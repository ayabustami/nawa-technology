import { ar } from './ar';
import { en, type Dictionary } from './en';
import type { Locale } from '../data/types';

export type { Dictionary, Locale };
export { en, ar };

export const LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

export const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale | string | undefined): Dictionary {
  return locale === 'ar' ? ar : en;
}

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ar';
}

export const LOCALE_META: Record<Locale, { label: string; nativeLabel: string; dir: 'ltr' | 'rtl'; htmlLang: string }> = {
  en: { label: 'English', nativeLabel: 'English', dir: 'ltr', htmlLang: 'en' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', htmlLang: 'ar' },
};

/* ------------------------------------------------------------ persistence */

export const LOCALE_COOKIE = 'nawa-lang';
export const THEME_COOKIE = 'nawa-theme';
export const PREVIEW_COOKIE = 'nawa-preview';

export type ThemeName = 'obsidian' | 'bone';
export const THEMES: ThemeName[] = ['obsidian', 'bone'];
export const DEFAULT_THEME: ThemeName = 'obsidian';

export type PreviewState = 'live' | 'loading' | 'empty' | 'populated';
export const PREVIEW_STATES: PreviewState[] = ['live', 'loading', 'empty', 'populated'];
export const DEFAULT_PREVIEW: PreviewState = 'live';

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function writeCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
