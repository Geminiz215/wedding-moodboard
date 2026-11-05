---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local data: 79 searchable styles (50 active), 192 product palettes and reasoning profiles, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks."
---

# UI/UX Pro Max - Design Intelligence

Adapted from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) ([`SKILL.md`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md)). Provides searchable local UI/UX guidance and standalone design intelligence: 79 searchable styles (50 active), 192 product palettes and exact reasoning profiles, 74 font pairings, 119 UX guidelines, 105 curated icons, 17 GSAP presets, 25 chart types, and 22 technology stacks.

## When to Apply

Use this Skill when the task involves UI structure, visual design decisions, interaction patterns, or user experience quality control:
- Designing new pages, landing pages, dashboards, or application layouts
- Creating or refactoring UI components and design systems
- Choosing color palettes, typography pairings, spacing scales, and layout systems
- Reviewing UI for UX, accessibility (WCAG), and visual consistency
- Implementing navigation patterns, micro-interactions, GSAP animations, or responsive behavior
- Improving perceived quality, dark/light theme fidelity, and usability across web, mobile, and desktop stacks

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something looks, feels, moves, or is interacted with.

## Rule Categories by Priority (1 -> 10)

Follow priority `1 -> 10` to decide which category to focus on first. When using the local search script, pass `--domain <Domain>` to query full details, or read `references/quick-reference.md` on demand.

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Accessibility** | CRITICAL | `ux` | Contrast >= 4.5:1 (normal) / 3:1 (large), Alt text, Keyboard nav, Aria-labels, visible focus rings | Removing focus rings (`outline-none` without replacement), Icon-only buttons without labels |
| **2** | **Touch & Interaction** | CRITICAL | `ux` | Min size `44x44px`, `8px+` spacing, `cursor-pointer`, Loading feedback & disabled states | Reliance on hover only, Instant state changes (`0ms`), non-functional clickable lookalikes |
| **3** | **Performance** | HIGH | `ux` | WebP/AVIF, Lazy loading below fold, Reserve space (`CLS < 0.1`), GPU transforms (`transform`, `opacity`) | Layout thrashing, Cumulative Layout Shift, animating `width`/`height`/`top`/`left` |
| **4** | **Style Selection** | HIGH | `style`, `product` | Match product type, Single cohesive style, Consistent SVG icons (`24x24` viewBox, no emoji) | Mixing flat & skeuomorphic randomly, Using emojis as UI icons, unverified brand SVGs |
| **5** | **Layout & Responsive** | HIGH | `ux` | Mobile-first breakpoints (`320px`, `768px`, `1024px`, `1440px`), Viewport meta, No horizontal scroll | Horizontal scroll on mobile, Fixed px container widths, Disabling user zoom |
| **6** | **Typography & Color** | MEDIUM | `typography`, `color` | Base `16px` (`1rem`), Line-height `1.5-1.75`, `65-75ch` prose width, Semantic color tokens | Text `< 12px` body, Low-contrast gray-on-gray, Raw hex values scattered in components |
| **7** | **Animation** | MEDIUM | `ux`, `gsap` | Context-aware timing (`150-300ms`), Motion conveys meaning, Spatial continuity, `prefers-reduced-motion` | One duration for every transition, Decorative motion blocking input, No reduced-motion support |
| **8** | **Forms & Feedback** | MEDIUM | `ux` | Persistent visible `<label>`, Error anchored near field, Helper text, Progressive disclosure | Placeholder-only labels, Dumping errors only at top, Overwhelming users with fields upfront |
| **9** | **Navigation Patterns** | HIGH | `ux` | Predictable back behavior, Bottom nav `<= 5` items, Clear active state, Deep linking | Overloaded nav bars, Broken back/modal escape behavior, No deep links |
| **10** | **Charts & Data** | LOW | `chart` | Direct legends, Interactive tooltips, Accessible colorblind-safe series palettes | Relying on color alone to convey meaning, Cluttered gridlines |

## Running the Search Tool (When Bundled with Local Scripts)

If your project includes the local `scripts/search.py` script from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), invoke it by its full path rather than assuming a working directory:

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "<query>" --domain <domain>
```

If `python` is not found, try `python3`, then `py -3`. Requires Python 3.x with no external dependencies. If running this `SKILL.md` standalone without the Python scripts, apply the structured workflow, domain tables, and checklists below directly.

## Workflow & Query Contract

### Query Contract

Choose the smallest search mode that fits the request:
- **New project/page or system-wide visual direction** -> use `--design-system`.
- **Targeted concern or component bug** -> use one explicit `--domain`.
- **Known implementation stack** -> use `--stack`; add a separate domain search only for a distinct design concern.

Build each query around one dominant intent, using 2-5 meaningful terms and one useful constraint such as product, platform, or interaction:
- **Accessibility work**: Search one observable outcome at a time using explicit accessibility outcome terms. Query the semantic outcome first (`"error summary validation" --domain ux`), then a component-specific domain if needed (`"decorative icon aria hidden" --domain icons` or `"icon button accessible label" --domain icons`), and only then the implementation stack. Other high-signal queries include `"focus not obscured" --domain ux`, `"dragging movements" --domain ux`, and `"accessible authentication" --domain ux`.
- **Text-layout and compact-component bugs**: Search the semantic UX outcome first (`"orphan heading line balance" --domain ux`, `"badge chip label wraps" --domain ux`, `"live badge count screen reader" --domain ux`, `"rapid chip animation interrupted" --domain ux`), then query the detected stack (`"chip badge overflow nowrap" --stack html-tailwind`).
- **Right-to-left (RTL) interfaces** (Arabic, Hebrew, Persian, Urdu, or explicit `dir="rtl"` / `rtl:` requests): Add `--rtl` to style and product searches and respect the returned `rtl_level`:
  - `full`: Needs no directional rework.
  - `partial`: Mirrors cleanly but requires per-component checks (icons, carousels, motion paths, charts).
  - `caveats`: Encodes reading direction; state this before recommending it and propose a mirrorable alternative (`--rtl=full` restricts searches to the safest rows).

### Step 1: Analyze User Requirements

Extract the core context from the user request and repository before writing UI code:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, fintech, healthcare, entertainment, tool, productivity, or hybrid.
- **Target audience & context**: Usage environment (commute, leisure, enterprise operations), density expectations, and theme mode (light, dark, or adaptive).
- **Style keywords**: Minimal, playful, vibrant, glassmorphism, neo-brutalism, bento grid, editorial, soft UI, or dark-mode enterprise.
- **Stack detection**: Inspect project files (`package.json` for React/Next/Vue/Svelte/Nuxt/Angular, `pubspec.yaml` for Flutter, `*.xcodeproj` / `Package.swift` for SwiftUI, `composer.json` for Laravel, `app.json` + `react-native` for React Native). Never silently assume a conflicting stack.

### Step 2: Generate Design System (Required for New Pages/Projects)

Define a coherent product-wide visual direction (via `--design-system` or direct architectural reasoning):

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

Establish these core pillars before coding components:
- **Recommended Pattern**: Layout architecture (e.g., Hero-centric, Bento Grid, Split-screen, Command-driven Dashboard).
- **Style Priority**: One cohesive visual aesthetic per product.
- **Semantic Color Tokens**: Map `primary`, `secondary`, `cta`, `background`, `surface`, `text-primary`, `text-muted`, `border`, `error`, `warning`, and `success` cleanly across light and dark modes.
- **Typography Pairing**: Pair a distinctive heading typeface with a legible body font and a monospace font for tabular numbers/code.
- **Industry Anti-Patterns**: Filter out domain mismatches (e.g., avoid neon pink/purple AI gradients in banking/healthcare; avoid comic typography in enterprise security).

### Step 2b: Persist Design System (`MASTER.md` + Overrides Pattern)

To save the design system across sessions in `design-system/<project-slug>/`:

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "<query>" --design-system --persist -p "Project Name" --output-dir "<project-root>"
```

This establishes a hierarchical design system structure:
1. **`design-system/<project-slug>/MASTER.md`**: Global source of truth containing shared tokens, typography, color palettes, and base component rules.
2. **`design-system/<project-slug>/pages/<page-name>.md`**: Page-specific overrides (generated via `--page "<page-name>"`).
3. **Precedence Rule**: Always read `MASTER.md` first. If `design-system/<project-slug>/pages/<page-name>.md` exists for the target page, its rules override `MASTER.md`; otherwise, follow `MASTER.md` exclusively. Never overwrite an existing `MASTER.md` with `--force` without explicit user authorization.

### Step 2c: Design Dials (Optional 1-10 Sliders)

Tune the design system output along three independent axes without changing the core query:

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "<query>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```

| Dial | Low (`1-3`) | Mid (`4-7`) | High (`8-10`) |
| :--- | :--- | :--- | :--- |
| `--variance` | Centered / minimal (biases toward Minimalism-style categories) | Balanced / modern | Bold / asymmetric (biases toward Brutalism, Bento Grids) |
| `--motion` | Subtle micro-interactions (`150-200ms` state transitions) | Standard scroll/stagger motion | Complex choreography (GSAP pin, Flip, SplitText) |
| `--density` | Spacious (`24-96px` spacing scale for marketing/landing pages) | Standard (`16-64px`, default) | Dense/dashboard (`8-32px` spacing scale for data-heavy UIs) |

### Step 3: Supplement with Domain Searches

Query specific domains when resolving targeted design or UX questions:

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "<keyword>" --domain <domain> [-n <max_results>]
```

| Need | Domain | Example Query |
| :--- | :--- | :--- |
| Product type patterns | `product` | `"entertainment social" --domain product` |
| Style options | `style` | `"glassmorphism dark" --domain style` |
| Color palettes | `color` | `"entertainment vibrant" --domain color` |
| Font pairings | `typography` | `"playful modern" --domain typography` |
| Individual Google Fonts | `google-fonts` | `"sans serif popular variable" --domain google-fonts` |
| Chart recommendations | `chart` | `"real-time dashboard" --domain chart` |
| UX best practices | `ux` | `"error summary validation" --domain ux` |
| Landing page structure | `landing` | `"hero social-proof" --domain landing` |
| Icon recommendations | `icons` | `"decorative icon aria hidden" --domain icons` |
| GSAP animation presets | `gsap` | `"scroll reveal stagger" --domain gsap` |
| React/Next.js performance | `react` | `"rerender memo list" --domain react` |
| App/native interface guidelines | `web` | `"accessibilityLabel touch safe-areas" --domain web` |
| RTL compatibility | `style`, `product` | `"dashboard" --domain style --rtl=full` |

### Step 4: Stack-Specific Implementation Guidelines

Query or apply idiomatic best practices for the detected technology stack:

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "<keyword>" --stack <stack>
```

- **Supported stacks (22)**: `react`, `nextjs`, `vue`, `svelte`, `astro`, `nuxtjs`, `nuxt-ui`, `angular`, `laravel`, `swiftui`, `react-native`, `flutter`, `jetpack-compose`, `html-tailwind`, `shadcn`, `threejs`, `javafx`, `wpf`, `winui`, `avalonia`, `uno`, `uwp`.
- **Web (`react`, `nextjs`, `shadcn`, `html-tailwind`)**: Prevent client-side request waterfalls, use `Suspense` boundaries and skeleton loaders, avoid unnecessary re-renders, and bind styles to semantic CSS variable/Tailwind tokens (`bg-primary`, `text-muted-foreground`) rather than hardcoded hex values.
- **Mobile & Native (`react-native`, `flutter`, `swiftui`, `jetpack-compose`)**: Respect OS status bars, safe areas, gesture home indicators, native `accessibilityLabel` props, and Dynamic Type / OS text scaling.

## Production Edge-Case & Resilience Rules

Ensure every generated interface handles real-world content and interaction edge cases gracefully:
- **Heading & Token Wrapping**: Treat `text-wrap: balance` on headings as a progressive enhancement; layouts must remain balanced with natural wrapping across locales and viewport widths. Allow long URLs, hashes, and identifiers to wrap safely (`overflow-wrap: anywhere` or `break-words`) without breaking container widths.
- **Text Reflow & Zoom**: Essential text must reflow without clipping at narrow viewports (`320px`), `200%` browser zoom, and system font scaling.
- **Chip & Tag Collections**: Multi-item chip/tag lists must wrap cleanly or use an accessible `+n` overflow disclosure. Avoid truncating compact labels when possible; if truncation is unavoidable, provide an accessible full-value path for keyboard, pointer, and touch users.
- **Semantic Badges & Live Counts**: Never rely on badge color alone to indicate status (pair with an icon, dot pattern, or descriptive text). Interactive chips must use native button/checkbox semantics with visible focus and programmatic state (`aria-pressed` or `aria-selected`). Live count badges updated asynchronously should announce changes cleanly via `aria-live="polite"`.
- **Interrupted Micro-Interactions**: Rapid user clicks/taps may cancel an in-flight animation, but the final semantic state, focus position, and rendered content must always settle accurately.

## Quick Troubleshooting Reference

| Problem | What to Do |
| :--- | :--- |
| Can't decide on style or color | Re-run `--design-system` with distinct industry/mood keywords or consult `ui-reasoning.csv` |
| Dark mode contrast issues | Check `color-dark-mode` + `color-accessible-pairs` (ensure surfaces use layered elevation and `>= 4.5:1` text contrast) |
| Animations feel unnatural | Use spring physics or `ease-out` for enter, `ease-in` for exit, and make exit duration faster than enter (`150-300ms`) |
| Form UX is poor | Add persistent `<label>`, inline validation anchored near the input, clear recovery instructions, and focus management |
| Navigation feels confusing | Enforce clear nav hierarchy, cap mobile bottom nav at `<= 5` items, and preserve predictable back/close behavior |
| Layout breaks on small screens | Rebuild with mobile-first breakpoints (`320px` upwards), fluid widths, and safe-area padding |
| Performance / scroll jank | Virtualize long lists, keep main-thread work within budget, debounce/throttle high-frequency events, and animate only `transform`/`opacity` |

## Canonical Pre-Delivery Checklist

Before delivering or finalizing any UI code, verify every item in this gate:

### Visual Quality
- [ ] **No emojis as UI icons**: Replaced all decorative/functional emojis with clean SVG icons from a single consistent set (`Lucide`, `Heroicons`, or `Phosphor`).
- [ ] **Consistent icon sizing**: Icons use a standardized `viewBox="0 0 24 24"` with explicit sizing classes (e.g., `w-5 h-5` or `w-6 h-6`) and `shrink-0`.
- [ ] **No layout shift on hover**: Hover states use color, opacity, border-color, or shadow transitions — never uncontained scale or border-width changes that shift adjacent elements.
- [ ] **Semantic token usage**: Styles reference theme tokens (`bg-primary`, `text-slate-900`, CSS variables) cleanly without conflicting hardcoded overrides.

### Interaction & States
- [ ] **Interactive affordance**: All clickable cards, buttons, and toggles have `cursor-pointer` and distinct hover, active, focus-visible, and disabled states.
- [ ] **Complete state coverage**: UI accounts for **Loading** (skeleton/spinner + disabled submit), **Empty** (clear message + primary CTA), and **Error** (actionable inline recovery) states.
- [ ] **Smooth timing**: Micro-interactions transition smoothly within `150-300ms` using appropriate easing (`ease-out` for enter, `ease-in` for exit).

### Light / Dark Mode & Contrast
- [ ] **WCAG AA contrast verified**: Normal text achieves `>= 4.5:1` contrast ratio; large text and active UI borders achieve `>= 3:1` in both light and dark modes.
- [ ] **Surface legibility**: Glassmorphic or translucent surfaces (`backdrop-blur`) maintain sufficient background opacity and border definition so foreground text remains legible over busy backgrounds.

### Layout & Accessibility
- [ ] **Responsive across breakpoints**: Layout verified structurally for `320px` (mobile), `768px` (tablet), `1024px` (laptop), and `1440px+` (desktop) with zero unintended horizontal scroll.
- [ ] **Fixed chrome clearance**: Content has sufficient top/bottom padding and safe-area insets so nothing is hidden beneath fixed headers, sticky toolbars, or mobile bottom navigation bars.
- [ ] **A11y semantics complete**: All meaningful images have `alt` attributes, decorative icons have `aria-hidden="true"`, icon-only buttons have `aria-label`, form inputs have linked `<label>` elements, and `prefers-reduced-motion` is respected.
