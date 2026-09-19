import type { Metadata } from 'next';
import { dataApi } from '@/lib/data/client';
import { resolveCollection } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { ROUTES } from '@/lib/site';
import { fill } from '@/lib/i18n/format';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ValueGrid, ValueSlots } from '@/components/sections/ValueGrid';
import { Timeline, TimelineSlots } from '@/components/sections/Timeline';
import { TeamGrid, TeamSlots } from '@/components/sections/TeamGrid';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Slot, SlotMarker, SlotRules } from '@/components/ui/Slot';
import { ButtonLink, QuietLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { NawaGlyph } from '@/components/graphics/NawaMark';

export const metadata: Metadata = {
  title: 'About',
  description: 'About NAWA Technology — mission, vision, values and approach.',
  alternates: { canonical: ROUTES.about },
};

export default async function AboutPage() {
  const { t, locale, preview } = await getPageContext();

  const [values, milestones, team, testimonials] = await Promise.all([
    dataApi.values(),
    dataApi.milestones(),
    dataApi.team(),
    dataApi.testimonials(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.about.eyebrow}
        title={t.pageHero.about.title}
        lede={t.pageHero.about.lede}
        size="lg"
        actions={<ButtonLink href={ROUTES.contact} variant="secondary" size="md" arrow="up-right">{t.actions.getInTouch}</ButtonLink>}
      />

      {/* 01 — introduction --------------------------------------------- */}
      <section className="nawa-section" aria-labelledby="about-intro">
        <div className="nawa-shell grid gap-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal className="flex items-center gap-4">
              <span className="t-num text-accent">01</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden />
              <span className="t-eyebrow">{t.about.intro.eyebrow}</span>
            </Reveal>
            <Reveal delay={90} className="mt-8 hidden lg:block">
              <span className="block size-20 text-fg-subtle/45" aria-hidden>
                <NawaGlyph />
              </span>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h2 id="about-intro" className="t-h2 max-w-3xl text-balance text-fg">
                {t.about.intro.title}
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <Slot label={fill(t.slots.markerTemplate, { label: t.about.intro.eyebrow })} className="t-lede mt-7 max-w-2xl" marker={false}>
                {t.slots.companyIntro}
              </Slot>
            </Reveal>
            <Reveal delay={130} className="mt-8 max-w-2xl">
              <SlotRules lines={5} />
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-fg-muted">{t.slots.companyIntroLong}</p>
            </Reveal>

            <Reveal delay={190}>
              <div className="mt-12 border-s-2 border-accent ps-6">
                <p className="t-eyebrow mb-3">{t.brand.meaningShort}</p>
                <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-fg text-pretty">{t.brand.meaning}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — mission & vision ----------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="about-mission">
        <div className="nawa-shell">
          <SectionHeading eyebrow={t.about.mission.eyebrow} index="02" title={t.about.mission.title} className="mb-12" id="about-mission" />

          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <article className="card edge-glow relative h-full overflow-hidden p-7 sm:p-9">
                <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <div className="relative">
                  <SlotMarker label={fill(t.slots.markerTemplate, { label: t.about.mission.eyebrow })} tone="accent" className="mb-6" />
                  <h3 className="t-h3 text-fg/70">{t.about.mission.title}</h3>
                  <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-fg-muted">{t.slots.mission}</p>
                  <SlotRules lines={3} className="mt-7" />
                </div>
              </article>
            </Reveal>

            <Reveal delay={90}>
              <article className="card edge-glow relative h-full overflow-hidden p-7 sm:p-9">
                <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <div className="relative">
                  <SlotMarker label={fill(t.slots.markerTemplate, { label: t.about.vision.eyebrow })} tone="accent" className="mb-6" />
                  <h3 className="t-h3 text-fg/70">{t.about.vision.title}</h3>
                  <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-fg-muted">{t.slots.vision}</p>
                  <SlotRules lines={3} className="mt-7" />
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — values --------------------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="about-values">
        <div className="nawa-shell">
          <SectionHeading
            eyebrow={t.about.values.eyebrow}
            index="03"
            title={t.about.values.title}
            lede={t.about.values.lede}
            className="mb-12"
            id="about-values"
          />

          <AsyncSection
            result={resolveCollection(values, PREVIEW_FIXTURES.values, preview)}
            loading={<ValueSlots count={4} labels={{ valueTitle: t.state.loading, valueDescription: t.state.loadingCollection, marker: t.slots.marker }} />}
            empty={<ValueSlots count={4} labels={{ valueTitle: t.slots.valueTitle, valueDescription: t.slots.valueDescription, marker: t.slots.marker }} />}
          >
            {(data) => <ValueGrid values={data} locale={locale} />}
          </AsyncSection>
        </div>
      </section>

      {/* 04 — approach ------------------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="about-approach">
        <div className="nawa-shell grid gap-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-20">
          <Reveal className="flex items-center gap-4 lg:block">
            <span className="t-num text-accent">04</span>
            <span className="h-px w-8 bg-line-strong lg:my-4 lg:block" aria-hidden />
            <span className="t-eyebrow">{t.about.approach.eyebrow}</span>
          </Reveal>

          <div>
            <Reveal>
              <h2 id="about-approach" className="t-h2 max-w-3xl text-balance text-fg">
                {t.about.approach.title}
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <p className="t-lede mt-6 max-w-2xl text-pretty text-fg-muted">{t.slots.approach}</p>
            </Reveal>
            <Reveal delay={130} className="mt-10">
              <QuietLink href={ROUTES.process}>{t.actions.ourProcess}</QuietLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 — milestones ----------------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="about-history">
        <div className="nawa-shell grid gap-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow={t.about.history.eyebrow} index="05" title={t.about.history.title} lede={t.about.history.lede} size="sm" rule={false} id="about-history" />
          </div>

          <AsyncSection
            result={resolveCollection(milestones, PREVIEW_FIXTURES.milestones, preview)}
            loading={<TimelineSlots labels={{ milestone: t.state.loadingCollection, marker: t.slots.marker, dateLabel: '—', titleLabel: t.state.loading }} />}
            empty={
              <EmptyState
                compact
                label={t.about.history.eyebrow}
                title={t.empty.milestones.title}
                body={t.empty.milestones.body}
              />
            }
          >
            {(data) => <Timeline milestones={data} locale={locale} />}
          </AsyncSection>
        </div>
      </section>

      {/* 06 — team ----------------------------------------------------- */}
      <section className="nawa-section border-t border-line" aria-labelledby="about-team">
        <div className="nawa-shell">
          <SectionHeading eyebrow={t.about.team.eyebrow} index="06" title={t.about.team.title} lede={t.about.team.lede} className="mb-12" id="about-team" />

          <AsyncSection
            result={resolveCollection(team, PREVIEW_FIXTURES.team, preview)}
            loading={<SkeletonGrid count={4} variant="value" columns="sm:grid-cols-2 lg:grid-cols-4" />}
            empty={<TeamSlots count={4} labels={{ teamMember: t.slots.teamMember, marker: t.slots.marker }} />}
          >
            {(data) => <TeamGrid team={data} locale={locale} />}
          </AsyncSection>
        </div>
      </section>

      {/* 07 — testimonials --------------------------------------------- */}
      <TestimonialsSection
        result={resolveCollection(testimonials, PREVIEW_FIXTURES.testimonials, preview)}
        t={t}
        locale={locale}
        className="nawa-section border-t border-line"
      />

      <CTASection
        eyebrow={t.home.cta.eyebrow}
        title={t.cta.title}
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        secondaryLabel={t.cta.secondary}
        className="nawa-section border-t border-line"
        compact
      />
    </>
  );
}
