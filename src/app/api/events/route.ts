import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { EVENTS_DATA } from '@/data/events';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Event.find({}).lean();
      if (items && items.length > 0) {
        const formatted = items.map((item: any) => ({
          ...item,
          id: item._id ? item._id.toString() : item.slug,
        }));
        return NextResponse.json({ success: true, data: formatted });
      }
    }
  } catch (err) {
    console.error('[GET /api/events] DB query error:', err);
  }

  // Fallback to single source-of-truth seed events when DB is empty
  return NextResponse.json({ success: true, data: EVENTS_DATA });
}
