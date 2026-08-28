import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';

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

  // Return empty array when DB has no events — no silent static fallback
  return NextResponse.json({ success: true, data: [] });
}
