'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/site';
import { cn } from '@/lib/utils';
import { useSite } from '@/components/system/providers';
import { ButtonLink } from '@/components/ui/Button';
import { SlotMarker } from '@/components/ui/Slot';
import { CoreField } from '@/components/graphics/CoreField';

/* -------------------------------------------------------------------------
   Hero — "Build what's next."
   Two masked headline lines, a supporting content slot, the two primary
   CTAs, and the نواة instrument drifting behind it with pointer parallax.
   ---------------------------------------------------------------------- */

export function Hero() {
  const { t, locale } = useSite();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  /* Pointer parallax — throttled to animation frames, disabled on touch. */
  useEffect(() => {
    const section = sectionRef.current;
    const field = fieldRef.current;
    if (!section || !field) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const loop = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      field.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      frame = Math.abs(targetX - x) > 0.05 || Math.abs(targetY - y) > 0.05 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 34;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 26;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    section.addEventListener('pointermove', onMove);
    return () => {
      section.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const line1 = t.home.hero.headlineLine1;
  const line2 = t.home.hero.headlineLine2;
  const trailingPeriod = line2.endsWith('.') || line2.endsWith('۔');
  const line2Body = trailingPeriod ? line2.slice(0, -1) : line2;

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* field ---------------------------------------------------------- */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(90% 70% at 78% 12%, var(--accent-softer), transparent 58%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 60% at 8% 96%, var(--accent-softer), transparent 62%)' }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" aria-hidden />

      {/* the nucleus ---------------------------------------------------- */}
      <div
        ref={fieldRef}
        className={cn(
          'pointer-events-none absolute will-change-transform',
          // mobile: a quiet presence behind the type
          '-end-[26%] top-[6%] size-[min(112vw,26rem)] opacity-[0.34]',
          // tablet
          'sm:-end-[14%] sm:top-[10%] sm:size-[min(80vw,34rem)] sm:opacity-45',
          // desktop: the right-hand column
          'lg:end-[2%] lg:top-1/2 lg:size-[min(46vw,40rem)] lg:-translate-y-1/2 lg:opacity-100',
        )}
        aria-hidden
      >
        <CoreField />
      </div>

      {/* content -------------------------------------------------------- */}
      <div className="nawa-shell relative flex flex-1 flex-col justify-center pb-28 pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="max-w-4xl">
          {/* eyebrow */}
          <div
            className={cn(
              'mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 transition-all duration-700 ease-[var(--ease-expo)] sm:mb-10',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
            )}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-accent-line bg-accent-soft px-3 py-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                {t.brand.arabicMark}
              </span>
            </span>
            <span className="t-eyebrow">{t.home.hero.eyebrow}</span>
            <span className="hidden h-px w-10 bg-line-strong sm:block" aria-hidden />
            <span className="hidden t-eyebrow text-fg-subtle/80 sm:block">{t.brand.tagline}</span>
          </div>

          {/* headline */}
          <h1 id="hero-title" className="t-display text-fg">
            <MaskLine mounted={mounted} delay={90}>
              {line1}
            </MaskLine>
            <MaskLine mounted={mounted} delay={230}>
              <span>
                {line2Body}
                <span className="text-accent">{trailingPeriod ? line2.slice(-1) : ''}</span>
              </span>
            </MaskLine>
          </h1>

          {/* accent rule that draws itself in */}
          <div className="mt-8 h-px w-full max-w-md overflow-hidden bg-line-subtle sm:mt-10">
            <div
              className="h-full origin-left bg-accent transition-transform duration-[1400ms] ease-[var(--ease-expo)] rtl:origin-right"
              style={{ transform: mounted ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: '520ms' }}
              aria-hidden
            />
          </div>

          {/* supporting slot */}
          <div
            className={cn(
              'mt-8 max-w-xl transition-all duration-[900ms] ease-[var(--ease-expo)] sm:mt-9',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
            style={{ transitionDelay: '430ms' }}
          >
            <SlotMarker label={t.slots.marker} className="mb-3" tone="accent" />
            <p className="t-lede text-pretty">{t.home.hero.supporting}</p>
          </div>

          {/* CTAs */}
          <div
            className={cn(
              'mt-10 flex flex-col gap-3 transition-all duration-[900ms] ease-[var(--ease-expo)] sm:mt-12 sm:flex-row sm:items-center sm:gap-4',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
            style={{ transitionDelay: '560ms' }}
          >
            <ButtonLink href={`${ROUTES.contact}?intent=start-a-project`} variant="primary" size="lg" arrow="up-right" className="w-full sm:w-auto">
              {t.home.hero.primaryCta}
            </ButtonLink>
            <ButtonLink href={ROUTES.work} variant="secondary" size="lg" className="w-full sm:w-auto">
              {t.home.hero.secondaryCta}
            </ButtonLink>
          </div>

          {/* status slot */}
          <div
            className={cn(
              'mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 transition-all duration-[900ms] ease-[var(--ease-expo)] sm:mt-14',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
            style={{ transitionDelay: '680ms' }}
          >
            <span className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-line-strong" aria-hidden />
              <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-fg-subtle">
                {t.home.hero.statusLabelPending}
              </span>
            </span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden />
            <Link
              href={ROUTES.about}
              className="group/meaning inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.06em] text-fg-muted transition-colors duration-300 hover:text-accent"
            >
              {t.brand.meaningShort}
              <ArrowUpRight
                className="size-3.5 transition-transform duration-400 ease-[var(--ease-nawa)] group-hover/meaning:translate-x-0.5 group-hover/meaning:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/meaning:-translate-x-0.5"
                strokeWidth={1.6}
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>

      {/* scroll cue ------------------------------------------------------ */}
      <div className="nawa-shell relative pb-7">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative block h-9 w-px overflow-hidden bg-line-strong" aria-hidden>
              <span
                className={cn(
                  'absolute inset-x-0 top-0 h-4 bg-accent transition-transform duration-[1600ms] ease-[var(--ease-expo)]',
                  mounted ? 'translate-y-9' : '-translate-y-4',
                )}
                style={{ transitionDelay: '900ms' }}
              />
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-fg-subtle">
              {t.home.hero.scrollHint}
            </span>
          </div>

          <span className="hidden items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg-subtle/70 md:flex">
            {locale === 'ar' ? 'نواة' : 'nawa'} <span className="text-accent">·</span> {locale === 'ar' ? 'الجوهر' : 'the core'}
          </span>
        </div>
      </div>

      <a href="#main" className="sr-only">
        <ArrowDown aria-hidden />
      </a>
    </section>
  );
}

function MaskLine({ children, mounted, delay }: { children: React.ReactNode; mounted: boolean; delay: number }) {
  return (
    <span className="line-mask" data-visible={mounted} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      <span>{children}</span>
    </span>
  );
}
