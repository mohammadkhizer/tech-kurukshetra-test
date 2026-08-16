import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const conn = await dbConnect();
    if (conn) {
      const event = await Event.findOne({ slug }).lean();
      if (event) {
        return NextResponse.json({
          success: true,
          data: {
            ...event,
            id: (event as any)._id ? (event as any)._id.toString() : '',
          },
        });
      }
    }
  } catch (err) {
    console.error('[GET /api/events/[slug]] Error:', err);
  }

  return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
}
