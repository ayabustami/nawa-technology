import type { Locale, TeamMember } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { GridCell, HairlineGrid } from '@/components/ui/HairlineGrid';
import { SlotMarker } from '@/components/ui/Slot';
import { AbstractTile } from '@/components/graphics/AbstractCover';
import { Reveal } from '@/components/ui/Reveal';

export function TeamGrid({ team, locale }: { team: TeamMember[]; locale: Locale }) {
  return (
    <HairlineGrid as="ul" columns="sm:grid-cols-2 lg:grid-cols-4">
      {team.map((member, i) => (
        <GridCell key={member.id ?? i} pad="p-5 sm:p-6">
          <Reveal delay={(i % 4) * 60}>
            <span className="mb-5 block size-14 overflow-hidden rounded-full border border-line">
              <AbstractTile seed={member.id ?? tv(member.name, locale)} className="size-full" />
            </span>
            <h3 className="text-[0.9375rem] font-medium text-fg">{tv(member.name, locale)}</h3>
            {tv(member.role, locale) && <p className="mt-1 text-[0.8125rem] text-fg-subtle">{tv(member.role, locale)}</p>}
          </Reveal>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}

export function TeamSlots({ count = 4, labels }: { count?: number; labels: { teamMember: string; marker: string } }) {
  return (
    <HairlineGrid as="ul" columns="sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <GridCell key={i} pad="p-5 sm:p-6" hover={false}>
          <span className="mb-5 block size-14 rounded-full border border-dashed border-line-strong" aria-hidden />
          <SlotMarker label={`${labels.marker} ${String(i + 1).padStart(2, '0')}`} className="mb-2" />
          <p className="text-[0.875rem] text-fg-subtle">{labels.teamMember}</p>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}
