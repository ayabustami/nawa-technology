import type { Locale, Milestone } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { SlotMarker } from '@/components/ui/Slot';
import { Reveal } from '@/components/ui/Reveal';

/* -------------------------------------------------------------------------
   Timeline — dated company milestones.
   A vertical rail with an accent node per record; collapses to a single
   column on mobile without losing the rail.
   ---------------------------------------------------------------------- */

export function Timeline({ milestones, locale }: { milestones: Milestone[]; locale: Locale }) {
  return (
    <ol className="relative list-none border-s border-line ps-8 sm:ps-10">
      {milestones.map((milestone, i) => (
        <Reveal as="li" key={milestone.id ?? i} delay={i * 70} className="relative pb-10 last:pb-0">
          <span className="absolute -start-[2.31rem] top-1.5 grid size-3 place-items-center sm:-start-[2.81rem]" aria-hidden>
            <span className="size-2.5 rounded-full border border-accent-line bg-bg" />
            <span className="absolute size-1 rounded-full bg-accent" />
          </span>

          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent tabular-nums">
            {tv(milestone.date, locale)}
          </p>
          <h3 className="t-h4 mt-2.5 text-fg">{tv(milestone.title, locale)}</h3>
          {tv(milestone.description, locale) && (
            <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-fg-muted">{tv(milestone.description, locale)}</p>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

export function TimelineSlots({
  count = 3,
  labels,
}: {
  count?: number;
  labels: { milestone: string; marker: string; dateLabel: string; titleLabel: string };
}) {
  return (
    <ol className="relative list-none border-s border-dashed border-line-strong ps-8 sm:ps-10">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="relative pb-10 last:pb-0">
          <span className="absolute -start-[2.31rem] top-1.5 size-2.5 rounded-full border border-dashed border-line-strong bg-bg sm:-start-[2.81rem]" aria-hidden />
          <SlotMarker label={`${labels.marker} ${String(i + 1).padStart(2, '0')}`} className="mb-2.5" />
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle/70">{labels.dateLabel}</p>
          <p className="mt-2 text-[0.9375rem] text-fg-subtle">{labels.titleLabel}</p>
          <p className="mt-1.5 max-w-xl text-[0.8125rem] text-fg-subtle/80">{labels.milestone}</p>
        </li>
      ))}
    </ol>
  );
}
