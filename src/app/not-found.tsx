import Link from 'next/link';
import { ROUTES } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import { CoreField } from '@/components/graphics/CoreField';

/**
 * 404 — the core, unattached.
 * Kept server-rendered and dependency-free so it always paints.
 */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-[var(--shell-gutter)] py-24 text-center">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 60% at 50% 40%, var(--accent-softer), transparent 70%)' }}
        aria-hidden
      />

      <div className="pointer-events-none absolute size-[min(90vw,34rem)] opacity-25" aria-hidden>
        <CoreField reducedDetail />
      </div>

      <div className="relative flex max-w-xl flex-col items-center">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.28em] text-accent">Error 404</span>

        <h1 className="mt-7 text-balance text-fg" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1.02, letterSpacing: '-0.03em' }}>
          This page does not exist.
        </h1>

        <p className="t-lede mt-6 max-w-md text-pretty">
          The link may be old, or the route may not have been built yet.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={ROUTES.home} variant="primary" size="md">
            Back to home
          </ButtonLink>
          <ButtonLink href={ROUTES.work} variant="secondary" size="md">
            Explore Our Work
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {[
            { href: ROUTES.services, label: 'Services' },
            { href: ROUTES.about, label: 'About' },
            { href: ROUTES.process, label: 'Process' },
            { href: ROUTES.contact, label: 'Contact' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="link-quiet text-[0.8125rem] text-fg-muted">
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-14 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-fg-subtle/70">نواة · the core</p>
      </div>
    </section>
  );
}
