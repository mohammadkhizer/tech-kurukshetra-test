import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';

// In-memory / persistent hero state
let heroSettings = {
  mainHeadline: 'BEYOND THE HORIZON',
  subHeadline: 'Battle of Minds',
  description: 'The most immersive tech battlefield of the year. Compete across coding, robotics, esports, and design.',
};

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: heroSettings });
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    heroSettings = {
      ...heroSettings,
      ...body,
    };
    return NextResponse.json({ success: true, data: heroSettings });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
