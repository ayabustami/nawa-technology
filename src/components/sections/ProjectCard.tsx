import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale, Project } from '@/lib/data/types';
import { displayDate, tv } from '@/lib/data/localized';
import { cn, indexLabel } from '@/lib/utils';
import { Card, IndexChip } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Badge';
import { AbstractCover } from '@/components/graphics/AbstractCover';

/* -------------------------------------------------------------------------
   ProjectCard — cover, category, title, description, stack, date.
   The cover falls back to a generated abstract visual keyed on the slug,
   so the grid never needs a stock photo to look finished.
   ---------------------------------------------------------------------- */

export function ProjectCard({
  project,
  locale,
  index,
  href,
  labels,
  layout = 'grid',
  className,
}: {
  project: Project;
  locale: Locale;
  index?: number;
  href?: string;
  labels: { category: string; technologies: string; readCaseStudy: string; year: string };
  layout?: 'grid' | 'list';
  className?: string;
}) {
  const title = tv(project.title, locale);
  const description = tv(project.description, locale);
  const category = tv(project.category, locale);
  const technologies = (project.technologies ?? []).slice(0, 4);
  const link = href ?? `/work/${project.slug}`;
  const date = displayDate(project.date, locale);

  const cover = (aspect: string) => (
    <div className={cn('relative overflow-hidden bg-bg-deep', aspect)}>
      {project.coverImage?.src ? (
        <Image
          src={project.coverImage.src}
          alt={tv(project.coverImage.alt ?? '', locale) || title}
          fill
          sizes={layout === 'grid' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 34vw'}
          className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-expo)] group-hover/prj:scale-[1.045]"
        />
      ) : (
        <AbstractCover
          seed={project.slug}
          className="size-full transition-transform duration-[1100ms] ease-[var(--ease-expo)] group-hover/prj:scale-[1.045]"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/35 to-transparent opacity-85" aria-hidden />

      {category && (
        <span className="absolute inset-inline-start-4 top-4 inline-flex items-center rounded-full border border-line bg-[var(--overlay)] px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-muted backdrop-blur-sm">
          {category}
        </span>
      )}

      {typeof index === 'number' && (
        <span className="absolute inset-inline-end-4 top-4 rounded-full border border-line bg-[var(--overlay)] px-2 py-1 font-mono text-[0.5625rem] tracking-[0.1em] text-fg-subtle backdrop-blur-sm tabular-nums">
          {indexLabel(index + 1)}
        </span>
      )}

      {project.featured && (
        <span className="absolute inset-inline-start-4 bottom-4 inline-flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent">
          <span className="size-1 rounded-full bg-accent" aria-hidden />
          Featured
        </span>
      )}
    </div>
  );

  if (layout === 'list') {
    return (
      <Card interactive as="article" className={cn('group/prj', className)}>
        <Link href={link} className="grid focus-visible:outline-none sm:grid-cols-[minmax(0,260px)_1fr] lg:grid-cols-[minmax(0,340px)_1fr]">
          {cover('aspect-[4/3] sm:aspect-auto sm:h-full')}
          <div className="flex flex-col p-5 sm:p-7">
            <div className="flex flex-1 flex-col">
              <h3 className="t-h4 text-fg text-balance transition-colors duration-300 group-hover/prj:text-accent sm:t-h3">{title}</h3>
              {description && <p className="mt-3 line-clamp-2 max-w-xl text-[0.875rem] leading-relaxed text-fg-muted">{description}</p>}

              {technologies.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {technologies.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              )}
            </div>

            <div className="hairline-t mt-6 flex items-center justify-between gap-4 pt-4">
              <span className="flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-subtle">
                {date && <span className="tabular-nums">{date}</span>}
                <span className="text-fg-muted">{labels.readCaseStudy}</span>
              </span>
              <ArrowIndicator />
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card interactive as="article" className={cn('group/prj flex h-full flex-col', className)}>
      <Link href={link} className="flex h-full flex-col focus-visible:outline-none">
        {cover('aspect-[4/3]')}

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="t-h4 text-fg text-balance transition-colors duration-300 group-hover/prj:text-accent">{title}</h3>
          {description && <p className="mt-2.5 line-clamp-3 text-[0.875rem] leading-relaxed text-fg-muted">{description}</p>}

          {technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}

          <div className="hairline-t mt-auto flex items-center justify-between gap-4 pt-4">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle tabular-nums">
              {date || <span className="italic normal-case tracking-normal">{labels.year}</span>}
            </span>
            <ArrowIndicator />
          </div>
        </div>
      </Link>
    </Card>
  );
}

function ArrowIndicator() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-all duration-300 group-hover/prj:border-accent-line group-hover/prj:bg-accent-soft group-hover/prj:text-accent">
      <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.6} aria-hidden />
    </span>
  );
}
