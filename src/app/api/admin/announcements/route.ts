import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';
import { ANNOUNCEMENTS } from '@/lib/dummy-data';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';

let memoryStore: any[] = [...ANNOUNCEMENTS];

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Announcement.find({}).sort({ createdAt: -1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json({ success: true, data: items });
      }
    }
  } catch (err) {
    console.error('[GET /api/admin/announcements]', err);
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
    const content = sanitizeString(body?.content);
    const timestamp = sanitizeString(body?.timestamp) || new Date().toISOString();
    const author = sanitizeString(body?.author) || 'Organizing Committee';

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and Content are required.' },
        { status: 400 }
      );
    }

    const conn = await dbConnect();
    if (conn) {
      const newDoc = await Announcement.create({ title, content, timestamp, author });
      return NextResponse.json({ success: true, data: newDoc });
    } else {
      const newItem = { id: Date.now().toString(), title, content, timestamp, author };
      memoryStore.unshift(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
