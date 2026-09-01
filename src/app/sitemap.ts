import { MetadataRoute } from 'next';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Announcement from '@/lib/models/Announcement';
import { EVENTS_DATA } from '@/data/events';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let eventRoutes: MetadataRoute.Sitemap = [];
  let announcementRoutes: MetadataRoute.Sitemap = [];

  try {
    const conn = await dbConnect();
    if (conn) {
      const events = await Event.find({}, 'slug updatedAt').lean();
      if (events && events.length > 0) {
        eventRoutes = events.map((e: any) => ({
          url: `${SITE_URL}/arenas/${e.slug}`,
          lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }

      const announcements = await Announcement.find({}, '_id createdAt').lean();
      if (announcements && announcements.length > 0) {
        announcementRoutes = announcements.map((a: any) => ({
          url: `${SITE_URL}/announcements/${a._id ? a._id.toString() : a.id}`,
          lastModified: a.createdAt ? new Date(a.createdAt) : new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (err) {
    console.error('[sitemap] DB error:', err);
  }

  // Fallback for events if DB is empty/unconnected
  if (eventRoutes.length === 0) {
    eventRoutes = EVENTS_DATA.map((e) => ({
      url: `${SITE_URL}/arenas/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
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
    '/code-of-conduct',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));

  return [...staticRoutes, ...eventRoutes, ...announcementRoutes];
}

