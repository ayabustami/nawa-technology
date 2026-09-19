import type { Metadata } from 'next';
import { dataApi } from '@/lib/data/client';
import { resolveCollection } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { ROUTES } from '@/lib/site';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ProcessSlots, ProcessSteps } from '@/components/sections/ProcessSteps';
import { ValueGrid, ValueSlots } from '@/components/sections/ValueGrid';
import { CTASection } from '@/components/sections/CTASection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { NawaGlyph } from '@/components/graphics/NawaMark';

export const metadata: Metadata = {
  title: 'Process',
  description: 'How NAWA Technology works — an ordered set of steps loaded from the database.',
  alternates: { canonical: ROUTES.process },
};

export default async function ProcessPage() {
  const { t, locale, preview } = await getPageContext();
  const [process, values] = await Promise.all([dataApi.process(), dataApi.values()]);

  const labels = {
    stepLabel: t.process.stepLabel,
    stepTitle: t.slots.stepTitle,
    stepDescription: t.slots.stepDescription,
    deliverables: t.process.deliverables,
    stepDeliverables: t.slots.stepDeliverables,
    duration: t.process.duration,
  };

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.process.eyebrow}
        title={t.pageHero.process.title}
        lede={t.pageHero.process.lede}
        size="lg"
        actions={
          <ButtonLink href={`${ROUTES.contact}?intent=start-a-project`} variant="primary" size="md" arrow="up-right">
            {t.actions.startAProject}
          </ButtonLink>
        }
      />

      {/* steps ---------------------------------------------------------- */}
      <section className="nawa-section relative isolate overflow-hidden" aria-labelledby="process-title">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 45% at 50% 0%, var(--accent-softer), transparent 70%)' }}
          aria-hidden
        />

        <div className="nawa-shell relative">
          <div className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="process-title" className="t-h2 text-fg">
                {t.process.title}
              </h2>
              <p className="t-lede mt-4 max-w-xl text-pretty">{t.process.lede}</p>
            </div>
            <span className="hidden size-24 shrink-0 text-fg-subtle/35 sm:block animate-orbit" aria-hidden>
              <NawaGlyph />
            </span>
          </div>

          <AsyncSection
            result={resolveCollection(process, PREVIEW_FIXTURES.process, preview)}
            loading={<ProcessSlots count={4} labels={labels} locale={locale} />}
            empty={<ProcessSlots count={4} labels={labels} locale={locale} />}
          >
            {(steps) => <ProcessSteps steps={steps} locale={locale} labels={labels} />}
          </AsyncSection>

          <p className="mt-12 border-t border-line pt-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle/70">
            GET /process — {locale === 'ar' ? 'مراحل مرتّبة حسب الحقل order' : 'ordered by the `order` field'}
          </p>
        </div>
      </section>

      {/* principles ----------------------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="principles-title">
        <div className="nawa-shell">
          <SectionHeading
            eyebrow={t.about.values.eyebrow}
            title={t.process.principlesTitle}
            lede={t.process.principlesLede}
            className="mb-12"
            id="principles-title"
          />

          <AsyncSection
            result={resolveCollection(values, PREVIEW_FIXTURES.values, preview)}
            loading={<SkeletonGrid count={4} variant="value" columns="sm:grid-cols-2 lg:grid-cols-4" />}
            empty={<ValueSlots count={4} labels={{ valueTitle: t.slots.valueTitle, valueDescription: t.slots.valueDescription, marker: t.slots.marker }} />}
          >
            {(data) => <ValueGrid values={data} locale={locale} />}
          </AsyncSection>
        </div>
      </section>

      <CTASection
        eyebrow={t.home.cta.eyebrow}
        title={t.process.ctaTitle}
        body={t.process.ctaBody}
        primaryLabel={t.cta.primary}
        secondaryLabel={t.cta.secondary}
        className="nawa-section border-t border-line"
      />
    </>
  );
}
