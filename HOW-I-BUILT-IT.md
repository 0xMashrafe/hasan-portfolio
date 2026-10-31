# How this portfolio was built

A short, honest account of the process behind the site — the decisions, the things that broke,
and how they were verified. Written so you can rebuild or extend it without guessing.

---

## 1. Brief

> "An extraordinary portfolio, same genre as ashik-exe.vercel.app, smooth, polished, interactive.
> One shot. Fill the content yourself. Test it and fix it before handing it over."

Starting point: an empty Windows home folder with Node 24 installed and no project.

## 2. Reading the reference (not copying it)

I fetched the reference page HTML and extracted its text outline to understand the *system*, not
the pixels:

- dark, near-black canvas with a fine grain and a canvas-drawn background layer
- tiny uppercase mono labels with generous letter-spacing (`RBL / 01`, `INDEX`, `//`)
- numbered sections with a section index rail
- oversized display type against small technical metadata
- editorial rules (1px hairlines) instead of cards and shadows
- one accent colour used sparingly

That became the design language for a new persona and layout. The result shares the genre — dark
editorial, kinetic, mono metadata — but the composition, type pairing, accent (acid lime), and
interactions are original.

## 3. Design system, chosen up front

| Token | Decision |
| --- | --- |
| Display type | **Bricolage Grotesque** (variable, tight tracking, uppercase at large sizes) |
| Accent type | **Instrument Serif** italic for contrast words |
| Metadata | **JetBrains Mono**, 9–11px, 0.18em tracking, uppercase |
| Dark palette | `#08080a` ground, `#f3f0e9` ink, `#8d8d87` muted, `#d9ff4b` accent |
| Light palette | `#f2efe7` paper, `#14140f` ink, `#55554c` muted, same lime for fills |
| Rhythm | 1240px max width; 20px / 5vw / 68px gutter steps; 96–112px section padding |
| Motion | one easing curve everywhere: `cubic-bezier(.16,1,.3,1)`; 500–1200ms durations |

Themes are CSS variables on `[data-theme]`, exposed to Tailwind v4 through `@theme`, so every
utility (`bg-bg`, `text-ink`, `border-line`, `text-accent-text`) flips instantly. An inline script
in `index.html` applies the stored theme before first paint to avoid a flash.

## 4. Stack

- **Vite 8 + React 19 + TypeScript** — fast dev loop, typed data model
- **Tailwind CSS v4** — CSS-first `@theme`, no config file
- **Motion (framer-motion 14)** — reveals, layout pills, scroll-linked values, AnimatePresence
- **Lenis** — smooth scroll, disabled automatically for reduced-motion users
- **lucide-react** — icon set (brand icons removed upstream, so generic icons were used instead)
- **Playwright (installed Edge) + axe-core** — verification, see §7

## 5. Build order

1. **Foundation** — Vite scaffold, Tailwind plugin, theme CSS, helpers (`src/lib/utils.ts`), motion
   primitives (`Reveal`, `SplitWords`, `Magnetic`, `SectionHead`, `Ticker` in `motion.tsx`), and a
   single source of truth for content (`src/data.ts`).
2. **Atmosphere** — a canvas flow field (curved strokes following a coherent wind field, pointer
   repulsion, DPR-capped, pauses when the tab is hidden), a spring-tracked pointer glow, a grain
   overlay, and a custom cursor that reads `data-cursor` labels and yields to the native cursor
   whenever an overlay is open.
3. **Hero** — oversized name with per-line mask reveal, pointer parallax, rotating availability
   seal, live Dhaka clock, statement + two magnetic CTAs, a linked index, and a bottom rail of
   stats and a scroll cue.
4. **Narrative sections** — About (portrait card + stats + "currently"), a scroll-scrubbed
   manifesto, a filterable work list with a cursor-following preview and a case-study modal,
   capability cards + a three-step process, a scroll-drawn experience timeline, and a contact
   section with a copy-to-clipboard toast and a footer watermark.
5. **System chrome** — sticky header with a shared-layout active pill, scroll progress bar, right
   section rail, full-screen mobile menu, and a `Ctrl/⌘+K` command palette (also `/`) with
   keyboard navigation.
6. **Verification** — screenshots and automated checks, then a fix pass (§6–7).

## 6. What actually broke (and how it was fixed)

These were found by looking at screenshots and measuring geometry, not by assuming:

| Problem | Cause | Fix |
| --- | --- | --- |
| Hero bottom row clipped at 900px | content taller than `100svh` | reduced name scale/leading, tighter index rows and margins; audited to fit 1920→1024 and 1280×800 |
| Cursor-following preview stuck at the top-left corner | `useSpring(0)` with a numeric source never followed `.set()` | replaced with `useMotionValue` + a `useAnimationFrame` lerp, plus clamping near viewport edges |
| Preview sat under the custom cursor badge | card centred on the pointer | offset to the right of the cursor and clamped vertically |
| Custom cursor label covered modal text | cursor persisted over overlays | overlays set `data-overlay="1"`; the cursor hides and the native cursor is restored |
| Timeline dot 5px off the rail | hard-coded `-left-[195px]` against a 190px indent | `-left-[190px] -translate-x-1/2` |
| Background looked like random scratches | high-frequency noise per point | coherent low-frequency wind field + 7-segment curved strokes, fewer particles |
| Footer watermark cropped mid-word | fixed `rem` cap on a viewport-scaled word | `13.4vw` with `overflow-hidden`, now fits at 390→1920 |
| Mobile footer line overflowed | long demo credit string | shortened + wrapping metadata row |
| Light theme muted labels washed out | muted token too light | `#55554c`, and reduced background stroke opacity in light mode |

The manifesto's first words start at 30% opacity by design; axe still flags that initial state as
low contrast, which is expected for a scroll-revealed passage that reaches full contrast as you
read it.

## 7. How it was verified

All of this ran against the **production build** served by `vite preview`, with Playwright driving
the installed Microsoft Edge:

- `scripts/audit.mjs` — hero height vs viewport and horizontal overflow at 1920×1080, 1440×900,
  1280×800, 1024×768. Result: hero exactly fills the viewport, `scrollWidth == innerWidth`.
- `scripts/interact.mjs` — hover preview visibility, modal open/close, scroll lock, category
  filter, command palette open/search/Enter, copy-email toast, mobile menu navigation.
  Result: all pass, zero console or page errors.
- `scripts/a11y.mjs` — axe-core WCAG 2.0 A/AA in both themes. Result: one known, intentional
  finding (manifesto reveal opacity); no structural violations.
- `scripts/reduced.mjs` — `prefers-reduced-motion: reduce`. Result: no Lenis, no entrance
  animations, all content visible.
- `scripts/shot.mjs`, `scripts/views.mjs`, `scripts/final.mjs` — screenshots of every section at
  390, 768, 1024, 1280, 1440 and 1920 widths, in dark and light, including overlays and hover
  states. Reviewed image by image and iterated.

Theme persistence across reloads was also tested (stored in `localStorage`, re-applied before
paint).

## 8. Content

The persona is fictional and every word lives in `src/data.ts`: profile, stats, five projects with
outcomes and stacks, capabilities, process, four experience entries, socials and marquees. Change
that file and the whole site follows — no copy is hard-coded inside section components (except
small UI labels).

The about-card artwork was generated with an image model (abstract liquid-chrome sculpture with a
lime arc) and saved at `public/art/portrait.jpg`. It is cropped with `object-cover` in a 4:5 card.

## 9. If you continue this project

1. Replace `src/data.ts` with your real details, starting with `profile`.
2. Export the portrait to `public/art/portrait.jpg` (or swap the `<img>` in `about.tsx`).
3. Point the socials at real profiles and add live links to the modal CTA (`work.tsx`).
4. If you add sections, add the id to `navSections` in `data.ts` — the header, rail, palette and
   mobile menu all derive from that list.
5. Keep the motion budget: one easing, 500–1200ms, and always respect
   `prefers-reduced-motion` (the existing hooks make this easy).
6. Re-run `node scripts/shot.mjs` and `node scripts/a11y.mjs` after changes — they catch the
   layout and contrast regressions that are hardest to see by eye.
