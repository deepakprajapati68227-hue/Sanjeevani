# UI/UX Specification
## Sanjeevani — Design Instructions for the Coding Agent

Goal: simple, attractive, animated, and pop-up-driven — while explicitly **not** looking AI-generated or template-default. This document gives concrete, buildable instructions, not vague adjectives.

---

## 1. What "looks AI-generated" means here, and how to avoid it

Avoid:
- Centered hero section with a big rounded-corner gradient blob behind a headline — this is the single most recognizable "AI landing page" pattern.
- Default shadcn/ui components used with zero customization (visible by their exact default border-radius, shadow, and spacing values).
- Overly generous rounded corners on *everything* (cards, buttons, inputs all at the same large radius) — mix sharper edges (map panels, data cards) with rounder ones (buttons, alert bubbles) so it reads as designed, not templated.
- Stock-photo-style AI-generated imagery (the too-clean lighting/composition look from earlier decks). Use real map tiles, real chart data, and custom simple icons/illustrations instead — never photographic hero images.
- Excessive glassmorphism/blur effects stacked with gradients — pick one visual technique per section, not all of them at once.

Do instead:
- Ground the interface in **real, functional content** (the map, real numbers, real village names) as the visual centerpiece — data-driven UI reads as authentic in a way decorative UI never does.
- Use **asymmetric layouts** where it makes sense (e.g., a large map on the left, a narrower detail panel on the right) rather than everything centered and stacked.
- Custom, simple line-icons (not a generic icon pack look) for the 3 core concepts: Predict / Alert / Respond.

## 2. Brand & Visual System

**Colors**
```
--color-navy:        #0A1128   (backgrounds, headers)
--color-pink:         #EC1E63  (primary actions, accents, brand)
--color-white:        #FFFFFF  (content backgrounds, text on navy)
--color-risk-low:      #2E7D32  (green)
--color-risk-moderate: #F9A825  (amber)
--color-risk-high:     #D32F2F  (red)
--color-gray-bg:       #F5F5F7  (light section backgrounds)
--color-text-dark:     #1A1A2E
```

**Typography**
- Headings: a bold geometric sans-serif (e.g., "Sora", "Manrope", or "Space Grotesk" via Google Fonts) — avoid default system-ui/Inter-only look, which is the most common AI-generated-site font choice. Pick one of the above, use it consistently.
- Body: "Inter" or "IBM Plex Sans" is fine for body text — the contrast between a distinctive heading font and a clean body font reads as intentional.

**Spacing & Shape**
- Base border-radius: 4px for data cards/panels (sharper, "dashboard" feel), 20px+ for the alert-bubble/chat-style components (to visually distinguish "this is a message," not a data panel), 8px for buttons.
- Use a consistent 8px spacing grid throughout.

## 3. Layout Structure

### Landing/Overview Page (`/`)
- Not a generic marketing hero. Instead: a short, direct headline ("Predict. Alert. Respond." as h1), one sentence of context, and a large, real preview of the live risk map embedded directly on the page (not a mockup screenshot — the actual live component) as the primary visual. This immediately signals "this is a working tool," not a marketing page.
- A single clear CTA button → "Open Dashboard."

### Dashboard Page (`/dashboard`) — the core demo screen
- **Layout: two-panel, asymmetric.**
 - Left ~65% width: the interactive map (Leaflet), villages shown as colored circle markers sized by population, pulsing gently (Framer Motion `scale` loop, subtle, 2s cycle) if risk is High.
 - Right ~35% width: a detail panel that populates when a village is clicked. Empty state before selection should show a short instructional line, not be blank.
- A slim top bar: project name/logo mark (simple geometric mark, not a generic AI-generated logo — see icon prompt below), a view toggle (Supervisor / Resident Alert Preview), and a small live-data indicator (a small green dot + "Live weather data" text) that reinforces the "not just static' credibility point.

### Village Detail Panel (right panel, on click)
- Village name, population estimate, overall risk badge (colored pill).
- **Score breakdown**: 4 small horizontal bar indicators (heat / flood / water / vulnerability), each labeled with its raw contributing value — this directly serves the "explainable AI" differentiator, make it visually prominent, not an afterthought.
- Below that: a "Generate Alert Preview" button (P0) that triggers the Alert Preview pop-up/panel.

### Alert Preview (pop-up or slide-in panel, styled like a phone)
- A simple phone-frame mockup (CSS only, not an image) with a chat-bubble-style message inside, styled to resemble WhatsApp (green accent bubble is fine here specifically, as a recognizable pattern — this is the one place borrowing a familiar visual convention helps rather than hurts, since it signals "this is what the resident sees on their own phone").
- Animate this **sliding in from the right** with Framer Motion (`x: 300 → 0`, spring transition) when triggered — this is your best "wow" animation moment, make it smooth.
- Include a language toggle (2 small pill buttons: English / [regional language]) that swaps the message text.
- Below the message: the Response recommendation card (nearest shelter name + distance, shown on a small inset mini-map or simple icon + text).

### Outcome Logger (modal pop-up)
- Triggered by a "Log Outcome" button on the detail panel.
- A short form: outcome type (dropdown: "Alert acted on" / "False alarm" / "Escalated"), optional note.
- On submit: modal closes with a satisfying small checkmark animation, and the detail panel updates to show "1 new outcome logged — model recalibrates on next refresh" as a small highlighted note (this is your feedback-loop payoff moment — make it visually noticeable but not overstated).

## 4. Animation & Micro-interaction Guidelines (Framer Motion)

| Interaction | Animation |
|---|---|
| High-risk map marker | Gentle pulsing scale (1 → 1.15 → 1), 2s loop, red glow via box-shadow |
| Selecting a village | Detail panel content fades + slides up slightly (`opacity 0→1`, `y: 10→0`), 250ms |
| Alert preview opening | Slide in from right with slight spring overshoot, 400ms |
| Score breakdown bars | Animate bar width from 0 to final value on panel open, staggered by 80ms each |
| Outcome logged | Small checkmark scale-bounce, then modal fade-out, 300ms total |
| View toggle (Supervisor/Resident) | Smooth crossfade between the two views, 200ms, not a jarring hard cut |

Keep every animation under ~400ms — snappy reads as polished, anything longer starts to feel sluggish in a live demo.

## 5. Custom Icon / Logo Generation Prompt

Since photographic AI images should be avoided, use a simple **custom icon set** instead. If using an AI image tool for icons/logo only (not photos), use this prompt:

> Design a minimal, geometric line-icon set for a climate-tech dashboard called "Sanjeevani," using a single hot-pink (#EC1E63) stroke color on a transparent background, 2px consistent stroke weight, no fill, no gradients, no shadows, no photorealistic elements. Icons needed: (1) a radar/signal wave icon representing "predict", (2) a bell or message-bubble icon representing "alert", (3) a location-pin with a small checkmark representing "respond", (4) a simple water droplet, (5) a simple flame/heat icon, (6) a simple rising-water/wave icon for flood. Style should feel like a modern fintech or climate-data product icon set — clean, engineering-grade, not playful or cartoonish, and not photorealistic in any way.

## 6. Optional: Background/Section Illustration Prompt (use sparingly, one place only)

If you want a single subtle illustrative graphic (e.g., for the landing page background, very low opacity, behind the live map preview) rather than none at all:

> Create a minimal, abstract vector-style illustration of a topographic contour map pattern, using thin hot-pink (#EC1E63) lines at low opacity (15-20%) on a navy (#0A1128) background, no photorealistic elements, no people, no buildings, no gradients — purely geometric contour-line art suggesting terrain/elevation data, suitable as a subtle full-bleed background texture behind dashboard content. Flat vector style only, similar to a technical data-visualization aesthetic, not decorative or organic.

Do **not** use this technique more than once in the app — one subtle background texture is a design choice; five different generated illustrations across five pages is what makes a deck/app look AI-assembled.

## 7. Accessibility & Polish Checklist (quick pass before demo)

- Color is never the only signal for risk level — always pair the color with a text label ("High," "Moderate," "Low") for the risk badges.
- All interactive elements have a visible hover/focus state.
- Test the whole flow at both a 1920px projector resolution and a phone-width viewport before demo day — this was explicitly your "both" requirement.
- Remove all placeholder/lorem ipsum text before the final build — this was flagged as a specific credibility issue in your earlier pitch deck; don't repeat it in the product.
