import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';

export const revalidate = 60;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
};

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Announcement.find({}).sort({ createdAt: -1 }).lean();
      const formatted = items.map((item: any) => ({
        ...item,
        id: item._id ? item._id.toString() : '',
      }));
      return NextResponse.json({ success: true, data: formatted }, { headers: CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[GET /api/announcements] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: [] }, { headers: CACHE_HEADERS });
}

