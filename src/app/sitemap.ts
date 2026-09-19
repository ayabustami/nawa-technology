import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { dataApi } from '@/lib/data/client';

/**
 * Sitemap. Static routes always appear; detail routes appear only once your
 * database actually serves records, so the sitemap never advertises a page
 * that would 404.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/process`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const [services, projects] = await Promise.all([dataApi.services(), dataApi.projects()]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...services.data.map((service) => ({
      url: `${base}/services/${service.slug}`,
      lastModified: service.publishedAt ? new Date(service.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...projects.data.map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: project.publishedAt ? new Date(project.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
