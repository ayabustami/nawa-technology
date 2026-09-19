import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'accent' | 'outline' | 'solid' | 'muted';

const TONES: Record<BadgeTone, string> = {
  neutral: 'border-line bg-surface-2 text-fg-muted',
  accent: 'border-accent-line bg-accent-soft text-accent',
  outline: 'border-line-strong bg-transparent text-fg',
  solid: 'border-transparent bg-accent-solid text-accent-contrast',
  muted: 'border-transparent bg-transparent text-fg-subtle',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
  mono = true,
  dot = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  mono?: boolean;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 leading-none whitespace-nowrap',
        mono ? 'font-mono text-[0.625rem] uppercase' : 'text-[0.75rem]',
        mono && 'tracking-[0.1em]',
        TONES[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/** Small technical tag used for stack / technology chips. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xs border border-line bg-surface-2/70 px-2 py-1 font-mono text-[0.625rem] tracking-[0.06em] text-fg-muted transition-colors duration-300 hover:border-line-strong hover:text-fg',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Two-column definition row — used in case-study metadata. */
export function MetaRow({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-6 border-b border-line-subtle py-3 last:border-b-0', className)}>
      <dt className="t-eyebrow shrink-0">{label}</dt>
      <dd className="text-end text-[0.875rem] text-fg">{value}</dd>
    </div>
  );
}
