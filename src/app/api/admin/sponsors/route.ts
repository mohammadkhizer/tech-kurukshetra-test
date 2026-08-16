import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';
import { SPONSORS } from '@/lib/dummy-data';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

let memoryStore: any[] = [...SPONSORS];

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Sponsor.find({}).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/admin/sponsors]', err);
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
    if (conn) {
      const newDoc = await Sponsor.create(payload);
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
