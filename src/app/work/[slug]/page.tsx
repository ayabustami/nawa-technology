import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { dataApi } from '@/lib/data/client';
import { resolveRecord } from '@/lib/data/resolve';
import { PREVIEW_FIXTURES } from '@/lib/data/fixtures';
import { getPageContext } from '@/lib/i18n/server';
import { displayDate, tv } from '@/lib/data/localized';
import { ROUTES } from '@/lib/site';
import { PageHero } from '@/components/layout/PageHero';
import { CaseStudyBlocks, CaseStudySlot } from '@/components/sections/CaseStudyBlocks';
import { ButtonLink } from '@/components/ui/Button';
import { SpecList } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Badge';
import { AbstractCover } from '@/components/graphics/AbstractCover';
import { Reveal } from '@/components/ui/Reveal';
import { CTASection } from '@/components/sections/CTASection';

/* -------------------------------------------------------------------------
   CASE STUDY TEMPLATE
   A complete project detail layout: hero, cover, metadata, block-based case
   study, outcomes, external link and a next-project handoff. It renders as
   soon as `GET /projects/:slug` returns a record.
   ---------------------------------------------------------------------- */

type Params = { slug: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const { t } = await getPageContext();
  const record = await dataApi.project(slug);
  const title = record.data ? tv(record.data.title, 'en') : slug;
  return {
    title,
    description: record.data ? tv(record.data.description ?? '', 'en') : `${t.pageHero.projectDetail.eyebrow} — NAWA Technology`,
  };
}

export default async function ProjectDetailPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const { t, locale, preview } = await getPageContext();

  const record = await dataApi.project(slug);
  const fixture = PREVIEW_FIXTURES.projects.find((p) => p.slug === slug);
  const resolved = resolveRecord(record, fixture, preview);

  if (resolved.status !== 'ready' || !resolved.data) notFound();

  const project = resolved.data;
  const title = tv(project.title, locale);
  const description = tv(project.description, locale);
  const category = tv(project.category, locale);
  const technologies = project.technologies ?? [];

  const siblings = preview === 'populated' ? PREVIEW_FIXTURES.projects : [];
  const index = siblings.findIndex((p) => p.slug === slug);
  const next = index >= 0 ? siblings[(index + 1) % siblings.length] : undefined;

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.projectDetail.eyebrow}
        title={title}
        lede={description || undefined}
        size="lg"
        visual={false}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.work}
              className="group/back inline-flex items-center gap-2 text-[0.8125rem] font-medium text-fg-muted transition-colors duration-300 hover:text-accent"
            >
              <ArrowLeft className="size-4 transition-transform duration-400 ease-[var(--ease-nawa)] group-hover/back:-translate-x-0.5 rtl:rotate-180 rtl:group-hover/back:translate-x-0.5" strokeWidth={1.6} aria-hidden />
              {t.actions.backToWork}
            </Link>
            {project.url && (
              <ButtonLink href={project.url} variant="secondary" size="sm" arrow="up-right">
                {t.work.visitProject}
              </ButtonLink>
            )}
          </div>
        }
      />

      {/* cover ---------------------------------------------------------- */}
      <section className="relative border-b border-line">
        <div className="nawa-shell py-10 sm:py-14">
          <Reveal>
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-line bg-bg-deep sm:aspect-[24/9]">
              {project.coverImage?.src ? (
                <Image
                  src={project.coverImage.src}
                  alt={tv(project.coverImage.alt ?? '', locale) || title}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <AbstractCover seed={project.slug} className="size-full" grid vignette />
              )}
              {resolved.source === 'preview' && (
                <span className="absolute inset-inline-start-4 top-4 rounded-full border border-accent-line bg-accent-soft px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-accent backdrop-blur-sm">
                  {t.state.previewRibbon}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* body ------------------------------------------------------------ */}
      <section className="nawa-section">
        <div className="nawa-shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div className="min-w-0">
            <Reveal className="mb-10 flex flex-wrap items-center gap-3">
              {category && <Tag className="border-accent-line bg-accent-soft text-accent">{category}</Tag>}
              {technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </Reveal>

            <h2 className="t-h3 mb-8 text-fg">{t.work.caseStudy}</h2>

            {project.caseStudy?.blocks?.length ? (
              <CaseStudyBlocks blocks={project.caseStudy.blocks} locale={locale} />
            ) : (
              <CaseStudySlot labels={{ caseStudyBody: t.work.noCaseStudy, marker: t.slots.marker }} />
            )}

            {project.caseStudy?.outcomes && project.caseStudy.outcomes.length > 0 && (
              <div className="mt-14">
                <h2 className="t-eyebrow mb-6">{t.work.outcomes}</h2>
                <dl className="grid grid-cols-2 border-e border-b border-line sm:grid-cols-4">
                  {project.caseStudy.outcomes.map((outcome, i) => (
                    <div key={i} className="border-s border-t border-line px-4 py-5">
                      <dt className="t-eyebrow mb-3">{tv(outcome.label, locale)}</dt>
                      <dd className="font-mono text-[1.5rem] leading-none text-fg tabular-nums">{tv(outcome.value, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* metadata rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="t-eyebrow mb-5">{t.work.projectDetails}</h2>
            <SpecList
              items={[
                { label: t.work.category, value: category || '—' },
                { label: t.work.year, value: displayDate(project.date, locale) || '—' },
                { label: t.work.client, value: tv(project.client ?? '', locale) || '—' },
                { label: t.work.role, value: tv(project.role ?? '', locale) || '—' },
                { label: t.work.duration, value: tv(project.duration ?? '', locale) || '—' },
              ]}
            />

            {technologies.length > 0 && (
              <>
                <h2 className="t-eyebrow mb-4 mt-8">{t.work.technologies}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </>
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group/url mt-8 flex items-center justify-between gap-4 rounded-sm border border-line px-4 py-3.5 transition-colors duration-300 hover:border-accent-line hover:bg-accent-softer"
              >
                <span className="min-w-0">
                  <span className="t-eyebrow mb-1 block">{t.actions.openLink}</span>
                  <span className="block truncate text-[0.8125rem] text-fg">{project.url.replace(/^https?:\/\//, '')}</span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-fg-subtle transition-colors duration-300 group-hover/url:text-accent" strokeWidth={1.5} aria-hidden />
              </a>
            )}

            <div className="mt-8 rounded-sm border border-dashed border-line-strong p-4">
              <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-fg-subtle">Gallery slot</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-subtle">{t.work.gallery} — {t.slots.imageAlt}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* next project ---------------------------------------------------- */}
      {next && next.slug !== slug && (
        <section className="border-t border-line">
          <Link href={ROUTES.workDetail(next.slug)} className="group/next block">
            <div className="nawa-shell flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between sm:py-16">
              <div>
                <span className="t-eyebrow mb-3 block">{t.work.nextProject}</span>
                <span className="t-h2 block text-balance text-fg transition-colors duration-400 group-hover/next:text-accent">
                  {tv(next.title, locale)}
                </span>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-all duration-500 ease-[var(--ease-nawa)] group-hover/next:border-accent-line group-hover/next:bg-accent-soft group-hover/next:text-accent">
                <ArrowUpRight className="size-6 rtl:-scale-x-100" strokeWidth={1.4} aria-hidden />
              </span>
            </div>
          </Link>
        </section>
      )}

      <CTASection
        eyebrow={t.home.cta.eyebrow}
        title={t.cta.title}
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        secondaryLabel={t.cta.secondary}
        secondaryHref={ROUTES.work}
        className="nawa-section border-t border-line"
        compact
      />
    </>
  );
}
