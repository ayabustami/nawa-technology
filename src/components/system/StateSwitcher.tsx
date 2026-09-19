'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Database, Moon, RotateCcw, SlidersHorizontal, Sun, X } from 'lucide-react';
import { PREVIEW_STATES, type PreviewState, type ThemeName } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSite } from './providers';
import { NawaGlyph } from '@/components/graphics/NawaMark';

/* -------------------------------------------------------------------------
   StateSwitcher — developer only.
   -----------------------------------------------------------------------
   Lets you look at LOADING, EMPTY and POPULATED without touching code.
   It writes a cookie and calls router.refresh() so the server components
   re-resolve through `resolveCollection()`.

   The shipped site defaults to `live`, which renders real API data or the
   designed empty state. Set NEXT_PUBLIC_ENABLE_STATE_PREVIEW=false to remove
   this panel from the production bundle entirely.
   ---------------------------------------------------------------------- */

const STATE_COPY: Record<PreviewState, { en: [string, string]; ar: [string, string] }> = {
  live: {
    en: ['Live', 'Fetch from the API and render whatever it returns.'],
    ar: ['حيّ', 'اجلب من واجهة البرمجة واعرض ما تُعيده.'],
  },
  loading: {
    en: ['Loading', 'Hold every dynamic section in its skeleton state.'],
    ar: ['تحميل', 'أبقِ كل قسم ديناميكي في حالة الهيكل العظمي.'],
  },
  empty: {
    en: ['Empty', 'Force the designed empty states.'],
    ar: ['فارغ', 'افرِض الحالات الفارغة المصمَّمة.'],
  },
  populated: {
    en: ['Populated', 'Render generic preview fixtures — not company content.'],
    ar: ['مكتمل', 'اعرض بيانات معاينة عامة — وليست محتوى الشركة.'],
  },
};

export function StateSwitcher({ apiConfigured }: { apiConfigured: boolean }) {
  const router = useRouter();
  const { preview, setPreview, theme, setTheme, locale, t } = useSite();
  const [open, setOpen] = useState(false);

  /* Cmd/Ctrl + Shift + D */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const apply = useCallback(
    (next: PreviewState) => {
      setPreview(next);
      router.refresh();
    },
    [setPreview, router],
  );

  const applyTheme = useCallback(
    (next: ThemeName) => {
      setTheme(next);
    },
    [setTheme],
  );

  return (
    <>
      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.dev.close : t.dev.open}
        className={cn(
          'fixed bottom-5 z-[70] grid size-11 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-expo)]',
          'end-5',
          preview === 'live'
            ? 'border-line bg-surface/90 text-fg-subtle backdrop-blur-md hover:border-line-strong hover:text-fg'
            : 'border-accent-line bg-accent-soft text-accent backdrop-blur-md shadow-[var(--shadow-accent)]',
          open && 'rotate-90',
        )}
      >
        {preview === 'live' && !open ? (
          <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden />
        ) : (
          <span className="size-4">
            <NawaGlyph />
          </span>
        )}
      </button>

      {/* panel */}
      <div
        className={cn(
          'fixed bottom-20 z-[70] w-[min(21rem,calc(100vw-2.5rem))] origin-bottom transition-all duration-400 ease-[var(--ease-expo)]',
          'end-5',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
        role="dialog"
        aria-label={t.dev.panelTitle}
        aria-hidden={!open}
      >
        <div className="overflow-hidden rounded-lg border border-line bg-[color-mix(in_oklab,var(--surface)_94%,transparent)] shadow-[var(--shadow-lg)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="size-3.5 text-accent" aria-hidden>
                <NawaGlyph />
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg">{t.dev.panelTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.dev.close}
              className="grid size-6 place-items-center rounded-xs text-fg-subtle transition-colors hover:text-fg"
            >
              <X className="size-3.5" strokeWidth={1.6} aria-hidden />
            </button>
          </div>

          <div className="px-4 py-4">
            <p className="mb-4 text-[0.6875rem] leading-relaxed text-fg-subtle">{t.dev.panelHint}</p>

            <div className="flex flex-col gap-1.5">
              {PREVIEW_STATES.map((state) => {
                const [label, hint] = STATE_COPY[state][locale === 'ar' ? 'ar' : 'en'];
                const active = preview === state;
                return (
                  <button
                    key={state}
                    type="button"
                    onClick={() => apply(state)}
                    aria-pressed={active}
                    className={cn(
                      'group flex items-start gap-3 rounded-sm border px-3 py-2.5 text-start transition-all duration-300 ease-[var(--ease-nawa)]',
                      active
                        ? 'border-accent-line bg-accent-soft'
                        : 'border-transparent hover:border-line hover:bg-surface-2',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-1 grid size-3 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                        active ? 'border-accent' : 'border-line-strong',
                      )}
                      aria-hidden
                    >
                      {active && <span className="size-1.5 rounded-full bg-accent" />}
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block text-[0.8125rem] font-medium', active ? 'text-accent' : 'text-fg')}>{label}</span>
                      <span className="mt-0.5 block text-[0.6875rem] leading-relaxed text-fg-subtle">{hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-4 h-px bg-line-subtle" aria-hidden />

            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-fg-subtle">{t.dev.themeLabel}</span>
              <div className="flex items-center rounded-sm border border-line bg-surface-2/60 p-0.5">
                {(['obsidian', 'bone'] as ThemeName[]).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => applyTheme(name)}
                    aria-pressed={theme === name}
                    className={cn(
                      'grid size-7 place-items-center rounded-[3px] transition-colors duration-300',
                      theme === name ? 'bg-surface-3 text-accent' : 'text-fg-subtle hover:text-fg',
                    )}
                    title={name === 'obsidian' ? t.nav.themeDark : t.nav.themeLight}
                    aria-label={name === 'obsidian' ? t.nav.themeDark : t.nav.themeLight}
                  >
                    {name === 'obsidian' ? <Moon className="size-3.5" strokeWidth={1.5} aria-hidden /> : <Sun className="size-3.5" strokeWidth={1.5} aria-hidden />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-sm border border-line bg-surface-2/40 px-3 py-2.5">
              <Database className={cn('mt-px size-3.5 shrink-0', apiConfigured ? 'text-accent' : 'text-fg-subtle')} strokeWidth={1.5} aria-hidden />
              <span className="text-[0.6875rem] leading-relaxed text-fg-subtle">
                {apiConfigured ? t.dev.apiConnected : t.dev.apiNotConnected}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                apply('live');
                applyTheme('obsidian');
              }}
              className="mt-4 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle transition-colors duration-300 hover:text-accent"
            >
              <RotateCcw className="size-3" strokeWidth={1.6} aria-hidden />
              {t.dev.reset}
            </button>
          </div>

          <div className="border-t border-line bg-surface-2/40 px-4 py-2.5">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle/70">⌘ ⇧ D</p>
          </div>
        </div>
      </div>
    </>
  );
}
