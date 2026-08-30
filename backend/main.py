import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import socket
from security import validate_domain_input, validate_resolved_ip, check_rate_limit
from traceroute_utils import run_system_traceroute, geolocate_ip_batch, map_hops_to_story_scenes

app = FastAPI(
    title="PacketPath Backend API — Follow Your Data",
    description="Live traceroute engine with security audit validations.",
    version="1.1.0"
)

# Environment variable CORS setup for production deployment
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class TraceRequest(BaseModel):
    domain: str

@app.get("/")
@app.get("/health")
def read_root():
    return {
        "status": "healthy",
        "app": "PacketPath Backend — Follow Your Data",
        "version": "1.1.0"
    }

@app.post("/trace")
def trace_domain(payload: TraceRequest, request: Request):
    # 1. Rate limiting per client IP
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip)

    # 2. Domain input validation & command injection prevention
    clean_domain = validate_domain_input(payload.domain)

    # 3. Resolve Domain Host IP
    try:
        dest_ip = socket.gethostbyname(clean_domain)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not resolve host domain: {clean_domain}. Ensure domain is valid and online."
        )

    # 4. Target IP Range Validation
    is_valid_target, reason = validate_resolved_ip(dest_ip)
    if not is_valid_target:
        raise HTTPException(
            status_code=400,
            detail=f"Target address forbidden: {reason}"
        )

    # 5. Run System OS Traceroute
    raw_hops = run_system_traceroute(clean_domain)
    
    # 6. Geolocate Public IP addresses
    geolocated_hops = geolocate_ip_batch(raw_hops)

    # 7. Map to 7-Scene Story Framework
    story_journey = map_hops_to_story_scenes(geolocated_hops, clean_domain)

    if not story_journey or not story_journey.get("hops"):
        return {
            "status": "partial_fallback",
            "isDemoFallback": True,
            "networkStatus": "DEMO / SIMULATED JOURNEY",
            "message": "Traceroute returned no responding router hops on this network. Switched to Simulated Data.",
            "dest_ip": dest_ip,
            "domain": clean_domain
        }

    return story_journey

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
