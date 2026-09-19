# Context Document
## For the coding agent building Sanjeevani

Read this before touching the PRD or TRD. This document exists to give you the "why" behind decisions so you don't second-guess them mid-build.

---

## 1. What this project actually is

This is a **hackathon prototype**, built solo, to be demoed live in front of judges in under 3 minutes, with a 5-slide pitch deck supporting it. It is judged on:
- Does the demo visibly work, end to end, without the presenter explaining away broken parts?
- Is the idea differentiated from generic "climate dashboard" submissions?
- Is the technical execution credible for the scope (judges know it's a hackathon — they are not expecting production infrastructure, they are expecting a convincing, working slice)?

This means: **breadth of a believable end-to-end loop beats depth in any single module.** Do not over-invest in making the risk-scoring model sophisticated. Do invest in making the Predict → Alert → Respond → Learn loop visibly connected and smooth to click through.

## 2. The core narrative the UI must support

The judge should be able to follow this story just by watching the screen, in this order:

1. "Here's a map of real villages/wards. Most are fine — this one is red."
2. "Here's why it's red — actual weather/groundwater/fire data, not a random number."
3. "Because it's red, a resident just received this alert — see, here's what their phone would show."
4. "The alert isn't just a warning, it tells them exactly what to do — here's the nearest shelter."
5. "And here's the part almost nobody builds — when the response is over, the outcome gets logged, and that feeds back into next time's prediction."

Every screen you build should be justified by which of these 5 beats it serves. If a feature doesn't serve one of these beats, it's P2 at best — deprioritize it.

## 3. Design philosophy constraints (important — read the UI/UX doc for detail, but the summary is)

- The founder has explicitly said the previous pitch deck "looked AI-generated" and wants the **product UI to avoid that same trap**. This means:
 - No generic centered-hero-with-gradient-blob layouts.
 - No default shadcn/Tailwind UI "starter template" look with no customization.
 - No stock-photo-style illustrations. Use real map data, real charts, and a couple of deliberately custom icons/illustrations instead.
 - Motion and micro-interactions should feel intentional (a risk marker pulsing when it goes red, a message sliding in like a real phone notification) — not just generic fade-ins on scroll.

## 4. Data honesty constraint

Because judges may ask "is this real data," be precise:
- Weather and fire-hotspot data **are** genuinely live, pulled from Open-Meteo and NASA FIRMS at runtime.
- Groundwater data is a **real published dataset snapshot** (CGWB/India-WRIS figures), not live-queried, because there is no reliable free real-time groundwater API. This is a defensible, honest engineering decision — document it in code comments and be ready to say this plainly if asked.
- Shelter/resource data is **illustrative** (a realistic but constructed dataset) since no clean open dataset of shelter locations exists for arbitrary districts. Say so if asked.
- Outcome-logging "improves the model" is a **visual demonstration of the concept**, not a live-retrained ML pipeline. This is normal and expected for a hackathon prototype — do not fake precision you don't have (e.g., don't display a fabricated "+2.3% accuracy improvement" number; instead show something like "3 new outcomes logged — model will recalibrate on next data refresh").

## 5. Solo-builder scope discipline

Since this is being built by/for a solo participant under time pressure:
- Favor a **single Next.js app** with API routes, not separate frontend/backend services.
- Favor **static/seeded JSON data files** committed to the repo over a database, unless a database is trivially easy to wire up (e.g., a hosted SQLite or a simple in-memory store is fine — do not set up a full Postgres + ORM pipeline for a hackathon demo unless it's already trivial in your chosen stack).
- Every feature should be buildable and testable in isolation before wiring it into the full flow — do not attempt a "big bang" integration at the end.

## 6. What "not looking AI-generated" means technically, not just visually

Beyond visual design, avoid these code/content patterns that read as generated-and-unreviewed:
- No leftover placeholder text/lorem ipsum in the shipped build.
- No mismatched or inconsistent naming (e.g., app called "Sanjeevani" in one place and "ClimateGuard" in another because of a copy-paste from a template).
- No obviously fabricated overly-precise statistics (e.g., "94.7% prediction accuracy") without a basis — approximate, round, and honest numbers read as more credible in a hackathon Q&A.

## 7. Reference project identity (keep consistent everywhere)

- **Project name:** Sanjeevani
- **Tagline:** Predict. Alert. Respond.
- **Brand colors:** Hot pink `#EC1E63` (primary accent), Navy `#0A1128` (dark base), White `#FFFFFF`. See UI/UX doc for full palette including semantic risk colors (green/amber/red).
- **Tone:** Grounded, plain-spoken, technically credible — not corporate-marketing, not overly casual.
