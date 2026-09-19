# Technical Requirements Document (TRD)
## Sanjeevani — Build Specification

**Stack decision:** Next.js 14+ (App Router), single full-stack application, deployed on Vercel.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) | Single repo for frontend + API routes; fast to build and deploy solo |
| Styling | Tailwind CSS | Fast, but must be customized per UI/UX doc — do not ship default Tailwind look |
| Animation | Framer Motion | For map marker pulses, alert slide-ins, panel transitions |
| Map | React-Leaflet + OpenStreetMap tiles | Free, no API key required, reliable for a live demo |
| Charts | Recharts | For historical risk trend lines |
| State | React Context + `useState`/`useReducer` — no Redux needed at this scale | Keeps it simple for a small app |
| Data fetching | Native `fetch` inside Next.js API routes (server-side), consumed by client via `/api/*` routes | Keeps API keys server-side, not exposed to browser |
| Deployment | Vercel | Free, one-command deploy, judges can access a live link |
| Hosting for static data | JSON files in `/data` directory | No database needed for MVP scope |

## 2. External Data Sources & Integration

### 2.1 Weather — Open-Meteo (LIVE)
- No API key required.
- Endpoint pattern: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto`
- Use for: heat risk scoring (max temp forecast) and flood risk scoring (precipitation forecast).
- Call this server-side from a Next.js API route (`/api/weather?lat=&lon=`) and cache the response for a few minutes to avoid rate limits during demo/judging.

### 2.2 Fire/Heat hotspots — NASA FIRMS (LIVE)
- Requires a free MAP_KEY: register at https://firms.modis.gov/api/area/ — do this **before** the hackathon, not during.
- Endpoint pattern: `https://firms.modis.gov/api/area/csv/{MAP_KEY}/VIIRS_SNPP_NRT/{area_coordinates}/1`
- Returns CSV — parse server-side, convert to JSON, return via `/api/fire-hotspots?bbox=`.
- Use for: an optional map overlay layer (P2 feature) and as a minor input to a "disaster risk" flag.
- **Fallback required:** if the API fails or returns empty (common outside active fire season), fall back to a small seeded JSON file with 2–3 illustrative hotspot points, clearly commented as fallback data in code.

### 2.3 Groundwater — CGWB/India-WRIS (STATIC SNAPSHOT, not live)
- No reliable free real-time API exists for this. Use a static dataset.
- Build `/data/groundwater.json` manually: for each village/ward in your demo region, assign a plausible groundwater trend value (declining / stable / rising) and a "meters below ground level" figure, based on real reported ranges for your chosen region if you can find them, or clearly-labeled illustrative data otherwise.
- Document in a code comment at the top of this file: `// Static snapshot based on CGWB-published block classifications. Not a live feed — see TRD section 2.3 for rationale.`

### 2.4 Shelters / Response Resources (STATIC, curated)
- Build `/data/shelters.json`: 10–15 entries, each with `{ id, name, lat, lon, capacity, type }` for your demo region.
- These can be realistic constructed entries (e.g., named after real schools/community halls in your chosen district) — label clearly in project docs as illustrative, not verified live capacity data.

### 2.5 Village/Ward Seed Data
- Build `/data/villages.json`: your core dataset. Each entry: `{ id, name, lat, lon, population_estimate, vulnerability_weight }`.
- Pick **8–15 villages/wards in one real district** (recommend a Maharashtra district given your location, for authenticity if asked about it) with real approximate coordinates. This is the backbone dataset everything else joins against.

## 3. Risk Scoring Logic (must be simple, explainable, and documented in code)

Implement as a pure function, server-side, recomputed on each API call (no need for a persistent job scheduler at this scale):

```
riskScore(village) =
  (heatWeight * normalizedForecastMaxTemp) +
  (floodWeight * normalizedPrecipitationForecast) +
  (waterWeight * normalizedGroundwaterDeclineSeverity) +
  (vulnerabilityWeight * village.vulnerability_weight)
```

- Normalize each input to a 0–1 scale before weighting.
- Suggested starting weights: heat 0.3, flood 0.3, water 0.2, vulnerability 0.2 — tune these after seeing real numbers for your region, but keep them as named constants in one config file (`/lib/riskWeights.ts`) so they're easy to explain and adjust live if a judge asks "what if you weighted X differently."
- Output band: 0–0.4 = Low (green), 0.4–0.7 = Moderate (amber), 0.7–1.0 = High (red).
- **This must be explainable in the UI** — when a user clicks a village, show the four component scores that produced the final number, not just the final number.

## 4. Application Structure

```
/app
  /page.tsx                 → landing/overview page
  /dashboard/page.tsx        → main map + risk dashboard (Supervisor view)
  /api/weather/route.ts
  /api/fire-hotspots/route.ts
  /api/risk/route.ts         → computes and returns risk scores for all villages
  /api/outcomes/route.ts     → POST endpoint to log an outcome (in-memory or simple JSON append for demo)
/components
  /Map/                      → Leaflet map + markers + popup
  /RiskPanel/                → village detail + score breakdown
  /AlertPreview/              → simulated WhatsApp/SMS message view
  /ResponsePanel/             → recommended action + shelter info
  /OutcomeLogger/             → form + feedback-loop visual
  /TrendChart/                → Recharts historical view (P1)
  /ScenarioSlider/            → what-if slider (P2)
/data
  villages.json
  groundwater.json
  shelters.json
  fire-hotspots-fallback.json
/lib
  riskWeights.ts
  riskCalculator.ts
```

## 5. Session/Persistence Approach for the Feedback Loop

- No database required for MVP. Use a simple server-side in-memory array (reset on server restart) or append to a local JSON file via the API route, to store logged outcomes during a demo session.
- When an outcome is logged, the UI should visibly show it added to a small "Recent outcomes" list, and the affected village's risk panel should show a small "Recalibrated using 1 new data point" note — this satisfies the "visible feedback loop" requirement from the PRD without needing real ML retraining.

## 6. Non-Functional Requirements

- **Responsive**: must work on both a laptop screen (for a projector demo) and a phone (in case a judge wants to try it on their own device) — this was your explicit "both, responsive single app" choice.
- **Load time**: keep total JS bundle lean — avoid heavy unused libraries. Map and chart libraries should be the heaviest dependencies; avoid adding a UI kit on top of Tailwind.
- **Resilience**: every external API call (Open-Meteo, NASA FIRMS) must have a try/catch with a fallback to seeded data, so a flaky API connection during judging never breaks the demo.
- **No secrets in client code**: NASA FIRMS MAP_KEY must only be used server-side in the API route, never exposed in client bundle or `.env` committed to a public repo.

## 7. Build Order (recommended sequence for the agent)

1. Scaffold Next.js app, set up Tailwind theme with brand colors (see UI/UX doc).
2. Build `/data/villages.json` and static datasets first — everything else depends on this.
3. Build `/api/risk` route with the scoring function using static/mock inputs first (don't wire live APIs yet) — get the scoring and map working end-to-end with fake numbers.
4. Wire in Open-Meteo live data to replace mock heat/flood inputs.
5. Wire in NASA FIRMS with fallback.
6. Build the map + risk panel UI.
7. Build the Alert Preview + Response Panel.
8. Build the Outcome Logger + feedback visual.
9. Add animations/polish (Framer Motion) last, once functionality is stable.
10. Add P1 features (trend chart, language toggle, dashboard summary) only once steps 1–9 are demo-stable.

## 8. Open Technical Decisions to Confirm Before Building

- Confirm the exact demo district/region and gather 8–15 real village/ward names + coordinates for it.
- Register the NASA FIRMS MAP_KEY in advance (takes a few minutes, but requires email confirmation — don't leave it to the last night).
- Decide on the second demo language for the alert preview (e.g., Hindi or Marathi given your location).
