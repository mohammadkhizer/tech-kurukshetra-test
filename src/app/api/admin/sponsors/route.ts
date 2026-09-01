import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';
import { sanitizeObject, sanitizeString, sanitizeUrl } from '@/lib/sanitizer';
import { SponsorSaveSchema } from '@/lib/schemas';

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
    const sanitizedBody = sanitizeObject(rawBody);
    const parsed = SponsorSaveSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid sponsor payload.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const payload = {
      name: sanitizeString(data.name),
      category: sanitizeString(data.category),
      logoUrl: sanitizeUrl(data.logoUrl),
      websiteUrl: sanitizeUrl(data.websiteUrl),
      order: data.order,
    };

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const newDoc = await Sponsor.create(payload);

    try {
      revalidatePath('/api/sponsors');
    } catch (cacheErr) {
      console.warn('[POST /api/admin/sponsors] Cache revalidation error:', cacheErr);
    }

    return NextResponse.json({ success: true, data: newDoc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

