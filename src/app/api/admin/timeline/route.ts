import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import TimelineMilestone from '@/lib/models/TimelineMilestone';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await TimelineMilestone.find({}).sort({ order: 1 }).lean();
      const formatted = items.map((item: any) => ({ ...item, id: item._id ? item._id.toString() : '' }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/admin/timeline]', err);
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
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }
    const newDoc = await TimelineMilestone.create(payload);
    return NextResponse.json({ success: true, data: newDoc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
