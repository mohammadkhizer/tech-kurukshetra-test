import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { EVENTS } from '@/lib/dummy-data';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Event.find({}).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/events] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: EVENTS });
}
