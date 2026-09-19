# Product Requirements Document (PRD)
## Sanjeevani — AI-Powered Early Warning and Response System for Climate Resilience

**Version:** 1.0
**Author:** Solo Hackathon Participant
**Status:** Ready for build

---

## 1. Problem Statement

Climate risk data (weather, groundwater, satellite/fire data) already exists in public datasets, but it is fragmented, technical, and never reaches the people who need it — rural and semi-urban communities, outdoor workers, and local officials — in time to act. By the time a heatwave, flood, or water shortage is visible on the ground, the window for prevention has closed. Existing government alert systems are generic, one-directional broadcasts with no personalization and no feedback loop.

## 2. Goal of the Prototype

Build a working, demoable, single responsive web application that proves the core loop:

**Predict → Alert → Respond → Learn**

The prototype does not need to serve real users in production. It needs to convincingly demonstrate, in a live 2–3 minute demo, that this loop works end-to-end using real data wherever feasible.

## 3. Target Users (for framing the UI, not for building auth/roles beyond what's needed for the demo)

- **Primary persona — Local Official / NGO Coordinator ("Supervisor")**: views the risk dashboard, sees alerts fire, sees response recommendations, can log an outcome.
- **Secondary persona — Resident / Frontline Worker ("Recipient")**: represented via a simulated phone/WhatsApp alert view — does not need a separate login, just a UI panel that shows what they'd receive.

Two views, one app. No complex auth system needed — a simple role toggle (Supervisor view / Resident alert preview) is enough for the demo.

## 4. Core Features (MVP scope — build these, in this priority order)

### Must-have (P0 — the demo does not work without these)
1. **Interactive risk map** — a map of a chosen district/region with villages/wards color-coded by risk level (green/yellow/red) for heat, flood, and water-scarcity.
2. **Risk detail panel** — clicking a village/ward shows its current risk score, the underlying data (temperature, rainfall forecast, groundwater trend, active fire hotspots nearby) and *why* the score is what it is (explainability is a stated differentiator — don't skip this).
3. **Simulated alert generation** — when a village crosses a risk threshold, an alert is generated and shown in a "Resident view" panel styled like a WhatsApp message, in a toggleable local language.
4. **Response recommendation** — the alert includes one concrete action (nearest shelter / safe route / advisory), pulled from a small static dataset of shelters/resources per region.
5. **Outcome logging + feedback loop visual** — a simple form where a "supervisor" logs what happened, and the UI visibly shows this feeding back into the risk model (even if the actual model update is simulated/simplified — the point is to make the loop visible, not to build production ML).

### Should-have (P1 — build if time allows, meaningfully strengthens the demo)
6. **Historical trend view** — a simple chart showing how a village's risk score has changed over the last N days/weeks.
7. **District-level summary dashboard** — total villages at risk, alerts sent this week, response time stats (can be illustrative/simulated numbers layered on top of real risk data).
8. **Language toggle** — at least 2 languages (English + 1 regional language) for the alert preview.

### Nice-to-have (P2 — only if P0 and P1 are fully done and stable)
9. Drone/satellite overlay toggle on the map (visual only, using NASA FIRMS fire points).
10. "What-if" slider — let the user simulate a scenario (e.g., +2°C, -30% rainfall) and watch the risk map update live. This is a strong demo moment if time allows.

## 5. Explicit Non-Goals (do NOT build these — they waste hackathon time)

- No real SMS/WhatsApp sending (Twilio integration etc.) — simulate the message UI only.
- No real user authentication/login system — a simple view-toggle is sufficient.
- No production-grade ML model — a transparent, rule-based or lightweight weighted-scoring formula is correct and is actually a stated product differentiator ("explainable, not black-box").
- No multi-tenant/database-backed persistence beyond what's needed to make the outcome-logging loop visually work within a session.
- No native mobile app — responsive web only.

## 6. Success Criteria for the Prototype

The prototype is "done" when a judge can, without narration from you filling every gap:
1. See a map with real risk data displayed per region.
2. Click a red/high-risk area and understand *why* it's flagged.
3. See an alert generated in a resident-facing view with a clear recommended action.
4. Log an outcome and see the interface acknowledge that this feeds back into the system.

## 7. Data Sources (see TRD for integration details)

- **Weather/forecast:** Open-Meteo API (free, no key required, reliable for hackathon use).
- **Fire/heat hotspots:** NASA FIRMS API (free, requires a MAP_KEY — register in advance).
- **Groundwater:** CGWB / India-WRIS published dataset (used as a static/snapshot dataset — see TRD for why live integration is not attempted).
- **Shelters/resources:** Static curated dataset (you create this — 10–15 realistic entries for your chosen demo district is enough).

## 8. Open Questions / Assumptions Made

- Assumption: demo will focus on **one real district/region** (recommend picking one you can find genuine coordinates and context for — e.g., a district in Maharashtra, since that's your location) rather than trying to cover all of India.
- Assumption: "outcome logging feeding back into the model" will be **visually and narratively true** but does not require a real retraining pipeline within the hackathon window.
- If you want a different demo region or a different secondary persona, flag it before the agent starts building — it changes the seed data.
