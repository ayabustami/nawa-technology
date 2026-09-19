'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { LayoutGrid, Rows3 } from 'lucide-react';
import type { Locale, Project } from '@/lib/data/types';
import { tv } from '@/lib/data/localized';
import { cn } from '@/lib/utils';
import { formatCount, type CountTemplate } from '@/lib/i18n/format';
import { ProjectCard } from './ProjectCard';
import { Reveal } from '@/components/ui/Reveal';

/* -------------------------------------------------------------------------
   ProjectGrid — client component.
   Category filtering and grid/list density live here so the interaction is
   instant. Categories are derived from the records themselves, so the filter
   bar can never contain a category your database does not have.
   ---------------------------------------------------------------------- */

type ViewMode = 'grid' | 'list';

export function ProjectGrid({
  projects,
  locale,
  labels,
  emptyFiltered,
  initialView = 'grid',
  showFilters = true,
  limit,
}: {
  projects: Project[];
  locale: Locale;
  labels: {
    category: string;
    technologies: string;
    readCaseStudy: string;
    year: string;
    allCategories: string;
    gridView: string;
    listView: string;
    filtersLabel: string;
    resultsTemplate: CountTemplate;
  };
  emptyFiltered: ReactNode;
  initialView?: ViewMode;
  showFilters?: boolean;
  limit?: number;
}) {
  const [view, setView] = useState<ViewMode>(initialView);
  const [active, setActive] = useState<string>('__all');

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) {
      const label = tv(p.category, locale).trim();
      if (!label) continue;
      map.set(label.toLowerCase(), label);
    }
    return Array.from(map.values());
  }, [projects, locale]);

  const filtered = useMemo(() => {
    if (active === '__all') return projects;
    return projects.filter((p) => tv(p.category, locale).trim().toLowerCase() === active.toLowerCase());
  }, [projects, active, locale]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {showFilters && (categories.length > 0 || projects.length > 3) && (
        <div className="mb-8 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar sm:flex-wrap sm:overflow-visible">
            <span className="t-eyebrow shrink-0">{labels.filtersLabel}</span>
            <span className="h-4 w-px bg-line-strong shrink-0" aria-hidden />
            <div className="flex items-center gap-1.5">
              <FilterChip active={active === '__all'} onClick={() => setActive('__all')} count={projects.length}>
                {labels.allCategories}
              </FilterChip>
              {categories.map((c) => {
                const count = projects.filter((p) => tv(p.category, locale).trim().toLowerCase() === c.toLowerCase()).length;
                return (
                  <FilterChip key={c} active={active.toLowerCase() === c.toLowerCase()} onClick={() => setActive(c)} count={count}>
                    {c}
                  </FilterChip>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-subtle tabular-nums">
              {formatCount(labels.resultsTemplate, filtered.length, locale)}
            </span>
            <div className="flex items-center rounded-sm border border-line bg-surface-2/60 p-0.5" role="group" aria-label={labels.filtersLabel}>
              <ViewButton active={view === 'grid'} onClick={() => setView('grid')} label={labels.gridView}>
                <LayoutGrid className="size-3.5" strokeWidth={1.6} aria-hidden />
              </ViewButton>
              <ViewButton active={view === 'list'} onClick={() => setView('list')} label={labels.listView}>
                <Rows3 className="size-3.5" strokeWidth={1.6} aria-hidden />
              </ViewButton>
            </div>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        emptyFiltered
      ) : view === 'grid' ? (
        <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal as="li" key={project.id ?? project.slug} delay={(i % 3) * 80} className="h-full">
              <ProjectCard project={project} locale={locale} index={i} labels={labels} className="h-full" />
            </Reveal>
          ))}
        </ul>
      ) : (
        <ul className="flex list-none flex-col gap-4">
          {visible.map((project, i) => (
            <Reveal as="li" key={project.id ?? project.slug} delay={Math.min(i, 4) * 60}>
              <ProjectCard project={project} locale={locale} index={i} labels={labels} layout="list" />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  count,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] whitespace-nowrap transition-all duration-300 ease-[var(--ease-nawa)]',
        active
          ? 'border-accent-line bg-accent-soft text-accent'
          : 'border-line bg-transparent text-fg-muted hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
      {typeof count === 'number' && <span className={cn('tabular-nums', active ? 'text-accent/70' : 'text-fg-subtle')}>{count}</span>}
    </button>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      aria-label={label}
      className={cn(
        'grid size-7 place-items-center rounded-[3px] transition-colors duration-300',
        active ? 'bg-surface-3 text-accent' : 'text-fg-subtle hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}
