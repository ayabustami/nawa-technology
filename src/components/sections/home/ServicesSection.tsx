import type { DataResult, Locale, Service } from '@/lib/data/types';
import type { Dictionary } from '@/lib/i18n';
import { ROUTES } from '@/lib/site';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink, QuietLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonGrid } from '@/components/ui/Skeleton';

export function HomeServices({
  result,
  t,
  locale,
}: {
  result: DataResult<Service>;
  t: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="nawa-section relative isolate border-t border-line" aria-labelledby="home-services-title">
      <div className="nawa-shell">
        <SectionHeading
          id="home-services-title"
          eyebrow={t.home.services.eyebrow}
          index={t.home.services.index}
          title={t.home.services.title}
          lede={t.home.services.lede}
          action={<QuietLink href={ROUTES.services}>{t.home.services.link}</QuietLink>}
          className="mb-12 sm:mb-14"
        />

        <AsyncSection
          result={result}
          loading={<SkeletonGrid count={3} variant="service" />}
          empty={
            <EmptyState
              label={t.home.services.eyebrow}
              title={t.empty.services.title}
              body={t.empty.services.body}
              actions={
                <ButtonLink href={ROUTES.services} variant="secondary" size="sm" arrow="up-right">
                  {t.actions.viewAll}
                </ButtonLink>
              }
            />
          }
        >
          {(services) => (
            <ServiceGrid
              services={services}
              locale={locale}
              labels={{ viewService: t.actions.viewService, serviceDescription: t.slots.serviceDescription, technologies: t.services.technologies }}
              limit={6}
            />
          )}
        </AsyncSection>
      </div>
    </section>
  );
}
