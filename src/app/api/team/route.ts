import { NextResponse } from 'next/server';
import { TEAM_MEMBERS } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json({ success: true, data: TEAM_MEMBERS });
}

