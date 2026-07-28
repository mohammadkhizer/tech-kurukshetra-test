import { NextRequest, NextResponse } from 'next/server';
import { EVENTS } from '@/lib/dummy-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return NextResponse.json({ success: false, data: null }, { status: 404 });
  return NextResponse.json({ success: true, data: event });
}

