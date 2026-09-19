import type { Metadata } from 'next';
import { dataApi } from '@/lib/data/client';
import { resolveCollection } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { ROUTES } from '@/lib/site';
import { formatCount } from '@/lib/i18n/format';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { ButtonLink } from '@/components/ui/Button';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Services',
  description: 'NAWA Technology services. Records load from the NAWA database.',
  alternates: { canonical: ROUTES.services },
};

export default async function ServicesPage() {
  const { t, locale, preview } = await getPageContext();
  const services = await dataApi.services();
  const result = resolveCollection(services, PREVIEW_FIXTURES.services, preview);

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.services.eyebrow}
        title={t.pageHero.services.title}
        lede={t.pageHero.services.lede}
        meta={[
          { label: 'Collection', value: 'services' },
          { label: 'Endpoint', value: 'GET /services' },
          { label: 'Record', value: 'Service' },
          {
            label: t.services.sectionTitle,
            value: result.status === 'ready' ? formatCount(t.services.countTemplate, result.total ?? result.data.length, locale) : '—',
          },
        ]}
      />

      <section className="nawa-section" aria-labelledby="services-grid-title">
        <div className="nawa-shell">
          <h2 id="services-grid-title" className="sr-only">
            {t.services.sectionTitle}
          </h2>

          <AsyncSection
            result={result}
            loading={<SkeletonGrid count={6} variant="service" />}
            empty={
              <EmptyState
                label={t.pageHero.services.eyebrow}
                title={t.empty.services.title}
                body={t.empty.services.body}
                actions={
                  <ButtonLink href={`${ROUTES.contact}?intent=start-a-project`} variant="primary" size="sm" arrow="up-right">
                    {t.actions.startAProject}
                  </ButtonLink>
                }
              />
            }
          >
            {(data) => (
              <ServiceGrid
                services={data}
                locale={locale}
                labels={{
                  viewService: t.actions.viewService,
                  serviceDescription: t.slots.serviceDescription,
                  technologies: t.services.technologies,
                }}
              />
            )}
          </AsyncSection>
        </div>
      </section>

      <CTASection
        eyebrow={t.home.cta.eyebrow}
        title={t.cta.title}
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        secondaryLabel={t.cta.secondary}
        className="nawa-section border-t border-line"
        compact
      />
    </>
  );
}
