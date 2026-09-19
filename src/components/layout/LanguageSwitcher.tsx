'use client';

import { LOCALE_META } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSite } from '@/components/system/providers';

/** Segmented EN / ع control. Writes the cookie and flips <html dir>. */
export function LanguageSwitcher({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const { locale, setLocale, t } = useSite();

  return (
    <div
      className={cn('relative flex items-center rounded-sm border border-line bg-surface-2/50 p-0.5', className)}
      role="group"
      aria-label={t.a11y.languageSwitcher}
    >
      <span
        className={cn(
          'absolute inset-y-0.5 w-[calc(50%-0.125rem)] rounded-[3px] bg-surface-3 transition-transform duration-500 ease-[var(--ease-nawa)]',
          locale === 'ar' ? 'translate-x-full rtl:-translate-x-full' : 'translate-x-0',
        )}
        style={{ insetInlineStart: '0.125rem' }}
        aria-hidden
      />
      {(['en', 'ar'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          title={LOCALE_META[code].label}
          className={cn(
            'relative z-10 font-mono uppercase transition-colors duration-300',
            size === 'sm' ? 'px-2 py-1 text-[0.625rem]' : 'px-2.5 py-1.5 text-[0.6875rem]',
            locale === code ? 'text-accent' : 'text-fg-subtle hover:text-fg',
          )}
          style={{ letterSpacing: '0.1em' }}
        >
          {code === 'ar' ? 'ع' : 'EN'}
        </button>
      ))}
    </div>
  );
}
