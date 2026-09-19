'use client';

import { cn } from '@/lib/utils';

/**
 * CoreField — نواة as an instrument.
 * A nucleus held by precessing orbits, crosshair ticks and concentric
 * measuring rings. Pure SVG + CSS animation, so it costs nothing at runtime
 * and scales to any container.
 */
export function CoreField({ className, reducedDetail = false }: { className?: string; reducedDetail?: boolean }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={cn('size-full', className)} aria-hidden="true">
      <defs>
        <radialGradient id="nawa-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.38" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.09" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nawa-ring-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* ambient glow */}
      <circle cx="200" cy="200" r="185" fill="url(#nawa-core-glow)" />

      {/* measuring rings */}
      <circle cx="200" cy="200" r="188" stroke="var(--fg)" strokeOpacity="0.07" strokeWidth="0.9" />
      <circle cx="200" cy="200" r="150" stroke="url(#nawa-ring-fade)" strokeWidth="0.9" strokeDasharray="2 7" />
      <circle cx="200" cy="200" r="112" stroke="var(--fg)" strokeOpacity="0.06" strokeWidth="0.9" />
      <circle cx="200" cy="200" r="74" stroke="var(--fg)" strokeOpacity="0.05" strokeWidth="0.9" />

      {!reducedDetail && (
        <g stroke="var(--fg)" strokeOpacity="0.055" strokeWidth="0.7">
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i * Math.PI) / 18;
            const inner = i % 3 === 0 ? 150 : 176;
            return (
              <line
                key={i}
                x1={200 + Math.cos(a) * inner}
                y1={200 + Math.sin(a) * inner}
                x2={200 + Math.cos(a) * 188}
                y2={200 + Math.sin(a) * 188}
              />
            );
          })}
        </g>
      )}

      {/* crosshair ticks */}
      <g stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1">
        <line x1="200" y1="6" x2="200" y2="26" />
        <line x1="200" y1="374" x2="200" y2="394" />
        <line x1="6" y1="200" x2="26" y2="200" />
        <line x1="374" y1="200" x2="394" y2="200" />
      </g>

      {/* orbit A */}
      <g className="animate-orbit" style={{ transformOrigin: '200px 200px' }}>
        <g transform="rotate(-28 200 200)">
          <ellipse cx="200" cy="200" rx="163" ry="62" stroke="var(--fg)" strokeOpacity="0.16" strokeWidth="1" />
          <circle cx="363" cy="200" r="4" fill="var(--accent)" />
          <circle cx="363" cy="200" r="9" fill="var(--accent)" fillOpacity="0.16" />
        </g>
      </g>

      {/* orbit B */}
      <g className="animate-orbit-rev" style={{ transformOrigin: '200px 200px' }}>
        <g transform="rotate(62 200 200)">
          <ellipse cx="200" cy="200" rx="140" ry="50" stroke="var(--fg)" strokeOpacity="0.11" strokeWidth="1" />
          <circle cx="60" cy="200" r="3" fill="var(--fg)" fillOpacity="0.5" />
        </g>
      </g>

      {/* orbit C — the accent one */}
      <g className="animate-orbit" style={{ transformOrigin: '200px 200px', animationDuration: '26s' }}>
        <g transform="rotate(14 200 200)">
          <ellipse cx="200" cy="200" rx="98" ry="98" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="0.9" strokeDasharray="1 6" />
          <circle cx="298" cy="200" r="2.6" fill="var(--accent)" fillOpacity="0.85" />
        </g>
      </g>

      {/* the nucleus */}
      <g>
        <circle cx="200" cy="200" r="34" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="0.9" />
        <circle cx="200" cy="200" r="24" fill="var(--accent)" fillOpacity="0.09" />
        <circle cx="200" cy="200" r="13" fill="var(--accent)" />
        <circle cx="200" cy="200" r="13" stroke="var(--bg)" strokeOpacity="0.35" strokeWidth="0.6" />
        <circle cx="200" cy="200" r="20" className="animate-pulse-ring" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1" style={{ transformOrigin: '200px 200px' }} />
      </g>

      {/* corner registration marks */}
      <g stroke="var(--fg)" strokeOpacity="0.18" strokeWidth="1">
        <path d="M28 44V28h16" />
        <path d="M372 44V28h-16" />
        <path d="M28 356v16h16" />
        <path d="M372 356v16h-16" />
      </g>
    </svg>
  );
}

/** Compact version used behind section headings and in the CTA. */
export function CoreFieldMini({ className }: { className?: string }) {
  return <CoreField className={className} reducedDetail />;
}
