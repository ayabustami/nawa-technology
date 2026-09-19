import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------
   Slot — a clearly marked content placeholder.
   -----------------------------------------------------------------------
   Used wherever the site needs *structure* but the words belong to your
   database. Renders a small monospace marker plus neutral copy, so nobody
   ever mistakes it for real company content and nobody mistakes it for a
   bug either.
   ---------------------------------------------------------------------- */

export function SlotMarker({
  label,
  className,
  tone = 'default',
}: {
  label: string;
  className?: string;
  tone?: 'default' | 'accent';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[0.625rem] leading-none uppercase whitespace-nowrap',
        tone === 'accent' ? 'text-accent' : 'text-fg-subtle',
        className,
      )}
      style={{ letterSpacing: 'var(--tracking-eyebrow)' }}
    >
      <span
        aria-hidden
        className={cn('size-[5px] rotate-45 border', tone === 'accent' ? 'border-accent bg-accent/40' : 'border-line-strong bg-transparent')}
      />
      {label}
    </span>
  );
}

export function Slot({
  label,
  children,
  as: Tag = 'p',
  className,
  markerClassName,
  tone = 'default',
  marker = true,
}: {
  label: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  markerClassName?: string;
  tone?: 'default' | 'accent';
  marker?: boolean;
}) {
  return (
    <span className="block">
      {marker && <SlotMarker label={label} tone={tone} className={cn('mb-2.5', markerClassName)} />}
      <Tag className={cn('text-fg-muted', className)}>{children}</Tag>
    </span>
  );
}

/** Hairline rules that show the *volume* of copy a slot is designed to hold. */
export function SlotRules({
  lines = 3,
  className,
  widths,
}: {
  lines?: number;
  className?: string;
  widths?: number[];
}) {
  const defaults = [100, 96, 88, 92, 74, 82, 66];
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="block h-px bg-line-subtle"
          style={{ width: `${(widths?.[i] ?? defaults[i % defaults.length])}%` }}
        />
      ))}
    </div>
  );
}

/** A dashed container for a media slot (image / embed that isn't in the DB yet). */
export function SlotBox({
  label,
  children,
  className,
  aspect = 'aspect-[16/10]',
}: {
  label: string;
  children?: ReactNode;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-lg border border-dashed border-line-strong bg-bg-deep/60 p-6 text-center',
        aspect,
        className,
      )}
    >
      <div className="bg-hatch pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative flex flex-col items-center gap-3">
        <SlotMarker label={label} tone="accent" />
        {children}
      </div>
      <CornerTicks />
    </div>
  );
}

/** Technical-drawing corner marks. Purely decorative. */
export function CornerTicks({ className, length = 10 }: { className?: string; length?: number }) {
  const s = { width: length, height: length };
  return (
    <span className={cn('pointer-events-none absolute inset-2', className)} aria-hidden>
      <span className="absolute top-0 left-0 border-t border-l border-accent-line" style={s} />
      <span className="absolute top-0 right-0 border-t border-r border-accent-line" style={s} />
      <span className="absolute bottom-0 left-0 border-b border-l border-accent-line" style={s} />
      <span className="absolute right-0 bottom-0 border-r border-b border-accent-line" style={s} />
    </span>
  );
}
