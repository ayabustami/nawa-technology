import type { Capability, DataResult, Locale } from '@/lib/data/types';
import type { Dictionary } from '@/lib/i18n';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { CapabilityIndex, CapabilitySkeleton, CapabilitySlots } from '@/components/sections/CapabilityIndex';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function HomeCapabilities({
  result,
  t,
  locale,
}: {
  result: DataResult<Capability>;
  t: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="nawa-section relative isolate overflow-hidden border-t border-line" aria-labelledby="home-cap-title">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 0%, var(--accent-softer), transparent 70%)' }}
        aria-hidden
      />
      <div className="nawa-shell relative">
        <SectionHeading
          id="home-cap-title"
          eyebrow={t.home.capabilities.eyebrow}
          index={t.home.capabilities.index}
          title={t.home.capabilities.title}
          lede={t.home.capabilities.lede}
          className="mb-12 sm:mb-14"
        />

        <AsyncSection
          result={result}
          loading={<CapabilitySkeleton count={8} />}
          empty={
            <CapabilitySlots
              count={8}
              locale={locale}
              labels={{ capabilityLabel: t.slots.capabilityLabel, capabilityDescription: t.slots.capabilityDescription, marker: t.slots.marker }}
            />
          }
        >
          {(capabilities) => <CapabilityIndex capabilities={capabilities} locale={locale} />}
        </AsyncSection>
      </div>
    </section>
  );
}
