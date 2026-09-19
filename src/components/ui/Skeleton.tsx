import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------
   Skeleton — the LOADING state.
   Shapes mirror the real components exactly, so the transition from
   skeleton → content never reflows the page.
   ---------------------------------------------------------------------- */

export function Skeleton({
  className,
  rounded = 'rounded-xs',
  style,
}: {
  className?: string;
  rounded?: string;
  style?: React.CSSProperties;
}) {
  return <div className={cn('skeleton', rounded, className)} style={style} aria-hidden />;
}

/** Stacked text bars. `widths` are percentages, cycled to fill `lines`. */
export function SkeletonText({
  lines = 3,
  className,
  widths = [100, 94, 82],
  gap = 'gap-2.5',
  height = 'h-3',
}: {
  lines?: number;
  className?: string;
  widths?: number[];
  gap?: string;
  height?: string;
}) {
  return (
    <div className={cn('flex flex-col', gap)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn(height, 'block')} style={{ width: `${widths[i % widths.length]}%` }} />
      ))}
    </div>
  );
}

/** Free-form skeleton block that accepts inline sizing. */
export function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <Skeleton className={className} style={style} />;
}

export function SkeletonCard({
  variant = 'service',
  className,
}: {
  variant?: 'service' | 'project' | 'testimonial' | 'value' | 'step';
  className?: string;
}) {
  if (variant === 'project') {
    return (
      <div className={cn('card overflow-hidden', className)} aria-hidden>
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
        <div className="space-y-3 p-5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'step') {
    return (
      <div className={cn('flex gap-5 border-t border-line pt-6', className)} aria-hidden>
        <Skeleton className="h-8 w-10 shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    );
  }

  if (variant === 'testimonial') {
    return (
      <div className={cn('card p-6', className)} aria-hidden>
        <Skeleton className="mb-5 h-4 w-8" />
        <div className="space-y-3">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-3/5" />
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'value') {
    return (
      <div className={cn('border-t border-line pt-5', className)} aria-hidden>
        <Skeleton className="mb-4 h-2.5 w-8" />
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
      </div>
    );
  }

  return (
    <div className={cn('card p-6', className)} aria-hidden>
      <div className="mb-6 flex items-start justify-between gap-4">
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="h-2.5 w-8" />
      </div>
      <Skeleton className="mb-3 h-4 w-2/3" />
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 3,
  variant = 'service',
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
  className,
}: {
  count?: number;
  variant?: 'service' | 'project' | 'testimonial' | 'value' | 'step';
  columns?: string;
  className?: string;
}) {
  return (
    <div
      className={cn('grid gap-5', columns)}
      role="status"
      aria-live="polite"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}
