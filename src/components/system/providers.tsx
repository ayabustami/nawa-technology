'use client';

/**
 * Site providers.
 * -----------------------------------------------------------------------
 * Language, theme and the developer state-preview all live in one context
 * so a single cookie write can re-render the whole tree. The root layout
 * reads the same cookies on the server, so the very first paint already
 * has the correct `dir`, `lang` and `data-theme` — no flash, no hydration
 * mismatch.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_LOCALE,
  DEFAULT_PREVIEW,
  DEFAULT_THEME,
  LOCALE_COOKIE,
  LOCALE_META,
  PREVIEW_COOKIE,
  THEME_COOKIE,
  getDictionary,
  isLocale,
  readCookie,
  writeCookie,
  type Dictionary,
  type Locale,
  type PreviewState,
  type ThemeName,
} from '@/lib/i18n';

interface SiteContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: Dictionary;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;

  theme: ThemeName;
  setTheme: (next: ThemeName) => void;
  toggleTheme: () => void;

  preview: PreviewState;
  setPreview: (next: PreviewState) => void;
  previewEnabled: boolean;
  hydrated: boolean;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
  initialTheme = DEFAULT_THEME,
  initialPreview = DEFAULT_PREVIEW,
  previewEnabled = false,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialTheme?: ThemeName;
  initialPreview?: PreviewState;
  previewEnabled?: boolean;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);
  const [preview, setPreviewState] = useState<PreviewState>(initialPreview);
  const [hydrated, setHydrated] = useState(false);

  /* Adopt cookies on the client if they disagree with the server render. */
  useEffect(() => {
    const cookieLocale = readCookie(LOCALE_COOKIE);
    const cookieTheme = readCookie(THEME_COOKIE);
    const cookiePreview = readCookie(PREVIEW_COOKIE);
    if (isLocale(cookieLocale) && cookieLocale !== locale) setLocaleState(cookieLocale);
    if ((cookieTheme === 'obsidian' || cookieTheme === 'bone') && cookieTheme !== theme) setThemeState(cookieTheme);
    if (cookiePreview && cookiePreview !== preview) setPreviewState(cookiePreview as PreviewState);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Mirror state onto <html> so CSS and native behaviour stay in sync. */
  useEffect(() => {
    const root = document.documentElement;
    root.lang = LOCALE_META[locale].htmlLang;
    root.dir = LOCALE_META[locale].dir;
    root.dataset.theme = theme;
  }, [locale, theme]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeCookie(LOCALE_COOKIE, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    writeCookie(THEME_COOKIE, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'obsidian' ? 'bone' : 'obsidian');
  }, [theme, setTheme]);

  const setPreview = useCallback((next: PreviewState) => {
    setPreviewState(next);
    writeCookie(PREVIEW_COOKIE, next);
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      locale,
      dir: LOCALE_META[locale].dir,
      t: getDictionary(locale),
      setLocale,
      toggleLocale,
      theme,
      setTheme,
      toggleTheme,
      preview,
      setPreview,
      previewEnabled,
      hydrated,
    }),
    [locale, setLocale, toggleLocale, theme, setTheme, toggleTheme, preview, setPreview, previewEnabled, hydrated],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}

/** Shorthand for components that only need the dictionary + locale. */
export function useT() {
  const { t, locale, dir } = useSite();
  return { t, locale, dir };
}
