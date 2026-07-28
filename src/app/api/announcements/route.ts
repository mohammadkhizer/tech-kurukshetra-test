import { NextResponse } from 'next/server';
import { ANNOUNCEMENTS } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json({ success: true, data: ANNOUNCEMENTS });
}

