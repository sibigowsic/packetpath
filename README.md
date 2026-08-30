<div align="center">

  # 🌐 PacketPath — Follow Your Data

  > **"Follow the invisible journey of your data."**

  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

  [![Build Status](https://img.shields.io/badge/Vite_Build-Passing-emerald?style=flat-square&logo=githubactions&logoColor=white)]()
  [![Security Test Suite](https://img.shields.io/badge/Security_Tests-10/10_Passed-cyan?style=flat-square&logo=shield&logoColor=white)]()
  [![Presentation Ready](https://img.shields.io/badge/Status-Presentation_Ready-violet?style=flat-square&logo=trophy&logoColor=white)]()

  <p align="center">
    An interactive 3D digital journey visualizer that maps live internet traceroutes onto physical Earth coordinates, transforming abstract IP handshakes into a 7-scene plain-English story.
  </p>

  [Key Features](#-key-features) • [How It Works](#-how-it-works) • [Architecture](#-architecture) • [Security & Audit](#-security--reliability-audit) • [Running Locally](#-running-locally) • [Presentation Guide](#-hackathon-presentation-guide)

  ---
</div>

## 🎬 Demo Showcase

<div align="center">

  ```
  +-----------------------------------------------------------------------+
  |                                                                       |
  |             [ 3D GLOBE VISUALIZATION & STORY SIDEBAR DEMO ]           |
  |                                                                       |
  |   Glowing Cyan Arcs  *  Animated Data Packet  *  7 Story Scenes       |
  |                                                                       |
  +-----------------------------------------------------------------------+
  ```
  *(Demo preview placeholder: `docs/demo-preview.png`)*

</div>

<br />

---

## ⚡ Problem vs. Solution

<table>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">❌ The Problem</h3>
      <p>
        Every day, billions of people press <b>"Send"</b>, stream video, and load web applications instantly. Yet, the physical infrastructure making this possible—underground fiber cables, carrier-neutral internet exchanges, subsea oceanic wires, and edge data centers—remains completely invisible.
      </p>
      <p>
        Standard network utilities like <code>traceroute</code> output raw, cryptic text logs that fail to communicate the physical reality of global networking.
      </p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">✨ The Solution</h3>
      <p>
        <b>PacketPath</b> turns live network traceroute diagnostics into a captivating 3D digital journey.
      </p>
      <p>
        Entering a target domain ignites a glowing data packet particle traveling across an interactive 3D Earth globe. A plain-English narrative sidebar guides users through <b>7 story milestones</b>, calculating real-world physical distance, hop latency, and estimated effective propagation speeds relative to light in optical fiber.
      </p>
    </td>
  </tr>
</table>

---

## 🚀 Key Features

### 🌟 1. "Follow Your Data" 7-Scene Story Engine
Translates raw router IP handshakes into human-understandable narrative milestones:
- **Scene 1**: *You pressed send.* — Packet ignites at local browser gateway.
- **Scene 2**: *Leaving your local network.* — Signal converts to optical pulses entering home ISP lines.
- **Scene 3**: *Entering provider infrastructure.* — Routing through regional Internet Exchange Points (IXPs).
- **Scene 4**: *Moving between networks.* — Handshake with Tier-1 global transit backbones.
- **Scene 5**: *Crossing large-scale infrastructure.* — High-speed subsea ocean cable crossing.
- **Scene 6**: *Approaching destination.* — Passing CDN security firewalls and load balancers.
- **Scene 7**: *Data arrives.* — Destination server reached and response generated.

### 🌐 2. Interactive 3D Earth Globe & Animated Packet Particle
- Powered by `globe.gl` and Three.js with high-contrast Earth night texture (`earth-night.jpg`).
- **Distinct Glowing Packet Particle**: A cyan particle (`#00ffff`) leads active arc pathways with smooth camera tracking.
- **Sequential Arc Rendering**: Arcs ignite hop-by-hop as the narrative advances.

### 🛡️ 3. Explicit Educational Accuracy Badges
PacketPath enforces strict transparency regarding network data precision:
- `[REAL NETWORK DATA]`: Confirmed router IP address, hop index, latency (RTT ms), and Autonomous System (ASN) organization.
- `[ESTIMATED IP GEOLOCATION]`: City and GPS coordinates resolved via BGP IP geolocation databases.
- `[ILLUSTRATIVE / FALLBACK VISUALIZATION]`: Ocean subsea optic cable pathways and fallback trajectory coordinates representing illustrative physical infrastructure models.

### ⚡ 4. Effective Fiber Light-Speed Physics Calculation
Calculates journey propagation efficiency against the theoretical speed of light in optical silica glass fiber ($c_{\text{fiber}} \approx 204,218\text{ km/s}$, $n = 1.468$).

### 🎬 5. Multi-Stage Cinematic Loading Experience
A multi-stage loading sequence (*"Resolving target domain..."* $\to$ *"Executing live probes..."* $\to$ *"Constructing 3D journey..."*) replaces generic spinners.

### 🔋 6. Presentation Demo Mode & Offline Resilience
Includes 3 pre-packaged cross-continental journeys (*San Francisco → Tokyo*, *New York → London*, *Mumbai → Sydney*) for instant presentation reliability.

---

## 🔮 How It Works

```
                     ┌──────────────────────────────┐
                     │   User Inputs Target Domain  │
                     │    (e.g., netflix.com)       │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │  FastAPI Backend /trace      │
                     │  - Domain Input Validation   │
                     │  - Target IP Safety Rules    │
                     │  - OS tracert / traceroute   │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │  ip-api Batch Geolocation    │
                     │  - GPS Lat/Lng & City        │
                     │  - ASN & Network Provider    │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │  Frontend Normalization      │
                     │  - journeyAdapter.js         │
                     │  - 7-Scene Story Generator   │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │  Interactive 3D Experience   │
                     │  - Globe Arc Animation       │
                     │  - Story Sidebar Cards       │
                     │  - Climax Summary Modal      │
                     └──────────────────────────────┘
```

---

## 🏗️ Architecture & Codebase Map

```
packetpath/
├── backend/
│   ├── main.py             # FastAPI server with CORS middleware & POST /trace endpoint
│   ├── security.py         # Domain input sanitization, IP range checks, & rate limiter
│   ├── traceroute_utils.py # Subprocess traceroute parser & ip-api geolocation
│   └── test_security_audit.py # Executable security test suite (10/10 passed)
└── frontend/
    ├── package.json        # Dependencies (globe.gl, three, lucide-react, tailwindcss)
    ├── vite.config.js      # Vite build setup with proxy to backend (/api -> http://localhost:8000)
    ├── index.html          # Google Fonts & SEO metadata
    └── src/
        ├── App.jsx                 # Master layout, loading triggers, & fallback state
        ├── components/
        │   ├── SearchBar.jsx       # Hero headline & "FOLLOW YOUR DATA" CTA
        │   ├── CinematicLoading.jsx # Multi-stage animated loading sequence
        │   ├── Navbar.jsx          # Header with Network Status Indicator (LIVE / DEMO / PARTIAL)
        │   ├── GlobeView.jsx       # 3D Globe with glowing packet particle & reduced motion support
        │   ├── StorySidebar.jsx    # 7-scene narrative cards with 3 explicit accuracy badges
        │   └── EmotionalSummary.jsx # Scene 7 climax modal with fiber light speed %
        └── utils/
            ├── journeyAdapter.js   # Normalization adapter handling missing data & scene mapping
            ├── haversine.js          # Great-circle distance math (km)
            └── lightSpeedMath.js    # Speed of light in fiber optic silica glass math
```

### Stack Breakdown

| Layer | Technology | Purpose | Source Location |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 18 & Vite 5 | UI components & build pipeline | `frontend/src/` |
| **Styling & Icons** | Tailwind CSS & Lucide React | Glassmorphism layout & icons | `frontend/src/index.css` |
| **3D Rendering** | Globe.gl & Three.js | WebGL dark Earth canvas & cyan arcs | `frontend/src/components/GlobeView.jsx` |
| **Backend Engine** | Python 3 & FastAPI | OS traceroute parsing & security rules | `backend/main.py` |
| **Security Module** | Python `ipaddress` & `re` | Input sanitization & IP range validation | `backend/security.py` |

---

## 🔒 Security & Reliability Audit

PacketPath implements security validations in `backend/security.py`, verified by the automated test suite (`backend/test_security_audit.py`):

- 🛡️ **Domain Input Sanitization**: Validates domain syntax via RFC 1035 regex rules ($\le 253$ characters).
- 🚫 **Command Injection Prevention**: Strict character blacklisting preventing shell execution (`shell=False` used exclusively).
- ⛔ **Forbidden Range Blocks**: Rejects targets resolving to `localhost`, loopback (`127.0.0.0/8`), private IPv4 (`RFC 1918`), link-local (`169.254.0.0/16`), multicast (`224.0.0.0/4`), or reserved IP ranges.
- ⏱️ **Subprocess Execution Safety**: Enforces 12-second upper bound timeout limits and max 15 hops.
- 🚦 **Rate Limiting**: Sliding window throttling (max 10 requests / 60 seconds per client IP).
- 🔄 **Automatic Demo Fallback**: If network environments block ICMP traceroute probes, PacketPath automatically switches to Simulated Data Mode without crashing.

---

## 💻 Running Locally

### Prerequisites
- **Node.js**: `v18.0.0+`
- **Python**: `v3.10+`

### 1. Clone & Navigate to Repository
```bash
git clone https://github.com/sibigowsic/packetpath.git
cd packetpath
```

### 2. Start Backend Server (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Backend server will start at `http://localhost:8000` (Health check at `/health`).*

### 3. Start Frontend App (React + Vite)
```bash
cd frontend
npm install
cmd /c node node_modules/vite/bin/vite.js --port 5173
```
*Open `http://localhost:5173` in your browser.*

### 4. Run Security Test Suite
```bash
cd backend
python test_security_audit.py
```

---

## 🏆 Hackathon Presentation Guide

### ⏱️ 60-Second Presentation Flow

1. **0:00 – 0:10 (Landing & Vision)**:
   - Point out the hero text: *"When you press send, your data begins a journey you never see."*
   - Explain that PacketPath makes invisible physical internet infrastructure visible in 3D.
2. **0:10 – 0:25 (Initiate Journey)**:
   - Click preset demo journey **"San Francisco → Tokyo"** (or enter a live domain).
   - Highlight the multi-stage `CinematicLoading` overlay.
3. **0:25 – 0:45 (3D Globe & Story Engine)**:
   - Show the glowing cyan arc and animated packet particle traveling across the Pacific Ocean.
   - Point out the **Network Status Badge** (`● SIMULATED DATA JOURNEY` or `● LIVE NETWORK TRACE`).
   - Show **Scene 5: Transpacific Cable Crossing** and the **3 Accuracy Badges**.
   - Expand the **Technical Details** tray to show raw IP, RTT ms, and ASN data.
4. **0:45 – 1:00 (Emotional Climax)**:
   - Arrive at Scene 7: *"You pressed send. In just 114 milliseconds, your data crossed 8,275 kilometers through 9 network hops."*
   - Highlight the **Fiber Optic Light Speed %** ($\approx 71.2\%$ of light speed in glass fiber).

---

## 📄 License & Acknowledgments

This project was built for hackathon competition demonstration.

<div align="center">
  <br />
  <strong>PacketPath — Follow Your Data</strong>
  <br />
  <sub>Designed with ❤️ for network exploration and educational curiosity.</sub>
</div>
