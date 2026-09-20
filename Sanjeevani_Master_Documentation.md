# Sanjeevani — Master Project Documentation

**One-line summary:** Sanjeevani is a closed-loop climate early-warning system that predicts heat, flood, and water-scarcity risk at the village level using free public data, and — unlike most alert systems — tells people exactly what to do about it, in a form that works for people with little or no formal reading ability.

**Meaning of the name:** "Sanjeevani" is Sanskrit for "life-restoring" — chosen because the project's real job isn't just to warn people, it's to keep them safe long enough that the warning actually mattered.

---

## 1. The Problem

In plain terms: the information needed to prevent a lot of climate-related harm already exists. It just doesn't reach the right person, in the right format, in time.

- India draws 249 billion cubic meters of groundwater every year — a quarter of everything extracted on the entire planet. Over 1,180 groundwater blocks nationwide are officially classified as over-exploited, meaning water is being taken out faster than nature refills it. *(Source: CGWB / Ministry of Jal Shakti)*
- Heatwave death counts reported by different government bodies (NDMA, NCRB, IMD) for the same year can differ by nearly double — a sign that tracking itself is broken, not just that warnings are late. *(Source: Down To Earth / PLOS Medicine analysis)*
- The people hit hardest — outdoor laborers, small farmers, rural households — are also the people with the least access to technical weather/water data in a form they can act on. By the time a flood or heatwave is visible on the ground, the window to prepare has closed.
- This is a **last-mile problem, not a data-availability problem.** Existing government alerts are generic, one-directional broadcasts with no personalization, no plain-language delivery, and no way to know if the warning actually worked.

## 2. The Solution — Predict → Alert → Respond → Learn

Sanjeevani runs as one continuous loop:

1. **Predict** — Pulls live weather (Open-Meteo), satellite fire/heat data (NASA FIRMS), and groundwater trend data (CGWB/India-WRIS snapshot) to compute a risk score for every village or ward in a chosen district.
2. **Alert** — When risk crosses a threshold, the system automatically generates a plain-language, local-language alert.
3. **Respond** — The alert always includes one specific action (nearest shelter, safe route, water access point) — never just a warning with nothing to do about it.
4. **Learn** — When someone logs what actually happened, that outcome feeds back into the system and improves future predictions.

**What makes this different from a typical dashboard:** almost every other project in this space stops after step 1 or 2. Very few close the loop back to step 4, and even fewer are designed so the actual alert (step 2–3) works for someone who can't read a technical dashboard at all — which is the whole point of this section of the doc.

## 3. Two Very Different Users, Two Very Different Interfaces

This is the most important design decision in the whole project: **the app is not one interface simplified two ways — it's two genuinely different interfaces, built for two people who have nothing in common except sharing the same underlying data.**

### 3.1 The Resident / Frontline Worker — the person the mission is actually for

This person may have limited formal education, may not read fluently, may only have a basic phone, and will see this system for a few seconds during a stressful moment — not sit and study a dashboard. Every design decision for this view should be judged against one question: **"could someone who can't read follow this?"**

**Resident-facing features:**

| Feature | Plain-language explanation | Why it matters |
|---|---|---|
| **Icon-first alerts** | Instead of sentences, the main thing on screen is one big, recognizable picture — a red sun for heat, a blue wave for flood — the same visual language used on TV weather reports people already know. | A picture doesn't require reading. Text becomes a support, not the primary message. |
| **Auto-playing voice alerts** | The moment the alert appears, it speaks the message out loud automatically, in the local language — no button to find or press. | Removes the literacy requirement entirely. Someone just has to listen. |
| **One action, not a list** | Every alert gives exactly one instruction — "go here," shown with a big arrow/pin icon and a distance — never a bulleted list of options to weigh. | A person in a stressful moment can follow one instruction. A list requires reading and decision-making they may not have time for. |
| **Two-button feedback** | Instead of a form with a dropdown, the resident just taps a big checkmark ("I'm safe / this happened") or a big X ("this didn't happen") — or, on a basic phone, replies "1" or "2" to a text message. | No typing, no reading a form, works on any phone including non-smartphones. |
| **Real SMS option, not just WhatsApp** | In addition to WhatsApp-style alerts (which need a smartphone and data), the system can send a genuine SMS text message, which works on any basic mobile phone. | WhatsApp assumes a smartphone. A large share of the actual target population may only have a basic phone — SMS reaches them too. |
| **Regional language by default** | The alert defaults to the local regional language (e.g., Marathi for the demo district), with English available as a toggle — not the other way around. | Reflects who the primary user actually is, rather than defaulting to the language most convenient for a judge or developer. |

**How to demo this simply, without technical jargon:** show a phone (or phone-shaped mockup) receiving a real alert, let it play out loud, and tap the checkmark — that's the entire resident-facing story, and it needs zero explanation of how it works under the hood.

### 3.2 The Officer / Supervisor — the person coordinating the response

This person (a panchayat official, NGO coordinator, or disaster-response supervisor) is comfortable with a screen full of information and needs depth, not simplicity. All of the more advanced/technical features belong here — **not** on the resident-facing view.

**Officer dashboard features — original scope (P0/P1, already planned or built):**

- Interactive risk map with color-coded villages (green/amber/red)
- Click-through risk detail panel showing the exact component scores (heat/flood/water/vulnerability) behind each number — the "explainable, not black-box" feature
- District-level summary stats (villages monitored, high-risk count, population in critical zones)
- Historical trend chart per village
- Outcome-logging form (the officer-side version — a real form with a dropdown and notes, unlike the resident's two-button version)
- Scenario "what-if" slider (e.g., +2°C, -30% rainfall) to see the map update live
- Historical backtest view — showing the model would have flagged a real past disaster date correctly, days in advance
- Downloadable one-page PDF advisory per village

**Officer dashboard features — new additions (officer-only, per latest scoping):**

| Feature | Plain-language explanation | Why it's officer-only |
|---|---|---|
| **Community-verified alert layer** | Residents can upvote/downvote an alert ("still flooding here" / "water's receded") with one tap, creating a live accuracy signal on top of the model's own logged outcomes. | The *aggregated* verification data is a supervisor-level insight; the tap itself happens on the resident's side but the resulting signal is displayed only on the officer dashboard. |
| **Compound risk flag** | If two risk types are elevated at once (e.g., heat + water scarcity together, which is more dangerous than either alone since dehydration worsens heat stress), the dashboard shows a distinct "compound risk" badge. | Requires understanding how two risk scores interact — a supervisor-level judgment call, not something to explain to a resident mid-crisis. |
| **"Time to critical" countdown** | Instead of a static score, the dashboard projects forward — "groundwater in this ward is trending toward critical in ~9 days at the current rate." | A planning tool for someone allocating resources ahead of time, not an in-the-moment alert. |
| **Officer accountability trail** | Logs the timestamp an alert was generated and the timestamp a response was logged, showing a "response time" metric (e.g., "42 minutes"). | This is an institutional accountability metric — relevant to a supervisor's performance tracking, not to the resident receiving the alert. |
| **Exportable district risk briefing** | One button compiles the day's high-risk villages, scores, and recommended actions into a single shareable PDF or forwardable summary — the kind of document a district office could use in a morning briefing. | A coordination document for officials managing many villages at once — not relevant to an individual resident. |
| **Voice-based alert intake** | A field worker can call in or record a short voice note describing what they're seeing on the ground, which gets logged against that village and reviewed by the supervisor. | This is data collection *feeding into* the officer's view — the officer reviews and acts on it, not the resident. |
| **Risk model transparency page** | A dedicated screen showing the exact weighting formula behind every risk score, with current live values filled in. | This directly answers a technical judge's question ("how do you know the model is trustworthy") — it's a credibility tool for an audience that reads formulas, not a resident-facing feature. |

## 4. The ML / AI Component — What's Actually "AI" Here, and Why

Being honest about this matters for judge credibility — don't claim more than what's built.

### 4.1 Learned risk weights (replaces hand-picked constants)

Originally, the risk formula used fixed, manually chosen weights (heat 0.3, flood 0.3, water 0.2, vulnerability 0.2). This is honest and explainable, but not actually "learned" from data — which weakens an "AI-powered" claim under technical questioning.

**The fix, doable in a few hours:**
1. Pull 2–3 years of historical weather data for the demo district from Open-Meteo's free historical API.
2. Label a small set of past dates (30–50 is enough for a hackathon) as "high-risk event occurred" or "normal," using news archives or known disaster dates as ground truth.
3. Train a simple **logistic regression** model (a small, well-understood, explainable model — not a deep neural network) in Python using scikit-learn to predict risk from the same features already being tracked.
4. Copy the model's learned coefficients into the app's weight configuration file. No live Python server is needed — the *learning* happens once, offline, before the hackathon; the *app* just uses the resulting numbers.

**In plain terms:** instead of "I guessed these numbers feel about right," the honest claim becomes "these numbers were learned from real historical weather and disaster data." Same code structure, same explainability, genuinely stronger claim.

### 4.2 LLM-generated alert text

Instead of hand-writing every alert message and its translations, a call to a language model (e.g., via a simple API request) generates the plain-language, simplified, translated version of the alert from the raw risk data.

**Why this is a good fit for both goals at once:**
- It's genuinely AI-powered, in a way a judge can verify by asking to see a different scenario generated live.
- Language models are specifically good at simplifying technical information into short, plain sentences — which is exactly the accessibility problem this project needs solved.

**Feasibility:** this is a small, self-contained piece of code (one API call, a clear prompt describing the tone and reading-level constraints) — realistically an hour or two of work, including testing a few sample outputs for clarity.

### 4.3 What to explicitly avoid claiming
- Do not claim "deep learning" or "neural network" — a logistic regression is the right, defensible choice at this scale and is not the same thing.
- Do not claim the model "retrains in real time" — outcome logging visually demonstrates the feedback-loop *concept*; actual retraining happens offline, between hackathon iterations, not live during a demo.
- Do not fabricate a precise accuracy number (e.g., "94.7% accurate") without a real evaluation — an approximate, honestly-described result is more credible than false precision.

## 5. Technical Architecture Summary

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) | Single app, frontend + backend API routes together |
| Styling | Tailwind CSS, customized (see UI/UX section) | Avoid default/unstyled Tailwind look |
| Animation | Framer Motion | Map pulses, alert slide-ins, panel transitions |
| Map | React-Leaflet + OpenStreetMap | Free, no API key |
| Charts | Recharts | Historical trend view |
| Weather data | Open-Meteo API | Live, free, no key required |
| Fire/heat data | NASA FIRMS API | Live, free, requires a MAP_KEY (register in advance) |
| Groundwater data | Static CGWB/India-WRIS snapshot | Honestly documented as a snapshot, not live — no reliable free live API exists |
| Shelters/resources | Static curated dataset | Illustrative, clearly labeled as such if asked |
| ML weighting | Offline-trained logistic regression (scikit-learn) | Coefficients copied into app config — no live ML server needed |
| Alert text generation | LLM API call (server-side) | Generates simplified, translated alert copy |
| SMS delivery (resident channel) | Twilio free-tier trial | Enables a real, live text message during the demo |
| Deployment | Vercel | One-command deploy, live link for judges |
| Data storage | JSON files + simple in-memory/session store | No database needed at this scale |

## 6. UI/UX Design Principles

- **Officer dashboard:** data-dense, asymmetric layout (large map + detail panel), sharp-cornered data cards, explainable score breakdowns, animated but efficient — built for someone comfortable reading a screen.
- **Resident view:** minimal, icon-first, voice-first, single-action, rounded/friendly shapes for alert bubbles — built for a few seconds of attention under stress, not sustained reading.
- **Brand colors:** Navy `#0A1128` (base), Hot pink `#EC1E63` (accent/action), risk colors green `#2E7D32` / amber `#F9A825` / red `#D32F2F`.
- **Avoid "AI-generated" visual tells:** no centered-hero-with-gradient-blob, no unmodified default component-library look, no stock-photo-style imagery, no uniform rounded corners on every element. Ground the design in real data (the live map, real numbers) as the visual centerpiece rather than decorative elements.
- **Motion:** staggered entrances, scroll-triggered reveals, a pulsing animation on high-risk markers — keep all individual animations under ~400–500ms so the interface feels responsive, not slow.

## 7. Data Sources & Honesty Notes (for Q&A)

| Data | Live or static? | Source |
|---|---|---|
| Weather forecast & historical | Live | Open-Meteo (free, no key) |
| Fire/heat hotspots | Live, with fallback | NASA FIRMS (free, requires MAP_KEY) |
| Groundwater trend | Static snapshot | CGWB / India-WRIS published figures |
| Shelters/resources | Static, illustrative | Manually curated for demo district |
| Alert text | Generated live | LLM API call |
| Risk weights | Learned offline, fixed at runtime | Logistic regression trained on historical data before the hackathon |

Be direct if asked: groundwater and shelter data are honest, labeled approximations — not a weakness to hide, but a scoping decision explainable in one sentence.

## 8. Feature Priority Summary

**P0 — must work for the demo to make sense at all**
- Risk map with real village data
- Click-through explainable risk score
- Icon-first, voice-first resident alert
- One concrete recommended action per alert
- Outcome logging that visibly feeds back into the system

**P1 — meaningfully strengthens the demo, build if time allows**
- Historical backtest against a real past disaster date
- District summary dashboard
- Language toggle (officer side) / regional-default (resident side)
- Two-button resident feedback
- Real SMS send for at least one live demo moment
- Learned (not hand-picked) risk weights

**P2 — officer-only advanced features, build only after P0/P1 are stable**
- Community-verified alert layer
- Compound risk flag
- "Time to critical" countdown
- Officer accountability trail (response-time metric)
- Exportable district risk briefing
- Voice-based alert intake
- Risk model transparency page
- What-if scenario slider
- Side-by-side village comparison

## 9. Pitch Narrative (core talking points)

- **Problem:** the data to prevent climate harm already exists; it never reaches the person who needs it, in a form they can use, in time.
- **Solution:** a closed loop — Predict, Alert, Respond, Learn — built on free public data, with a resident-facing layer designed for people with limited literacy, not just a dashboard for officials.
- **Differentiator:** most competing projects stop at monitoring. This one closes the loop back to the model, and — critically — it's the only one built so the actual affected person, not just the official watching a screen, can use it.
- **Feasibility:** no hardware, no sensors, low cost, scales by expanding the data boundary, not by rebuilding the system.
- **Honesty under questioning:** groundwater/shelter data are static/illustrative by clear design choice; the ML model is a simple, explainable logistic regression, not a deep learning system; the feedback loop is visually demonstrated, not a live-retraining pipeline — all defensible, all honestly scoped for a hackathon timeline.

## 10. Future Roadmap (beyond the hackathon)

- Pilot in one real district, validating the model against that region's actual historical disaster records.
- Partner with local health workers and panchayat officials for real field-testing of alerts and response recommendations.
- Integrate with existing government disaster management platforms rather than operate as a standalone competitor.
- Add drone-based rapid assessment for severe, fast-moving events.
- Explore licensing to State Disaster Management Authorities as a standard early-warning layer.
- Expand the community-verification and voice-intake features into a two-way trust system between residents and officials over time.
