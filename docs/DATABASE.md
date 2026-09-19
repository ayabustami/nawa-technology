# NAWA — Database & API contract

This document is the bridge between this frontend and whatever backend you
build. Everything here is derived from the TypeScript interfaces in
`src/lib/data/types.ts` — that file is the canonical contract.

---

## 1. How the frontend talks to your backend

```
Database  →  Backend API  →  src/lib/data/client.ts  →  AsyncSection  →  UI
```

| Step | File | What it does |
| --- | --- | --- |
| Contract | `src/lib/data/types.ts` | The shape of every record |
| Transport | `src/lib/data/client.ts` | `dataApi.*` fetchers, envelope parsing, error mapping |
| Stubs | `src/lib/data/stub.ts` | Empty responses used until your API exists |
| HTTP stubs | `src/app/api/nawa/[...segment]/route.ts` | The same stubs over HTTP |
| State switch | `src/lib/data/resolve.ts` | `resolveCollection()` → loading / empty / ready / error |
| Render | `src/components/sections/AsyncSection.tsx` | Chooses skeleton, empty state or content |

**To connect:** set `NEXT_PUBLIC_API_URL=https://api.your-domain.com` in
`.env.local`. Nothing else changes. The stub layer stops being used
automatically.

### Response envelope

Either shape is accepted:

```json
{ "data": [ /* records */ ], "total": 12 }
```

```json
[ /* records */ ]
```

* An empty array resolves to `status: 'empty'` → the designed empty state.
* A non-2xx response resolves to `status: 'error'` → the error surface.
* Detail routes should return **404** when a slug is unknown.

### Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/services` | `Service[]` |
| GET | `/services/:slug` | `Service` |
| GET | `/projects` | `Project[]` (accepts `?category=`) |
| GET | `/projects/:slug` | `Project` |
| GET | `/projects/categories` | `{ id, label, slug }[]` |
| GET | `/testimonials` | `Testimonial[]` |
| GET | `/capabilities` | `Capability[]` |
| GET | `/process` | `ProcessStep[]` |
| GET | `/values` | `CompanyValue[]` |
| GET | `/milestones` | `Milestone[]` |
| GET | `/team` | `TeamMember[]` |
| GET | `/contact-channels` | `ContactChannel[]` |
| GET | `/content` | `ContentSlot[]` |
| POST | `/contact` | `{ ok, id, message }` or `{ error, fieldErrors }` |

---

## 2. Localisation convention

Any user-facing string may be **either** a plain string **or** an object:

```json
{ "name": "Platform Engineering" }
```

```json
{ "name": { "en": "Platform Engineering", "ar": "هندسة المنصات" } }
```

The resolver (`src/lib/data/localized.ts`) falls back
`requested locale → en → ar → empty`. A partially translated row therefore
never renders `undefined`.

If your database stores one row per language instead, map it in your API
layer into the `{ en, ar }` shape — the frontend does not need to know.

---

## 3. Suggested schema (Prisma)

```prisma
// A pragmatic starting point. Rename freely — only the JSON your API
// returns has to match src/lib/data/types.ts.

model Service {
  id               String   @id @default(cuid())
  slug             String   @unique
  name             Json     // string | { en, ar }
  shortDescription Json?
  fullDescription  Json?
  icon             String?  // key in the icon registry (see style guide)
  imageSrc         String?
  imageAlt         Json?
  features         Json?    // Localized<string>[]
  technologies     String[] // plain strings, not localised
  ctaLabel         Json?
  ctaHref          String?
  order            Int      @default(0)
  featured         Boolean  @default(false)
  published        Boolean  @default(false)
  publishedAt      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  projects         Project[]
}

model Project {
  id           String   @id @default(cuid())
  slug         String   @unique
  title        Json
  description  Json?
  category     Json?
  coverSrc     String?
  coverAlt     Json?
  gallery      Json?    // MediaAsset[]
  technologies String[]
  date         String?  // "2025" or ISO date
  url          String?
  client       Json?
  role         Json?
  duration     Json?
  featured     Boolean  @default(false)
  order        Int      @default(0)
  published    Boolean  @default(false)
  publishedAt  DateTime?
  caseStudy    Json?    // { summary, blocks[], outcomes[] }
  services     Service[]
  testimonials Testimonial[]
}

model ProcessStep {
  id           String  @id @default(cuid())
  number       String? // "01" — falls back to array order
  title        Json
  description  Json?
  deliverables Json?
  duration     Json?
  icon         String?
  order        Int     @default(0)
}

model Capability {
  id          String @id @default(cuid())
  label       Json
  description Json?
  icon        String?
  group       Json?
  order       Int    @default(0)
}

model CompanyValue {
  id          String @id @default(cuid())
  index       String?
  title       Json
  description Json?
  order       Int    @default(0)
}

model Milestone {
  id          String @id @default(cuid())
  date        Json
  title       Json
  description Json?
  order       Int    @default(0)
}

model TeamMember {
  id        String @id @default(cuid())
  name      Json
  role      Json?
  avatarSrc String?
  bio       Json?
  order     Int    @default(0)
}

model Testimonial {
  id           String   @id @default(cuid())
  quote        Json
  authorName   Json
  authorRole   Json?
  organisation Json?
  avatarSrc    String?
  project      Project? @relation(fields: [projectId], references: [id])
  projectId    String?
  published    Boolean  @default(false)
  order        Int      @default(0)
}

model ContactChannel {
  id    String @id @default(cuid())
  kind  String // email | phone | address | social | other
  label Json
  value Json
  href  String?
  icon  String?
  order Int    @default(0)
}

model OfficeLocation {
  id           String @id @default(cuid())
  label        Json
  addressLines Json?
  mapUrl       String?
  mapEmbedUrl  String?
}

model ContentSlot {
  id        String   @id @default(cuid())
  key       String   @unique // e.g. "home.hero.supporting"
  value     Json
  updatedAt DateTime @updatedAt
}

model ProjectBrief {
  id          String   @id @default(cuid())
  name        String
  email       String
  company     String?
  projectType String?
  budget      String?
  message     String
  locale      String?  @default("en")
  source      String?
  status      String   @default("new") // new | reading | replied | archived
  ip          String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

---

## 4. Case-study blocks

`Project.caseStudy.blocks` is an ordered array. The renderer
(`src/components/sections/CaseStudyBlocks.tsx`) handles seven block types,
so an editor can compose any article without a frontend change:

```json
{
  "summary": { "en": "…", "ar": "…" },
  "blocks": [
    { "type": "heading",   "text": { "en": "The problem", "ar": "المشكلة" } },
    { "type": "paragraph", "text": { "en": "…", "ar": "…" } },
    { "type": "image",     "asset": { "src": "/media/x.jpg", "alt": { "en": "…" } }, "caption": { "en": "…" } },
    { "type": "quote",     "text": { "en": "…" }, "attribution": { "en": "…" } },
    { "type": "list",      "items": [{ "en": "…" }, { "en": "…" }] },
    { "type": "metrics",   "items": [{ "label": { "en": "…" }, "value": { "en": "…" } }] },
    { "type": "divider" }
  ],
  "outcomes": [{ "label": { "en": "…" }, "value": { "en": "…" } }]
}
```

Unknown block types are ignored rather than crashing the page.

---

## 5. Contact form payload

`POST /contact` receives exactly this body (see `ContactSubmission`):

```json
{
  "name": "string, required",
  "email": "string, required, validated",
  "company": "string, optional",
  "projectType": "string, optional",
  "budget": "string, optional",
  "message": "string, required, max 2000",
  "locale": "en | ar",
  "source": "contact-page | start-a-project",
  "timestamp": "ISO-8601"
}
```

**Success** — return 2xx:

```json
{ "ok": true, "id": "brief_123", "message": "Optional copy shown to the user." }
```

**Validation failure** — return 422 with field-level errors. The form maps
them straight back onto the inputs:

```json
{
  "error": "validation_failed",
  "fieldErrors": { "email": "Enter a valid email address." }
}
```

The form also renders an invisible honeypot field named `website`. Reject
submissions where it is non-empty.

**Project type and budget options** are currently neutral placeholders in
`src/lib/i18n/{en,ar}.ts`. Replace them with your own taxonomy, or serve
them from an endpoint and swap the `<optgroup>` in
`src/components/sections/ContactForm.tsx`.

---

## 6. Editorial content slots

Fixed marketing copy (hero supporting line, about introduction, mission,
vision, approach) is *not* hardcoded in components. Two options:

1. **Simple** — edit the strings in `src/lib/i18n/en.ts` and `ar.ts`.
2. **CMS-driven** — serve `ContentSlot` records from `GET /content` keyed by
   slot name (`home.hero.supporting`, `about.introduction`, `about.mission`,
   `about.vision`, `about.approach`) and read them in the page component
   with `dataApi.content()`.

Until either happens, those areas render as marked content slots.

---

## 7. Caching

`src/lib/data/client.ts` sets `next: { revalidate: 60 }` on server fetches.
Change `DEFAULT_REVALIDATE`, or pass `{ revalidate: 0 }` per call for
always-fresh data. Client-side fetches are uncached.
