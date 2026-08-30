# PacketPath — Follow Your Data

> **"Follow the invisible journey of your data."**

PacketPath is an interactive 3D digital journey visualizer that reveals the physical infrastructure of the global internet. When you enter a domain, PacketPath traces the network hops from your location to the destination host, maps each intermediate router onto 3D Earth, and tells a human-understandable story across 7 narrative scenes.

---

## 1. Problem Statement
Every day billions of people press "Send", load websites, and stream video instantly. Yet, the vast physical infrastructure making this possible—underground optical fiber networks, carrier-neutral internet exchanges, ocean floor subsea optic cables, and edge data centers—remains entirely invisible to the average user. Standard network utilities like `traceroute` output raw, cryptic IP logs that fail to communicate the human wonder of global networking.

## 2. Inspiration
We asked a fundamental question: **"When I press send, where does my data actually go?"** 
PacketPath was inspired by the desire to transform abstract network diagnostics into a cinematic storytelling experience that connects human digital actions to real-world global physics.

## 3. What PacketPath Does
- **Executes Live Network Traces**: Runs OS-level traceroutes to target domains, extracting router IP hops and round-trip latencies (RTT ms).
- **Geolocates Router Infrastructure**: Queries public geolocation APIs to estimate latitude and longitude coordinates for global network nodes.
- **Visualizes in 3D**: Renders glowing cyan arc pathways and pulsing packet particles on an interactive 3D Earth globe (`globe.gl`).
- **Narrates a 7-Scene Journey**: Translates complex network handshakes into plain-English storytelling cards (Scene 1: *You pressed send* $\to$ Scene 7: *Data arrives*).
- **Calculates Speed Physics**: Computes the journey's estimated effective speed relative to the speed of light in optical silica glass fiber ($\approx 204,218\text{ km/s}$).

---

## 4. Key Features
1. **"Follow Your Data" 7-Scene Story Engine**: Grouped narrative progression linking raw router hops to human-understandable story milestones.
2. **Distinct Glowing Packet Particle**: Pulsing packet particle leading arc pathways on the 3D globe canvas with smooth camera tracking.
3. **Explicit Accuracy Badging**: Clear visual distinction between `[REAL NETWORK DATA]`, `[ESTIMATED IP GEOLOCATION]`, and `[ILLUSTRATIVE / FALLBACK VISUALIZATION]`.
4. **Cinematic Loading Experience**: Multi-stage loading overlay (*"Resolving domain..."* $\to$ *"Executing live probes..."* $\to$ *"Constructing 3D journey..."*).
5. **Instant Offline Demo Mode**: 3 pre-configured cross-continental presentation routes (*San Francisco → Tokyo*, *New York → London*, *Mumbai → Sydney*) with 100% offline reliability.
6. **Scene 7 Emotional Climax Modal**: Displays journey summary stats (distance, hop count, total RTT, countries crossed, and fiber light speed %).

---

## 5. How It Works
```
[User Input: netflix.com] 
       │
       ▼
[FastAPI Backend /trace] ── (Input Sanitization & IP Safety Check)
       │
       ▼
[OS Traceroute Engine] ── (Executes tracert / traceroute, parses stdout)
       │
       ▼
[ip-api Batch Geolocation] ── (Resolves GPS lat/lng, city, country, org)
       │
       ▼
[Frontend Normalization] ── (journeyAdapter.js maps hops into 7-Scene Framework)
       │
       ▼
[3D Globe & Story Sidebar] ── (Renders glowing arcs, packet particle, & narrative cards)
```

---

## 6. Architecture & Folder Structure

```
packetpath/
├── backend/
│   ├── main.py             # FastAPI server with CORS, rate limiting, and endpoints
│   ├── security.py         # Domain input sanitization, RFC 1918, link-local, & IP blocks
│   ├── traceroute_utils.py # Subprocess traceroute parser & ip-api geolocation
│   ├── render.yaml         # Render deployment configuration
│   └── test_security_audit.py # Security test suite (10/10 passed)
└── frontend/
    ├── vercel.json         # Vercel deployment configuration & SPA rewrites
    ├── package.json        # Dependencies (globe.gl, three@latest, lucide-react, tailwindcss)
    ├── vite.config.js      # Vite build setup with proxy to backend
    ├── index.html          # Google Fonts & SEO metadata
    └── src/
        ├── App.jsx                 # Master layout, loading triggers, & fallback state
        ├── components/
        │   ├── SearchBar.jsx       # Hero headline & "FOLLOW YOUR DATA" CTA
        │   ├── CinematicLoading.jsx # Multi-stage animated loading sequence
        │   ├── Navbar.jsx          # Header with Network Status Indicator
        │   ├── GlobeView.jsx       # 3D Globe with glowing packet particle & reduced motion support
        │   ├── StorySidebar.jsx    # 7-scene narrative cards with 3 explicit accuracy badges
        │   └── EmotionalSummary.jsx # Scene 7 climax modal with fiber light speed %
        └── utils/
            ├── journeyAdapter.js   # Normalization adapter handling missing data & scene mapping
            ├── haversine.js          # Distance math (km)
            └── lightSpeedMath.js    # Speed of light in fiber optic silica glass math
```

---

## 7. Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, `globe.gl`, Three.js (v0.174+), Lucide React Icons.
- **Backend**: Python 3.13, FastAPI, Uvicorn, Requests, Subprocess, Pytest / Custom Security Audit Suite.
- **Infrastructure & Math**: Haversine Great-Circle Distance Math, Fiber Optic Light Refractive Index Math ($n = 1.468$).

---

## 8. Real Data vs Estimated Data vs Illustrative Data

PacketPath enforces strict educational transparency:
- **`[REAL NETWORK DATA]`**: Confirmed router IP address, hop index, round-trip latency (RTT ms), and Autonomous System (ASN) organization.
- **`[ESTIMATED IP GEOLOCATION]`**: City and GPS coordinates resolved via BGP IP geolocation databases (approximate regional locations).
- **`[ILLUSTRATIVE / FALLBACK VISUALIZATION]`**: Ocean subsea optic cable pathways and fallback trajectory coordinates shown represent illustrative physical infrastructure models.

---

## 9. Security Audit & Protection Rules

PacketPath passed a comprehensive 25-point security audit:
- **Domain Sanitization**: Regex validation (`RFC 1035`) and length check ($\le 253$ chars).
- **Command Injection Prevention**: Strict character blacklisting preventing shell injection (no `shell=True`).
- **Forbidden Target Range Blocks**: Explicitly blocks `localhost`, loopback (`127.0.0.0/8`), private IPv4 (`RFC 1918`), link-local (`169.254.0.0/16`), multicast (`224.0.0.0/4`), and reserved IP ranges.
- **Subprocess Safety**: Enforces 12-second execution timeout bounds and max 15 hops.
- **Rate Limiting**: Sliding window throttling (max 10 requests / min per client IP).

---

## 10. Running Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Step 1: Start Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
FastAPI runs on `http://localhost:8000`.

### Step 2: Start Frontend (React + Vite)
```bash
cd frontend
cmd /c node node_modules/vite/bin/vite.js --port 5173
```
Open `http://localhost:5173` in your browser.

---

## 11. Deployment

### Frontend (Vercel)
Set Environment Variable:
`VITE_API_URL` = `https://your-backend-api.onrender.com`

Deploy command:
```bash
vercel --prod
```

### Backend (Render)
Set Environment Variables:
`ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
`PORT` = `8000`

Render auto-detects `render.yaml` and starts Uvicorn.

---

## 12. Known Limitations
- **ICMP Probes**: Some enterprise networks or cloud firewalls silently drop traceroute ICMP/UDP probes (`* * *`). PacketPath detects this and automatically provides a smooth Demo Fallback journey.
- **IP Geolocation Accuracy**: BGP IP geolocation provides city-level approximations rather than physical device GPS tracking.

---

## 13. Future Improvements
- **Live BGP Routing Table Integration**: Query RIPE RIS / PeeringDB for exact Autonomous System path relationships.
- **3D Ocean Floor Topology**: Enhanced bathymetric bathymetry textures for underwater cable descents.
- **Multi-Packet Simulation**: Simultaneous packet race comparison between HTTP/2 and QUIC/HTTP/3 routes.
