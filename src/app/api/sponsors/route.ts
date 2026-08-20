import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';
import { decodeHtmlEntities } from '@/lib/sanitizer';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const items = await Sponsor.find({}).sort({ order: 1 }).lean();
      const formatted = items.map((item: any) => ({
        ...item,
        id: item._id ? item._id.toString() : '',
        // Decode any HTML-entity-corrupted URLs stored from previous sanitizeString() misuse
        logoUrl: item.logoUrl ? decodeHtmlEntities(item.logoUrl) : item.logoUrl,
        websiteUrl: item.websiteUrl ? decodeHtmlEntities(item.websiteUrl) : item.websiteUrl,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }
  } catch (err) {
    console.error('[GET /api/sponsors] DB query error:', err);
  }

  return NextResponse.json({ success: true, data: [] });
}
