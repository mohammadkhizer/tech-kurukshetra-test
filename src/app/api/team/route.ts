import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TeamMember.find({}).sort({ order: 1 }).lean();
      const formatted = items.map((item: any) => ({
        ...item,
        id: item._id ? item._id.toString() : '',
      }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/team] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: [] });
}
