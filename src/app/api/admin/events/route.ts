import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { EVENTS } from '@/lib/dummy-data';

// In-memory mutable store seeded from dummy data
const store: any[] = [...EVENTS];

export async function GET() {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: store });
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const newItem = { ...body, id: Date.now().toString() };
  store.push(newItem);
  return NextResponse.json({ success: true, data: newItem });
}
