'use client';

import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { NAV, ROUTES } from '@/lib/site';
import { cn, indexLabel } from '@/lib/utils';
import { useSite } from '@/components/system/providers';
import { NawaGlyph } from '@/components/graphics/NawaMark';
import { LanguageSwitcher } from './LanguageSwitcher';

/* -------------------------------------------------------------------------
   MobileNav — a full-screen sheet, not a shrunken desktop bar.
   Large editorial links with monospace indices, staggered entrance, and the
   primary CTA pinned to the bottom so it is always within thumb reach.
   ---------------------------------------------------------------------- */

export function MobileNav({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const { t, locale } = useSite();

  const labels: Record<string, string> = {
    home: t.nav.home,
    services: t.nav.services,
    work: t.nav.work,
    about: t.nav.about,
    contact: t.nav.contact,
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      {/* scrim */}
      <div
        className={cn(
          'absolute inset-0 bg-[var(--overlay)] backdrop-blur-md transition-opacity duration-500 ease-[var(--ease-nawa)]',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      {/* sheet */}
      <nav
        aria-label={t.a11y.mobileNavigation}
        className={cn(
          'absolute inset-0 flex flex-col bg-bg transition-[transform,opacity] duration-[600ms] ease-[var(--ease-expo)]',
          open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
        )}
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{ background: 'radial-gradient(90% 100% at 50% 0%, var(--accent-softer), transparent 70%)' }}
          aria-hidden
        />

        <div className="relative flex h-[3.75rem] shrink-0 items-center justify-between border-b border-line px-[var(--shell-gutter)]">
          <span className="t-eyebrow">{t.nav.menu}</span>
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher size="sm" />
            <button
              type="button"
              onClick={onClose}
              aria-label={t.nav.closeMenu}
              className="grid size-9 place-items-center rounded-sm border border-line text-fg transition-colors duration-300 hover:border-line-strong hover:bg-surface-2"
            >
              <X className="size-4" strokeWidth={1.6} aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-[var(--shell-gutter)] py-8">
          <ul className="flex flex-col">
            {NAV.map((item, i) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.key} className="hairline-b">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-center justify-between gap-4 py-5 transition-[padding,opacity] duration-500 ease-[var(--ease-expo)] active:ps-2"
                    style={{
                      transitionDelay: open ? `${120 + i * 55}ms` : '0ms',
                      opacity: open ? 1 : 0,
                      transform: open ? 'none' : 'translateY(10px)',
                    }}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={cn('t-num w-6 shrink-0', active ? 'text-accent' : 'text-fg-subtle')}>
                        {locale === 'ar' ? indexLabel(i + 1).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]) : indexLabel(i + 1)}
                      </span>
                      <span
                        className={cn(
                          'text-[1.75rem] leading-tight font-medium tracking-[-0.02em] transition-colors duration-300 sm:text-[2.1rem]',
                          active ? 'text-accent' : 'text-fg group-hover:text-accent',
                        )}
                        style={{ letterSpacing: locale === 'ar' ? '0em' : '-0.02em' }}
                      >
                        {labels[item.key]}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-fg-subtle transition-all duration-400 ease-[var(--ease-nawa)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href={ROUTES.process}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="link-quiet text-[0.875rem] text-fg-muted"
            >
              {t.nav.process}
            </Link>
            <span className="h-3 w-px bg-line-strong" aria-hidden />
            <Link
              href={ROUTES.styleGuide}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="link-quiet text-[0.875rem] text-fg-muted"
            >
              {t.nav.styleGuide}
            </Link>
          </div>
        </div>

        <div className="relative shrink-0 border-t border-line px-[var(--shell-gutter)] py-6">
          <Link
            href={`${ROUTES.contact}?intent=start-a-project`}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="group flex items-center justify-between gap-4 rounded-sm bg-accent-solid px-5 py-4 text-accent-contrast transition-colors duration-300 hover:bg-accent-hover"
          >
            <span className="text-[0.9375rem] font-medium">{t.nav.cta}</span>
            <span className="grid size-8 place-items-center rounded-full border border-[color-mix(in_oklab,var(--accent-contrast)_28%,transparent)] transition-transform duration-400 ease-[var(--ease-nawa)] group-hover:rotate-45">
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
          </Link>

          <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-fg-subtle">
            <span className="size-1.5 text-accent" aria-hidden>
              <NawaGlyph />
            </span>
            {t.brand.meaningShort}
          </p>
        </div>
      </nav>
    </div>
  );
}
