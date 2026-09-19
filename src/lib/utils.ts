import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class joiner. Use everywhere instead of string concat. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Locale-aware date formatting that degrades gracefully on bad input. */
export function formatDate(
  value: string | number | Date | null | undefined,
  locale = 'en-GB',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' },
): string {
  if (value === null || value === undefined || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function slugify(value: string): string {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Zero-padded index label — 01, 02, 03 ... */
export function indexLabel(n: number, pad = 2): string {
  return String(n).padStart(pad, '0');
}

/** Deterministic pseudo-id so keys stay stable across renders. */
export function stableId(prefix: string, seed: string | number): string {
  return `${prefix}-${seed}`;
}

export function isExternalUrl(href?: string | null): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

/** Truncates on a word boundary and appends an ellipsis. */
export function truncate(value: string, max = 140): string {
  if (!value) return '';
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd()}…`;
}

/** Converts Latin digits to Arabic-Indic — used for indices and counts in RTL. */
export function toArabicDigits(value: string): string {
  const map: Record<string, string> = {
    '0': '\u0660', '1': '\u0661', '2': '\u0662', '3': '\u0663', '4': '\u0664',
    '5': '\u0665', '6': '\u0666', '7': '\u0667', '8': '\u0668', '9': '\u0669',
  };
  return value.replace(/\d/g, (digit) => map[digit] ?? digit);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
