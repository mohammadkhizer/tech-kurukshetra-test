import { MetadataRoute } from 'next';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Announcement from '@/lib/models/Announcement';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.techkurukshetra.in';

  let eventRoutes: MetadataRoute.Sitemap = [];
  let announcementRoutes: MetadataRoute.Sitemap = [];

  try {
    const conn = await dbConnect();
    if (conn) {
      const events = await Event.find({}, 'slug updatedAt').lean();
      eventRoutes = events.map((e: any) => ({
        url: `${siteUrl}/arenas`,
        lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      const announcements = await Announcement.find({}, 'createdAt').lean();
      announcementRoutes = announcements.map((a: any) => ({
        url: `${siteUrl}/announcements`,
        lastModified: a.createdAt ? new Date(a.createdAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error('[sitemap] DB error:', err);
  }

  const staticRoutes = [
    '/',
    '/arenas',
    '/timeline',
    '/announcements',
    '/contact',
    '/register',
    '/privacy-protocol',
    '/terms-of-entry',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));

  return [...staticRoutes, ...eventRoutes, ...announcementRoutes];
}
