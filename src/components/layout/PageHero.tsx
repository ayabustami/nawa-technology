import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';
import { NawaGlyph } from '@/components/graphics/NawaMark';

/* -------------------------------------------------------------------------
   PageHero — the interior page opener.
   Deliberately quieter than the home hero: an eyebrow, an editorial title,
   a lede, an optional metadata strip and an optional abstract field.
   ---------------------------------------------------------------------- */

export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  meta,
  children,
  className,
  size = 'md',
  visual = true,
  align = 'start',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  meta?: { label: ReactNode; value: ReactNode }[];
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  visual?: boolean;
  align?: 'start' | 'center';
}) {
  return (
    <section className={cn('relative isolate overflow-hidden border-b border-line', className)}>
      {visual && (
        <>
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(78% 100% at 88% -10%, var(--accent-softer), transparent 62%)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -top-32 -end-24 size-[26rem] text-accent/[0.09] animate-orbit"
            aria-hidden
          >
            <NawaGlyph />
          </div>
        </>
      )}

      <div className="nawa-shell relative">
        <div
          className={cn(
            'flex flex-col',
            size === 'lg' ? 'pb-16 pt-32 sm:pb-20 sm:pt-44' : size === 'sm' ? 'pb-10 pt-24 sm:pb-12 sm:pt-32' : 'pb-12 pt-28 sm:pb-16 sm:pt-40',
            align === 'center' && 'items-center text-center',
          )}
        >
          {eyebrow && (
            <Reveal className={cn('mb-6 flex items-center gap-4', align === 'center' && 'justify-center')}>
              <span className="size-1.5 rotate-45 bg-accent" aria-hidden />
              <span className="h-px w-8 bg-line-strong" aria-hidden />
              <span className="t-eyebrow">{eyebrow}</span>
            </Reveal>
          )}

          <Reveal delay={70} className={cn('w-full', align === 'center' && 'mx-auto max-w-4xl')}>
            <h1 className={cn('text-balance text-fg', size === 'lg' ? 't-display-sm' : size === 'sm' ? 't-h2' : 't-h1')}>{title}</h1>
          </Reveal>

          {lede && (
            <Reveal delay={130} className={cn('mt-6 max-w-2xl', align === 'center' && 'mx-auto')}>
              <p className="t-lede text-pretty">{lede}</p>
            </Reveal>
          )}

          {actions && (
            <Reveal delay={190} className={cn('mt-9 flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
              {actions}
            </Reveal>
          )}

          {children}

          {meta && meta.length > 0 && (
            <Reveal delay={240} className="mt-12 w-full">
              <dl className="grid grid-cols-2 border-s border-t border-line sm:grid-cols-4">
                {meta.map((item, i) => (
                  <div key={i} className="border-e border-b border-line px-4 py-4 sm:px-5">
                    <dt className="t-eyebrow mb-2">{item.label}</dt>
                    <dd className="text-[0.875rem] text-fg">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
