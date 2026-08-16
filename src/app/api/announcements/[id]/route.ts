import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await dbConnect();
    if (conn) {
      const announcement = await Announcement.findById(id).lean();
      if (announcement) {
        return NextResponse.json({
          success: true,
          data: {
            ...announcement,
            id: (announcement as any)._id ? (announcement as any)._id.toString() : '',
          },
        });
      }
    }
  } catch (err) {
    console.error('[GET /api/announcements/[id]] Error:', err);
  }

  return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
}
