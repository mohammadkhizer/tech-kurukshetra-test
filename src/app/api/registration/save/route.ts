import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { sanitizeString, sanitizeObject } from '@/lib/sanitizer';
import { RegistrationSaveSchema } from '@/lib/schemas';

// In-memory fallback if MongoDB connection is unavailable
const fallbackRegistrations: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = RegistrationSaveSchema.safeParse(rawBody);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { orderId, name, email, phone, college, mode, teamName, teamSize, eventSlug, paymentStatus } = parsed.data;

    const payload = {
      orderId: sanitizeString(orderId),
      name: sanitizeString(name),
      email: sanitizeString(email),
      phone: sanitizeString(phone),
      college: sanitizeString(college),
      mode,
      teamName: sanitizeString(teamName),
      teamSize: sanitizeString(teamSize),
      eventSlug: sanitizeString(eventSlug),
      paymentStatus: sanitizeString(paymentStatus),
    };

    const conn = await dbConnect();

    if (conn) {
      const updated = await Registration.findOneAndUpdate(
        { orderId },
        { $set: payload },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Fallback in-memory persistence
      const idx = fallbackRegistrations.findIndex((r) => r.orderId === orderId);
      const record = { ...payload, id: `fb_${Date.now()}`, createdAt: new Date().toISOString() };
      if (idx >= 0) fallbackRegistrations[idx] = record;
      else fallbackRegistrations.push(record);

      return NextResponse.json({ success: true, data: record, fallback: true });
    }
  } catch (err: any) {
    console.error('[POST /api/registration/save]', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error.' },
      { status: 500 }
    );
  }
}
