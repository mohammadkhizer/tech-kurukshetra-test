import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import TimelineMilestone from '@/lib/models/TimelineMilestone';
import { TIMELINE } from '@/lib/dummy-data';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

let memoryStore: any[] = [...TIMELINE];

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TimelineMilestone.find({}).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/admin/timeline]', err);
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

    const title = sanitizeString(body?.title);
    const date = sanitizeString(body?.date);
    const description = sanitizeString(body?.description);
    const status = (['Completed', 'Live', 'Upcoming'].includes(body?.status)
      ? body?.status
      : 'Upcoming') as 'Completed' | 'Live' | 'Upcoming';

    if (!title || !date) {
      return NextResponse.json(
        { success: false, message: 'Title and Date are required.' },
        { status: 400 }
      );
    }

    const payload = { title, date, description, status, order: body?.order || 0 };

    const conn = await dbConnect();
    if (conn) {
      const newDoc = await TimelineMilestone.create(payload);
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
