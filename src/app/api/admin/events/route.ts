import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';
import { EventSaveSchema } from '@/lib/schemas';

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Event.find({}).lean();
      const formatted = items.map((item: any) => ({ ...item, id: item._id ? item._id.toString() : '' }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/admin/events]', err);
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
    const parsed = EventSaveSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid event payload.' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const name = sanitizeString(data.name);
    const slug = sanitizeString(data.slug) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload: Record<string, any> = {
      ...data,
      name,
      slug,
      description: sanitizeString(data.description),
      hook: sanitizeString(data.hook),
      longDescription: sanitizeString(data.longDescription),
      prize: sanitizeString(data.prize),
      prizePool: sanitizeString(data.prizePool),
      category: sanitizeString(data.category),
      location: sanitizeString(data.location),
      venue: sanitizeString(data.venue),
      date: sanitizeString(data.date),
      time: sanitizeString(data.time),
      duration: sanitizeString(data.duration),
      registrationDeadline: sanitizeString(data.registrationDeadline),
      registrationFee: sanitizeString(data.registrationFee),
      bannerImage: sanitizeString(data.bannerImage),
      imageUrl: sanitizeString(data.imageUrl),
    };

    // Strip custom id / _id from update payload to avoid immutable path conflicts in MongoDB
    delete payload.id;
    delete payload._id;

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const newDoc = await Event.findOneAndUpdate({ slug }, { $set: payload }, { upsert: true, returnDocument: 'after' });

    // Invalidate public and API cache paths instantly
    try {
      revalidatePath('/api/events');
      revalidatePath(`/api/events/${slug}`);
      revalidatePath('/arenas');
      revalidatePath(`/arenas/${slug}`);
      revalidateTag('events');
    } catch (cacheErr) {
      console.warn('[POST /api/admin/events] Cache revalidation error:', cacheErr);
    }

    return NextResponse.json({ success: true, data: newDoc });
  } catch (err: any) {
    console.error('[POST /api/admin/events] Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}

