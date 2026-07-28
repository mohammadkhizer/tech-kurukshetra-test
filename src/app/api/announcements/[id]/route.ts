import { NextRequest, NextResponse } from 'next/server';
import { ANNOUNCEMENTS } from '@/lib/dummy-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const announcement = ANNOUNCEMENTS.find((a) => a.id === id);
  if (!announcement) return NextResponse.json({ success: false, data: null }, { status: 404 });
  return NextResponse.json({ success: true, data: announcement });
}

