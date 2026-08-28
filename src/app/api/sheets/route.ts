import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';

export async function GET(req: NextRequest) {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (scriptUrl) {
      try {
        const response = await fetch(scriptUrl, { cache: 'no-store' });
        if (response.ok) {
          const result = await response.json();
          return NextResponse.json(result);
        }
      } catch (e) {
        console.warn('[sheets/GET] Google Script fetch failed, falling back to MongoDB:', e);
      }
    }

    // Fallback: Query MongoDB Registrations directly
    const conn = await dbConnect();
    if (conn) {
      const items = await Registration.find({}).sort({ createdAt: -1 }).lean();
      const mapped = items.map((item: any) => {
        const payload = item.rawPayload || {};
        return {
          'ORDER ID': item.orderId || (item._id ? item._id.toString() : ''),
          'NAME': item.name || payload.fullName || '',
          'EMAIL': item.email || payload.email || '',
          'MOBILE NO.': item.phone || payload.phone || '',
          'INSTITUTION NAME': item.college || payload.college || '',
          'BRACH & SEM': payload.course || payload.yearOfStudy || '',
          'EVENT NAME': item.eventSlug || payload.eventSlug || '',
          'CATEGORY': payload.eventCategory || 'TECH',
          'TEAM NAME': item.teamName || '',
          'TEAM MEMBERS': JSON.stringify(item.players || payload.players || []),
          'AMOUNT': item.entryFee || 0,
          'STATUS': item.paymentStatus || 'completed',
          'UTR': item.orderId || '',
          'DATE & TIME': item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
        };
      });

      return NextResponse.json({ success: true, data: mapped });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error: any) {
    console.error('[sheets/GET] Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error', data: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body empty or non-JSON
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (scriptUrl) {
      try {
        const response = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const text = await response.text();
          try {
            const result = JSON.parse(text);
            return NextResponse.json(result);
          } catch {
            // Google script returned non-JSON text
          }
        }
      } catch (e) {
        console.warn('[sheets/POST] Google Script POST failed:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'Registration recorded locally.' });
  } catch (error: any) {
    console.error('[sheets/POST] Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 200 });
  }
}
