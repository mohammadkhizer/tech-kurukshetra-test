import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// POST /api/payment/verify
// Body: { utrNumber: string, registrationId: string }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const { utrNumber, registrationId } = await req.json();

    if (!utrNumber || !/^\d{12}$/.test(utrNumber.trim())) {
      return NextResponse.json(
        { success: false, message: 'Invalid UTR number. Must be a 12-digit number found in your UPI app.' },
        { status: 400 }
      );
    }

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: 'Registration ID is missing.' },
        { status: 400 }
      );
    }

    // No database — just acknowledge receipt.
    // When a database is added, save the UTR and mark payment as verified here.
    console.log(`[payment/verify] UTR ${utrNumber} for registration ${registrationId}`);

    return NextResponse.json({ success: true, message: 'Payment verified successfully.' });
  } catch (err) {
    console.error('[verify-payment]', err);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

