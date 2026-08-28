import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { EVENTS_DATA } from '@/data/events';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const conn = await dbConnect();
    if (conn) {
      const event = await Event.findOne({ slug }).lean();
      if (event) {
        return NextResponse.json({
          success: true,
          data: {
            ...event,
            id: (event as any)._id ? (event as any)._id.toString() : event.slug,
          },
        });
      }
    }
  } catch (err) {
    console.error('[GET /api/events/[slug]] DB Error:', err);
  }

  // Fallback to single source-of-truth EVENTS_DATA array
  const fallback = EVENTS_DATA.find((e) => e.slug === slug || e.id === slug);
  if (fallback) {
    return NextResponse.json({
      success: true,
      data: fallback,
    });
  }

  return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
}
