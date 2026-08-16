import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { TEAM_MEMBERS } from '@/lib/dummy-data';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TeamMember.find({}).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/team] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: TEAM_MEMBERS });
}
