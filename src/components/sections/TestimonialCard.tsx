import type { Locale, Testimonial } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { Card } from '@/components/ui/Card';
import { AbstractTile } from '@/components/graphics/AbstractCover';
import Image from 'next/image';

export function TestimonialCard({ testimonial, locale }: { testimonial: Testimonial; locale: Locale }) {
  const quote = tv(testimonial.quote, locale);
  const name = tv(testimonial.authorName, locale);
  const role = tv(testimonial.authorRole, locale);
  const org = tv(testimonial.organisation, locale);

  return (
    <Card interactive as="article" className="flex h-full flex-col p-6 sm:p-7">
      <figure className="flex h-full flex-col">
      <span className="mb-6 block text-[2.5rem] leading-[0.6] font-light text-accent/60" aria-hidden>
        &ldquo;
      </span>

      <blockquote className="flex-1">
        <p className="text-[0.9375rem] leading-relaxed text-fg text-pretty">{quote}</p>
      </blockquote>

      <figcaption className="hairline-t mt-7 flex items-center gap-3.5 pt-5">
        <span className="relative size-10 shrink-0 overflow-hidden rounded-full border border-line">
          {testimonial.avatar?.src ? (
            <Image src={testimonial.avatar.src} alt={name} fill sizes="40px" className="object-cover" />
          ) : (
            <AbstractTile seed={testimonial.id ?? name} className="size-full" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[0.875rem] font-medium text-fg">{name}</span>
          <span className="block truncate text-[0.75rem] text-fg-subtle">
            {[role, org].filter(Boolean).join(' · ')}
          </span>
        </span>
      </figcaption>
      </figure>
    </Card>
  );
}

export function TestimonialSlots({ count = 3, labels }: { count?: number; labels: { testimonial: string; marker: string } }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="flex h-full flex-col p-6 sm:p-7">
          <span className="mb-6 block text-[2.5rem] leading-[0.6] font-light text-fg-subtle/40" aria-hidden>
            &ldquo;
          </span>
          <p className="flex-1 text-[0.9375rem] leading-relaxed text-fg-subtle">{labels.testimonial}</p>
          <div className="hairline-t mt-7 flex items-center gap-3.5 pt-5">
            <span className="size-10 shrink-0 rounded-full border border-dashed border-line-strong" aria-hidden />
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle">{labels.marker}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
