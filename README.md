# NAWA Technology — website foundation

A premium, production-ready **empty** website for NAWA Technology.

Every page, component and data path is built and finished. Nothing about the
company has been invented: no projects, no clients, no testimonials, no
statistics, no team, no addresses, no social links. Where content belongs to
your database, you will find either a **designed empty state** or a **clearly
marked content slot**. There is no lorem ipsum anywhere in the codebase.

> نواة — *the core, or the seed. Something small that grows into something
> much bigger.* The visual identity is built on that idea: a nucleus held by
> orbits, hairline precision, one warm copper accent on near-black.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
```

Copy `.env.example` to `.env.local` before you connect anything.

---

## What you get

### Pages

| Route | Contents |
| --- | --- |
| `/` | Hero · Introduction · Services · Work · Capabilities · Process · Final CTA · Footer |
| `/services` | Page hero + metadata strip, service grid, three data states, CTA |
| `/services/[slug]` | Full service detail template: overview, features, technologies, media slot, related services |
| `/work` | Page hero, category filter bar, grid/list density toggle, three data states, CTA |
| `/work/[slug]` | Full case-study template: cover, metadata rail, block-based article, outcomes, next project |
| `/about` | Introduction · Mission · Vision · Values · Approach · Milestones · Team · Testimonials · CTA |
| `/process` | Ordered steps (01–04) with deliverables, principles grid, CTA |
| `/contact` | Six-field project brief with validation, contact channels, offices, FAQ and response-time slots |
| `/style-guide` | The complete design system, documented live |
| `not-found` | 404 built on the same identity |
| `/sitemap.xml`, `/robots.txt` | Detail routes are only listed once your database actually serves them |

### The three data states

Every dynamic section renders through one component, `AsyncSection`:

```
result.status === 'loading'  →  skeleton (mirrors the real geometry)
result.status === 'empty'    →  designed empty state
result.status === 'error'    →  recoverable error surface
result.status === 'ready'    →  the real grid / list / timeline
```

### Developer state preview

The shipped site renders the **live** path: real API data, or the empty state
when there is none. To look at the other two designs without writing code:

* Click the small control in the bottom corner, or press **⌘/Ctrl + ⇧ + D**
* Choose **Loading**, **Empty** or **Populated**
* The choice is stored in the `nawa-preview` cookie and re-resolved on the
  server, so it survives refreshes and works on every page

**Populated** renders generic preview fixtures from `src/lib/data/fixtures.ts`
— `Project 01`, `Service 02`, `Capability 03`. They are stamped with a
**Preview data** ribbon, flagged `preview: true` at the record level, and are
never company content. Delete that file and the `populated` branch in
`StateSwitcher.tsx` and nothing else changes.

Set `NEXT_PUBLIC_ENABLE_STATE_PREVIEW=false` to remove the panel from a
production build entirely. That also lets pages become statically renderable,
because the cookie is then never read.

### Themes and languages

* **Obsidian** (default) — near-black, warm white, ember copper
* **Bone** — warm off-white ground, ink type, deeper copper

Both are complete token sets. No component contains a theme-specific
override; switching is a single `data-theme` attribute on `<html>`.

* **English (LTR)** and **Arabic (RTL)** are both first-class. The whole
  layout uses CSS logical properties (`ps-*`, `me-*`, `start-*`,
  `text-start`), arrows mirror, marquees reverse, the skeleton shimmer
  reverses, and Arabic gets IBM Plex Sans Arabic with opened-up tracking —
  tight negative letter-spacing damages Arabic word shapes.
* The locale and theme are read from cookies **on the server**, so the first
  paint is already correct: no flash, no hydration mismatch.

---

## Connecting your backend

Full detail in [`docs/DATABASE.md`](docs/DATABASE.md).

```
Database  →  Backend API  →  src/lib/data/client.ts  →  AsyncSection  →  UI
```

1. Implement the endpoints listed in `docs/DATABASE.md`, returning the shapes
   in `src/lib/data/types.ts`.
2. Set `NEXT_PUBLIC_API_URL=https://api.your-domain.com` in `.env.local`.
3. Restart. Every section populates. No component changes are required.

Until then, requests resolve against the stub layer
(`src/lib/data/stub.ts`), which returns empty collections. On the server this
happens **in process** — the app never makes an HTTP request back into its own
server, which would deadlock during development.

Response envelope, either shape:

```json
{ "data": [ ... ], "total": 12 }
```

---

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx              fonts, cookies, providers, header, footer
│  ├─ page.tsx                home
│  ├─ services/               index + [slug] detail
│  ├─ work/                   index + [slug] case study
│  ├─ about/  process/  contact/  style-guide/
│  ├─ api/nawa/[...segment]/  HTTP stub layer
│  ├─ icon.svg                brand favicon
│  ├─ sitemap.ts  robots.ts
│  └─ not-found.tsx
├─ components/
│  ├─ ui/                     Button, Card, Badge, Tag, Field, Skeleton,
│  │                          EmptyState, Slot, SectionHeading, HairlineGrid,
│  │                          Icon registry, Reveal
│  ├─ layout/                 Header, MobileNav, Footer, PageHero,
│  │                          LanguageSwitcher
│  ├─ sections/               AsyncSection, ServiceCard/Grid, ProjectCard/Grid,
│  │                          ProcessSteps, ValueGrid, Timeline, TeamGrid,
│  │                          CapabilityIndex, Testimonials, CTASection,
│  │                          ContactForm, ContactChannels, CaseStudyBlocks
│  │  └─ home/                Hero, Intro, Services, Work, Capabilities, Process
│  ├─ graphics/               NawaMark, CoreField, AbstractCover
│  └─ system/                 providers, StateSwitcher, CodeBlock, StyleGuideNav
├─ lib/
│  ├─ data/                   types · client · stub · resolve · localized · fixtures
│  ├─ i18n/                   en · ar · index · server · format
│  ├─ site.ts                 routes and navigation config
│  ├─ utils.ts                cn, dates, slugs, Arabic digits
│  └─ styles/globals.css      THE DESIGN SYSTEM — every token lives here
└─ docs/DATABASE.md
```

---

## Design system

All of it is defined once, in `src/styles/globals.css`, and documented live
at `/style-guide`.

**Colour** — semantic variables (`--bg`, `--surface`, `--fg`, `--fg-muted`,
`--line`, `--accent`, …) re-bound per theme, plus three reference ramps
(ink, ember, bone).

**Type** — Geist for Latin display and UI, Geist Mono for labels and
numerals, IBM Plex Sans Arabic for RTL. A fluid editorial scale from
`t-display` (`clamp(2.85rem → 7.75rem)`) down to `t-micro`.

**Layout** — one shell (`--shell-max` 1344px), one editorial measure
(`--shell-narrow` 992px), one fluid gutter, one fluid section rhythm.
Restrained radii (2–20px). Hairline grids instead of floating cards where
precision matters.

**Motion** — four durations, three easing curves. Scroll reveals run once;
ambient loops run for tens of seconds so they read as texture. Everything
collapses under `prefers-reduced-motion`.

**No stock photography** — when a record has no image, `AbstractCover`
generates a deterministic technical visual from its slug (three patterns:
core rings, dot field, strata). Every card looks intentional without a single
fabricated photo.

---

## Working conventions

* **Never hardcode company facts.** If a string is a claim about NAWA, it
  belongs in your database. Structural labels live in `src/lib/i18n/`.
* **Add a key to `en.ts` and TypeScript forces you to translate it.** `ar.ts`
  is typed against `Dictionary`, so the two locales cannot drift.
* **Pass strings, not functions, from server to client components.** Counts
  and slots use `{n}` / `{label}` templates resolved by `lib/i18n/format.ts`.
* **Use logical properties.** `ms-*` not `ml-*`, `text-start` not
  `text-left`, `start-0` not `left-0`. RTL is not an afterthought.
* **New dynamic section?** Add a type in `data/types.ts`, a fetcher in
  `data/client.ts`, a stub entry in `data/stub.ts`, a fixture in
  `data/fixtures.ts`, then render it inside `AsyncSection`.

---

## Production checklist

- [ ] Implement the API endpoints and set `NEXT_PUBLIC_API_URL`
- [ ] Set `NEXT_PUBLIC_SITE_URL` so `sitemap.xml`, `robots.txt` and Open Graph resolve correctly
- [ ] Replace the placeholder project-type and budget options in `src/lib/i18n/{en,ar}.ts`
- [ ] Fill the content slots: hero supporting line, introduction, mission, vision, approach
- [ ] Point `POST /contact` at your persistence layer and add real spam protection
- [ ] Set `NEXT_PUBLIC_ENABLE_STATE_PREVIEW=false` to remove the dev panel and restore static rendering
- [ ] Delete `src/lib/data/fixtures.ts` (and the `populated` branch in `StateSwitcher.tsx`) once you are confident in the live path
- [ ] Add real `Privacy` and `Terms` routes — they are currently struck through in the footer on purpose

---

## Notes

* Pages render dynamically because the locale, theme and preview cookies are
  read on the server. With the preview disabled they can be cached; tune
  `DEFAULT_REVALIDATE` in `src/lib/data/client.ts` (currently 60s).
* `next/image` is configured to accept any HTTPS origin, so images served
  from your CDN work without further configuration.
* The icon registry maps database icon *names* to components. An unknown name
  falls back to the nucleus glyph rather than breaking a card — see the
  registered names on `/style-guide`.
