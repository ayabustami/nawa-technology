import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { dataApi } from '@/lib/data/client';
import { resolveRecord } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { tv, tvList } from '@/lib/data/localized';
import { ROUTES } from '@/lib/site';
import { fill } from '@/lib/i18n/format';
import { ButtonLink } from '@/components/ui/Button';
import { IconTile } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Badge';
import { Slot, SlotBox, SlotMarker } from '@/components/ui/Slot';
import { Reveal } from '@/components/ui/Reveal';
import { AbstractCover } from '@/components/graphics/AbstractCover';
import { CTASection } from '@/components/sections/CTASection';

/* -------------------------------------------------------------------------
   SERVICE DETAIL TEMPLATE
   Renders one `Service` record: icon, name, short + full description,
   features, technologies, image slot and a call to action. Missing fields
   fall back to marked slots rather than disappearing.
   ---------------------------------------------------------------------- */

type Params = { slug: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const record = await dataApi.service(slug);
  const title = record.data ? tv(record.data.name, 'en') : slug;
  return { title, description: record.data ? tv(record.data.shortDescription ?? '', 'en') : undefined };
}

export default async function ServiceDetailPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const { t, locale, preview } = await getPageContext();

  const record = await dataApi.service(slug);
  const fixture = PREVIEW_FIXTURES.services.find((s) => s.slug === slug);
  const resolved = resolveRecord(record, fixture, preview);

  if (resolved.status !== 'ready' || !resolved.data) notFound();

  const service = resolved.data;
  const name = tv(service.name, locale);
  const short = tv(service.shortDescription, locale);
  const full = tv(service.fullDescription, locale);
  const features = tvList(service.features, locale);
  const technologies = service.technologies ?? [];
  const ctaLabel = service.cta ? tv(service.cta.label, locale) : t.actions.startAProject;
  const ctaHref = service.cta?.href ?? `${ROUTES.contact}?intent=start-a-project`;

  const siblings = (preview === 'populated' ? PREVIEW_FIXTURES.services : []).filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 100% at 88% 0%, var(--accent-softer), transparent 60%)' }}
          aria-hidden
        />

        <div className="nawa-shell relative pb-14 pt-28 sm:pb-16 sm:pt-40">
          <Link
            href={ROUTES.services}
            className="group/back mb-10 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-fg-muted transition-colors duration-300 hover:text-accent"
          >
            <ArrowLeft className="size-4 transition-transform duration-400 ease-[var(--ease-nawa)] group-hover/back:-translate-x-0.5 rtl:rotate-180 rtl:group-hover/back:translate-x-0.5" strokeWidth={1.6} aria-hidden />
            {t.actions.backToServices}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <IconTile name={service.icon} size="lg" tone="accent" />
                {resolved.source === 'preview' && (
                  <span className="rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent">
                    {t.state.previewRibbon}
                  </span>
                )}
              </div>

              <p className="t-eyebrow mb-4">{t.pageHero.serviceDetail.eyebrow}</p>
              <h1 className="t-h1 max-w-3xl text-balance text-fg">{name}</h1>
              {short ? (
                <p className="t-lede mt-6 max-w-2xl text-pretty">{short}</p>
              ) : (
                <Slot label={t.slots.marker} className="t-lede mt-6 max-w-2xl">
                  {t.slots.serviceDescription}
                </Slot>
              )}
            </div>

            <ButtonLink href={ctaHref} variant="primary" size="lg" arrow="up-right" className="w-full lg:w-auto">
              {ctaLabel}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* body */}
      <section className="nawa-section">
        <div className="nawa-shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div className="min-w-0">
            <h2 className="t-h3 mb-7 text-fg">{t.services.overview}</h2>

            {full ? (
              <div className="flex max-w-2xl flex-col gap-5">
                {full.split(/\n{2,}/).map((paragraph, i) => (
                  <p key={i} className="text-[1.0625rem] leading-relaxed text-fg-muted text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <Slot label={fill(t.slots.markerTemplate, { label: t.services.overview })} className="max-w-2xl text-[1.0625rem] leading-relaxed">
                {t.slots.serviceFullDescription}
              </Slot>
            )}

            <div className="mt-14">
              <h2 className="t-eyebrow mb-6">{t.services.whatYouGet}</h2>
              {features.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <Reveal key={feature}>
                      <li className="flex items-start gap-3 rounded-sm border border-line bg-surface/60 px-4 py-3.5 text-[0.9375rem] text-fg-muted transition-colors duration-400 hover:border-line-strong hover:bg-surface-2">
                        <span className="mt-[0.55rem] size-1 shrink-0 rotate-45 bg-accent/70" aria-hidden />
                        {feature}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <p className="text-[0.9375rem] text-fg-subtle">{t.services.noFeatures}</p>
              )}
            </div>

            {siblings.length > 0 && (
              <div className="mt-16">
                <h2 className="t-eyebrow mb-6">{t.services.relatedServices}</h2>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {siblings.map((sibling) => (
                    <li key={sibling.slug}>
                      <Link
                        href={ROUTES.serviceDetail(sibling.slug)}
                        className="group/sib flex items-center justify-between gap-3 rounded-sm border border-line px-4 py-3.5 transition-colors duration-400 hover:border-accent-line hover:bg-accent-softer"
                      >
                        <span className="truncate text-[0.875rem] text-fg-muted transition-colors duration-300 group-hover/sib:text-fg">
                          {tv(sibling.name, locale)}
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-fg-subtle transition-colors group-hover/sib:text-accent rtl:-scale-x-100" strokeWidth={1.6} aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="t-eyebrow mb-5">{t.services.atAGlance}</h2>

            {service.image?.src ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
                <Image src={service.image.src} alt={tv(service.image.alt ?? '', locale) || name} fill sizes="(max-width:1024px) 100vw, 320px" className="object-cover" />
              </div>
            ) : (
              <SlotBox label={t.slots.marker} aspect="aspect-[4/3]">
                <p className="text-[0.8125rem] text-fg-subtle">{t.slots.imageAlt}</p>
              </SlotBox>
            )}

            <div className="mt-8">
              <SlotMarker label={t.services.technologies} className="mb-4" />
              {technologies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              ) : (
                <p className="text-[0.8125rem] text-fg-subtle">{t.services.noTechnologies}</p>
              )}
            </div>

            <div className="mt-8 rounded-sm border border-line bg-surface/50 p-4">
              <AbstractCover seed={service.slug} pattern="core" className="mb-4 aspect-square rounded-xs" grid={false} />
              <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle">
                {t.brand.meaningShort}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <CTASection
        eyebrow={t.home.cta.eyebrow}
        title={t.cta.title}
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        secondaryLabel={t.cta.secondary}
        secondaryHref={ROUTES.services}
        className="nawa-section border-t border-line"
        compact
      />
    </>
  );
}
