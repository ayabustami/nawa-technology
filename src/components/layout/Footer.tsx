'use client';

import Link from 'next/link';
import { ArrowUp, ArrowUpRight, Moon, Sun } from 'lucide-react';
import { NAV, ROUTES } from '@/lib/site';
import { cn } from '@/lib/utils';
import { NawaGlyph, NawaMark } from '@/components/graphics/NawaMark';
import { useSite } from '@/components/system/providers';
import { SlotMarker } from '@/components/ui/Slot';
import { LanguageSwitcher } from './LanguageSwitcher';

/* -------------------------------------------------------------------------
   Footer — brand statement, navigation index, and honest gaps.
   Anything that would normally hold a fabricated detail (social links,
   office address, phone) is rendered as a marked slot until your database
   supplies it.
   ---------------------------------------------------------------------- */

export function Footer() {
  const { t, locale, theme, toggleTheme } = useSite();
  const year = new Date().getFullYear();

  const navLabels: Record<string, string> = {
    home: t.nav.home,
    services: t.nav.services,
    work: t.nav.work,
    about: t.nav.about,
    contact: t.nav.contact,
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-bg-deep">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-line)] to-transparent"
        aria-hidden
      />

      <div className="nawa-shell relative">
        {/* Brand row */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20 lg:py-20">
          <div>
            <NawaMark size="lg" arabicMark={t.brand.arabicMark} />
            <p className="mt-7 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">{t.footer.brandLine}</p>
            <p className="mt-4 max-w-md text-[0.8125rem] leading-relaxed text-fg-subtle">{t.brand.meaning}</p>

            <Link
              href={`${ROUTES.contact}?intent=start-a-project`}
              className="group/cta mt-9 inline-flex items-center gap-3 rounded-sm border border-line-strong px-5 py-3.5 text-[0.875rem] font-medium text-fg transition-all duration-400 ease-[var(--ease-nawa)] hover:border-accent-line hover:bg-accent-softer hover:text-accent"
            >
              {t.nav.cta}
              <span className="grid size-6 place-items-center rounded-full border border-line transition-all duration-400 group-hover/cta:border-accent-line group-hover/cta:rotate-45">
                <ArrowUpRight className="size-3.5 rtl:-scale-x-100" strokeWidth={1.6} aria-hidden />
              </span>
            </Link>
          </div>

          {/* Index columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title={t.footer.navigate}>
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="link-quiet text-[0.875rem] text-fg-muted">
                    {navLabels[item.key]}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title={t.footer.company}>
              <li>
                <Link href={ROUTES.process} className="link-quiet text-[0.875rem] text-fg-muted">
                  {t.nav.process}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.about} className="link-quiet text-[0.875rem] text-fg-muted">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.styleGuide} className="link-quiet text-[0.875rem] text-fg-muted">
                  {t.nav.styleGuide}
                </Link>
              </li>
            </FooterColumn>

            <FooterColumn title={t.footer.connect}>
              <li>
                <SlotMarker label={t.slots.marker} className="mb-2" />
                <p className="text-[0.8125rem] leading-relaxed text-fg-subtle">{t.slots.socialLinks}</p>
              </li>
            </FooterColumn>
          </div>
        </div>

        {/* Oversized wordmark — the editorial signature */}
        <div className="relative select-none overflow-hidden" aria-hidden>
          <div
            className="whitespace-nowrap text-center leading-[0.78] font-medium text-transparent"
            style={{
              fontSize: 'clamp(4.5rem, 19vw, 17rem)',
              letterSpacing: locale === 'ar' ? '0em' : '-0.045em',
              WebkitTextStroke: '1px var(--line-strong)',
            }}
          >
            NAWA
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--bg-deep)] to-transparent" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] tracking-[0.04em] text-fg-subtle">
            © {year} {t.meta.titleSuffix}. {t.footer.rights}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="flex items-center gap-4">
              <span className="text-[0.75rem] text-fg-subtle/70 line-through decoration-line-strong decoration-dashed">
                {t.footer.privacy}
              </span>
              <span className="text-[0.75rem] text-fg-subtle/70 line-through decoration-line-strong decoration-dashed">
                {t.footer.terms}
              </span>
            </span>

            <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden />

            <LanguageSwitcher size="sm" />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.a11y.themeSwitcher}
              title={theme === 'obsidian' ? t.nav.themeLight : t.nav.themeDark}
              className="grid size-8 place-items-center rounded-sm border border-line text-fg-subtle transition-colors duration-300 hover:border-line-strong hover:text-accent"
            >
              {theme === 'obsidian' ? <Sun className="size-3.5" strokeWidth={1.5} aria-hidden /> : <Moon className="size-3.5" strokeWidth={1.5} aria-hidden />}
            </button>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group/top inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle transition-colors duration-300 hover:text-accent"
            >
              {t.footer.backToTop}
              <ArrowUp className="size-3 transition-transform duration-400 ease-[var(--ease-nawa)] group-hover/top:-translate-y-0.5" strokeWidth={1.6} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* The nucleus, resting at the base of the page */}
      <span className="pointer-events-none absolute -bottom-24 -start-24 size-64 text-accent/[0.07] animate-orbit" aria-hidden>
        <NawaGlyph />
      </span>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="t-eyebrow mb-5">{title}</p>
      <ul className={cn('flex list-none flex-col gap-3')}>{children}</ul>
    </div>
  );
}
