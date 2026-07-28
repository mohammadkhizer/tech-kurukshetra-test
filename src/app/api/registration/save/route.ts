import { NextRequest, NextResponse } from 'next/server';

// In-memory store (resets on server restart).
// Replace this with a real DB write when you add a database.
const registrations: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, name, email } = body;

    if (!orderId || !name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (orderId, name, email).' },
        { status: 400 }
      );
    }

    const existing = registrations.findIndex((r) => r.orderId === orderId);
    const record = { ...body, paymentStatus: body.paymentStatus || 'completed', createdAt: new Date().toISOString() };
    if (existing >= 0) registrations[existing] = record;
    else registrations.push(record);

    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    console.error('[POST /api/registration/save]', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error.' }, { status: 500 });
  }
}

