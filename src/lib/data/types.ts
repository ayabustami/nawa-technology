/**
 * NAWA — DATA CONTRACTS
 * =========================================================================
 * These interfaces are the agreement between your database, your backend API
 * and this frontend. Shape your API responses like these types and every
 * dynamic section on the site populates with zero component changes.
 *
 * Conventions
 *   • `id`      stable primary key from your DB
 *   • `slug`    url-safe identifier used by the detail routes
 *   • `*At`     ISO-8601 timestamps
 *   • `locale`  optional per-locale content (see `Localized<T>`)
 *   • Every field that is not required by the layout is optional, so a
 *     partially-filled database row still renders cleanly.
 */

export type Locale = 'en' | 'ar';

/** A field that can carry separate English and Arabic values. */
export type Localized<T> = T | { en?: T; ar?: T };

/* ---------------------------------------------------------------- states */

export type DataStatus = 'loading' | 'empty' | 'ready' | 'error';

export interface DataResult<T> {
  status: DataStatus;
  data: T[];
  /** Present only when `status === 'error'`. Safe to show to a developer. */
  error?: string;
  /** Total count from the API when paginated (may exceed `data.length`). */
  total?: number;
  /** Where the data came from — useful while wiring up a backend. */
  source: 'api' | 'stub' | 'preview' | 'static';
}

/* ------------------------------------------------------------- services */

export interface Service {
  id: string;
  slug: string;
  /** Display name. */
  name: Localized<string>;
  /** One or two lines — used on cards and in grids. */
  shortDescription?: Localized<string>;
  /** Long form — used on the detail page. May contain markdown. */
  fullDescription?: Localized<string>;
  /** Lucide icon name, e.g. "layers". Resolved by `<ServiceIcon />`. */
  icon?: string;
  image?: MediaAsset;
  features?: Localized<string>[];
  technologies?: string[];
  cta?: { label: Localized<string>; href: string };
  /** Sort order from your CMS. Lower first. */
  order?: number;
  featured?: boolean;
  publishedAt?: string;
}

/* ------------------------------------------------------------- projects */

export interface Project {
  id: string;
  slug: string;
  title: Localized<string>;
  description?: Localized<string>;
  /** Free-form category label from your DB, e.g. a taxonomy term. */
  category?: Localized<string>;
  coverImage?: MediaAsset;
  gallery?: MediaAsset[];
  technologies?: string[];
  /** ISO date or a display string such as "2025". */
  date?: string;
  /** Live site / repository / store link. */
  url?: string;
  client?: Localized<string>;
  role?: Localized<string>;
  duration?: Localized<string>;
  featured?: boolean;
  order?: number;
  caseStudy?: CaseStudy;
  publishedAt?: string;
}

export type CaseStudyBlock =
  | { type: 'heading'; text: Localized<string> }
  | { type: 'paragraph'; text: Localized<string> }
  | { type: 'image'; asset: MediaAsset; caption?: Localized<string> }
  | { type: 'quote'; text: Localized<string>; attribution?: Localized<string> }
  | { type: 'list'; items: Localized<string>[] }
  | { type: 'metrics'; items: { label: Localized<string>; value: Localized<string> }[] }
  | { type: 'divider' };

export interface CaseStudy {
  /** Optional long-form intro shown above the blocks. */
  summary?: Localized<string>;
  blocks: CaseStudyBlock[];
  /** Outcome / results section, kept separate so it can be omitted. */
  outcomes?: { label: Localized<string>; value: Localized<string> }[];
}

/* ---------------------------------------------------------------- media */

export interface MediaAsset {
  src: string;
  alt?: Localized<string>;
  width?: number;
  height?: number;
  blurDataURL?: string;
  credit?: Localized<string>;
}

/* ------------------------------------------------------- process / misc */

export interface ProcessStep {
  id: string;
  /** Zero-padded display number: "01". Falls back to array order. */
  number?: string;
  title: Localized<string>;
  description?: Localized<string>;
  deliverables?: Localized<string>[];
  duration?: Localized<string>;
  icon?: string;
}

export interface Capability {
  id: string;
  label: Localized<string>;
  description?: Localized<string>;
  icon?: string;
  group?: Localized<string>;
}

export interface CompanyValue {
  id: string;
  title: Localized<string>;
  description?: Localized<string>;
  index?: string;
}

export interface Milestone {
  id: string;
  date: Localized<string>;
  title: Localized<string>;
  description?: Localized<string>;
}

export interface TeamMember {
  id: string;
  name: Localized<string>;
  role?: Localized<string>;
  avatar?: MediaAsset;
  bio?: Localized<string>;
}

export interface Testimonial {
  id: string;
  quote: Localized<string>;
  authorName: Localized<string>;
  authorRole?: Localized<string>;
  organisation?: Localized<string>;
  avatar?: MediaAsset;
  projectId?: string;
}

/** Contact channels — phone / email / address / socials, all DB-driven. */
export interface ContactChannel {
  id: string;
  kind: 'email' | 'phone' | 'address' | 'social' | 'other';
  label: Localized<string>;
  value: Localized<string>;
  href?: string;
  /** Social icon name when `kind === 'social'`. */
  icon?: string;
}

export interface OfficeLocation {
  id: string;
  label: Localized<string>;
  addressLines?: Localized<string>[];
  mapUrl?: string;
  mapEmbedUrl?: string;
}

/* ------------------------------------------------------------ site copy */

/**
 * Free-text editorial content (hero lines, about paragraphs, mission,
 * vision). Modelled as slotted keys so your CMS can own the wording while
 * the layout stays fixed here.
 */
export interface ContentSlot {
  key: string;
  value: Localized<string>;
  updatedAt?: string;
}

/* ------------------------------------------------------------- contact */

export type ProjectType = string;
export type BudgetBand = string;

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  projectType?: ProjectType;
  budget?: BudgetBand;
  message: string;
  locale?: Locale;
  /** Anti-spam / attribution fields your backend may want. */
  source?: string;
  timestamp?: string;
}

export type ContactSubmitResult =
  | { ok: true; id?: string; message?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactSubmission, string>> };
