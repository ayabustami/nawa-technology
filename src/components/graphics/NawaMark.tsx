import { cn } from '@/lib/utils';

/**
 * The NAWA mark — نواة rendered as a nucleus.
 * A solid core held by two elliptical orbits inside a hairline frame.
 * Pure SVG, inherits `currentColor`, scales to any size.
 */
export function NawaGlyph({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-full', className)}
      {...props}
    >
      {/* frame */}
      <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="7" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />
      {/* orbits */}
      <ellipse cx="16" cy="16" rx="11.4" ry="5.1" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.15" transform="rotate(-32 16 16)" />
      <ellipse cx="16" cy="16" rx="11.4" ry="5.1" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.15" transform="rotate(58 16 16)" />
      {/* the core */}
      <circle cx="16" cy="16" r="3.6" fill="currentColor" />
      <circle cx="16" cy="16" r="6.1" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.9" />
    </svg>
  );
}

export function NawaMark({
  className,
  glyphClassName,
  showWordmark = true,
  showSub = true,
  arabicMark,
  size = 'md',
}: {
  className?: string;
  glyphClassName?: string;
  showWordmark?: boolean;
  showSub?: boolean;
  arabicMark?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const glyph = size === 'lg' ? 'size-11' : size === 'sm' ? 'size-6' : 'size-8';

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span className={cn('relative inline-grid place-items-center text-fg', glyph, glyphClassName)}>
        <NawaGlyph />
      </span>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="flex items-baseline gap-2">
            <span
              className={cn(
                'font-medium tracking-[-0.02em] text-fg',
                size === 'lg' ? 'text-[1.4rem]' : size === 'sm' ? 'text-[0.95rem]' : 'text-[1.06rem]',
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              NAWA
            </span>
            {showSub && (
              <span
                className={cn(
                  't-eyebrow text-fg-subtle',
                  size === 'lg' ? 'text-[0.62rem]' : 'text-[0.55rem]',
                )}
              >
                Technology
              </span>
            )}
          </span>
          {arabicMark && size !== 'sm' && (
            <span className="mt-1 text-[0.66rem] leading-none tracking-[0.12em] text-accent" dir="rtl">
              {arabicMark}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
