import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------
   EmptyState — the signature "nothing here yet" surface.
   -----------------------------------------------------------------------
   Every dynamic section on the site renders this when the database returns
   no records. It is deliberately composed (core glyph, corner ticks, hairline
   frame, grid field) so an empty page reads as *designed* rather than broken.
   ---------------------------------------------------------------------- */

/** The NAWA nucleus, drawn as a waiting core: dashed orbit + soft pulse. */
export function CoreWaitingGlyph({ className }: { className?: string }) {
  return (
    <span className={cn('relative grid size-20 place-items-center', className)} aria-hidden>
      <span className="absolute inset-0 rounded-full border border-dashed border-line-strong animate-orbit" />
      <span className="absolute inset-2.5 rounded-full border border-line animate-orbit-rev" />
      <span className="absolute size-6 rounded-full bg-accent/15 animate-pulse-ring" />
      <span className="relative size-2.5 rounded-full bg-accent shadow-[0_0_22px_2px_var(--accent-soft)]" />
      <svg viewBox="0 0 80 80" className="absolute inset-0 size-full text-accent" fill="none">
        <ellipse cx="40" cy="40" rx="30" ry="12" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.9" transform="rotate(-28 40 40)" />
        <ellipse cx="40" cy="40" rx="30" ry="12" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.9" transform="rotate(62 40 40)" />
      </svg>
    </span>
  );
}

export function EmptyState({
  title,
  body,
  actions,
  label,
  className,
  glyph = true,
  compact = false,
  variant = 'framed',
}: {
  title: string;
  body?: string;
  actions?: React.ReactNode;
  /** Small monospace label above the title, e.g. the collection name. */
  label?: string;
  className?: string;
  glyph?: boolean;
  compact?: boolean;
  variant?: 'framed' | 'plain';
}) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        variant === 'framed' && 'rounded-lg border border-line bg-bg-elevated/60',
        compact ? 'px-6 py-10' : 'px-6 py-16 sm:px-10 sm:py-20',
        className,
      )}
    >
      {variant === 'framed' && (
        <>
          <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(80% 60% at 50% 0%, var(--accent-softer), transparent 70%)' }}
            aria-hidden
          />
          <CornerTicks />
        </>
      )}

      <div className={cn('relative mx-auto flex max-w-xl flex-col items-center text-center', compact && 'max-w-md')}>
        {glyph && <CoreWaitingGlyph className="mb-8" />}

        {label && (
          <span
            className="mb-4 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase text-fg-subtle"
            style={{ letterSpacing: 'var(--tracking-eyebrow)' }}
          >
            <span className="h-px w-6 bg-line-strong" aria-hidden />
            {label}
            <span className="h-px w-6 bg-line-strong" aria-hidden />
          </span>
        )}

        <h3 className={cn('text-fg text-balance', compact ? 't-h4' : 't-h3')}>{title}</h3>

        {body && <p className={cn('mt-3 text-pretty text-fg-muted', compact ? 't-small' : 't-body')}>{body}</p>}

        {actions && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>}

        <p className="mt-8 font-mono text-[0.625rem] uppercase text-fg-subtle/70" style={{ letterSpacing: 'var(--tracking-eyebrow)' }}>
          نواة · awaiting records
        </p>
      </div>
    </div>
  );
}

function CornerTicks() {
  const s = { width: 12, height: 12 };
  return (
    <span className="pointer-events-none absolute inset-3 sm:inset-4" aria-hidden>
      <span className="absolute top-0 left-0 border-t border-l border-accent-line" style={s} />
      <span className="absolute top-0 right-0 border-t border-r border-accent-line" style={s} />
      <span className="absolute bottom-0 left-0 border-b border-l border-accent-line" style={s} />
      <span className="absolute right-0 bottom-0 border-r border-b border-accent-line" style={s} />
    </span>
  );
}

/** Inline empty row — for small slots like "no technologies listed". */
export function EmptyInline({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-[0.8125rem] text-fg-subtle italic', className)}>
      <span className="h-px w-4 bg-line-strong" aria-hidden />
      {children}
    </span>
  );
}
