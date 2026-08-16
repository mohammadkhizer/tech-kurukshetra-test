import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { TEAM_MEMBERS } from '@/lib/dummy-data';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

let memoryStore: any[] = [...TEAM_MEMBERS];

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TeamMember.find({}).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/admin/team]', err);
  }

  return NextResponse.json({ success: true, data: memoryStore });
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);

    const name = sanitizeString(body?.name);
    const role = sanitizeString(body?.role);
    const group = sanitizeString(body?.group) || 'Core Team';
    const linkedinUrl = sanitizeString(body?.linkedinUrl);
    const photoUrl = sanitizeString(body?.photoUrl);

    if (!name || !role) {
      return NextResponse.json(
        { success: false, message: 'Name and Role are required.' },
        { status: 400 }
      );
    }

    const payload = { name, role, group, linkedinUrl, photoUrl, order: body?.order || 99 };

    const conn = await dbConnect();
    if (conn) {
      const newDoc = await TeamMember.create(payload);
      return NextResponse.json({ success: true, data: newDoc });
    } else {
      const newItem = { id: Date.now().toString(), ...payload };
      memoryStore.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
