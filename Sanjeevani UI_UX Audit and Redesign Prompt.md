# Sanjeevani UI/UX Audit and Redesign Prompt

**Prepared for:** Sanjeevani — Gramin Jal & Jalvayu Raksha Pranali  
**Source reviewed:** [Live Sanjeevani application][1], [Live supervisor dashboard][2], and the uploaded prototype master report.  
**Objective:** Make the application more attractive, calmer, less cluttered, easier to understand, and operationally safer while preserving its live climate-risk, groundwater, mapping, AI advisory, multilingual, voice, verification, and reporting capabilities.

## 1. Executive assessment

Sanjeevani already has a compelling product concept and an unusually strong feature set. It combines hyperlocal weather and aquifer telemetry with explainable risk scoring, field verification, emergency actions, multilingual voice alerts, and official reporting. The current interface communicates technical seriousness, but it asks users to process too many controls and visual signals at once.

The most important redesign decision is to separate the product into **two intentionally different dashboards**:

1. **Officer Command Dashboard:** information-dense, map-led, action-oriented, and optimized for district administrators, municipal commissioners, and disaster-management officers.
2. **Resident Safety Dashboard:** calm, mobile-first, icon-led, voice-first, and optimized for a person who needs to understand one immediate instruction quickly, possibly with low literacy, limited bandwidth, or a basic phone.

Do not treat the resident experience as a modal layered over the officer workstation. It should feel like a separate product surface with its own layout, typography, navigation, content hierarchy, and interaction rules.

## 2. Current UI/UX findings to address

### 2.1 Strengths to preserve

- The mission statement, “Predict. Alert. Respond.”, is memorable and should remain central.
- The live map is an effective operational anchor because it connects risk to place.
- The current selected-location panel contains valuable operational context: risk score, hazard explanation, community verification, time to criticality, recommended shelter, and response actions.
- Explainable risk contribution bars are a strong trust-building feature and should remain available without dominating the primary view.
- The existing multilingual, voice, SMS, shelter, WhatsApp, SITREP, scenario simulation, backtest, and official-order features are valuable differentiators.
- Animated risk markers and Framer Motion are appropriate foundations for a more polished interaction system.

### 2.2 Problems visible in the current live experience

- The header contains the district selector, location search, scenario slider, satellite toggle, SITREP, backtest, role switcher, and language selector in one compressed band. This creates a high cognitive load before the user reaches the main task.
- Five metric cards, a dense map legend, map-layer controls, the selected-location card, multiple response buttons, seven risk contributors, a trend chart, and a shelter card compete for attention in a single viewport.
- Action buttons have too many equal visual weights. A user cannot immediately distinguish the primary emergency response from analysis tools, exports, simulations, and secondary utilities.
- The neon pink, purple, cyan, amber, green, and red accents create energy, but the number of accent colors makes the interface feel more like a prototype or control panel than a dependable public-safety product.
- The dark map is attractive but visually sparse. Without clear geographic framing, ward boundaries, location context, and a strong “selected area” treatment, the map can feel like a field of dots rather than a decision surface.
- The resident alert is shown inside the officer dashboard context, with officer metrics and the map still visible around it. This weakens focus during an emergency and may confuse residents about what they are expected to do.
- Some labels are ambiguous or awkward. For example, “I AM SAFE / Hazard confirmed” and “ALL NORMAL / No hazard” should be rewritten as unambiguous community-status choices.
- The visible string `5.1d (undefinedh) until Red` is a trust-damaging defect. Time values must be formatted through one tested utility and must never expose `undefined`, `NaN`, or an empty unit.
- Risk thresholds should be made consistent across the product. The report describes low risk below 0.45, moderate risk from 0.45 to below 0.70, and high risk at 0.70 or above, while the live legend displays a different moderate threshold. Use one canonical threshold definition everywhere.
- The live page exposes technical source and engine details close to the action surface. Those details are important for transparency, but they should be progressively disclosed rather than competing with immediate response instructions.

## 3. Copy-paste redesign prompt

> **Redesign the Sanjeevani climate-risk and early-warning web application into a polished, calm, highly legible public-safety product with two genuinely separate dashboards: an Officer Command Dashboard and a Resident Safety Dashboard. Preserve all existing live functionality and data integrations, including Open-Meteo weather, CGWB groundwater stress, NASA FIRMS thermal anomalies, explainable risk calculations, community verification, AI incident advisory, multilingual voice and SMS alerts, shelter routing, WhatsApp simulation, scenario simulation, historical backtesting, SITREP export, and official disaster-order generation. Improve the information architecture rather than merely changing colors.**
>
> ### A. Product principles
>
> - Design for fast comprehension under stress. Every screen must answer, in order: **Where is the risk? What is happening? Who is affected? What should I do next?**
> - Use progressive disclosure. Show the minimum information needed for the current decision first, with “View details,” “Why this score?”, and “Open analysis” controls for deeper evidence.
> - Keep the system explainable without making every technical detail permanently visible.
> - Use plain language for actions and community status. Keep technical terminology inside expandable evidence panels.
> - Build for Indian district operations, multilingual use, mobile devices, low bandwidth, and variable literacy.
> - Preserve a clear difference between **monitoring**, **analysis**, **communication**, and **response logging**.
>
> ### B. Information architecture and routes
>
> Create two distinct application surfaces:
>
> - `/officer` or `/dashboard`: Officer Command Dashboard.
> - `/resident`: Resident Safety Dashboard.
>
> The role switcher may remain available, but it must behave like a clear role-selection control, not like a small button hidden among unrelated tools. On mobile, show a simple “Officer view” or “Resident view” label in the header. The resident view must not retain the officer metric ribbon, dense risk-analysis stack, or officer-only administrative controls around the alert.
>
> Use a shared design system, shared data layer, shared language selector, and shared status definitions. Do not use one generic layout for both audiences.
>
> ### C. Officer Command Dashboard
>
> #### C1. Header and global navigation
>
> Create a two-row responsive header:
>
> - **Row 1:** Sanjeevani logo, current district and last-updated status, global search, language selector, notifications, user/role indicator.
> - **Row 2:** Primary navigation tabs: `Overview`, `Risk Map`, `Priority Zones`, `Response Actions`, `Community Reports`, and `Reports & Models`.
>
> Move secondary tools into an `Analysis tools` menu containing Scenario Simulator, Disaster Backtest, Risk Math & XAI, and source/provenance details. Place the NASA thermal layer inside map-layer controls instead of presenting it as a top-level peer to SITREP.
>
> Keep **Morning SITREP** visible as the principal export action. Give it a clear document icon, a tooltip, and a small “Ready to export” status when data is available.
>
> #### C2. Overview screen hierarchy
>
> The first screen should have this order:
>
> 1. **District status banner:** district name, current overall status, last refresh time, data freshness, and a short plain-language summary such as “1 critical hotspot requires immediate field action.”
> 2. **Four summary cards maximum:** Critical zones, population at risk, average district risk, and active shelters. Each card must include a trend or status context, not only a number.
> 3. **Primary workspace:** map on the left and a priority queue on the right.
> 4. **Selected-zone drawer:** opens when a map marker or priority row is selected. It should not permanently consume the full right column when nothing is selected.
> 5. **Secondary evidence:** forecast trend, risk contributors, community verification, and data provenance below the main workspace or inside tabs.
>
> Avoid showing five or more equal-weight metric tiles before the user reaches the map and priority queue.
>
> #### C3. Map and priority queue
>
> Make the map the operational center of the officer experience, but make it more readable:
>
> - Use a lighter neutral basemap option alongside the dark operational theme.
> - Add visible district, block, ward, and village boundary context where available.
> - Use one consistent marker grammar: marker size represents affected population, marker color represents risk state, and a subtle ring represents active escalation.
> - Keep pulsing animation only for high-risk or newly escalated locations. Do not animate every marker continuously.
> - Provide a compact map legend with plain labels: `Critical`, `Watch`, `Stable`, `Shelter`, `Relief vehicle`, and `Thermal anomaly`.
> - Put map layers in a single layers control with checkboxes and short descriptions.
> - Add a “Fit to priority zones” control and a “Return to district view” control.
>
> Create a right-side **Priority queue** with sortable rows containing: risk state, village or ward, score, population affected, dominant hazard, time to criticality, verification confidence, and recommended next action. Selecting a row synchronizes the map and opens the selected-zone drawer.
>
> #### C4. Selected-zone drawer
>
> Structure the drawer into clear sections:
>
> - **Status header:** location, risk state, score out of 100, last updated, and a compact “Why this is flagged” sentence.
> - **Immediate decision strip:** time to critical threshold, population affected, community confirmation, and nearest shelter distance.
> - **Primary response action:** one dominant button such as `Start heat alert response` or `Deploy hydration support`.
> - **Secondary actions:** `Broadcast alert`, `Log field outcome`, `Open AI advisory`, `View shelter route`, and `Generate official order`.
> - **Evidence tabs:** `Risk drivers`, `Forecast`, `Ground reports`, `Shelter`, and `Audit trail`.
> - **Expandable technical explanation:** formula, feature weights, data source, model provenance, and backtest evidence.
>
> Make the primary action visually dominant. Analysis and administrative actions must not look equivalent to an emergency response.
>
> #### C5. Response workflow
>
> When an officer starts an action, use a short guided flow:
>
> 1. Confirm affected zone and severity.
> 2. Show recommended action and required resources.
> 3. Allow language/channel selection for voice, SMS, or WhatsApp simulation.
> 4. Show a preview before sending or logging.
> 5. Record responsible department, officer, timestamp, and expected follow-up.
> 6. Return the user to an action-status timeline.
>
> Use a persistent but unobtrusive `Action status` timeline so officers can see what is pending, in progress, completed, or verified.
>
> ### D. Resident Safety Dashboard
>
> Design this as a separate, mobile-first experience for a person receiving an alert. It must work clearly at 320px wide and remain usable on a slow connection.
>
> #### D1. Resident screen structure
>
> Use one focused vertical flow:
>
> 1. Sanjeevani identity and language selector.
> 2. Large alert state with icon, color, and spoken-language label.
> 3. One-sentence explanation of the immediate hazard.
> 4. One dominant instruction, for example: `Move to the cooling center now`.
> 5. Large shelter card with distance, walking direction, open/closed status, capacity, facilities, and tap-to-call action.
> 6. Large voice playback button with visible playback state.
> 7. Two unambiguous community response buttons: `I need help` and `I am safe`. Do not use wording that can be interpreted in two ways.
> 8. Basic-phone SMS fallback and emergency phone contact.
> 9. Optional `More information` section for forecast, reason for alert, and nearby support.
>
> The resident dashboard must not display officer metrics, ML weights, raw telemetry, administrative exports, or dense map controls by default. If a map is included, show only a simple shelter direction or route card.
>
> #### D2. Resident accessibility and language behavior
>
> - Use large touch targets of at least 48px.
> - Use short sentences and one instruction per block.
> - Pair all color with an icon and text label.
> - Offer text-to-speech with a clearly visible play, pause, replay, and language state.
> - Keep language choices in the user’s script where possible, while retaining a small English fallback.
> - Provide a high-contrast mode and a reduced-motion mode.
> - Make the alert usable without relying on map literacy.
> - Do not autoplay audio without a clear user setting or browser-safe fallback; if autoplay is attempted, show an immediate “Tap to hear this alert” control.
>
> ### E. Color palette and visual language
>
> Replace the current multi-neon treatment with a restrained, trustworthy palette. Use semantic colors consistently across cards, map markers, charts, alerts, and buttons.
>
> | Token | Suggested value | Use |
> |---|---:|---|
> | Ink | `#0B1220` | Main background and deep contrast surfaces |
> | Navy | `#12233A` | Header, navigation, map frame |
> | Slate | `#1E344D` | Cards and raised panels |
> | Cloud | `#F5F7FA` | Light-theme page background and primary text on dark surfaces |
> | Muted text | `#A9B7C6` | Secondary text on dark surfaces |
> | Teal | `#16B8A6` | Stable state, safe action, confirmed data |
> | Sky | `#4CC9F0` | Informational state and interactive focus |
> | Amber | `#F5B942` | Watch/moderate risk and attention |
> | Coral | `#F16B6F` | High risk and urgent but non-critical state |
> | Critical red | `#E5484D` | Critical risk, emergency state, destructive confirmation |
> | Violet | `#8B7CF6` | AI or model-analysis features only; do not use for hazard severity |
>
> Use a light operational theme by default for long officer sessions, with a dark map workspace option. Keep the resident alert theme calm and high contrast. Do not use pink as the primary color for emergency actions because it currently competes with the semantic red alert state.
>
> Verify all text and status combinations against WCAG AA contrast targets. Never use color as the only indicator of risk.
>
> ### F. Typography and content design
>
> Use a highly legible sans-serif family with strong Devanagari and other Indian-script support. Establish a clear scale:
>
> - Display alert: large, bold, short.
> - Page title: one clear sentence.
> - Section title: compact and consistent.
> - Metric value: large enough to scan quickly.
> - Supporting text: short, with comfortable line height.
> - Technical explanation: smaller but never below a practical mobile reading size.
>
> Rewrite labels in plain language. Examples:
>
> - `High Risk Hotspots` → `Critical zones`.
> - `District Risk Index` → `District risk today`.
> - `Ground Verification` → `Community reports`.
> - `Time-to-Critical Velocity` → `Time before risk becomes critical`.
> - `I AM SAFE / Hazard confirmed` → `I need help`.
> - `ALL NORMAL / No hazard` → `I am safe`.
> - `Risk Math & XAI` → `Why this alert?` for general users, with technical details inside.
>
> Use a canonical glossary for `Critical`, `Watch`, and `Stable`, and use the same thresholds in the map legend, cards, charts, alerts, and reports.
>
> ### G. Animation and interaction system
>
> Use Framer Motion deliberately. The interface should feel responsive and alive, not continuously distracting.
>
> - Page entrance: fade and translate content by 8–12px over 180–240ms.
> - Card entrance: stagger by 40–60ms, but only on first load or route change.
> - Map marker selection: scale selected marker to 1.08 and add one soft ring pulse.
> - New critical escalation: show one 2-second halo pulse and a visible status change; do not loop indefinitely.
> - Drawer: spring from the right on desktop and from the bottom on mobile.
> - Metric refresh: animate numeric changes over 350–500ms and announce major changes to assistive technology.
> - Alert transition: use a clear crossfade with a brief icon emphasis, not a flashing screen.
> - Button feedback: use a subtle press state and loading indicator. Never rely on hover-only feedback.
> - Timeline updates: animate a new event into place once, then leave it still.
> - Charts: draw the line once when first revealed, with a reduced-motion fallback.
> - Respect `prefers-reduced-motion` globally. Disable pulsing, parallax, repeated loops, and animated counters when it is enabled.
>
> ### H. Trust, data freshness, and error handling
>
> Make data confidence visible without clutter:
>
> - Show `Live`, `Cached`, `Estimated`, or `Curated baseline` beside relevant data groups.
> - Display last refresh time and a small source label in an expandable provenance area.
> - Show graceful skeleton loading states for weather, map overlays, AI advice, and backtests.
> - Never expose `undefined`, `NaN`, raw API errors, or incomplete units. Add unit tests for countdown and numeric formatting.
> - If an external source is unavailable, explain the fallback in plain language and preserve the last known safe state.
> - Mark AI-generated recommendations clearly and show a rule-based fallback when applicable.
> - Require a clear preview step before an officer exports or simulates an alert or official order.
>
> ### I. Responsive behavior
>
> - Desktop: map and priority queue share the primary workspace; the selected-zone drawer can open without destroying context.
> - Tablet: map appears above the priority queue; action drawer becomes a bottom sheet.
> - Mobile officer view: use a bottom navigation bar for `Overview`, `Map`, `Actions`, and `Reports`; place filters in a drawer.
> - Mobile resident view: one-column layout with large actions and no officer controls.
> - At 320px width, prevent horizontal scrolling and ensure every critical action is visible without precision tapping.
>
> ### J. Deliverables and implementation constraints
>
> Produce:
>
> 1. A redesigned Officer Command Dashboard.
> 2. A redesigned Resident Safety Dashboard.
> 3. A shared tokenized design system for colors, typography, spacing, radii, shadows, icons, buttons, badges, drawers, status chips, loading states, and charts.
> 4. A responsive component library with reusable cards, alert banners, metric cards, map controls, priority rows, action timelines, shelter cards, and language controls.
> 5. A short empty-state, loading-state, and error-state treatment for every major data panel.
> 6. Accessibility support for keyboard navigation, focus visibility, screen readers, reduced motion, high contrast, and Indian-language text.
> 7. Regression checks confirming that existing integrations and features remain available.
>
> Do not remove the existing data, APIs, map behavior, risk math, AI advisory, voice, SMS, community verification, SITREP, backtest, or official-order functionality. Reorganize and clarify them. Keep the technical model transparent, but move detailed evidence behind progressive disclosure.
>
> ### K. Acceptance criteria
>
> - A first-time officer can identify the highest-priority zone and its next recommended action within 10 seconds.
> - A first-time resident can identify the alert severity, hear the instruction, locate the nearest refuge, and report their status within 10 seconds.
> - The officer dashboard has one dominant primary action and no more than four equally prominent summary cards above the main map workspace.
> - The resident dashboard contains no officer-only controls in its default view.
> - Every risk state has an icon, text label, and semantic color.
> - Risk thresholds and labels are identical across map, cards, charts, alerts, and exports.
> - No rendered view contains `undefined`, `NaN`, blank units, truncated action labels, or ambiguous status wording.
> - The layout works at desktop, tablet, and 320px mobile widths without horizontal scrolling.
> - Critical actions are keyboard accessible and have visible focus states.
> - Reduced-motion mode removes repeated pulses and nonessential movement.
> - Loading, stale-data, API-failure, and no-community-report states are understandable and actionable.
> - The final result feels like a calm, credible public-safety command system rather than a neon prototype control panel.

## 4. Recommended priority order for implementation

Begin with the information architecture and role separation. Then implement the shared tokens and semantic status system. Next, rebuild the officer overview, map-priority queue, and selected-zone drawer. After that, rebuild the resident dashboard as a focused mobile-first surface. Finally, add the animation polish, progressive disclosure, accessibility improvements, formatting safeguards, and responsive QA.

This order matters because visual polish cannot solve the core issue if both audiences continue to share the same dense workspace.

## References

[1]: https://sanjeevani-eight-tau.vercel.app/ "Sanjeevani live application"
[2]: https://sanjeevani-eight-tau.vercel.app/dashboard "Sanjeevani live supervisor dashboard"
[3]: /home/ubuntu/upload/SANJEEVANI_PROTOTYPE_MASTER_REPORT.md "Sanjeevani prototype master report"


## 5. Human-designed visual direction

The final interface must not look like a generic AI-generated dashboard, a template assembled from random cards, or a futuristic neon control panel. It should feel like a carefully designed public-safety tool created with knowledge of Indian district administration, local communities, and the real pressure of emergency decisions.

Add the following direction to the implementation brief:

> **Make the product feel intentionally designed by a thoughtful human product team. Do not produce a generic AI dashboard aesthetic. Avoid excessive glassmorphism, random gradients, decorative glow, oversized rounded cards, meaningless 3D illustrations, stock “AI” sparkles, repetitive cards, and visually interchangeable sections. Every element must have a clear operational reason to exist. Use restraint, hierarchy, editorial spacing, and consistent visual grammar.**
>
> ### Personalization on entry
>
> When the application opens, make the experience feel specific to the user and their district rather than like a blank software template:
>
> - Welcome the user with the selected district, role, and operational context. For example: `Good morning, Chandrapur response team` or `Ballarpur community alert` rather than a generic `Welcome to your dashboard`.
> - Show the local date, time, weather context, data freshness, and a short human-readable operational summary.
> - Preserve the user’s last selected district, language, theme, map position, and preferred dashboard role when appropriate.
> - Include a compact “Today in your district” briefing written in plain language, with the most important risk first.
> - Use local place names, block names, shelter names, and administrative terminology naturally. Do not fill the interface with invented personalization or unnecessary greetings.
> - For officers, show a discreet identity/context area such as `District Disaster Management Authority · Chandrapur` rather than a generic avatar-only header.
> - For residents, open directly into the relevant alert and refuge instruction, using their chosen language and location context.
>
> ### Local and editorial character
>
> Give the interface a recognizable Sanjeevani identity without turning it into a decorative brand exercise:
>
> - Use a restrained visual motif inspired by a **district field notebook, weather map, and public-service noticeboard**, expressed through typography, dividers, map annotations, and information hierarchy rather than literal illustrations.
> - Use carefully selected local geographic or environmental references, such as heat, aquifer stress, monsoon, shade, shelters, water access, and community reports.
> - Use a small set of purposeful icon styles. Do not mix icons from unrelated libraries or use a different visual style for every feature.
> - Introduce occasional human-authored microcopy, such as `Verified by 58 community reports` or `Water support is the first priority today`, while avoiding fake conversational language.
> - Use editorial labels such as `What needs attention`, `Why this is flagged`, `Recommended next step`, and `Community signal` to guide comprehension.
> - Use subtle map annotations and callouts that feel placed by an information designer, not automatically scattered across the canvas.
>
> ### Visual restraint and layout quality
>
> - Establish a deliberate spacing rhythm based on a small set of spacing tokens. Do not let every card use a different padding value.
> - Use fewer, larger information groups instead of many small cards.
> - Allow meaningful empty space around the primary map, alert, and response action.
> - Use borders, dividers, tonal surfaces, and typography to create hierarchy before using shadows or gradients.
> - Keep border radii moderate and consistent. Avoid making every control look like a pill.
> - Use one signature accent for the Sanjeevani brand and reserve semantic colors for risk and status.
> - Avoid decorative badges that do not communicate state, ownership, confidence, freshness, or action.
> - Prefer human-readable labels over icon-only controls unless the icon is globally understood and paired with a tooltip or accessible name.
>
> ### Avoiding AI-generated patterns
>
> Explicitly reject these patterns during design review:
>
> - A page made entirely of repeated rounded rectangles with no clear reading order.
> - Excessive purple-blue gradients used to imply artificial intelligence.
> - Sparkles, robot icons, neural-network decorations, or “magic” visual effects around every AI feature.
> - Generic dashboard copy such as `Unlock insights`, `Empower your workflow`, or `Intelligent action center`.
> - Automatically generated-looking charts with too many colors, legends, gradients, and labels.
> - Unnecessary floating widgets, random circular progress meters, or ornamental data visualizations.
> - Identical card components repeated for weather, groundwater, AI advice, verification, and reports without adapting the layout to the actual task.
> - Motion applied to every object. Animation must clarify change, location, status, or feedback.
> - Generic stock imagery of people, villages, satellites, or disaster scenes unless a real, relevant image has a clear communication purpose.
>
> ### Human-centered content and tone
>
> Write content as if it has been reviewed by a district officer and a community representative:
>
> - Be specific about what happened, where it happened, when it matters, and what action is recommended.
> - Avoid claiming certainty when the system is forecasting or estimating. Use labels such as `Forecast`, `Observed`, `Community reported`, and `Model estimate`.
> - Make uncertainty visible without making the interface sound evasive.
> - Use calm, direct language during emergencies. Do not use sensational headlines or excessive exclamation marks.
> - Make each alert sound locally relevant but not artificially conversational.
> - Keep technical explanations available for trust and auditability, but do not expose them before the user understands the immediate action.
>
> ### Personalized states and empty states
>
> Empty, loading, and success states should also feel authored:
>
> - If no critical zone is active, say `No critical zones are active in Chandrapur right now` and show when the next forecast refresh is expected.
> - If community reports are unavailable, say `No ground reports have arrived for this zone yet` and offer a clear reporting path.
> - If the AI advisory is unavailable, say `The advisory service is offline. A rule-based response checklist is ready instead.`
> - If a shelter is full, explain the next nearest available refuge rather than showing only a red badge.
> - If the user changes district, use a brief transition that names the new district and confirms the data refresh.
>
> ### Design review test
>
> Before approval, show the redesigned interface to a designer or stakeholder without explaining the implementation. Ask:
>
> 1. Does it look like a product designed for a real district operation rather than a generic AI template?
> 2. Can the reviewer tell what is most important without reading every card?
> 3. Does the selected district feel present and meaningful?
> 4. Do the officer and resident views feel like two products designed for two real audiences?
> 5. Are color, animation, and decoration serving comprehension rather than trying to impress?
>
> Reject the design if the answer to any of these questions is no.

## 6. Updated final design standard

The desired outcome is **quietly distinctive rather than flashy**. Sanjeevani should feel trustworthy, locally grounded, and deliberately composed. Its personality should come from the quality of its decisions, the specificity of its language, the clarity of its hierarchy, and the care given to district and community context. It should look like a mature human-designed public-service system that happens to use advanced data and AI—not like an AI-generated interface trying to advertise its intelligence.


## 7. Color analysis and final flat-color system

The latest live dashboard has a stronger information architecture, but its visual treatment still uses too many high-intensity accents at once. The current dark navy/black surfaces are combined with bright pink primary controls, purple AI actions, cyan/teal utility states, amber risk states, red critical states, and animated colored map markers. This makes the interface feel like a technology demo and weakens the meaning of semantic colors.

The redesign must use a **flat, non-gradient, standard color system**. Do not use CSS gradients, radial gradients, mesh gradients, aurora effects, blurred color glows, gradient text, gradient borders, or gradient map overlays in the interface. This rule applies to backgrounds, buttons, cards, badges, charts, loading states, hero areas, modals, and alert banners. Color transitions between risk states must be discrete and semantic.

### 7.1 Recommended primary palette

Use a light operational interface by default because officers may work for long periods and need clean data separation. Retain a dark map canvas as an optional workspace surface, not as the color treatment for every screen.

| Token | Hex value | Intended use |
|---|---:|---|
| `--ink-950` | `#17212B` | Main text, dark map labels, deepest contrast |
| `--navy-900` | `#203447` | Header, navigation, dark map shell |
| `--navy-800` | `#2D465A` | Dark elevated panel and selected map context |
| `--slate-700` | `#526575` | Secondary text, dividers on dark surfaces |
| `--slate-500` | `#7D8C98` | Muted text and metadata |
| `--mist-100` | `#F4F7F8` | Application background |
| `--mist-200` | `#E7EDF0` | Subtle section surfaces and separators |
| `--white` | `#FFFFFF` | Cards, drawers, modal surfaces |
| `--sanjeevani-teal` | `#147D78` | Brand accent, links, focus ring, stable state |
| `--sanjeevani-teal-dark` | `#0E625E` | Hover and pressed teal actions |
| `--stable` | `#2E8B68` | Stable/safe status and confirmed community signal |
| `--watch` | `#B7791F` | Watch/moderate risk and attention state |
| `--critical` | `#C43D3D` | Critical risk, urgent response, emergency state |
| `--critical-dark` | `#982F35` | Critical hover, pressed, and dark-surface variant |
| `--information` | `#2F6F9F` | Informational state, data source, map selection |
| `--analysis` | `#635B8F` | Model evidence and analysis tools only |
| `--focus` | `#1E6FA8` | Keyboard focus ring and accessible interaction emphasis |

### 7.2 Palette rules

- Use `--sanjeevani-teal` as the single brand accent. Remove bright pink as the global primary action color.
- Use risk colors only for risk and safety meaning. Do not use red, amber, or green as general decoration.
- Use the dark navy family for structure, navigation, and the map frame. Use white and mist surfaces for most content cards.
- Use violet only for technical analysis or model evidence. It must not compete with critical risk red.
- Use teal for normal operations and safe confirmation, but never use teal to imply that a hazard is low unless the text label also says `Stable` or `Safe`.
- Keep one primary button color per screen. Secondary buttons should use neutral borders or flat tonal surfaces.
- Use neutral borders and typography to create most hierarchy. Do not use colored outlines around every card.
- Use flat fills only. A tonal change between surfaces is acceptable; a color blend is not.
- Keep status chips compact and text-led. Every colored status must also have an icon or written label.
- Use color tokens consistently across the officer dashboard, resident dashboard, map, charts, reports, and exported SITREP.

### 7.3 Contrast and color validation

- Meet WCAG AA contrast for normal text and controls. Target a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text and graphical controls.
- Test the palette under protanopia, deuteranopia, and tritanopia simulations.
- Do not use red versus green as the sole distinction between risk states.
- Provide labels such as `Critical`, `Watch`, and `Stable` beside every status color.
- Use a visible 2px `--focus` outline with a 2px offset for keyboard focus.
- Do not reduce opacity on critical text or action buttons to create a softer visual effect.
- Ensure the dark map theme has readable marker outlines and labels against both light and dark map tiles.

### 7.4 Component color mapping

- **Primary response action:** flat `--critical` only when the action is an emergency escalation; otherwise flat `--sanjeevani-teal`.
- **Secondary response action:** white or `--mist-100` surface with a neutral border.
- **Critical alert banner:** `--critical` fill with white text and a clear alert icon.
- **Watch banner:** pale solid amber-tinted surface with dark text and a visible amber rule; do not use a yellow gradient.
- **Stable banner:** pale solid teal-tinted surface with dark text and a stable icon.
- **AI advisory:** neutral or `--analysis` tonal treatment with the label `Model-assisted recommendation`; avoid sparkles and purple glow.
- **Data freshness:** `--information` for live, `--watch` for stale, and neutral gray for cached or curated baseline.
- **Map markers:** discrete solid colors with a dark outline, consistent shape, and a text-supported legend.
- **Resident emergency screen:** use one dominant semantic state color at a time. Do not combine pink, purple, orange, and red around the same alert.

## 8. Animation and interaction specification

Use animation to improve orientation, feedback, state change, and perceived performance. Animation must not make Sanjeevani look like an AI-generated showcase. It must be quiet, repeatable, and understandable.

### 8.1 Animation technology

Use **Framer Motion** as the primary animation system for React layout transitions, drawers, modals, route changes, list updates, and state transitions. Use shared motion variants and tokens instead of writing unrelated animations inside individual components.

Use **CSS transitions** for simple hover, focus, pressed, border, and color changes. Use the existing Leaflet animation capabilities for map pan and zoom. Use chart-library animation only for first reveal and data updates. If a second animation library is needed, use it for a narrowly defined purpose only:

- **Framer Motion:** page transitions, priority queue updates, drawers, modals, banners, layout changes, and status changes.
- **React Spring or Motion One:** optional physics-based map drawer or compass movement where a natural spring is demonstrably clearer than a standard transition.
- **AutoAnimate:** optional for simple priority-list insertion/removal if it reduces implementation complexity and does not conflict with Framer Motion.
- **Lottie:** avoid by default. Use only for one small, custom-authored offline/loading or voice-state illustration if a static icon cannot communicate the state. Never use stock AI-themed Lottie animations.

Do not install several animation libraries for decorative effects. Framer Motion plus CSS transitions is the default and preferred implementation.

### 8.2 Motion tokens

Define motion tokens in one place:

- `motion-fast`: 120ms for hover and pressed feedback.
- `motion-standard`: 180–240ms for fades, tabs, and small surface changes.
- `motion-emphasis`: 300–420ms for drawers, alert transitions, and selected-zone changes.
- `motion-spring`: a restrained spring with low bounce for drawers and route cards.
- `motion-stagger`: 40–60ms between priority rows, limited to the initial reveal.
- `motion-ease`: use a standard ease-out for entrances and ease-in-out for layout changes.

Avoid bouncy, elastic, or overshooting transitions in critical safety flows.

### 8.3 Officer dashboard motion

- On first load, fade the status header and priority workspace into place over 180–240ms. Do not animate every metric card independently with a large stagger.
- When switching district, crossfade the summary values, move the map to the new extent, and display a short inline message naming the new district. Avoid a full-page wipe.
- When selecting a map marker or priority row, use a subtle selected-state ring and open the detail drawer from the right on desktop or bottom on mobile.
- When a new critical zone appears, animate one short status transition: a single 1.2–1.8 second ring pulse and a visible `New critical zone` label. Do not loop the pulse forever.
- When the data refreshes, animate changed numbers over 300–450ms and leave unchanged values still. Do not make the entire dashboard shimmer.
- When an action is started, disable the button, show a compact progress state, then transition to a completed or needs-attention state with a clear text label.
- Animate priority queue insertion once. Preserve row position after the animation so the user does not lose their place.
- Use a short crossfade between evidence tabs. Keep the selected tab and focus position stable.
- Animate the shelter route line only when the user explicitly turns route guidance on. Do not animate routes continuously.

### 8.4 Resident dashboard motion

- Use one calm entrance transition for the alert card and refuge card.
- Animate the voice button between `Ready`, `Playing`, `Paused`, and `Replay` using a small icon state change and an accessible text label. Do not use a glowing halo.
- When the resident selects `I need help` or `I am safe`, show a clear pressed state, a short confirmation transition, and a persistent text confirmation.
- Move the shelter direction indicator with a restrained spring only when the user’s orientation or route changes.
- Do not flash, shake, bounce, or continuously pulse the resident screen. Emergency severity must come from clear words, color, and instruction.

### 8.5 Loading, errors, and reduced motion

- Prefer static skeleton blocks with subtle opacity changes. Do not use animated gradient skeletons because gradients are prohibited.
- Use a static neutral loading state with a small rotating stroke only when a wait is genuinely occurring.
- Make error recovery visible with a flat button such as `Try again` or `Use last available data`.
- Implement `prefers-reduced-motion`. Under reduced motion, remove looping pulses, spring movement, animated counters, chart drawing, and parallax; retain instant state changes, focus movement, and clear labels.
- Ensure all important state changes are communicated in text and through an ARIA live region where appropriate. Motion must never be the only signal.

## 9. Additional acceptance criteria for color and motion

- A full visual scan of the application contains no CSS gradients, SVG gradients, gradient text, gradient borders, or animated color blends.
- The interface uses one brand accent and a small semantic palette rather than multiple neon accents.
- Red, amber, and teal consistently mean critical, watch, and stable across every screen.
- The live map, officer dashboard, resident dashboard, modals, charts, and exported reports use the same semantic tokens.
- Framer Motion is used through shared variants and motion tokens, not as isolated decorative effects.
- Animation communicates selection, loading, navigation, confirmation, or data change.
- No critical control flashes, shakes, glows continuously, or relies on motion for meaning.
- The resident experience remains calm and readable even when the officer dashboard has many live updates.
- Reduced-motion mode removes nonessential movement without removing information or access to actions.
- A design reviewer should describe the final interface as **clear, trustworthy, locally specific, and human-designed**, not “AI-looking,” “neon,” “over-animated,” or “template-based.”

## 10. Revised implementation order

1. Replace the current multi-accent and dark-first treatment with the flat semantic token system.
2. Remove all gradients from CSS, SVG, charts, loading states, cards, buttons, and map overlays.
3. Apply the token system consistently to both dashboards and all status components.
4. Implement shared Framer Motion variants and motion tokens.
5. Add only the interaction animations that improve orientation and feedback.
6. Test contrast, color-blind distinguishability, reduced motion, and mobile performance.
7. Review the final UI for visual restraint and human authorship before adding any optional decorative detail.
