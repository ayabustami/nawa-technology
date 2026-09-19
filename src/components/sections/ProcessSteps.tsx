import type { Locale, ProcessStep } from '@/lib/data/types';
import { tv, tvList } from '@/lib/data/localized';
import { cn, indexLabel, toArabicDigits } from '@/lib/utils';
import { IconTile } from '@/components/ui/Icon';
import { SlotMarker } from '@/components/ui/Slot';
import { Reveal } from '@/components/ui/Reveal';

/* -------------------------------------------------------------------------
   Process — ordered steps.
   `ProcessSteps` renders database records; `ProcessSlots` renders the same
   geometry with neutral placeholder copy so the section is visually complete
   before a single record exists.
   ---------------------------------------------------------------------- */

type Labels = {
  stepLabel: string;
  stepTitle: string;
  stepDescription: string;
  deliverables: string;
  stepDeliverables: string;
  duration: string;
};

export function ProcessSteps({
  steps,
  locale,
  labels,
  layout = 'rows',
}: {
  steps: ProcessStep[];
  locale: Locale;
  labels: Labels;
  layout?: 'rows' | 'grid';
}) {
  if (layout === 'grid') {
    return (
      <ol className="grid list-none gap-5 sm:grid-cols-2">
        {steps.map((step, i) => (
          <Reveal as="li" key={step.id ?? i} delay={(i % 2) * 90}>
            <ProcessCard step={step} locale={locale} labels={labels} index={i} />
          </Reveal>
        ))}
      </ol>
    );
  }

  return (
    <ol className="list-none">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.id ?? i} delay={i * 60}>
          <ProcessRow step={step} locale={locale} labels={labels} index={i} />
        </Reveal>
      ))}
    </ol>
  );
}

function ProcessRow({ step, locale, labels, index }: { step: ProcessStep; locale: Locale; labels: Labels; index: number }) {
  const title = tv(step.title, locale);
  const description = tv(step.description, locale);
  const deliverables = tvList(step.deliverables, locale);
  const isPreview = Boolean((step as ProcessStep & { preview?: boolean }).preview);

  return (
    <div className="group/step hairline-t grid gap-6 py-8 transition-colors duration-500 hover:bg-surface/40 sm:py-10 lg:grid-cols-[auto_minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
      <div className="flex items-start gap-5 lg:block">
        <span className="font-mono text-[2rem] leading-none font-light text-fg-subtle tabular-nums transition-colors duration-500 group-hover/step:text-accent sm:text-[2.75rem]">
          {step.number ?? indexLabel(index + 1)}
        </span>
        {step.icon && <IconTile name={step.icon} className="mt-5 hidden lg:inline-grid" />}
      </div>

      <div>
        <h3 className="t-h3 text-fg text-balance">{title}</h3>
        {description && <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">{description}</p>}
        {step.duration && (
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
            <span className="h-px w-4 bg-line-strong" aria-hidden />
            {labels.duration}: {tv(step.duration, locale)}
          </p>
        )}
        {isPreview && (
          <span className="mt-4 inline-flex w-fit items-center rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent">
            Preview record
          </span>
        )}
      </div>

      {deliverables.length > 0 && (
        <div className="lg:pt-1">
          <p className="t-eyebrow mb-4">{labels.deliverables}</p>
          <ul className="space-y-2.5">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-fg-muted">
                <span className="mt-[0.5rem] size-1 shrink-0 rotate-45 bg-accent/70" aria-hidden />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProcessCard({ step, locale, labels, index }: { step: ProcessStep; locale: Locale; labels: Labels; index: number }) {
  const deliverables = tvList(step.deliverables, locale);
  return (
    <div className="card edge-glow h-full p-6 transition-colors duration-500 hover:bg-surface-2">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="font-mono text-[1.75rem] leading-none font-light text-fg-subtle tabular-nums">
          {step.number ?? indexLabel(index + 1)}
        </span>
        {step.icon && <IconTile name={step.icon} size="sm" />}
      </div>
      <h3 className="t-h4 text-fg">{tv(step.title, locale)}</h3>
      {tv(step.description, locale) && <p className="mt-2.5 text-[0.875rem] leading-relaxed text-fg-muted">{tv(step.description, locale)}</p>}
      {deliverables.length > 0 && (
        <ul className="hairline-t mt-5 space-y-2 pt-4">
          {deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2.5 text-[0.8125rem] text-fg-muted">
              <span className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Structural placeholder version — identical geometry, neutral copy. */
export function ProcessSlots({ count = 4, labels, locale }: { count?: number; labels: Labels; locale: Locale }) {
  return (
    <ol className="list-none">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="group/step hairline-t grid gap-6 py-8 sm:py-10 lg:grid-cols-[auto_minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <span className="font-mono text-[2rem] leading-none font-light text-fg-subtle/70 tabular-nums sm:text-[2.75rem]">
            {locale === 'ar' ? toArabicDigits(indexLabel(i + 1)) : indexLabel(i + 1)}
          </span>
          <div>
            <SlotMarker label={`${labels.stepLabel} ${indexLabel(i + 1)}`} className="mb-3" />
            <h3 className="t-h3 text-fg/55">{labels.stepTitle}</h3>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted/70">{labels.stepDescription}</p>
          </div>
          <div className="lg:pt-1">
            <SlotMarker label={labels.deliverables} className="mb-3" />
            <p className={cn('text-[0.8125rem] leading-relaxed text-fg-subtle')}>{labels.stepDeliverables}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

