'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, ROUTES } from '@/lib/site';
import { cn } from '@/lib/utils';
import { NawaMark } from '@/components/graphics/NawaMark';
import { ButtonLink } from '@/components/ui/Button';
import { useSite } from '@/components/system/providers';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';

/* -------------------------------------------------------------------------
   Header — fixed, scroll-aware.
   Transparent over the hero, then condenses into a hairline-bordered bar
   with a soft backdrop once the page moves. The active route carries an
   accent rule; hovering any item previews it.
   ---------------------------------------------------------------------- */

export function Header() {
  const pathname = usePathname();
  const { t, preview } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const labels: Record<string, string> = {
    home: t.nav.home,
    services: t.nav.services,
    work: t.nav.work,
    about: t.nav.about,
    contact: t.nav.contact,
    process: t.nav.process,
    styleGuide: t.nav.styleGuide,
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:inset-inline-start-3 focus:z-[100] focus:rounded-sm focus:border focus:border-accent-line focus:bg-surface focus:px-4 focus:py-2 focus:text-[0.8125rem] focus:text-fg"
      >
        {t.nav.skipToContent}
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-[var(--ease-nawa)]',
          scrolled || open
            ? 'border-b border-line bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <ScrollProgress />

        <div
          className={cn(
            'nawa-shell flex items-center justify-between gap-4 transition-[height] duration-500 ease-[var(--ease-nawa)]',
            scrolled ? 'h-[3.75rem]' : 'h-[var(--header-h)]',
          )}
        >
          <Link
            href={ROUTES.home}
            className="group/logo -ms-1.5 flex shrink-0 items-center rounded-xs px-1.5 py-1"
            aria-label={t.a11y.logoHome}
          >
            <NawaMark
              arabicMark={t.brand.arabicMark}
              className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/logo:scale-[1.02]"
            />
          </Link>

          <nav aria-label={t.a11y.mainNavigation} className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group/nav relative px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.005em] transition-colors duration-300',
                    active ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {labels[item.key]}
                  <span
                    className={cn(
                      'absolute inset-x-3.5 -bottom-px h-px origin-center transition-[transform,background-color] duration-500 ease-[var(--ease-expo)]',
                      active ? 'scale-x-100 bg-accent' : 'scale-x-0 bg-line-strong group-hover/nav:scale-x-100',
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {preview !== 'live' && (
              <span className="hidden items-center gap-1.5 rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent md:inline-flex">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                </span>
                {t.dev.badge}
              </span>
            )}

            <LanguageSwitcher className="hidden sm:flex" />

            <ButtonLink href={`${ROUTES.contact}?intent=start-a-project`} variant="primary" size="sm" className="hidden lg:inline-flex">
              {t.nav.cta}
            </ButtonLink>

            <MenuButton open={open} onClick={() => setOpen((v) => !v)} label={open ? t.nav.closeMenu : t.nav.openMenu} />
          </div>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}

function MenuButton({ open, onClick, label }: { open: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className={cn(
        'grid size-10 place-items-center rounded-sm border transition-colors duration-300 lg:hidden',
        open ? 'border-transparent text-fg' : 'border-line text-fg hover:border-line-strong hover:bg-surface-2',
      )}
    >
      <span className="relative block size-4" aria-hidden>
        <span
          className={cn(
            'absolute inset-x-0 h-px bg-current transition-all duration-500 ease-[var(--ease-nawa)]',
            open ? 'top-[7.5px] rotate-45' : 'top-[3px]',
          )}
        />
        <span
          className={cn(
            'absolute inset-x-0 top-[7.5px] h-px bg-current transition-opacity duration-200',
            open && 'opacity-0',
          )}
        />
        <span
          className={cn(
            'absolute inset-x-0 h-px bg-current transition-all duration-500 ease-[var(--ease-nawa)]',
            open ? 'top-[7.5px] -rotate-45' : 'top-[12px]',
          )}
        />
      </span>
    </button>
  );
}

/** 1px accent scroll-progress line, painted above the header rule. */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden" aria-hidden>
      <div
        className="h-full origin-left bg-accent rtl:origin-right"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
