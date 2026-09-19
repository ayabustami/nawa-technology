import { cookies } from 'next/headers';
import { getPreviewState } from '@/lib/data/resolve';
import type { Locale, PreviewState } from '@/lib/i18n';
import { DEFAULT_LOCALE, LOCALE_META, LOCALE_COOKIE, getDictionary, isLocale, type Dictionary } from '@/lib/i18n';

export interface PageContext {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: Dictionary;
  preview: PreviewState;
}

/**
 * Everything a server component needs before rendering:
 * resolved locale, dictionary, direction and the developer state-preview.
 */
export async function getPageContext(): Promise<PageContext> {
  const [preview, store] = await Promise.all([getPreviewState(), cookies()]);
  const raw = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return {
    locale,
    dir: LOCALE_META[locale].dir,
    t: getDictionary(locale),
    preview,
  };
}
