import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------
   Card — composable surface used by services, projects, values and more.
   ---------------------------------------------------------------------- */

export function Card({
  children,
  className,
  interactive = false,
  glow = true,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  as?: 'div' | 'article' | 'li' | 'section';
}) {
  return (
    <Tag
      className={cn(
        'card isolate overflow-hidden',
        interactive && 'card-interactive',
        glow && 'edge-glow',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5 sm:p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('hairline-t flex items-center justify-between gap-4 px-5 py-4 sm:px-6', className)}>{children}</div>;
}

export function CardTitle({ children, className, as: Tag = 'h3' }: { children: ReactNode; className?: string; as?: 'h2' | 'h3' | 'h4' }) {
  return <Tag className={cn('t-h4 text-fg text-balance', className)}>{children}</Tag>;
}

/**
 * Numbered index chip — the "01 / 02 / 03" motif used across process steps,
 * values and service cards.
 */
export function IndexChip({ value, className, tone = 'default' }: { value: string; className?: string; tone?: 'default' | 'accent' }) {
  return (
    <span
      className={cn(
        'font-mono text-[0.6875rem] leading-none tracking-[0.1em] tabular-nums',
        tone === 'accent' ? 'text-accent' : 'text-fg-subtle',
        className,
      )}
    >
      {value}
    </span>
  );
}

/** Hairline-separated definition list — case studies, service detail pages. */
export function SpecList({ items, className }: { items: { label: ReactNode; value: ReactNode }[]; className?: string }) {
  if (!items.length) return null;
  return (
    <dl className={cn('divide-y divide-[var(--line-subtle)] border-y border-line-subtle', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="t-eyebrow shrink-0">{item.label}</dt>
          <dd className="text-end text-[0.875rem] text-fg">{item.value || <span className="text-fg-subtle">—</span>}</dd>
        </div>
      ))}
    </dl>
  );
}
