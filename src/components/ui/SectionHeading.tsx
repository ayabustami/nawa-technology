import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

/* -------------------------------------------------------------------------
   SectionHeading — the editorial header used by every section.
   Hairline rule on top, monospace index + eyebrow, large title, lede, and an
   optional action anchored to the opposite side of the grid.
   ---------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  index,
  title,
  lede,
  action,
  align = 'start',
  className,
  titleClassName,
  rule = true,
  titleAs: TitleTag = 'h2',
  size = 'md',
  id,
  children,
}: {
  id?: string;
  eyebrow?: ReactNode;
  index?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
  titleClassName?: string;
  rule?: boolean;
  titleAs?: 'h1' | 'h2' | 'h3';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}) {
  const centered = align === 'center';

  return (
    <header className={cn(rule && 'hairline-t pt-6 sm:pt-8', className)}>
      <div
        className={cn(
          'grid gap-x-10 gap-y-6',
          centered ? 'justify-items-center text-center' : 'lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end',
        )}
      >
        <div className={cn('max-w-3xl', centered && 'mx-auto')}>
          {(eyebrow || index) && (
            <Reveal className="mb-5 flex items-center gap-4">
              {index && <span className="t-num text-accent">{index}</span>}
              {index && <span className="h-px w-8 bg-line-strong" aria-hidden />}
              {eyebrow && <span className="t-eyebrow">{eyebrow}</span>}
            </Reveal>
          )}

          <Reveal delay={60}>
            <TitleTag
              id={id}
              className={cn(
                'text-balance text-fg',
                size === 'lg' ? 't-h1' : size === 'sm' ? 't-h3' : 't-h2',
                titleClassName,
              )}
            >
              {title}
            </TitleTag>
          </Reveal>

          {lede && (
            <Reveal delay={120}>
              <p className={cn('t-lede mt-5 max-w-2xl text-pretty', centered && 'mx-auto')}>{lede}</p>
            </Reveal>
          )}

          {children}
        </div>

        {action && (
          <Reveal delay={160} className={cn('lg:pb-2', centered && 'mt-2')}>
            {action}
          </Reveal>
        )}
      </div>
    </header>
  );
}

/** Simple eyebrow + rule divider used between sub-sections. */
export function SubRule({ label, className }: { label: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="t-eyebrow whitespace-nowrap">{label}</span>
      <span className="rule flex-1" aria-hidden />
    </div>
  );
}
