import type { Metadata } from 'next';
import { dataApi } from '@/lib/data/client';
import { resolveCollection } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { ROUTES } from '@/lib/site';
import { formatCount } from '@/lib/i18n/format';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { ButtonLink } from '@/components/ui/Button';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Work',
  description: 'NAWA Technology work and case studies.',
  alternates: { canonical: ROUTES.work },
};

export default async function WorkPage() {
  const { t, locale, preview } = await getPageContext();
  const projects = await dataApi.projects();
  const result = resolveCollection(projects, PREVIEW_FIXTURES.projects, preview);

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.work.eyebrow}
        title={t.pageHero.work.title}
        lede={t.pageHero.work.lede}
        meta={[
          { label: 'Collection', value: 'projects' },
          { label: 'Endpoint', value: 'GET /projects' },
          { label: 'Record', value: 'Project' },
          { label: t.work.sectionTitle, value: result.status === 'ready' ? formatCount(t.work.resultsTemplate, result.total ?? result.data.length, locale) : '—' },
        ]}
      />

      <section className="nawa-section" aria-labelledby="work-grid-title">
        <div className="nawa-shell">
          <h2 id="work-grid-title" className="sr-only">
            {t.work.sectionTitle}
          </h2>

          <AsyncSection
            result={result}
            loading={<SkeletonGrid count={6} variant="project" />}
            empty={
              <EmptyState
                label={t.pageHero.work.eyebrow}
                title={t.empty.work.title}
                body={t.empty.work.body}
                actions={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <ButtonLink href={`${ROUTES.contact}?intent=start-a-project`} variant="primary" size="sm" arrow="up-right">
                      {t.actions.startAProject}
                    </ButtonLink>
                    <ButtonLink href={ROUTES.process} variant="secondary" size="sm">
                      {t.actions.ourProcess}
                    </ButtonLink>
                  </div>
                }
              />
            }
          >
            {(data) => (
              <ProjectGrid
                projects={data}
                locale={locale}
                labels={{
                  category: t.work.category,
                  technologies: t.work.technologies,
                  readCaseStudy: t.actions.readCaseStudy,
                  year: t.work.year,
                  allCategories: t.actions.allCategories,
                  gridView: t.actions.gridView,
                  listView: t.actions.listView,
                  filtersLabel: t.work.filtersLabel,
                  resultsTemplate: t.work.resultsTemplate,
                }}
                emptyFiltered={
                  <EmptyState
                    compact
                    glyph={false}
                    title={t.empty.filters.title}
                    body={t.empty.filters.body}
                  />
                }
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
