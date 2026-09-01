import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TeamMember.find({}).sort({ order: 1 }).lean();
      const formatted = items.map((item: any) => ({ ...item, id: item._id ? item._id.toString() : '' }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/admin/team]', err);
  }

  return NextResponse.json({ success: true, data: [] });
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
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }
    const newDoc = await TeamMember.create(payload);

    try {
      revalidatePath('/api/team');
    } catch (cacheErr) {
      console.warn('[POST /api/admin/team] Cache revalidation error:', cacheErr);
    }

    return NextResponse.json({ success: true, data: newDoc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

