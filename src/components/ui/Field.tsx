'use client';

import { useId, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------
   Form fields — label, control, hint, error. All four states styled.
   The contact form composes these; every field maps to one DB column.
   ---------------------------------------------------------------------- */

const CONTROL =
  'w-full rounded-sm border bg-surface-2/50 px-4 text-[0.9375rem] text-fg transition-[border-color,background-color,box-shadow] duration-300 ease-[var(--ease-nawa)] placeholder:text-fg-subtle/80 hover:border-line-strong focus:border-accent-line focus:bg-surface-2 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';

export function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required,
  optionalLabel,
  requiredLabel,
  children,
  className,
  labelAside,
}: {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optionalLabel?: string;
  requiredLabel?: string;
  children: ReactNode;
  className?: string;
  labelAside?: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className="font-mono text-[0.6875rem] uppercase text-fg-muted"
          style={{ letterSpacing: 'var(--tracking-eyebrow)' }}
        >
          {label}
          {required && <span className="ms-1 text-accent">*</span>}
        </label>

        <span className="flex items-center gap-2">
          {labelAside}
          {required ? (
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle/70">{requiredLabel}</span>
          ) : optionalLabel ? (
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle/70">{optionalLabel}</span>
          ) : null}
        </span>
      </div>

      {children}

      {error ? (
        <p role="alert" className="flex items-start gap-1.5 text-[0.75rem] text-accent">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.75rem] text-fg-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  error,
  required,
  optionalLabel,
  requiredLabel,
  className,
  ...rest
}: { label: ReactNode; hint?: ReactNode; error?: ReactNode; optionalLabel?: string; requiredLabel?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = rest.id ?? autoId;
  return (
    <FieldShell label={label} htmlFor={id} hint={hint} error={error} required={required} optionalLabel={optionalLabel} requiredLabel={requiredLabel}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL, 'h-12', error && 'border-accent-line', !error && 'border-line', className)}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextArea({
  label,
  hint,
  error,
  required,
  optionalLabel,
  requiredLabel,
  className,
  counter,
  ...rest
}: { label: ReactNode; hint?: ReactNode; error?: ReactNode; optionalLabel?: string; requiredLabel?: string; counter?: ReactNode } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const id = rest.id ?? autoId;
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      optionalLabel={optionalLabel}
      requiredLabel={requiredLabel}
      labelAside={counter}
    >
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL, 'min-h-36 resize-y py-3.5 leading-relaxed', error && 'border-accent-line', !error && 'border-line', className)}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectInput({
  label,
  hint,
  error,
  required,
  optionalLabel,
  requiredLabel,
  className,
  children,
  placeholder,
  ...rest
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optionalLabel?: string;
  requiredLabel?: string;
  placeholder?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const autoId = useId();
  const id = rest.id ?? autoId;
  const hasValue = Boolean(rest.value);

  return (
    <FieldShell label={label} htmlFor={id} hint={hint} error={error} required={required} optionalLabel={optionalLabel} requiredLabel={requiredLabel}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            CONTROL,
            'h-12 appearance-none pe-11',
            error && 'border-accent-line',
            !error && 'border-line',
            !hasValue && 'text-fg-subtle/80',
            className,
          )}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 end-3.5 grid place-items-center text-fg-subtle" aria-hidden>
          <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </FieldShell>
  );
}

/** Compact inline note used under the form (privacy, API target, etc.). */
export function FormNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('flex items-start gap-2.5 text-[0.75rem] leading-relaxed text-fg-subtle', className)}>{children}</p>;
}
