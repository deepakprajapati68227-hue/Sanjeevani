# 🌿 Sanjeevani (संजीवनी)
### AI-Powered Climate Resilience, Multi-Hazard Early Warning & Hyperlocal Response System

> **Predict. Alert. Respond.**  
> An explainable, multi-parameter climate risk forecasting and disaster decision-support platform designed for district administrations, panchayats, and rural communities across India.

---

## 🌟 Key Features

1. **Pan-India Multi-District Support & Geocartography**
   - Instant multi-district switching across 5 diverse agro-climatic pilot regions:
     - **Chandrapur, Maharashtra** *(Vidarbha Deccan)*: Heatwaves, industrial mine heat radiance & forest edge fire anomalies.
     - **Barmer, Rajasthan** *(Thar Desert)*: Hyper-heatwave (>48°C), sandstorms & deep aquifer depletion.
     - **Wayanad, Kerala** *(Western Ghats)*: Extreme monsoon cloudbursts, flash floods & saturated slope risks.
     - **Sundarbans, West Bengal** *(Ganges Delta)*: Cyclonic storm surges, tidal inundation & saline water ingress.
     - **Solapur, Maharashtra** *(Rainshadow Plateau)*: Chronic agricultural drought, groundwater over-exploitation & pre-monsoon heat.
   - Dynamic map fly-to transitions and village hazard dots with explainable risk ratings.

2. **Explainable 7-Parameter Risk Engine**
   - Rather than black-box AI, each village score ($0.0 - 1.0$) is calculated from weighted, auditable drivers:
     - Ambient Maximum Temperature
     - Apparent Heat Index / Heatwave Severity
     - 24-Hour Precipitation
     - 7-Day Cumulative Flood Surge
     - Central Ground Water Board (CGWB) Aquifer Stress & Depth
     - NASA FIRMS Satellite Thermal Anomalies
     - Socioeconomic Vulnerability & Demographic Exposure

3. **Live & Watermark-Free Telemetry**
   - **Open-Meteo Weather API**: Zero-cost, live hourly & 7-day temperature and rainfall forecasting for any coordinates across India.
   - **NASA FIRMS (VIIRS-SNPP)**: Live satellite active fire / thermal radiation detection.
   - **Watermark-Free Cartography**: ESRI World Dark Gray Canvas, ESRI World Satellite Imagery, and OpenStreetMap basemaps without requiring proprietary API tokens.

4. **Interactive "What-If" Climate Scenario Simulator**
   - Real-time stress-testing drawer allowing District Magistrates and Emergency Operation Centers to simulate temperature shifts ($\pm 5^\circ\text{C}$) and rainfall shocks ($\pm 80\%$) to preview vulnerable hotspots before extreme events hit.

5. **Operational Emergency Response & Citizen Alerts**
   - **Multi-lingual WhatsApp Alert Simulator** (English & Marathi): Audio voice notes with animated equalizer, regional guidance, and shelter locations.
   - **District Magistrate Executive Directive Generator**: Automatically crafts legally enforceable disaster containment orders under the Disaster Management Act, 2005 with printable letterhead, seal, and IAS signature block.
   - **Emergency Relief Fleet Tracking**: Real-time GPS-tracked water tankers and Mobile Disaster ICUs.
   - **Evacuation Corridors**: Dynamic polylines connecting at-risk settlements to nearest relief shelters.
   - **Outcome Feedback & Empirical Recalibration**: Field workers log response outcomes, dynamically updating model confidence and risk calibrations.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Dynamic API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Mapping**: Leaflet, React-Leaflet, ESRI Canvas & OpenStreetMap
- **Visualizations**: Recharts, Framer Motion
- **Data Integrations**: Open-Meteo API, NASA FIRMS Earthdata API, CGWB Aquifer Reports

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/deepakprajapati68227-hue/Sanjeevani.git
cd Sanjeevani
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your NASA FIRMS map key (or obtain a free key at [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/map_key)):
```env
NEXT_PUBLIC_NASA_FIRMS_MAP_KEY=your_nasa_firms_key
```
*(Open-Meteo and ESRI map layers require no API key)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
├── app/
│   ├── api/
│   │   ├── risk/           # 7-parameter dynamic risk calculation & district filtering
│   │   ├── fire-hotspots/  # NASA FIRMS satellite thermal anomaly proxy
│   │   ├── weather/        # Open-Meteo live forecast endpoint
│   │   └── outcomes/       # Action outcome logging & recalibration
│   ├── dashboard/          # Supervisor Command Center UI
│   ├── layout.tsx          # Root app layout & fonts
│   └── page.tsx            # Interactive landing & system portal
├── components/
│   ├── AlertPreview/       # WhatsApp audio & multi-lingual mockup
│   ├── Common/             # Header, Navigation & District Switcher
│   ├── DistrictSummary/    # Metric ribbon & district roll-up stats
│   ├── ExecutiveDirective/ # DM Order letterhead generator & PDF printer
│   ├── Map/                # Leaflet map, fleet markers, evacuation corridors
│   ├── OutcomeFeedback/    # Response verification & recalibration modal
│   ├── RiskPanel/          # Village telemetry radar & factor breakdown
│   └── ScenarioSlider/     # What-If climate stress-testing drawer
├── context/
│   └── RiskContext.tsx     # Global state management for pan-India districts
├── data/
│   ├── districts.json      # Pilot districts metadata & coordinates
│   ├── villages.json       # Village dataset across all districts
│   ├── groundwater.json    # CGWB aquifer extraction & depth metrics
│   ├── shelters.json       # Disaster refuge & cooling centers
│   └── fire-hotspots-fallback.json
└── lib/
    ├── riskCalculator.ts   # Core multi-parameter risk algorithm
    ├── riskWeights.ts      # Mathematical factor weights & thresholds
    ├── translations.ts     # Multi-lingual UI and alert dictionaries
    └── types.ts            # TypeScript definitions
```

---

## 📜 License
MIT License. Built for community resilience and open-source disaster preparedness.
