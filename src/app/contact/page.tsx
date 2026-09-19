import type { Metadata } from 'next';
import { dataApi } from '@/lib/data/client';
import { resolveCollection } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { ROUTES } from '@/lib/site';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactChannelGrid, ContactChannelSlots } from '@/components/sections/ContactChannels';
import { SlotMarker } from '@/components/ui/Slot';
import { Skeleton } from '@/components/ui/Skeleton';
import { NawaGlyph } from '@/components/graphics/NawaMark';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with NAWA Technology.',
  alternates: { canonical: ROUTES.contact },
};

export default async function ContactPage(props: { searchParams: Promise<{ intent?: string }> }) {
  const { t, locale, preview } = await getPageContext();
  const { intent } = await props.searchParams;
  const channels = await dataApi.contactChannels();

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.contact.eyebrow}
        title={t.pageHero.contact.title}
        lede={t.pageHero.contact.lede}
        size="md"
        meta={[
          { label: 'Endpoint', value: 'POST /contact' },
          { label: 'Record', value: 'ContactSubmission' },
          { label: t.contact.channelsTitle, value: '—' },
          { label: t.contact.responseTimeLabel, value: t.contact.responseTimeValue },
        ]}
      />

      <section className="nawa-section" aria-labelledby="contact-form-title">
        <div className="nawa-shell grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12">
          {/* form */}
          <div className="min-w-0">
            <h2 id="contact-form-title" className="sr-only">
              {t.contact.formTitle}
            </h2>
            <ContactForm intent={intent} />
          </div>

          {/* aside */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div>
              <p className="t-eyebrow mb-5">{t.contact.channelsTitle}</p>

              <AsyncSection
                result={resolveCollection(channels, PREVIEW_FIXTURES.contactChannels, preview)}
                loading={
                  <div className="grid gap-3" role="status" aria-live="polite">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="flex items-start gap-4 rounded-sm border border-line p-4">
                        <Skeleton className="size-9 shrink-0 rounded-sm" />
                        <div className="flex-1 space-y-2.5 pt-1">
                          <Skeleton className="h-2.5 w-16" />
                          <Skeleton className="h-3.5 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                }
                empty={
                  <ContactChannelSlots
                    count={4}
                    labels={{ contactDetails: t.slots.contactDetails, marker: t.slots.marker }}
                  />
                }
              >
                {(data) => <ContactChannelGrid channels={data} locale={locale} />}
              </AsyncSection>
            </div>

            {/* brand panel */}
            <div className="card relative overflow-hidden p-6">
              <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="relative flex items-start gap-5">
                <span className="size-14 shrink-0 text-accent/80 animate-orbit" aria-hidden>
                  <NawaGlyph />
                </span>
                <div className="min-w-0">
                  <p className="text-[1.5rem] leading-none font-medium text-fg" dir="rtl" lang="ar">
                    نواة
                  </p>
                  <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-fg-subtle">nawa</p>
                  <p className="mt-4 text-[0.8125rem] leading-relaxed text-fg-muted">{t.brand.meaning}</p>
                </div>
              </div>
            </div>

            {/* where the brief goes */}
            <div className="rounded-sm border border-dashed border-line-strong p-5">
              <SlotMarker label={t.slots.marker} tone="accent" className="mb-3" />
              <p className="text-[0.8125rem] leading-relaxed text-fg-subtle">
                {locale === 'ar'
                  ? 'تُرسل الطلبات إلى نقطة النهاية الخاصة بك. أضف عنوان البريد أو قناة الاستلام في قاعدة البيانات.'
                  : 'Briefs are posted to your endpoint. Add the receiving address or channel as a contact-channel record.'}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* offices / FAQ band --------------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="contact-more">
        <div className="nawa-shell grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="t-eyebrow mb-5">{t.contact.officesTitle}</p>
            <div className="rounded-sm border border-dashed border-line-strong p-5">
              <SlotMarker label={t.slots.marker} className="mb-3" />
              <p className="text-[0.8125rem] leading-relaxed text-fg-subtle">{t.slots.officeAddress}</p>
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-5">{t.contact.faqTitle}</p>
            <div className="rounded-sm border border-dashed border-line-strong p-5">
              <SlotMarker label={t.slots.marker} className="mb-3" />
              <p className="text-[0.8125rem] leading-relaxed text-fg-subtle">{t.contact.faqLede}</p>
              <div className="mt-5 space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className="flex items-center justify-between gap-4 border-t border-line-subtle pt-3">
                    <span className="h-px flex-1 bg-line-subtle" aria-hidden />
                    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle/60">
                      FAQ {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-5">{t.contact.responseTimeLabel}</p>
            <div className="rounded-sm border border-line bg-surface/50 p-5">
              <p className="font-mono text-[1.75rem] leading-none text-fg-subtle">—</p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-subtle">{t.contact.responseTimeValue}</p>
            </div>
          </div>

          <h2 id="contact-more" className="sr-only">
            {t.contact.channelsTitle}
          </h2>
        </div>
      </section>
    </>
  );
}
