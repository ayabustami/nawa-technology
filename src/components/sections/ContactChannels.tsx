import type { ContactChannel, Locale, OfficeLocation } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { GridCell, HairlineGrid } from '@/components/ui/HairlineGrid';
import { SlotMarker } from '@/components/ui/Slot';

const KIND_ICON = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  social: Globe,
  other: Globe,
} as const;

export function ContactChannelGrid({ channels, locale }: { channels: ContactChannel[]; locale: Locale }) {
  return (
    <HairlineGrid as="ul" columns="sm:grid-cols-2">
      {channels.map((channel) => {
        const IconCmp = KIND_ICON[channel.kind] ?? Globe;
        const value = tv(channel.value, locale);
        const label = tv(channel.label, locale);
        const isPreview = Boolean((channel as ContactChannel & { preview?: boolean }).preview);

        return (
          <GridCell key={channel.id} pad="p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-line bg-surface-2 text-fg-muted">
                <IconCmp className="size-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="t-eyebrow mb-2">{label}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="link-quiet block truncate text-[0.9375rem]"
                    {...(channel.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-[0.9375rem] text-fg">{value}</p>
                )}
                {isPreview && (
                  <span className="mt-2 inline-flex items-center rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent">
                    Preview record
                  </span>
                )}
              </div>
            </div>
          </GridCell>
        );
      })}
    </HairlineGrid>
  );
}

export function ContactChannelSlots({
  count = 4,
  labels,
}: {
  count?: number;
  labels: { contactDetails: string; marker: string };
}) {
  return (
    <HairlineGrid as="ul" columns="sm:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <GridCell key={i} pad="p-6" hover={false}>
          <div className="flex items-start gap-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-dashed border-line-strong text-fg-subtle">
              <span className="size-1.5 rotate-45 bg-line-strong" aria-hidden />
            </span>
            <div>
              <SlotMarker label={`${labels.marker} ${String(i + 1).padStart(2, '0')}`} className="mb-2" />
              <p className="text-[0.9375rem] text-fg-subtle">{labels.contactDetails}</p>
            </div>
          </div>
        </GridCell>
      ))}
    </HairlineGrid>
  );
}

export function OfficeList({ offices, locale, labels }: { offices: OfficeLocation[]; locale: Locale; labels: { officesTitle: string; officeAddress: string } }) {
  if (!offices.length) {
    return (
      <div className="hairline-t pt-6">
        <p className="t-eyebrow mb-3">{labels.officesTitle}</p>
        <p className="text-[0.875rem] text-fg-subtle">{labels.officeAddress}</p>
      </div>
    );
  }

  return (
    <div className="hairline-t pt-6">
      <p className="t-eyebrow mb-5">{labels.officesTitle}</p>
      <ul className="space-y-5">
        {offices.map((office) => (
          <li key={office.id}>
            <p className="text-[0.9375rem] font-medium text-fg">{tv(office.label, locale)}</p>
            {office.addressLines?.map((line, i) => (
              <p key={i} className="text-[0.875rem] text-fg-muted">
                {tv(line, locale)}
              </p>
            ))}
            {office.mapUrl && (
              <a href={office.mapUrl} target="_blank" rel="noreferrer noopener" className="link-quiet mt-1.5 inline-block text-[0.8125rem]">
                View map
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
