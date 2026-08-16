import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import TimelineMilestone from '@/lib/models/TimelineMilestone';
import { TIMELINE } from '@/lib/dummy-data';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TimelineMilestone.find({}).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/timeline] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: TIMELINE });
}
