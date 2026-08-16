import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';
import { ANNOUNCEMENTS } from '@/lib/dummy-data';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Announcement.find({}).sort({ createdAt: -1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/announcements] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: ANNOUNCEMENTS });
}
