import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';
import '@/styles/globals.css';
import { SITE } from '@/lib/site';
import { DEFAULT_LOCALE, DEFAULT_PREVIEW, DEFAULT_THEME, LOCALE_COOKIE, LOCALE_META, PREVIEW_COOKIE, THEME_COOKIE, isLocale } from '@/lib/i18n';
import { SiteProvider } from '@/components/system/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StateSwitcher } from '@/components/system/StateSwitcher';
import { isApiConfigured } from '@/lib/data/client';

/* Latin display + mono, and a technical Arabic face that carries the whole
   RTL layout. All three are self-hosted by next/font — no runtime requests. */
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
  fallback: ['Noto Sans Arabic', 'Tahoma', 'sans-serif'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
    { media: '(prefers-color-scheme: light)', color: '#f6f4f0' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'NAWA Technology — Build what’s next',
    template: `%s — ${SITE.name}`,
  },
  description:
    'NAWA Technology. نواة — the core, the seed. A premium, database-ready website foundation for a technology company.',
  applicationName: SITE.name,
  keywords: ['NAWA Technology', 'نواة', 'technology company'],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'NAWA Technology — Build what’s next',
    description: 'نواة — the core, the seed.',
    locale: 'en_GB',
    alternateLocale: 'ar_AR',
  },
  twitter: { card: 'summary_large_image', title: 'NAWA Technology', description: 'نواة — the core, the seed.' },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();

  const rawLocale = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const rawTheme = store.get(THEME_COOKIE)?.value;
  const theme = rawTheme === 'bone' ? 'bone' : DEFAULT_THEME;

  const rawPreview = store.get(PREVIEW_COOKIE)?.value;
  const preview = (['live', 'loading', 'empty', 'populated'] as const).includes(rawPreview as never)
    ? (rawPreview as typeof DEFAULT_PREVIEW)
    : DEFAULT_PREVIEW;

  const previewEnabled = process.env.NEXT_PUBLIC_ENABLE_STATE_PREVIEW !== 'false';

  return (
    <html
      lang={LOCALE_META[locale].htmlLang}
      dir={LOCALE_META[locale].dir}
      data-theme={theme}
      className={`${geist.variable} ${geistMono.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <SiteProvider
          initialLocale={locale}
          initialTheme={theme}
          initialPreview={preview}
          previewEnabled={previewEnabled}
        >
          <div className="relative flex min-h-dvh flex-col">
            <Header />

            <main id="main" className="flex-1">
              {children}
            </main>

            <Footer />
          </div>

          {previewEnabled && <StateSwitcher apiConfigured={isApiConfigured} />}
        </SiteProvider>
      </body>
    </html>
  );
}
