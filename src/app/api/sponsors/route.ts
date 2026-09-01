import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';
import { decodeHtmlEntities } from '@/lib/sanitizer';

export const revalidate = 300;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Sponsor.find({}).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        const formatted = items.map((item: any) => ({
          ...item,
          id: item._id ? item._id.toString() : '',
          logoUrl: item.logoUrl ? decodeHtmlEntities(item.logoUrl) : item.logoUrl,
          websiteUrl: item.websiteUrl ? decodeHtmlEntities(item.websiteUrl) : item.websiteUrl,
        }));
        return NextResponse.json({ success: true, data: formatted }, { headers: CACHE_HEADERS });
      }
    }
  } catch (err) {
    console.error('[GET /api/sponsors] DB query error:', err);
  }

  // Return empty array when DB has no sponsors — no silent static fallback
  return NextResponse.json({ success: true, data: [] }, { headers: CACHE_HEADERS });
}

