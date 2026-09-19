import { cn } from '@/lib/utils';

/**
 * AbstractCover
 * -------------------------------------------------------------------------
 * NAWA does not use stock photography. When a database record has no
 * `coverImage`, this renders a deterministic, generative technical visual
 * derived from the record's slug — so every card looks intentional and
 * distinct without a single fabricated photo.
 *
 * Three patterns: `core` (concentric seed rings), `field` (dot matrix with
 * radial falloff) and `strata` (hairline sediment bands). The pattern is
 * chosen from the seed unless you pass one explicitly.
 */

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Small deterministic PRNG so the same seed always draws the same art. */
function rng(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return Math.abs(state % 100000) / 100000;
  };
}

export type CoverPattern = 'core' | 'field' | 'strata';

const PATTERNS: CoverPattern[] = ['core', 'field', 'strata'];

export function patternFor(seed: string): CoverPattern {
  return PATTERNS[hash(seed) % PATTERNS.length];
}

function CorePattern({ seed }: { seed: string }) {
  const r = rng(seed);
  const cx = 150 + r() * 100;
  const cy = 100 + r() * 100;
  const rings = 5 + Math.floor(r() * 3);
  const accentRing = 1 + Math.floor(r() * (rings - 1));
  const tilt = -34 + r() * 22;

  return (
    <g transform={`rotate(${tilt} 200 150)`}>
      {Array.from({ length: rings }, (_, i) => {
        const size = 34 + i * 30;
        const isAccent = i === accentRing;
        return (
          <rect
            key={i}
            x={cx - size / 2}
            y={cy - size / 2}
            width={size}
            height={size}
            rx={size * 0.22}
            fill="none"
            stroke={isAccent ? 'var(--accent)' : 'var(--fg)'}
            strokeOpacity={isAccent ? 0.75 : 0.09 + (rings - i) * 0.028}
            strokeWidth={isAccent ? 1.2 : 0.8}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={5.5} fill="var(--accent)" fillOpacity={0.9} />
      <circle cx={cx} cy={cy} r={13} fill="none" stroke="var(--accent)" strokeOpacity={0.25} strokeWidth={0.8} />
    </g>
  );
}

function FieldPattern({ seed }: { seed: string }) {
  const r = rng(seed);
  const fx = 90 + r() * 220;
  const fy = 70 + r() * 160;
  const step = 20;
  const dots: { x: number; y: number; rad: number; op: number }[] = [];

  for (let x = step / 2; x < 400; x += step) {
    for (let y = step / 2; y < 300; y += step) {
      const d = Math.hypot(x - fx, y - fy);
      const falloff = Math.max(0, 1 - d / 230);
      if (falloff <= 0.02) continue;
      dots.push({
        x,
        y,
        rad: 0.7 + falloff * 2.4,
        op: 0.08 + falloff * 0.62,
      });
    }
  }

  return (
    <g>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.rad}
          fill={d.op > 0.5 ? 'var(--accent)' : 'var(--fg)'}
          fillOpacity={d.op > 0.5 ? d.op * 0.85 : Math.min(1, d.op * 1.25)}
        />
      ))}
      <circle cx={fx} cy={fy} r={26} fill="none" stroke="var(--accent)" strokeOpacity={0.3} strokeWidth={0.9} />
      <circle cx={fx} cy={fy} r={52} fill="none" stroke="var(--fg)" strokeOpacity={0.07} strokeWidth={0.9} />
    </g>
  );
}

function StrataPattern({ seed }: { seed: string }) {
  const r = rng(seed);
  const gapStart = 90 + Math.floor(r() * 90);
  const gapHeight = 26 + Math.floor(r() * 34);
  const accentY = gapStart + gapHeight / 2;
  const lines: { y: number; op: number }[] = [];

  for (let y = 10; y < 300; y += 9) {
    const inGap = y > gapStart && y < gapStart + gapHeight;
    lines.push({ y, op: inGap ? 0.04 : 0.075 + Math.abs(Math.sin(y / 26)) * 0.095 });
  }

  return (
    <g>
      {lines.map((l, i) => (
        <line key={i} x1={0} x2={400} y1={l.y} y2={l.y} stroke="var(--fg)" strokeOpacity={l.op} strokeWidth={0.9} />
      ))}
      <line x1={0} x2={400} y1={accentY} y2={accentY} stroke="var(--accent)" strokeOpacity={0.62} strokeWidth={1.3} />
      <line x1={0} x2={400} y1={gapStart} y2={gapStart} stroke="var(--accent)" strokeOpacity={0.18} strokeWidth={0.8} />
      <line x1={0} x2={400} y1={gapStart + gapHeight} y2={gapStart + gapHeight} stroke="var(--accent)" strokeOpacity={0.18} strokeWidth={0.8} />
    </g>
  );
}

export function AbstractCover({
  seed,
  pattern,
  className,
  grid = true,
  vignette = true,
  animated = true,
}: {
  seed: string;
  pattern?: CoverPattern;
  className?: string;
  grid?: boolean;
  vignette?: boolean;
  animated?: boolean;
}) {
  const chosen = pattern ?? patternFor(seed);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-bg-deep',
        animated && 'transition-transform duration-[900ms] ease-[var(--ease-expo)]',
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className={cn('absolute inset-0 size-full', animated && 'animate-drift')}
      >
        {grid && (
          <g stroke="var(--fg)" strokeOpacity={0.028} strokeWidth={0.6}>
            {Array.from({ length: 17 }, (_, i) => (
              <line key={`v${i}`} x1={i * 25} x2={i * 25} y1={0} y2={300} />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`h${i}`} x1={0} x2={400} y1={i * 25} y2={i * 25} />
            ))}
          </g>
        )}
        {chosen === 'core' && <CorePattern seed={seed} />}
        {chosen === 'field' && <FieldPattern seed={seed} />}
        {chosen === 'strata' && <StrataPattern seed={seed} />}
      </svg>

      {vignette && (
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 100% at 50% 0%, transparent 38%, var(--bg) 108%)' }}
        />
      )}
    </div>
  );
}

/** A small square variant used for avatars, service tiles and the dev panel. */
export function AbstractTile({ seed, className, pattern }: { seed: string; className?: string; pattern?: CoverPattern }) {
  return <AbstractCover seed={seed} pattern={pattern ?? 'core'} grid={false} className={cn('aspect-square', className)} />;
}
