import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale, Service } from '@/lib/data/types';
import { tv, tvList } from '@/lib/data/localized';
import { cn, indexLabel } from '@/lib/utils';
import { Card, IndexChip } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Badge';
import { AbstractCover } from '@/components/graphics/AbstractCover';

/* -------------------------------------------------------------------------
   ServiceCard — one database record, one card.
   Handles every combination of present/absent fields: a row with only a
   name still renders as a complete, balanced card.
   ---------------------------------------------------------------------- */

export function ServiceCard({
  service,
  locale,
  index,
  href,
  viewLabels,
  className,
  layout = 'grid',
}: {
  service: Service;
  locale: Locale;
  index?: number;
  href?: string;
  viewLabels: { viewService: string; serviceDescription: string; technologies: string };
  className?: string;
  layout?: 'grid' | 'list';
}) {
  const name = tv(service.name, locale);
  const short = tv(service.shortDescription, locale);
  const features = tvList(service.features, locale).slice(0, 3);
  const technologies = (service.technologies ?? []).slice(0, 4);
  const link = href ?? `/services/${service.slug}`;
  const isPreview = Boolean((service as Service & { preview?: boolean }).preview);

  const media = (
    <div className="relative aspect-[16/9] overflow-hidden">
      {service.image?.src ? (
        <Image
          src={service.image.src}
          alt={tv(service.image.alt ?? '', locale) || name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover/svc:scale-[1.04]"
        />
      ) : (
        <AbstractCover
          seed={service.slug}
          className="size-full transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover/svc:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80" aria-hidden />
    </div>
  );

  const body = (
    <div className={cn('flex flex-1 flex-col', layout === 'grid' ? 'p-5 sm:p-6' : 'p-5 sm:p-7')}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <IconTile name={service.icon} tone="default" className="group-hover/svc:border-accent-line group-hover/svc:bg-accent-soft group-hover/svc:text-accent" />
        {typeof index === 'number' && <IndexChip value={indexLabel(index + 1)} />}
      </div>

      <h3 className={cn('t-h4 text-fg text-balance transition-colors duration-300 group-hover/svc:text-accent', layout === 'list' && 'sm:t-h3')}>
        {name}
      </h3>

      <p className={cn('mt-2.5 text-[0.875rem] leading-relaxed text-fg-muted', layout === 'grid' ? 'line-clamp-3' : 'line-clamp-2 sm:max-w-xl')}>
        {short || <span className="text-fg-subtle italic">{viewLabels.serviceDescription}</span>}
      </p>

      {features.length > 0 && (
        <ul className="mt-5 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[0.8125rem] text-fg-muted">
              <span className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {technologies.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      )}

      {isPreview && (
        <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent">
          Preview record
        </span>
      )}
    </div>
  );

  const footer = (
    <div className="hairline-t flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-subtle">{viewLabels.viewService}</span>
      <span className="grid size-8 place-items-center rounded-full border border-line text-fg-muted transition-all duration-300 group-hover/svc:border-accent-line group-hover/svc:bg-accent-soft group-hover/svc:text-accent">
        <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.6} aria-hidden />
      </span>
    </div>
  );

  if (layout === 'list') {
    return (
      <Card interactive as="article" className={cn('group/svc', className)}>
        <Link href={link} className="grid focus-visible:outline-none sm:grid-cols-[minmax(0,240px)_1fr] lg:grid-cols-[minmax(0,320px)_1fr]">
          {media}
          <div className="flex flex-col">
            {body}
            {footer}
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card interactive as="article" className={cn('group/svc flex h-full flex-col', className)}>
      <Link href={link} className="flex h-full flex-col focus-visible:outline-none">
        {media}
        {body}
        <div className="mt-auto">{footer}</div>
      </Link>
    </Card>
  );
}
