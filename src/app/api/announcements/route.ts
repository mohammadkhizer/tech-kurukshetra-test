import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Announcement.find({}).sort({ createdAt: -1 }).lean();
      const formatted = items.map((item: any) => ({
        ...item,
        id: item._id ? item._id.toString() : '',
      }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/announcements] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: [] });
}
