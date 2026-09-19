import type { DataResult, Locale, ProcessStep } from '@/lib/data/types';
import type { Dictionary } from '@/lib/i18n';
import { ROUTES } from '@/lib/site';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ProcessSlots, ProcessSteps } from '@/components/sections/ProcessSteps';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { QuietLink } from '@/components/ui/Button';

export function HomeProcess({ result, t, locale }: { result: DataResult<ProcessStep>; t: Dictionary; locale: Locale }) {
  const labels = {
    stepLabel: t.process.stepLabel,
    stepTitle: t.slots.stepTitle,
    stepDescription: t.slots.stepDescription,
    deliverables: t.process.deliverables,
    stepDeliverables: t.slots.stepDeliverables,
    duration: t.process.duration,
  };

  return (
    <section className="nawa-section relative isolate border-t border-line" aria-labelledby="home-process-title">
      <div className="nawa-shell">
        <SectionHeading
          id="home-process-title"
          eyebrow={t.home.process.eyebrow}
          index={t.home.process.index}
          title={t.home.process.title}
          lede={t.home.process.lede}
          action={<QuietLink href={ROUTES.process}>{t.home.process.link}</QuietLink>}
          className="mb-12 sm:mb-14"
        />

        <AsyncSection
          result={result}
          loading={<ProcessSlots count={4} labels={labels} locale={locale} />}
          empty={<ProcessSlots count={4} labels={labels} locale={locale} />}
        >
          {(steps) => <ProcessSteps steps={steps} locale={locale} labels={labels} />}
        </AsyncSection>
      </div>
    </section>
  );
}
