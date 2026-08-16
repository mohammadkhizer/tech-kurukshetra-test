import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Sponsor.find({}).sort({ order: 1 }).lean();
      const formatted = items.map((item: any) => ({ ...item, id: item._id ? item._id.toString() : '' }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/admin/sponsors]', err);
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
    const category = sanitizeString(body?.category) || 'Partner';
    const logoUrl = sanitizeString(body?.logoUrl);
    const websiteUrl = sanitizeString(body?.websiteUrl);

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Sponsor Name is required.' },
        { status: 400 }
      );
    }

    const payload = { name, category, logoUrl, websiteUrl, order: body?.order || 0 };

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }
    const newDoc = await Sponsor.create(payload);
    return NextResponse.json({ success: true, data: newDoc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
