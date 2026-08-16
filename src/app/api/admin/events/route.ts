import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { EVENTS } from '@/lib/dummy-data';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

let memoryStore: any[] = [...EVENTS];

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Event.find({}).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/admin/events]', err);
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
    const slug = sanitizeString(body?.slug) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const description = sanitizeString(body?.description);

    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: 'Event Name and Description are required.' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      name,
      slug,
      description,
      hook: sanitizeString(body?.hook),
      longDescription: sanitizeString(body?.longDescription),
      prize: sanitizeString(body?.prize),
      category: sanitizeString(body?.category),
      location: sanitizeString(body?.location),
      registrationFee: sanitizeString(body?.registrationFee),
    };

    const conn = await dbConnect();
    if (conn) {
      const newDoc = await Event.findOneAndUpdate({ slug }, { $set: payload }, { upsert: true, new: true });
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
