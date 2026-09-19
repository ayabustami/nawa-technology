import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Dictionary, Locale } from '@/lib/i18n';
import { ROUTES } from '@/lib/site';
import { fill } from '@/lib/i18n/format';
import { Reveal } from '@/components/ui/Reveal';
import { SlotMarker } from '@/components/ui/Slot';
import { NawaGlyph } from '@/components/graphics/NawaMark';

/* -------------------------------------------------------------------------
   Introduction — the brand's one true story: what نواة means.
   Everything else in this section is a marked slot waiting for real copy.
   ---------------------------------------------------------------------- */

export function Intro({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="nawa-section relative isolate" aria-labelledby="intro-title">
      <div className="nawa-shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-20">
          {/* label column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal className="flex items-center gap-4">
              <span className="t-num text-accent">{t.home.intro.index}</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden />
              <span className="t-eyebrow">{t.home.intro.eyebrow}</span>
            </Reveal>

            <Reveal delay={90} className="mt-8 hidden lg:block">
              <span className="block size-24 text-fg-subtle/50" aria-hidden>
                <NawaGlyph />
              </span>
            </Reveal>
          </div>

          {/* content column */}
          <div>
            <Reveal>
              <SlotMarker label={fill(t.slots.markerTemplate, { label: t.home.intro.eyebrow })} className="mb-5" />
              <h2 id="intro-title" className="t-h2 max-w-3xl text-balance text-fg/60">
                {t.home.intro.titleSlot}
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="t-lede mt-7 max-w-2xl text-pretty">{t.home.intro.bodySlot}</p>
            </Reveal>

            {/* the meaning of NAWA — real, given content */}
            <Reveal delay={150}>
              <div className="card mt-12 overflow-hidden">
                <div className="grid sm:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="relative grid place-items-center border-b border-line bg-bg-deep px-10 py-10 sm:border-e sm:border-b-0">
                    <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-70" aria-hidden />
                    <div className="relative flex flex-col items-center gap-3">
                      <span className="text-[2.75rem] leading-none font-medium text-accent" dir="rtl" lang="ar">
                        نواة
                      </span>
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-fg-subtle">nawa</span>
                    </div>
                  </div>

                  <div className="p-7 sm:p-9">
                    <p className="t-eyebrow mb-4">{t.home.intro.meaningLabel}</p>
                    <p className="text-[1rem] leading-relaxed text-fg text-pretty sm:text-[1.0625rem]">
                      {t.home.intro.meaningBody}
                    </p>

                    <Link
                      href={ROUTES.about}
                      className="group/intro mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-fg transition-colors duration-300 hover:text-accent"
                    >
                      {t.home.intro.linkLabel}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-400 ease-[var(--ease-nawa)] group-hover/intro:translate-x-0.5 group-hover/intro:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/intro:-translate-x-0.5"
                        strokeWidth={1.6}
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={210}>
              <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle/70">
                {locale === 'ar' ? 'نواة' : 'nawa'} — {locale === 'ar' ? 'الجوهر / البذرة' : 'core / seed'}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
