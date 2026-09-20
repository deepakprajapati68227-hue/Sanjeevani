# Sanjeevani UI/UX Enhancement Master Prompt

## Design Read

**Artifact:** Responsive public-safety climate-risk dashboard and resident alert web application.  
**Primary audiences:** District Disaster Management Authority officers, municipal and field-response teams, and residents receiving urgent local alerts.  
**Design mode:** Redesign and preserve. Keep the current live functionality and data integrations, but improve information architecture, visual hierarchy, readability, and interaction quality.  
**Visual direction:** Human-designed public-service command system with local environmental character. Use flat color, editorial spacing, clear typography, and restrained motion. Do not create a generic AI dashboard, neon control panel, or random card grid.  
**Information density:** High for the officer workspace, low and focused for the resident experience.  
**Motion intensity:** Moderate for officers and low for residents.  
**Accessibility target:** WCAG 2.1 AA, keyboard accessible, reduced-motion compatible, multilingual-ready, and usable at 320px width and 200% zoom.

## Copy-paste implementation prompt

> Redesign the Sanjeevani application at `https://sanjeevani-eight-tau.vercel.app/` and `https://sanjeevani-eight-tau.vercel.app/dashboard` into a polished, human-designed public-safety product. Preserve the current live capabilities: district selection, live weather and groundwater context, risk scoring, map markers, priority zones, shelter information, community verification, multilingual alerts, voice playback, SMS fallback, WhatsApp simulation, AI advisory, risk explanation, historical backtesting, SITREP generation, and official disaster-order workflows.
>
> The design must contain two genuinely separate experiences:
>
> 1. **Officer Command Dashboard:** map-led, evidence-based, operational, and optimized for district response decisions.
> 2. **Resident Safety Dashboard:** mobile-first, calm, icon-led, voice-friendly, and optimized for one immediate instruction.
>
> Do not place the resident experience inside the officer dashboard as a dense modal. Use separate layouts, navigation, content density, actions, and responsive rules while sharing the same design tokens and risk definitions.

## 1. Officer Command Dashboard

### 1.1 Header and navigation

Use a restrained two-level header. The first row contains the Sanjeevani logo, district jurisdiction, last-refresh status, global search, language selector, notifications, and role context. The second row contains only the primary workflow navigation:

`Overview` · `Risk Map` · `Priority Zones` · `Response Fleet` · `Reports`

Place Scenario Simulator, Disaster Backtest, Risk Math, model provenance, and other technical utilities inside an `Analysis tools` menu. Keep `Morning SITREP` visible as the main reporting action. Do not put every tool in the top header.

The current personalized context should remain visible, for example:

`Good afternoon, Chandrapur response team`  
`DDMA · Sunday, 20 September · 2 critical zones require immediate field intervention`

Show data freshness as a calm inline status: `Refreshed live from Open-Meteo & CGWB · 2 min ago`.

### 1.2 Overview hierarchy

Organize the first viewport in this order:

1. District status summary.
2. Four metric cards maximum.
3. Main map and priority queue workspace.
4. Selected-zone decision drawer.
5. Secondary evidence and reporting modules.

Use four summary cards:

- `Critical zones`
- `Population at risk`
- `District risk today`
- `Active relief shelters`

Each card must show a number, a clear label, and one short context line. Do not add decorative sparklines or unnecessary circular meters.

If no ward is selected, show a useful but quiet empty state beside the map:

`Select a ward to review its risk evidence and dispatch actions.`

Provide two clear ways forward: `Choose from priority queue` and `Select on map`. Do not leave a large blank panel with only a heading.

### 1.3 Map and priority queue

Make the map the primary operational workspace. Use a clear neutral/light basemap by default and retain a dark map option for users who prefer it. Show district, block, ward, and village context where available.

Use one marker grammar:

- Marker color communicates risk state.
- Marker size communicates affected population.
- A single short ring animation communicates a new escalation or current selection.
- Shelter markers use a distinct shelter icon.
- Fleet markers use a distinct vehicle icon.
- Thermal anomaly markers use a distinct thermal icon.

Place a compact legend inside the map frame:

`Critical ≥ 0.70` · `Watch 0.45–0.69` · `Stable < 0.45` · `Shelter` · `Relief vehicle` · `Thermal anomaly`

Create a priority queue beside the map. Each row contains location, risk status, score, affected population, dominant hazard, time to criticality, community confirmation, and recommended next action. Selecting a row must synchronize the map and open the detail drawer.

### 1.4 Selected-zone decision drawer

The drawer must use a clear reading sequence:

- Location and status header.
- Score out of 100 and last update.
- One-sentence reason for the alert.
- Time before risk becomes critical.
- Population affected.
- Community report confidence.
- Nearest refuge distance.
- One dominant primary response action.
- Secondary actions.
- Evidence tabs.

Use the following evidence tabs:

`Risk drivers` · `History & forecast` · `Shelter` · `Ground reports` · `Audit trail` · `Model math`

The primary action may be `Dispatch multilingual alert`, `Deploy hydration support`, or `Open field response`. Secondary actions include `Log field outcome`, `Open AI advisory`, `Open shelter route`, and `Generate official order`. Do not style all buttons with equal visual emphasis.

Use technical details progressively. Show plain language first, then provide the formula, weights, data sources, model provenance, and backtest evidence through expandable sections.

## 2. Resident Safety Dashboard

Create a dedicated `/resident` experience with no officer metric ribbon, no dense analytics stack, and no administrative controls in the default view.

Use one focused vertical flow:

1. Sanjeevani identity and language selector.
2. Alert level with icon and text.
3. Location and hazard sentence.
4. One immediate instruction.
5. Nearest safe refuge card.
6. Voice playback control.
7. `I need help` and `I am safe` response buttons.
8. Tap-to-call action.
9. Basic-phone SMS fallback.
10. Optional `Why am I seeing this alert?` section.

Example resident content:

`SEVERE HEAT ALERT`  
`Ballarpur, Chandrapur`  
`Move to Ballarpur Municipal Community Hall & Cooling Center, 400 m away.`

Keep the resident screen visually calm even during a critical alert. Use one dominant semantic status color, large readable text, high-contrast controls, and no decorative animation.

All resident touch targets must be at least 48px. The primary message must be understandable without map knowledge or technical literacy. Provide audio controls with visible states: `Ready to play`, `Playing alert`, `Paused`, and `Replay alert`.

## 3. Color system: Monsoon Indigo + River Teal + Saffron

Use a brighter, standard, role-based palette. The current navy/slate base is dependable but slightly dull; the new combination adds warmth and identity without becoming neon or AI-themed.

| Role | Token | Hex | Use |
|---|---|---:|---|
| Page background | `surface-page` | `#F7F9FC` | Main light background |
| Card surface | `surface-card` | `#FFFFFF` | Cards, drawers, modals |
| Soft surface | `surface-soft` | `#EAF2F5` | Grouped areas and selected navigation |
| Main text | `text-strong` | `#172B4D` | Headings, values, primary labels |
| Secondary text | `text-muted` | `#52657A` | Descriptions and metadata |
| Border | `border-default` | `#CBD7E2` | Dividers, card outlines, fields |
| Primary indigo | `primary-indigo` | `#3157A6` | Brand, navigation, selected tabs |
| Indigo pressed | `primary-indigo-dark` | `#24417D` | Hover and pressed state |
| River teal | `secondary-teal` | `#087F7B` | Communication, routes, completed actions |
| Teal pressed | `secondary-teal-dark` | `#05605D` | Hover and pressed state |
| Saffron | `attention-saffron` | `#C47A12` | Watch, stale, pending attention |
| Saffron surface | `attention-saffron-soft` | `#FFF3D6` | Watch background with dark text |
| Critical red | `risk-critical` | `#B9383E` | Critical risk and emergency action |
| Critical surface | `risk-critical-soft` | `#FBE8E8` | Critical background |
| Stable green | `risk-stable` | `#267A58` | Stable and safe confirmation |
| Stable surface | `risk-stable-soft` | `#E5F3EC` | Stable background |
| Information blue | `info-blue` | `#2B6EA6` | Live data, forecast, source |
| Analysis violet | `analysis-indigo` | `#6558A5` | Model evidence only |
| Focus blue | `focus-blue` | `#1D6FD0` | Keyboard focus outline |

Apply these meanings consistently:

- Indigo is the primary identity and navigation color.
- Teal is operational confirmation and communication.
- Saffron is attention and watch status.
- Red is critical risk only.
- Green is stable or safe only.
- Blue is informational or data-source context.
- Violet is model analysis only.

### Strict visual restriction

Do not use gradients of any kind. No `linear-gradient`, `radial-gradient`, `conic-gradient`, mesh background, aurora effect, gradient text, gradient border, colored glow, gradient map overlay, or animated gradient loader. Use solid fills, neutral borders, spacing, typography, and restrained shadows to create hierarchy.

Do not use color as the only signal. Every state requires a text label and an icon or shape. Validate final color pairings against WCAG AA contrast requirements. Test protanopia, deuteranopia, and tritanopia.

## 4. Typography and alignment system

Use a highly readable multilingual typeface such as **Noto Sans** or another verified family with strong support for English, Hindi, Marathi, Telugu, Tamil, Bengali, Gujarati, and Kannada. Use one primary family consistently. Do not mix unrelated display fonts.

Use a responsive type scale:

| Role | Desktop | Mobile | Notes |
|---|---:|---:|---|
| Resident alert heading | 32/38px | 28/34px | Short and direct |
| Officer page title | 28/34px | 24/30px | District/workspace title |
| Section heading | 20/26px | 18/24px | Clear section purpose |
| Card heading | 16/22px | 16/22px | Location and action heading |
| Metric value | 28/32px | 24/30px | Use tabular numerals |
| Body text | 16/24px | 16/24px | Instructions and explanation |
| Supporting text | 14/20px | 14/20px | Metadata and secondary copy |
| Micro-label | 13/18px | 13/18px | Never for critical instructions |

Use a consistent 8px spacing grid. Align headings, values, labels, buttons, and table columns to shared vertical guides. Use left alignment for long text and instructions. Center only short alert titles, voice controls, or single focused resident actions.

Use 1.4–1.6 line height for body copy and 1.15–1.3 for headings. Limit officer detail text to 60–75 characters per line and resident alert text to approximately 35–55 characters per line. Do not use 11px or 12px text for important content.

Use sentence case for actions: `Dispatch multilingual alert`, `Open shelter route`, `View risk drivers`. Avoid all-caps except for short metadata such as `LIVE` or `DDMA`.

Preserve units and readable formatting: `5.1 days`, `400 m`, `35.2°C`, and `89,450 people`. Never expose `undefined`, `NaN`, missing units, or clipped language strings. Support text expansion in Indian scripts without fixed-height overflow.

Test at 320px width, tablet widths, desktop widths, 200% browser zoom, keyboard navigation, and both light and dark modes.

## 5. Atomic design system

### Atoms

Create consistent atoms for buttons, icon buttons, status chips, badges, labels, input fields, language selectors, data freshness indicators, risk icons, dividers, focus rings, tooltips, and loading states. Use moderate 6–10px corner radii rather than making every component a pill.

### Molecules

Create metric cards, shelter cards, risk-driver rows, priority rows, alert banners, map legends, data-source labels, action buttons, language controls, voice controls, and community-report controls.

### Organisms

Create the officer header, primary navigation, district status summary, map workspace, priority queue, selected-zone drawer, action timeline, evidence tabs, resident alert panel, shelter route panel, SITREP generator, and model transparency panel.

### Templates

Create a desktop officer template, tablet officer template, mobile officer template, and 320px resident template. Use the same design tokens but different information density and action hierarchy.

## 6. Custom motion and Framer Motion

Use **Framer Motion** as the primary animation layer. Keep animation authored, useful, and specific to Sanjeevani.

Implement the following custom interactions:

- **District Pulse:** crossfade summary values, move the map to the new district, and confirm data refresh.
- **Risk Tide:** one semantic ring pulse when a zone escalates, then return the marker to a static state.
- **Evidence Reveal:** reveal risk drivers in weighted order once when the tab opens.
- **Response Trail:** animate `Identified → Prepared → Dispatched → Verified` as an action progresses.
- **Shelter Direction:** use a restrained spring for the resident shelter arrow only when direction changes.
- **Voice State:** transition between ready, playing, paused, and replay states with an icon and text label.
- **Community Confirmation:** turn the selected status button into a confirmed state with timestamp and text confirmation.
- **Morning Brief Assembly:** show SITREP sections preparing, then end with `Brief ready`.

Use `AnimatePresence` for drawers, modals, banners, and changing states. Use `layout` and `layoutId` for priority rows, tabs, and status chips. Keep shared motion variants in one file.

Use these motion tokens:

- 120ms for button feedback.
- 180–240ms for normal transitions.
- 300–420ms for drawers and major state changes.
- 40–60ms list staggering only on initial reveal.
- Ease-out for entrances and ease-in-out for layout changes.

Use CSS transitions for simple hover, focus, border, and color changes. Use Leaflet’s built-in map motion. Do not add several animation libraries for decoration. React Spring, Motion One, AutoAnimate, or Lottie may be used only for one narrowly justified interaction.

Support `prefers-reduced-motion`. Remove looping pulses, parallax, animated counters, chart drawing, spring movement, and repeated shimmer while preserving readable state changes and focus behavior.

## 7. Decluttering rules

- Show no more than four equal-weight metric cards above the primary workspace.
- Make one action primary and group secondary actions under a clear action section.
- Move scenario, backtest, XAI, and provenance tools into progressive disclosure.
- Keep technical model data inside evidence tabs rather than in the first reading layer.
- Remove duplicate legends and repeated labels.
- Use one map-layer control instead of separate controls scattered across the map.
- Keep empty states useful, not decorative.
- Avoid repeated rounded cards with identical visual treatment.
- Use whitespace and alignment instead of more borders, colors, or badges.
- Remove any component that does not answer a user question or support a decision.

## 8. Human-designed quality bar

The design must feel like it was created by a product team that understands Indian district administration and community safety. Use real district names, local shelter names, direct operational wording, data freshness, community signals, and human-reviewed empty states.

Avoid generic AI language such as `Unlock insights`, `Intelligent action center`, or `AI-powered everything`. Avoid sparkles, robot imagery, decorative neural networks, excessive glassmorphism, random gradients, futuristic glow, stock disaster imagery, and motion applied to every component.

The visual tone should be **clear, warm, calm, locally specific, and quietly distinctive**. It should look like a mature civic/public-service product that uses advanced data and AI, not an AI-generated dashboard trying to advertise its intelligence.

## 9. Acceptance criteria

- Officers can identify the most urgent zone and recommended next action within 10 seconds.
- Residents can identify the alert severity, hear the instruction, locate refuge, and report status within 10 seconds.
- The officer dashboard and resident dashboard feel like separate products.
- The primary palette is indigo, teal, and saffron with semantic red and green states.
- No gradient or glow exists anywhere in the interface.
- Every risk state has a text label, icon, and color.
- All text remains readable at 320px width and 200% zoom.
- Multilingual content does not clip, overlap, or break fixed-height cards.
- Typography follows the defined type scale and alignment grid.
- Framer Motion is used through shared variants and purposeful custom interactions.
- Reduced-motion mode removes nonessential movement.
- No control exposes `undefined`, `NaN`, missing units, truncated labels, or ambiguous status wording.
- The final design is appealing, understandable, human-designed, and visually calmer than the current dashboard.

## References

[1]: https://sanjeevani-eight-tau.vercel.app/dashboard "Sanjeevani live officer dashboard"
[2]: https://sanjeevani-eight-tau.vercel.app/resident "Sanjeevani live resident dashboard"
[3]: https://designsystem.digital.gov/design-tokens/color/overview/ "U.S. Web Design System — Using color and accessibility"
[4]: https://m3.material.io/styles/color/roles "Material Design 3 — Color roles"
