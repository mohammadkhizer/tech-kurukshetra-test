import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';
import { AnnouncementSaveSchema } from '@/lib/schemas';

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Announcement.find({}).sort({ timestamp: -1 }).lean();
      const formatted = items.map((item: any) => ({ ...item, id: item._id ? item._id.toString() : '' }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/admin/announcements]', err);
  }

  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const sanitizedBody = sanitizeObject(rawBody);
    const parsed = AnnouncementSaveSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid announcement payload.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const payload = {
      title: sanitizeString(data.title),
      content: sanitizeString(data.content),
      category: data.category,
      isPinned: data.isPinned,
      deadlineDate: sanitizeString(data.deadlineDate),
      author: sanitizeString(data.author),
      timestamp: new Date().toISOString(),
    };

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const newDoc = await Announcement.create(payload);

    try {
      revalidatePath('/api/announcements');
      revalidatePath('/announcements');
    } catch (cacheErr) {
      console.warn('[POST /api/admin/announcements] Cache revalidation error:', cacheErr);
    }

    return NextResponse.json({ success: true, data: newDoc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

