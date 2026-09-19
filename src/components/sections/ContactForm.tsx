'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AlertTriangle, Check, Lock, Send } from 'lucide-react';
import { dataApi } from '@/lib/data/client';
import type { ContactSubmission } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { useSite } from '@/components/system/providers';
import { Button } from '@/components/ui/Button';
import { FormNote, SelectInput, TextArea, TextInput } from '@/components/ui/Field';

/* -------------------------------------------------------------------------
   ContactForm
   -------------------------------------------------------------------------
   Posts to `dataApi.submitContact()`, which targets NEXT_PUBLIC_API_URL when
   set and the local stub otherwise. Field names map 1:1 to the columns of a
   typical `project_briefs` table, so wiring a backend is a single endpoint.

   Validation runs on the client for responsiveness and is mirrored by the
   API; server `fieldErrors` are merged back into the same UI.
   ---------------------------------------------------------------------- */

type Status = 'idle' | 'submitting' | 'success' | 'error';
type Errors = Partial<Record<keyof ContactSubmission, string>>;

const MAX_MESSAGE = 2000;

export function ContactForm({ intent }: { intent?: string }) {
  const { t, locale } = useSite();
  const [values, setValues] = useState<ContactSubmission>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
    locale,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  /* Keep the payload tagged with the active language. */
  useEffect(() => setValues((v) => ({ ...v, locale })), [locale]);

  const set = (key: keyof ContactSubmission) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const projectTypes = t.contact.projectTypes.placeholders;
  const budgets = t.contact.budgets.placeholders;

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t.contact.validation.nameRequired;
    if (!values.email.trim()) next.email = t.contact.validation.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = t.contact.validation.emailInvalid;
    if (!values.message.trim()) next.message = t.contact.validation.messageRequired;
    else if (values.message.trim().length < 20) next.message = t.contact.validation.messageShort;
    return next;
  };

  const canSubmit = useMemo(
    () => Boolean(values.name.trim() && values.email.trim() && values.message.trim().length >= 20),
    [values.name, values.email, values.message],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus('submitting');
    setServerError('');

    const result = await dataApi.submitContact({
      ...values,
      source: intent ?? 'contact-page',
      timestamp: new Date().toISOString(),
    });

    if (result.ok) {
      setStatus('success');
      setValues({ name: '', email: '', company: '', projectType: '', budget: '', message: '', locale });
      window.requestAnimationFrame(() => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    } else {
      setStatus('error');
      setServerError(result.error);
      if (result.fieldErrors) setErrors(result.fieldErrors);
    }
  }

  /* ---------------------------------------------------------- success */
  if (status === 'success') {
    return (
      <div ref={statusRef} className="card relative overflow-hidden p-8 sm:p-12">
        <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 90% at 50% 0%, var(--accent-softer), transparent 66%)' }}
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <span className="relative mb-7 grid size-16 place-items-center">
            <span className="absolute inset-0 rounded-full border border-accent-line animate-pulse-ring" aria-hidden />
            <span className="absolute inset-0 rounded-full border border-accent-line/60" aria-hidden />
            <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
              <Check className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
          </span>

          <h2 className="t-h3 text-fg">{t.contact.successTitle}</h2>
          <p className="t-body mt-4 text-pretty">{t.contact.successBody}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" size="md" onClick={() => setStatus('idle')}>
              {t.contact.successAgain}
            </Button>
          </div>

          <p className="mt-8 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg-subtle">
            نواة · brief received
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- form */
  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card relative overflow-hidden">
      {/* Honeypot — bots fill it, people never see it. */}
      <div className="absolute -start-[9999px] top-0" aria-hidden>
        <label htmlFor="nawa-company-url">Leave this field empty</label>
        <input id="nawa-company-url" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <header className="hairline-b bg-surface-2/40 px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="t-eyebrow mb-3 text-accent">{intent === 'start-a-project' ? t.nav.cta : t.contact.formTitle}</p>
            <h2 className="t-h3 text-fg">{t.contact.formTitle}</h2>
          </div>
          <span className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
            <Lock className="size-3" strokeWidth={1.5} aria-hidden />
            POST /api/nawa/contact
          </span>
        </div>
        <p className="t-small mt-3 max-w-xl">{t.contact.formLede}</p>
      </header>

      <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-8 sm:py-8">
        <TextInput
          name="name"
          label={t.contact.fields.name}
          placeholder={t.contact.fields.namePlaceholder}
          value={values.name}
          onChange={set('name')}
          required
          autoComplete="name"
          error={errors.name}
          requiredLabel={t.contact.required}
          optionalLabel={t.contact.optional}
        />

        <TextInput
          name="email"
          type="email"
          label={t.contact.fields.email}
          placeholder={t.contact.fields.emailPlaceholder}
          value={values.email}
          onChange={set('email')}
          required
          autoComplete="email"
          dir="ltr"
          error={errors.email}
          requiredLabel={t.contact.required}
          optionalLabel={t.contact.optional}
        />

        <TextInput
          name="company"
          label={t.contact.fields.company}
          placeholder={t.contact.fields.companyPlaceholder}
          value={values.company ?? ''}
          onChange={set('company')}
          autoComplete="organization"
          optionalLabel={t.contact.optional}
          error={errors.company}
        />

        <div className="grid gap-6 sm:col-span-1 sm:grid-cols-1">
          <SelectInput
            name="projectType"
            label={t.contact.fields.projectType}
            placeholder={t.contact.fields.projectTypePlaceholder}
            value={values.projectType ?? ''}
            onChange={set('projectType')}
            optionalLabel={t.contact.optional}
            error={errors.projectType}
            hint={t.contact.projectTypes.label}
          >
            <optgroup label={t.contact.projectTypes.label}>
              {projectTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          </SelectInput>
        </div>

        <SelectInput
          name="budget"
          label={t.contact.fields.budget}
          placeholder={t.contact.fields.budgetPlaceholder}
          value={values.budget ?? ''}
          onChange={set('budget')}
          optionalLabel={t.contact.optional}
          error={errors.budget}
          hint={t.contact.budgets.label}
          className="sm:col-span-2"
        >
          <optgroup label={t.contact.budgets.label}>
            {budgets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </optgroup>
        </SelectInput>

        <div className="sm:col-span-2">
          <TextArea
            name="message"
            label={t.contact.fields.message}
            placeholder={t.contact.fields.messagePlaceholder}
            value={values.message}
            onChange={set('message')}
            required
            rows={6}
            maxLength={MAX_MESSAGE}
            error={errors.message}
            requiredLabel={t.contact.required}
            optionalLabel={t.contact.optional}
            counter={
              <span
                className={cn(
                  'font-mono text-[0.625rem] tabular-nums transition-colors duration-300',
                  values.message.length > MAX_MESSAGE * 0.9 ? 'text-accent' : 'text-fg-subtle',
                )}
              >
                {values.message.length}/{MAX_MESSAGE}
              </span>
            }
          />
        </div>
      </div>

      <footer className="hairline-t flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <FormNote className="max-w-sm">
          <span className="mt-1.5 size-1 shrink-0 rotate-45 bg-accent/70" aria-hidden />
          <span>
            {locale === 'ar'
              ? 'يرسل هذا النموذج طلبك إلى نقطة النهاية الخاصة بك. لا تُخزَّن أي بيانات في الواجهة الأمامية.'
              : 'This form posts to your endpoint. Nothing is stored in the frontend.'}
          </span>
        </FormNote>

        <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'} disabled={!canSubmit && status !== 'submitting'} icon={<Send className="size-4" strokeWidth={1.6} aria-hidden />}>
          {status === 'submitting' ? t.contact.submitting : t.contact.submit}
        </Button>
      </footer>

      {/* live region for server-side failures */}
      <div ref={statusRef} aria-live="polite" role="status">
        {status === 'error' && (
          <div className="flex items-start gap-3 border-t border-accent-line bg-accent-softer px-6 py-5 sm:px-8">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.6} aria-hidden />
            <div>
              <p className="text-[0.875rem] font-medium text-fg">{t.contact.errorTitle}</p>
              <p className="mt-1 text-[0.8125rem] text-fg-muted">
                {serverError || t.contact.errorBody}
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
