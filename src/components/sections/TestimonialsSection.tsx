import type { DataResult, Locale, Testimonial } from '@/lib/data/types';
import type { Dictionary } from '@/lib/i18n';
import { AsyncSection } from './AsyncSection';
import { TestimonialCard } from './TestimonialCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonGrid } from '@/components/ui/Skeleton';

/* -------------------------------------------------------------------------
   Testimonials — always database-driven. Quotes are never written by hand
   in the frontend, so an unpopulated collection shows a designed empty
   state rather than fabricated praise.
   ---------------------------------------------------------------------- */

export function TestimonialsSection({
  result,
  t,
  locale,
  className,
  id = 'testimonials-title',
}: {
  result: DataResult<Testimonial>;
  t: Dictionary;
  locale: Locale;
  className?: string;
  id?: string;
}) {
  return (
    <section className={className} aria-labelledby={id}>
      <div className="nawa-shell">
      <SectionHeading
        id={id}
        eyebrow={t.testimonials.eyebrow}
        title={t.testimonials.title}
        lede={t.testimonials.lede}
        className="mb-12"
      />

      <AsyncSection
        result={result}
        loading={<SkeletonGrid count={3} variant="testimonial" />}
        empty={<EmptyState label={t.testimonials.eyebrow} title={t.empty.testimonials.title} body={t.empty.testimonials.body} />}
      >
        {(items) => (
          <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="h-full">
                <TestimonialCard testimonial={item} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </AsyncSection>
      </div>
    </section>
  );
}
