import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { DataResult } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

/* -------------------------------------------------------------------------
   AsyncSection — the three-state contract.
   -----------------------------------------------------------------------
   Every dynamic section on the site renders through this component:

       result.status === 'loading'  →  your skeleton
       result.status === 'empty'    →  your empty state
       result.status === 'error'    →  a recoverable error surface
       result.status === 'ready'    →  children(data)

   Nothing is hardcoded and nothing is faked: the section only ever shows
   what the data layer resolved to.
   ---------------------------------------------------------------------- */

export function AsyncSection<T>({
  result,
  loading,
  empty,
  error,
  children,
  className,
  labelledBy,
}: {
  result: DataResult<T>;
  loading: ReactNode;
  empty: ReactNode;
  error?: ReactNode;
  children: (data: T[], result: DataResult<T>) => ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <div className={cn('relative', className)} aria-labelledby={labelledBy}>
      {result.source === 'preview' && <PreviewRibbon />}

      {result.status === 'loading' && <LoadingWrap>{loading}</LoadingWrap>}

      {result.status === 'error' && (error ?? <DefaultError message={result.error} />)}

      {result.status === 'empty' && empty}

      {result.status === 'ready' && children(result.data, result)}
    </div>
  );
}

function LoadingWrap({ children }: { children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="relative">
      {children}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function DefaultError({ message, onRetryHref }: { message?: string; onRetryHref?: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-accent-line/60 bg-accent-softer px-6 py-12 text-center">
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
        <span className="grid size-11 place-items-center rounded-full border border-accent-line bg-accent-soft text-accent">
          <AlertTriangle className="size-5" strokeWidth={1.5} aria-hidden />
        </span>
        <h3 className="t-h4 text-fg">This section could not reach its data source.</h3>
        {message && <p className="font-mono text-[0.6875rem] break-all text-fg-subtle">{message}</p>}
        {onRetryHref && (
          <ButtonLink href={onRetryHref} variant="secondary" size="sm" icon={<RefreshCw className="size-3.5" strokeWidth={1.75} aria-hidden />}>
            Try again
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

/** Stamps preview-fixture output so it can never be mistaken for real data. */
export function PreviewRibbon({ className }: { className?: string }) {
  return (
    <div className={cn('mb-4 flex items-center gap-3', className)}>
      <span className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
        </span>
        Preview data — not company content
      </span>
      <span className="h-px flex-1 bg-line-subtle" aria-hidden />
    </div>
  );
}

/** Fallback empty state for collections that have no bespoke copy. */
export function GenericEmpty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return <EmptyState title={title} body={body} actions={action} />;
}
