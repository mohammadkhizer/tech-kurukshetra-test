import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import TimelineMilestone from '@/lib/models/TimelineMilestone';

export const revalidate = 300;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TimelineMilestone.find({}).sort({ order: 1 }).lean();
      const formatted = items.map((item: any) => ({
        ...item,
        id: item._id ? item._id.toString() : '',
      }));
      return NextResponse.json({ success: true, data: formatted }, { headers: CACHE_HEADERS });
    }
  } catch (err) {
    console.error('[GET /api/timeline] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: [] }, { headers: CACHE_HEADERS });
}

