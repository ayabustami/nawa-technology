import type { CompanyValue, Locale } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { indexLabel } from '@/lib/utils';
import { GridCell, HairlineGrid } from '@/components/ui/HairlineGrid';
import { SlotMarker } from '@/components/ui/Slot';
import { Reveal } from '@/components/ui/Reveal';

export function ValueGrid({ values, locale }: { values: CompanyValue[]; locale: Locale }) {
  return (
    <HairlineGrid as="ul" columns="sm:grid-cols-2">
      {values.map((value, i) => (
        <GridCell key={value.id ?? i} pad="p-6 sm:p-8">
          <Reveal delay={(i % 2) * 80}>
            <span className="t-num mb-5 block text-accent">{value.index ?? indexLabel(i + 1)}</span>
            <h3 className="t-h4 text-fg">{tv(value.title, locale)}</h3>
            {tv(value.description, locale) && (
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-fg-muted">{tv(value.description, locale)}</p>
            )}
          </Reveal>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}

export function ValueSlots({
  count = 4,
  labels,
}: {
  count?: number;
  labels: { valueTitle: string; valueDescription: string; marker: string };
}) {
  return (
    <HairlineGrid as="ul" columns="sm:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <GridCell key={i} pad="p-6 sm:p-8" hover={false}>
          <span className="t-num mb-5 block text-fg-subtle/70">{indexLabel(i + 1)}</span>
          <SlotMarker label={`${labels.marker} ${indexLabel(i + 1)}`} className="mb-3" />
          <h3 className="t-h4 text-fg/55">{labels.valueTitle}</h3>
          <p className="mt-2.5 text-[0.875rem] leading-relaxed text-fg-subtle">{labels.valueDescription}</p>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}
