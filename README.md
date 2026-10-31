# Ayaan Rahman — Portfolio

An editorial, motion-first portfolio for a fictional independent design engineer. Dark/light
themed, fully responsive, and built as a single-page experience.

- **How it was made:** [`HOW-I-BUILT-IT.md`](./HOW-I-BUILT-IT.md) — decisions, bugs found during
  testing, fixes, and the verification results.
- **Screenshots:** [`docs/screenshots`](./docs/screenshots) — desktop dark/light, overlays, and
  mobile.
- **Production build:** already included in `dist/` (serve it with `npm run preview`).

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build on http://127.0.0.1:4173
```

## What's inside

- **Vite + React 19 + TypeScript + Tailwind CSS v4**
- **Motion** for choreographed entrances, layout transitions and scroll-linked effects
- **Lenis** smooth scrolling (automatically disabled for reduced-motion users)
- Custom canvas flow-field background + pointer glow, grain overlay and custom cursor
- Command palette (`Ctrl/⌘ + K` or `/`), theme toggle, project case-study modal
- All content is sample data in `src/data.ts` — edit there to make it yours

## Project structure

```
ayaan-portfolio/
  README.md              this file
  HOW-I-BUILT-IT.md      the full process, fixes and verification log
  index.html             fonts, meta, anti-flash theme script
  package.json           scripts + dependencies
  vite.config.ts         React + Tailwind v4 plugins
  public/                favicon and generated portrait artwork
  docs/screenshots/      reference captures of the finished site
  dist/                  production build
  scripts/               Playwright / axe verification scripts
src/
  App.tsx                page shell, theme + smooth scroll + shortcuts
  data.ts                all copy, projects, experience, socials
  components/
    hero.tsx             oversized type, pointer parallax, live clock
    about.tsx            bio, portrait card, stats, marquee
    manifesto.tsx        scroll-scrubbed word reveal
    work.tsx             filterable project list, hover preview, case modal
    capabilities.tsx     toolkit cards + process
    experience.tsx       scroll-drawn timeline
    contact.tsx          CTA, copy-email toast, footer
    header.tsx           sticky nav with sliding indicator
    command-palette.tsx  keyboard-driven navigation
    background.tsx       canvas flow field + pointer glow
    cursor.tsx           custom cursor
    preloader.tsx        boot sequence
    motion.tsx           Reveal / SplitWords / Magnetic / SectionHead / Ticker
  lib/                   helpers + reduced-motion hook
```

## Customise

Everything readable lives in `src/data.ts` — name, role, statement, stats, projects, capabilities,
process, experience, socials and nav sections. The header, section rail, command palette and mobile
menu all derive their links from `navSections`, so adding a section there keeps every navigation
surface in sync.

## Tests used during the build

Scripts in `scripts/` (Playwright driving installed Edge) capture screenshots, verify hero
geometry at several viewports, exercise the modal / palette / filters / mobile menu, and run an
axe-core WCAG A/AA pass:

```bash
node scripts/shot.mjs       # screenshots of every section
node scripts/interact.mjs   # interaction smoke test
node scripts/a11y.mjs       # axe accessibility audit
node scripts/audit.mjs      # hero height + horizontal overflow audit
```

The only axe finding left is the intentional low-opacity state of the scroll-revealed manifesto
copy, which reaches full contrast as you scroll through it.
