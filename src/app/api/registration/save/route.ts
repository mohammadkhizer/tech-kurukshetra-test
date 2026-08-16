import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { sanitizeString, sanitizeObject, isValidEmail } from '@/lib/sanitizer';

// In-memory fallback if MongoDB connection is unavailable
const fallbackRegistrations: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);

    const orderId = sanitizeString(body?.orderId);
    const name = sanitizeString(body?.name);
    const email = sanitizeString(body?.email);

    if (!orderId || !name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (orderId, name, email).' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    const payload = {
      orderId,
      name,
      email,
      phone: sanitizeString(body?.phone),
      college: sanitizeString(body?.college),
      mode: body?.mode === 'team' ? 'team' : 'individual',
      teamName: sanitizeString(body?.teamName),
      teamSize: sanitizeString(body?.teamSize),
      eventSlug: sanitizeString(body?.eventSlug),
      paymentStatus: sanitizeString(body?.paymentStatus) || 'completed',
      rawPayload: body,
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
