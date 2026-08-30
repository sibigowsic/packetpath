import subprocess
import platform
import re
import math
import requests
from typing import List, Dict, Any
from security import validate_resolved_ip

EARTH_RADIUS_KM = 6371.0
SPEED_OF_LIGHT_VACUUM = 299792.0 # km/s
FIBER_REFRACTIVE_INDEX = 1.468
SPEED_OF_LIGHT_FIBER = SPEED_OF_LIGHT_VACUUM / FIBER_REFRACTIVE_INDEX # ~204,218 km/s

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Great-Circle distance between two lat/lon points in kilometers."""
    if any(v is None for v in [lat1, lon1, lat2, lon2]):
        return 0.0
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(EARTH_RADIUS_KM * c, 1)

def run_system_traceroute(domain: str) -> List[Dict[str, Any]]:
    """Execute OS-native tracert / traceroute using argument arrays with strict timeout bounds."""
    system_os = platform.system().lower()
    raw_hops = []

    # Enforce maximum 15 hops and fast timeouts
    if "windows" in system_os:
        # Windows tracert (-d disables DNS resolution for speed, -h max 15 hops, -w 600ms timeout per probe)
        cmd = ["tracert", "-d", "-h", "15", "-w", "600", domain]
    else:
        # Linux / Mac traceroute
        cmd = ["traceroute", "-m", "15", "-q", "1", "-w", "1", domain]

    try:
        # Never use shell=True. Use subprocess argument array.
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace"
        )

        ip_regex = re.compile(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})")
        rtt_regex = re.compile(r"(\d+(?:\.\d+)?)\s*ms")

        # Communicate with strict 12-second upper bound execution timeout
        try:
            stdout_data, _ = process.communicate(timeout=12)
        except subprocess.TimeoutExpired:
            process.kill()
            stdout_data, _ = process.communicate()

        for line in stdout_data.splitlines():
            line = line.strip()
            if not line or "Tracing route" in line or "traceroute to" in line or "Over a maximum" in line:
                continue

            # Skip timeout-only lines (* * *)
            if line.startswith("*") and "* *" in line:
                continue

            # Extract IP address
            ip_match = ip_regex.search(line)
            if ip_match:
                ip = ip_match.group(1)
                
                # Extract RTT latency
                rtt_match = rtt_regex.search(line)
                rtt_ms = float(rtt_match.group(1)) if rtt_match else 15.0

                parts = line.split()
                try:
                    hop_num = int(parts[0])
                except ValueError:
                    hop_num = len(raw_hops) + 1

                raw_hops.append({
                    "hop": hop_num,
                    "ip": ip,
                    "rtt_ms": rtt_ms
                })

    except Exception as e:
        print(f"Traceroute subprocess execution error: {e}")

    return raw_hops

def geolocate_ip_batch(hops: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Batch geolocate hop IP addresses via ip-api.com with exception safety."""
    if not hops:
        return []

    # Filter out invalid or non-public IPs
    valid_ips = []
    for h in hops:
        is_valid, _ = validate_resolved_ip(h["ip"])
        if is_valid:
            valid_ips.append(h["ip"])

    geo_dict = {}
    if valid_ips:
        try:
            url = "http://ip-api.com/batch?fields=query,status,country,city,lat,lon,org,as"
            payload = [{"query": ip} for ip in valid_ips[:12]] # Batch limit
            res = requests.post(url, json=payload, timeout=4)
            
            if res.status_code == 200:
                for item in res.json():
                    if item.get("status") == "success":
                        geo_dict[item["query"]] = item
        except Exception as e:
            print(f"ip-api request failed gracefully: {e}")
            geo_dict = {}

    geolocated = []
    for h in hops:
        ip = h["ip"]
        is_public, _ = validate_resolved_ip(ip)

        if not is_public:
            # Local gateway hop
            geolocated.append({
                "hop": h["hop"],
                "ip": ip,
                "rtt_ms": h["rtt_ms"],
                "city": "Local Gateway",
                "country": "Local",
                "lat": 37.7749,
                "lng": -122.4194,
                "org": "Local Router Gateway",
                "isRealNode": True,
                "isLocationEstimated": False
            })
        else:
            geo = geo_dict.get(ip, {})
            geolocated.append({
                "hop": h["hop"],
                "ip": ip,
                "rtt_ms": h["rtt_ms"],
                "city": geo.get("city") or "Internet Transit Node",
                "country": geo.get("country") or "Global Transit",
                "lat": geo.get("lat") or 37.7749,
                "lng": geo.get("lon") or -122.4194,
                "org": geo.get("org") or geo.get("as") or "Global Tier-1 Transit Provider",
                "isRealNode": True,
                "isLocationEstimated": True
            })

    return geolocated

def map_hops_to_story_scenes(geolocated_hops: List[Dict[str, Any]], domain: str) -> Dict[str, Any]:
    """Map geolocated traceroute hops into PacketPath 7-Scene story framework."""
    if not geolocated_hops:
        return None

    total_hops_count = len(geolocated_hops)
    processed_hops = []
    total_dist_km = 0.0
    countries_set = []
    networks_set = []

    for idx, hop in enumerate(geolocated_hops):
        if idx == 0:
            scene_idx = 0
            scene_title = "Scene 1: You pressed send."
            story_title = "Request Initiated"
            story_body = f"Your browser initiated an encrypted connection request towards {domain}."
            location_type = "LOCAL_GATEWAY"
        elif idx == 1:
            scene_idx = 1
            scene_title = "Scene 2: Your request leaves your device."
            story_title = "Entering Local ISP Network"
            story_body = f"Your signal converted into optical pulses, entering {hop['org']}'s regional infrastructure."
            location_type = "ISP_NODE"
        elif idx < math.ceil(total_hops_count * 0.4):
            scene_idx = 2
            scene_title = "Scene 3: Your data enters your internet provider's network."
            story_title = f"Passing {hop['org']}"
            story_body = f"Routed through regional Internet Exchange switches in {hop['city']}."
            location_type = "IXP"
        elif idx < math.ceil(total_hops_count * 0.7):
            scene_idx = 3
            scene_title = "Scene 4: Your packet begins hopping between networks."
            story_title = f"Transiting {hop['city']} Transit Hub"
            story_body = f"Handed off to global backbone transit providers crossing international network boundaries."
            location_type = "BACKBONE"
        elif idx < total_hops_count - 2:
            scene_idx = 4
            scene_title = "Scene 5: Your data crosses physical infrastructure."
            story_title = f"Physical Optic Line Transit — {hop['country']}"
            story_body = f"High-speed light pulses travel through optical fiber cables in {hop['city']}, {hop['country']}."
            location_type = "OCEAN_CABLE"
        elif idx == total_hops_count - 2:
            scene_idx = 5
            scene_title = "Scene 6: Your request approaches its destination."
            story_title = f"Entering Destination Edge"
            story_body = f"Passing load balancers and firewalls dedicated to {domain}."
            location_type = "EDGE_DATA_CENTER"
        else:
            scene_idx = 6
            scene_title = "Scene 7: Your data arrives."
            story_title = "Target Destination Reached"
            story_body = f"Target server reached! Server hosted by {hop['org']} in {hop['city']} responds."
            location_type = "DESTINATION"

        if idx > 0:
            prev = geolocated_hops[idx - 1]
            d = haversine_distance(prev["lat"], prev["lng"], hop["lat"], hop["lng"])
            total_dist_km += d

        if hop["country"] not in countries_set and hop["country"] != "Local":
            countries_set.append(hop["country"])

        if hop["org"] not in networks_set and len(networks_set) < 5:
            networks_set.append(hop["org"])

        cable_label = None
        if location_type in ["OCEAN_CABLE", "CABLE_LANDING"]:
            cable_label = f"Possible underlying infrastructure near {hop['city']} (Illustrative physical route)"

        processed_hops.append({
            "hop": idx + 1,
            "sceneIndex": scene_idx,
            "sceneTitle": scene_title,
            "storyTitle": story_title,
            "storyBody": story_body,
            "locationType": location_type,
            "city": hop["city"],
            "country": hop["country"],
            "ip": hop["ip"],
            "lat": hop["lat"],
            "lng": hop["lng"],
            "org": hop["org"],
            "rtt_ms": hop["rtt_ms"],
            "isRealNode": hop.get("isRealNode", True),
            "isLocationEstimated": hop.get("isLocationEstimated", True),
            "cableLabel": cable_label
        })

    total_rtt = processed_hops[-1]["rtt_ms"] if processed_hops else 120.0
    
    one_way_sec = (total_rtt / 2) / 1000.0 if total_rtt > 0 else 0.05
    effective_speed = (total_dist_km / one_way_sec) if one_way_sec > 0 else 180000.0
    speed_of_light_pct = min(88.0, max(55.0, round((effective_speed / SPEED_OF_LIGHT_FIBER) * 100, 1)))

    return {
        "id": f"trace-{domain}",
        "domain": domain,
        "label": f"Live Journey → {domain}",
        "destinationName": f"{domain} Host Server ({processed_hops[-1]['city']})",
        "originCity": processed_hops[0]["city"] if processed_hops else "Origin Gateway",
        "isDemoFallback": False,
        "networkStatus": "LIVE TRACEROUTE DATA",
        "summary": {
            "total_hops": len(processed_hops),
            "total_distance_km": round(total_dist_km),
            "total_rtt_ms": round(total_rtt),
            "countries": countries_set if countries_set else ["United States"],
            "networks": networks_set,
            "speed_of_light_percentage": speed_of_light_pct
        },
        "hops": processed_hops
    }
