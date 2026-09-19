import type { Locale, Service } from '@/lib/data/types';
import { ServiceCard } from './ServiceCard';
import { Reveal } from '@/components/ui/Reveal';

/* -------------------------------------------------------------------------
   ServiceGrid — pure layout. Sort order comes from the API (`order`).
   ---------------------------------------------------------------------- */

export function sortServices(services: Service[]): Service[] {
  return [...services].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function ServiceGrid({
  services,
  locale,
  labels,
  limit,
  columns = 3,
}: {
  services: Service[];
  locale: Locale;
  labels: { viewService: string; serviceDescription: string; technologies: string };
  limit?: number;
  columns?: 2 | 3;
}) {
  const sorted = sortServices(services);
  const visible = limit ? sorted.slice(0, limit) : sorted;

  return (
    <ul
      className={
        columns === 2
          ? 'grid list-none gap-5 sm:grid-cols-2'
          : 'grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {visible.map((service, i) => (
        <Reveal as="li" key={service.id ?? service.slug} delay={(i % 3) * 80} className="h-full">
          <ServiceCard service={service} locale={locale} index={i} viewLabels={labels} className="h-full" />
        </Reveal>
      ))}
    </ul>
  );
}

export function ServiceList({
  services,
  locale,
  labels,
}: {
  services: Service[];
  locale: Locale;
  labels: { viewService: string; serviceDescription: string; technologies: string };
}) {
  const sorted = sortServices(services);
  return (
    <ul className="flex list-none flex-col gap-4">
      {sorted.map((service, i) => (
        <Reveal as="li" key={service.id ?? service.slug} delay={Math.min(i, 4) * 60}>
          <ServiceCard service={service} locale={locale} index={i} viewLabels={labels} layout="list" />
        </Reveal>
      ))}
    </ul>
  );
}
