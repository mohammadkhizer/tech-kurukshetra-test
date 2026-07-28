import { NextResponse } from 'next/server';
import { SPONSORS } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json({ success: true, data: SPONSORS });
}

