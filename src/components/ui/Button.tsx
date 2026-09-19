import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { cn, isExternalUrl } from '@/lib/utils';

/* -------------------------------------------------------------------------
   Button — one component, four variants, three sizes.
   Renders <button>, <Link> or <a> depending on the props it is given.
   ---------------------------------------------------------------------- */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-sm font-medium whitespace-nowrap select-none transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-nawa)] disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 active:translate-y-px';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-solid text-accent-contrast hover:bg-accent-hover shadow-[0_12px_34px_-18px_var(--accent-solid)]',
  secondary: 'border border-line-strong text-fg hover:border-accent-line hover:bg-accent-softer',
  ghost: 'text-fg-muted hover:text-fg hover:bg-surface-2',
  'accent-outline': 'border border-accent-line text-accent hover:bg-accent-soft hover:border-accent',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem] tracking-[-0.005em]',
  md: 'h-11 px-5 text-[0.875rem] tracking-[-0.008em]',
  lg: 'h-[3.25rem] px-7 text-[0.9375rem] tracking-[-0.01em]',
};

/** Light sweep that runs across `primary` on hover. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.22)_50%,transparent_80%)] transition-transform duration-[750ms] ease-[var(--ease-expo)] group-hover/btn:translate-x-full"
    />
  );
}

function Arrow({ dir }: { dir: 'forward' | 'up-right' }) {
  const Icon = dir === 'up-right' ? ArrowUpRight : ArrowUpRight;
  return (
    <span className="relative inline-grid place-items-center transition-transform duration-300 ease-[var(--ease-nawa)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:group-hover/btn:-translate-x-0.5 rtl:-scale-x-100">
      <Icon className="size-[1.05em]" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  arrow?: boolean | 'forward' | 'up-right';
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
};

function classes({ variant = 'secondary', size = 'md', fullWidth, className }: CommonProps) {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);
}

export function Button({
  variant,
  size,
  loading = false,
  arrow = false,
  icon,
  fullWidth,
  className,
  children,
  disabled,
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className'>) {
  return (
    <button
      className={classes({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {variant === 'primary' && <Sheen />}
      <span className="relative inline-flex items-center gap-2.5">
        {loading ? <Loader2 className="size-[1.05em] animate-spin" strokeWidth={1.75} aria-hidden /> : icon}
        {children}
        {arrow && !loading && <Arrow dir={arrow === true ? 'up-right' : arrow} />}
      </span>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  arrow = false,
  icon,
  fullWidth,
  className,
  children,
  href,
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'href'> & { href: string }) {
  const content = (
    <>
      {variant === 'primary' && <Sheen />}
      <span className="relative inline-flex items-center gap-2.5">
        {icon}
        {children}
        {arrow && <Arrow dir={arrow === true ? 'up-right' : arrow} />}
      </span>
    </>
  );

  if (isExternalUrl(href)) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes({ variant, size, fullWidth, className })}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes({ variant, size, fullWidth, className })} {...rest}>
      {content}
    </Link>
  );
}

/** Text-only inline action with an animated underline + arrow. */
export function QuietLink({
  href,
  children,
  className,
  arrow = true,
  ...rest
}: { href: string; children: ReactNode; arrow?: boolean; className?: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'>) {
  const inner = (
    <span className="inline-flex items-center gap-1.5">
      {children}
      {arrow && (
        <ArrowUpRight
          className="size-3.5 transition-transform duration-300 ease-[var(--ease-nawa)] group-hover/q:translate-x-0.5 group-hover/q:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/q:-translate-x-0.5"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </span>
  );

  const cls = cn(
    'group/q relative inline-flex items-center text-[0.8125rem] font-medium text-fg transition-colors duration-300 hover:text-accent',
    "after:absolute after:inset-inline-start-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[var(--ease-nawa)] after:content-[''] after:rtl:origin-right hover:after:scale-x-100",
    className,
  );

  if (isExternalUrl(href)) {
    return (
      <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
