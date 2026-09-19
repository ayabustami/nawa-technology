import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { NawaGlyph } from '@/components/graphics/NawaMark';

/* -------------------------------------------------------------------------
   CTASection — the closing statement used at the end of every page.
   ---------------------------------------------------------------------- */

export function CTASection({
  eyebrow,
  title,
  body,
  primaryLabel,
  secondaryLabel,
  primaryHref = '/contact?intent=start-a-project',
  secondaryHref = '/work',
  className,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section className={cn('relative isolate overflow-hidden', className)} aria-labelledby="cta-title">
      <div className="nawa-shell">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border border-line bg-bg-elevated',
            compact ? 'px-6 py-14 sm:px-12' : 'px-6 py-16 sm:px-12 sm:py-24',
          )}
        >
          {/* ambient field */}
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(70% 110% at 82% 8%, var(--accent-softer), transparent 62%)' }}
            aria-hidden
          />
          <div className="pointer-events-none absolute -top-24 -end-16 size-72 text-accent/25 opacity-70 animate-orbit" aria-hidden>
            <NawaGlyph />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-line)] to-transparent" aria-hidden />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            {eyebrow && (
              <Reveal>
                <span className="t-eyebrow mb-6 inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-line-strong" aria-hidden />
                  {eyebrow}
                  <span className="h-px w-8 bg-line-strong" aria-hidden />
                </span>
              </Reveal>
            )}

            <Reveal delay={70}>
              <h2 id="cta-title" className={cn('text-balance text-fg', compact ? 't-h2' : 't-display-sm')}>
                {title}
              </h2>
            </Reveal>

            {body && (
              <Reveal delay={130}>
                <p className="t-lede mt-6 max-w-xl text-pretty">{body}</p>
              </Reveal>
            )}

            <Reveal delay={190} className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <ButtonLink href={primaryHref} variant="primary" size="lg" arrow="up-right" className="w-full sm:w-auto">
                {primaryLabel}
              </ButtonLink>
              {secondaryLabel && secondaryHref && (
                <ButtonLink href={secondaryHref} variant="secondary" size="lg" className="w-full sm:w-auto">
                  {secondaryLabel}
                </ButtonLink>
              )}
            </Reveal>

            <Reveal delay={250}>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg-subtle transition-colors duration-300 hover:text-accent"
              >
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                </span>
                نواة · awaiting your brief
                <ArrowUpRight className="size-3 rtl:-scale-x-100" strokeWidth={1.6} aria-hidden />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
