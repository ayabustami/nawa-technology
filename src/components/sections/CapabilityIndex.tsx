import type { Capability, Locale } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { cn, indexLabel } from '@/lib/utils';
import { GridCell, HairlineGrid } from '@/components/ui/HairlineGrid';
import { SlotMarker } from '@/components/ui/Slot';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { toArabicDigits } from '@/lib/utils';

/* -------------------------------------------------------------------------
   Capabilities — an index, not a marketing wall.
   Rendered as a precise hairline grid; each cell shows a number, a label and
   an optional one-line description, plus a hover state that lights the rule.
   ---------------------------------------------------------------------- */

export function CapabilityIndex({
  capabilities,
  locale,
  columns = 'sm:grid-cols-2 lg:grid-cols-4',
  className,
}: {
  capabilities: Capability[];
  locale: Locale;
  columns?: string;
  className?: string;
}) {
  return (
    <HairlineGrid as="ul" columns={columns} className={className}>
      {capabilities.map((capability, i) => (
        <GridCell key={capability.id ?? i} pad="p-5 sm:p-6">
          <Reveal delay={(i % 4) * 55}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="t-num text-accent/80 transition-colors duration-500 group-hover/cell:text-accent">
                {locale === 'ar' ? toArabicDigits(indexLabel(i + 1)) : indexLabel(i + 1)}
              </span>
              {capability.group && (
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-fg-subtle">
                  {tv(capability.group, locale)}
                </span>
              )}
            </div>
            <h3 className="mt-5 text-[0.9375rem] leading-snug font-medium text-fg transition-colors duration-500 group-hover/cell:text-accent">
              {tv(capability.label, locale)}
            </h3>
            {tv(capability.description, locale) && (
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-muted">{tv(capability.description, locale)}</p>
            )}
          </Reveal>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}

export function CapabilitySlots({
  count = 8,
  locale,
  labels,
  columns = 'sm:grid-cols-2 lg:grid-cols-4',
  className,
}: {
  count?: number;
  locale: Locale;
  labels: { capabilityLabel: string; capabilityDescription: string; marker: string };
  columns?: string;
  className?: string;
}) {
  return (
    <HairlineGrid as="ul" columns={columns} className={className}>
      {Array.from({ length: count }, (_, i) => (
        <GridCell key={i} pad="p-5 sm:p-6" hover={false}>
          <span className="t-num text-fg-subtle/60">
            {locale === 'ar' ? toArabicDigits(indexLabel(i + 1)) : indexLabel(i + 1)}
          </span>
          <SlotMarker label={`${labels.marker} ${indexLabel(i + 1)}`} className="mt-5 mb-2.5" />
          <p className={cn('text-[0.9375rem] leading-snug font-medium text-fg/50')}>{labels.capabilityLabel}</p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-subtle">{labels.capabilityDescription}</p>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}

/** Running strip variant — used on the home page for ambient motion. */
export function CapabilityMarquee({ capabilities, locale }: { capabilities: Capability[]; locale: Locale }) {
  const items = capabilities.map((c) => tv(c.label, locale));
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className="marquee mask-fade-x relative overflow-hidden border-y border-line py-5">
      <div className="marquee-track gap-10" style={{ ['--marquee-dur' as string]: `${Math.max(30, items.length * 6)}s` }}>
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="text-[0.9375rem] whitespace-nowrap text-fg-muted transition-colors duration-300 hover:text-accent">{item}</span>
            <span className="size-1 shrink-0 rotate-45 bg-accent/50" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

/** LOADING state for the capability index — same grid geometry, shimmering. */
export function CapabilitySkeleton({
  count = 8,
  columns = 'sm:grid-cols-2 lg:grid-cols-4',
  className,
}: {
  count?: number;
  columns?: string;
  className?: string;
}) {
  return (
    <div className={cn('grid border-e border-b border-line', columns, className)} role="status" aria-live="polite">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border-s border-t border-line p-5 sm:p-6">
          <Skeleton className="mb-5 h-2.5 w-6" />
          <Skeleton className="mb-2.5 h-3.5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-2/3" />
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}
