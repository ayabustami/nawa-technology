import { toArabicDigits } from '@/lib/utils';
import type { Locale } from '../data/types';

/* -------------------------------------------------------------------------
   Count and slot templates.
   The dictionary holds plain strings with `{n}` / `{label}` tokens rather
   than functions — a function can never be passed from a Server Component
   to a Client Component, and templates keep the whole dictionary
   serialisable in both directions.
   ---------------------------------------------------------------------- */

export interface CountTemplate {
  one: string;
  /** Optional dual form (Arabic uses it). Falls back to `many`. */
  two?: string;
  many: string;
}

export function formatCount(template: CountTemplate, count: number, locale: Locale = 'en'): string {
  const digits = locale === 'ar' ? toArabicDigits(String(count)) : String(count);
  const raw = count === 1 ? template.one : count === 2 && template.two ? template.two : template.many;
  return raw.replace('{n}', digits);
}

/** Replaces `{token}` placeholders in a template string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
