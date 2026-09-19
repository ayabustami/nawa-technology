/**
 * Site-wide configuration.
 * -----------------------------------------------------------------------
 * Everything here is structural (labels, routes, ordering). No company
 * facts, contact details or claims live in this file — those are loaded
 * from your database through the data layer in `src/lib/data`.
 */

export const SITE = {
  name: 'NAWA Technology',
  shortName: 'NAWA',
  /** Arabic root of the brand: نواة — the core, the seed. */
  arabicName: 'نواة',
  brandMeaning: {
    en: 'NAWA comes from the Arabic نواة — the core, or the seed. Something small that grows into something much bigger.',
    ar: 'ناوا مشتقة من الكلمة العربية «نواة» — أي الجوهر أو البذرة؛ شيءٌ صغير ينمو ليصبح أكبر بكثير.',
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nawa.example',
} as const;

export type NavKey = 'home' | 'services' | 'work' | 'about' | 'contact';

export const NAV: { key: NavKey; href: string }[] = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'work', href: '/work' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

/** Secondary routes that exist but stay out of the primary navigation. */
export const SECONDARY_NAV: { key: string; href: string }[] = [
  { key: 'process', href: '/process' },
  { key: 'styleGuide', href: '/style-guide' },
];

export const ROUTES = {
  home: '/',
  services: '/services',
  serviceDetail: (slug: string) => `/services/${slug}`,
  work: '/work',
  workDetail: (slug: string) => `/work/${slug}`,
  about: '/about',
  process: '/process',
  contact: '/contact',
  styleGuide: '/style-guide',
} as const;

export const CONTACT_CTA = { href: ROUTES.contact, param: '?intent=start-a-project' } as const;
