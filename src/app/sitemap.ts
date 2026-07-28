import { MetadataRoute } from 'next';
import { EVENTS, ANNOUNCEMENTS } from '@/lib/dummy-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.techkurukshetra.in';

  const eventRoutes: MetadataRoute.Sitemap = EVENTS.map((e) => ({
    url: `/arenas/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const announcementRoutes: MetadataRoute.Sitemap = ANNOUNCEMENTS.map((a) => ({
    url: `/announcements/`,
    lastModified: new Date(a.createdAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const staticRoutes = ['/', '/arenas', '/timeline', '/announcements', '/team', '/contact', '/register', '/privacy-protocol', '/terms-of-entry'].map((route) => ({
    url: ``,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));

  return [...staticRoutes, ...eventRoutes, ...announcementRoutes];
}
