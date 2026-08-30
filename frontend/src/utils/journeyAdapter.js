import { calculateHaversineDistance } from './haversine';
import { calculateSpeedOfLightStats } from './lightSpeedMath';

// Default fallback coordinate trajectory if raw hops lack GPS coordinates
const DEFAULT_TRAJECTORY_POINTS = [
  { lat: 37.7749, lng: -122.4194, city: "San Francisco Gateway", country: "United States" },
  { lat: 40.7128, lng: -74.0060, city: "New York IXP", country: "United States" },
  { lat: 51.5074, lng: -0.1278, city: "London Fiber Transit", country: "United Kingdom" },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo Edge Gateway", country: "Japan" }
];

/**
 * Safely normalize raw backend traceroute responses into PacketPath's 7-Scene Story Journey payload
 */
export function normalizeJourneyData(rawData, requestedDomain) {
  if (!rawData) return null;

  const isDemo = Boolean(rawData.isDemoFallback || rawData.status === 'partial_fallback');
  const isPartial = Boolean(rawData.status === 'partial_fallback' || (rawData.hops && rawData.hops.length < 3));
  
  // Network Status Badge Label
  let networkStatusLabel = "● LIVE NETWORK TRACE";
  let statusBadgeColor = "emerald"; // emerald | amber | cyan

  if (isDemo) {
    networkStatusLabel = "● DEMO / SIMULATED JOURNEY";
    statusBadgeColor = "amber";
  } else if (isPartial) {
    networkStatusLabel = "● PARTIAL NETWORK DATA";
    statusBadgeColor = "cyan";
  }

  const rawHops = Array.isArray(rawData.hops) ? rawData.hops : [];
  
  let accumulatedDist = 0;
  const processedHops = rawHops.map((hop, idx) => {
    let lat = typeof hop.lat === 'number' && !isNaN(hop.lat) ? hop.lat : null;
    let lng = typeof hop.lng === 'number' && !isNaN(hop.lng) ? hop.lng : null;
    let isFallbackCoordinates = false;

    // Assign fallback trajectory if coordinates are missing
    if (lat === null || lng === null) {
      const fallbackPt = DEFAULT_TRAJECTORY_POINTS[idx % DEFAULT_TRAJECTORY_POINTS.length];
      lat = fallbackPt.lat;
      lng = fallbackPt.lng;
      isFallbackCoordinates = true;
    }

    const city = hop.city && hop.city.trim() ? hop.city : "Internet Transit Node";
    const country = hop.country && hop.country.trim() ? hop.country : "Global Network";
    const org = hop.org && hop.org.trim() ? hop.org : "Autonomous System Provider";
    const ip = hop.ip && hop.ip.trim() ? hop.ip : "---.---.---.---";
    const rtt_ms = typeof hop.rtt_ms === 'number' && !isNaN(hop.rtt_ms) ? Math.max(0.5, hop.rtt_ms) : 15.0;

    // Determine 7-Scene Index
    const totalCount = rawHops.length;
    let sceneIndex = 0;
    let sceneTitle = "Scene 1: You pressed send.";
    let storyTitle = "Request Initiated";
    let storyBody = `Your request left your device bound for ${requestedDomain || 'the destination server'}.`;
    let locationType = "LOCAL_GATEWAY";

    if (idx === 0) {
      sceneIndex = 0;
      sceneTitle = "Scene 1: You pressed send.";
      storyTitle = "Request Initiated";
      storyBody = `Your browser initiated an encrypted connection towards ${requestedDomain || 'the destination server'}.`;
      locationType = "LOCAL_GATEWAY";
    } else if (idx === 1) {
      sceneIndex = 1;
      sceneTitle = "Scene 2: Leaving your local network.";
      storyTitle = `Entering ${org}`;
      storyBody = `Your signal converted to optical pulses, entering your local internet provider's regional network.`;
      locationType = "ISP_NODE";
    } else if (idx < Math.ceil(totalCount * 0.4)) {
      sceneIndex = 2;
      sceneTitle = "Scene 3: Entering provider infrastructure.";
      storyTitle = `Passing Internet Exchange — ${city}`;
      storyBody = `Data packets pass through high-capacity regional exchange switches connecting major providers.`;
      locationType = "IXP";
    } else if (idx < Math.ceil(totalCount * 0.7)) {
      sceneIndex = 3;
      sceneTitle = "Scene 4: Moving between networks.";
      storyTitle = `Global Backbone Transit — ${city}`;
      storyBody = `Handed over to tier-1 transit backbone networks spanning long-distance fiber routes.`;
      locationType = "BACKBONE";
    } else if (idx < totalCount - 2) {
      sceneIndex = 4;
      sceneTitle = "Scene 5: Crossing large-scale infrastructure.";
      storyTitle = `Long-Distance Fiber Link — ${country}`;
      storyBody = `High-speed infrared light pulses traverse terrestrial or ocean subsea optic cables.`;
      locationType = "OCEAN_CABLE";
    } else if (idx === totalCount - 2) {
      sceneIndex = 5;
      sceneTitle = "Scene 6: Approaching destination.";
      storyTitle = `Entering Edge Gateway — ${city}`;
      storyBody = `Reaching load balancers and edge security gateways dedicated to hosting ${requestedDomain || 'this platform'}.`;
      locationType = "EDGE_DATA_CENTER";
    } else {
      sceneIndex = 6;
      sceneTitle = "Scene 7: Data arrives.";
      storyTitle = "Target Destination Reached";
      storyBody = `Target server reached! Server hosted by ${org} in ${city} responds to your request.`;
      locationType = "DESTINATION";
    }

    if (idx > 0) {
      const prev = rawHops[idx - 1];
      const pLat = typeof prev.lat === 'number' ? prev.lat : lat;
      const pLng = typeof prev.lng === 'number' ? prev.lng : lng;
      accumulatedDist += calculateHaversineDistance(pLat, pLng, lat, lng);
    }

    const cableLabel = (locationType === 'OCEAN_CABLE' || locationType === 'CABLE_LANDING') 
      ? `Possible underlying physical infrastructure near ${city} (Illustrative pathway)`
      : null;

    // Explicit badges
    const isRealNode = Boolean(hop.isRealNode !== false && !isFallbackCoordinates);
    const isLocationEstimated = Boolean(hop.isLocationEstimated !== false && !isFallbackCoordinates);

    return {
      hop: idx + 1,
      sceneIndex,
      sceneTitle,
      storyTitle,
      storyBody,
      locationType,
      city,
      country,
      ip,
      lat,
      lng,
      org,
      rtt_ms: round(rtt_ms, 1),
      isRealNode,
      isLocationEstimated,
      isFallbackCoordinates,
      cableLabel
    };
  });

  const countries = Array.from(new Set(processedHops.map(h => h.country).filter(c => c && c !== "Local")));
  const networks = Array.from(new Set(processedHops.map(h => h.org))).slice(0, 5);

  const totalDistKm = Math.round(accumulatedDist);
  const totalRttMs = processedHops.length > 0 ? Math.round(processedHops[processedHops.length - 1].rtt_ms) : 100;
  const speedStats = calculateSpeedOfLightStats(totalDistKm, totalRttMs);

  return {
    id: rawData.id || `trace-${requestedDomain}`,
    domain: requestedDomain || rawData.domain || "target.com",
    label: rawData.label || `Journey → ${requestedDomain}`,
    destinationName: rawData.destinationName || `${requestedDomain} Destination Node`,
    originCity: processedHops[0]?.city || "Origin Gateway",
    isDemoFallback: isDemo,
    isPartial,
    networkStatusLabel,
    statusBadgeColor,
    summary: {
      total_hops: processedHops.length,
      total_distance_km: totalDistKm,
      total_rtt_ms: totalRttMs,
      countries: countries.length > 0 ? countries : ["United States"],
      networks: networks.length > 0 ? networks : ["Local Gateway", "Tier-1 Transit"],
      speed_of_light_percentage: speedStats.percentageOfFiberSpeed
    },
    hops: processedHops
  };
}

function round(val, decimals = 1) {
  return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}
