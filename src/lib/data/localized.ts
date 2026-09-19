import type { Locale, Localized } from './types';

/**
 * Resolves a `Localized<T>` field for the active locale.
 * Falls back English → any available value → empty, so a partially
 * translated database row never renders `undefined` on screen.
 */
export function tv<T extends string>(value: Localized<T> | undefined | null, locale: Locale, fallback = '' as T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value as T;
  const picked = value[locale] ?? value.en ?? value.ar;
  return (picked ?? fallback) as T;
}

/** Maps an array of localized strings for the active locale. */
export function tvList(values: Localized<string>[] | undefined | null, locale: Locale): string[] {
  if (!values?.length) return [];
  return values.map((v) => tv(v, locale)).filter(Boolean);
}

/** True when a localized field has any content at all. */
export function hasContent(value: Localized<string> | undefined | null): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value.en?.trim() || value.ar?.trim());
}

/** Normalises free-form date values coming out of a database. */
export function displayDate(value: string | undefined | null, locale: Locale): string {
  if (!value) return '';
  // Plain years / ranges ("2024", "2023 — 2024") are passed through untouched.
  if (/^\d{4}([^\d]|$)/.test(value.trim()) || value.includes('—') || value.includes('-') && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
  }).format(parsed);
}
