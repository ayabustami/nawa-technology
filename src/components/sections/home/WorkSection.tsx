import type { DataResult, Locale, Project } from '@/lib/data/types';
import type { Dictionary } from '@/lib/i18n';
import { ROUTES } from '@/lib/site';
import { AsyncSection } from '@/components/sections/AsyncSection';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink, QuietLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonGrid } from '@/components/ui/Skeleton';

export function HomeWork({ result, t, locale }: { result: DataResult<Project>; t: Dictionary; locale: Locale }) {
  const gridLabels = {
    category: t.work.category,
    technologies: t.work.technologies,
    readCaseStudy: t.actions.readCaseStudy,
    year: t.work.year,
    allCategories: t.actions.allCategories,
    gridView: t.actions.gridView,
    listView: t.actions.listView,
    filtersLabel: t.work.filtersLabel,
    resultsTemplate: t.work.resultsTemplate,
  };

  return (
    <section className="nawa-section relative isolate border-t border-line" aria-labelledby="home-work-title">
      <div className="nawa-shell">
        <SectionHeading
          id="home-work-title"
          eyebrow={t.home.work.eyebrow}
          index={t.home.work.index}
          title={t.home.work.title}
          lede={t.home.work.lede}
          action={<QuietLink href={ROUTES.work}>{t.home.work.link}</QuietLink>}
          className="mb-12 sm:mb-14"
        />

        <AsyncSection
          result={result}
          loading={<SkeletonGrid count={3} variant="project" />}
          empty={
            <EmptyState
              label={t.home.work.eyebrow}
              title={t.empty.work.title}
              body={t.empty.work.body}
              actions={
                <ButtonLink href={ROUTES.work} variant="secondary" size="sm" arrow="up-right">
                  {t.actions.exploreWork}
                </ButtonLink>
              }
            />
          }
        >
          {(projects) => (
            <ProjectGrid
              projects={projects}
              locale={locale}
              labels={gridLabels}
              showFilters={false}
              limit={3}
              emptyFiltered={null}
            />
          )}
        </AsyncSection>
      </div>
    </section>
  );
}
