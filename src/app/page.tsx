import type { Metadata } from 'next';
import { dataApi } from '@/lib/data/client';
import { getPreviewState, resolveCollection } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getDictionary, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { Hero } from '@/components/sections/home/Hero';
import { Intro } from '@/components/sections/home/Intro';
import { HomeServices } from '@/components/sections/home/ServicesSection';
import { HomeWork } from '@/components/sections/home/WorkSection';
import { HomeCapabilities } from '@/components/sections/home/CapabilitiesSection';
import { HomeProcess } from '@/components/sections/home/ProcessSection';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'NAWA Technology — Build what’s next',
  alternates: { canonical: '/' },
};

/**
 * HOME
 * ---------------------------------------------------------------------------
 * 1. Hero          2. Introduction      3. Services
 * 4. Work          5. Capabilities      6. Process
 * 7. Final CTA     8. Footer (rendered by the root layout)
 *
 * Every dynamic section is fetched in parallel, resolved against the
 * developer state-preview, and handed to an `<AsyncSection>` that owns the
 * loading / empty / populated decision.
 */
export default async function HomePage() {
  const [preview, cookieStore] = await Promise.all([getPreviewState(), cookies()]);
  const rawLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const t = getDictionary(locale);

  const [services, projects, capabilities, process] = await Promise.all([
    dataApi.services(),
    dataApi.projects(),
    dataApi.capabilities(),
    dataApi.process(),
  ]);

  return (
    <>
      <Hero />

      <Intro t={t} locale={locale} />

      <HomeServices result={resolveCollection(services, PREVIEW_FIXTURES.services, preview)} t={t} locale={locale} />

      <HomeWork result={resolveCollection(projects, PREVIEW_FIXTURES.projects, preview)} t={t} locale={locale} />

      <HomeCapabilities
        result={resolveCollection(capabilities, PREVIEW_FIXTURES.capabilities, preview)}
        t={t}
        locale={locale}
      />

      <HomeProcess result={resolveCollection(process, PREVIEW_FIXTURES.process, preview)} t={t} locale={locale} />

      <CTASection
        eyebrow={t.home.cta.eyebrow}
        title={t.home.cta.title}
        body={t.home.cta.body}
        primaryLabel={t.home.cta.primaryCta}
        secondaryLabel={t.home.cta.secondaryCta}
        className="nawa-section border-t border-line"
      />
    </>
  );
}
