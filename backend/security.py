import re
import ipaddress
import time
from typing import Tuple
from fastapi import HTTPException

# Regex for valid domain name (RFC 1035 / RFC 1123)
DOMAIN_REGEX = re.compile(
    r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$'
)

# Regex for IPv4 address
IPV4_REGEX = re.compile(
    r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
)

# In-memory sliding window rate limiter (max 10 requests / 60 seconds per client IP)
RATE_LIMIT_WINDOW = 60
MAX_REQUESTS_PER_WINDOW = 10
_rate_limit_db = {}

def validate_domain_input(raw_domain: str) -> str:
    """Sanitize and validate target domain input string against length, injection, and format rules."""
    if not raw_domain:
        raise HTTPException(status_code=400, detail="Domain target cannot be empty.")
    
    # Clean whitespace and lowercase
    domain = raw_domain.strip().lower()

    # Strip protocol prefix if present
    domain = domain.replace("https://", "").replace("http://", "").split("/")[0].split(":")[0]

    # Enforce maximum length (RFC 1035 max 253 chars)
    if len(domain) > 253:
        raise HTTPException(status_code=400, detail="Target domain exceeds maximum length of 253 characters.")

    # Reject localhost keyword explicitly
    if domain in ["localhost", "localhost.localdomain", "local"]:
        raise HTTPException(status_code=400, detail="Localhost target domain is forbidden for traceroute.")

    # Check for command injection characters or flag attempts
    if any(char in domain for char in [';', '&', '|', '`', '$', '>', '<', '\n', '\r', ' ', '"', "'", '\\']):
        raise HTTPException(status_code=400, detail="Invalid character detected in target domain.")

    # Must match domain format or IPv4 format
    if not (DOMAIN_REGEX.match(domain) or IPV4_REGEX.match(domain)):
        raise HTTPException(status_code=400, detail="Invalid domain or IP address format.")

    return domain

def validate_resolved_ip(ip_str: str) -> Tuple[bool, str]:
    """Validate resolved target IP address against loopback, private, link-local, and multicast ranges."""
    try:
        ip = ipaddress.ip_address(ip_str)
    except ValueError:
        return False, "Invalid IP address syntax."

    if ip.is_loopback:
        return False, f"Target IP {ip_str} is a loopback address (127.0.0.0/8)."

    if ip.is_private:
        return False, f"Target IP {ip_str} is in a private network range (RFC 1918)."

    if ip.is_link_local:
        return False, f"Target IP {ip_str} is a link-local address (169.254.0.0/16)."

    if ip.is_multicast:
        return False, f"Target IP {ip_str} is a multicast address."

    if ip.is_reserved or ip.is_unspecified:
        return False, f"Target IP {ip_str} is in a reserved IP range."

    return True, "IP address is valid for public tracing."

def check_rate_limit(client_ip: str):
    """Enforce basic rate limiting per client IP."""
    now = time.time()
    if client_ip not in _rate_limit_db:
        _rate_limit_db[client_ip] = []

    _rate_limit_db[client_ip] = [
        t for t in _rate_limit_db[client_ip] if now - t < RATE_LIMIT_WINDOW
    ]

    if len(_rate_limit_db[client_ip]) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Maximum {MAX_REQUESTS_PER_WINDOW} requests per minute."
        )

    _rate_limit_db[client_ip].append(now)
