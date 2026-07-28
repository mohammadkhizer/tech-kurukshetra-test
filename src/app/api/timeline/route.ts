import { NextResponse } from 'next/server';
import { TIMELINE } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json({ success: true, data: TIMELINE });
}

