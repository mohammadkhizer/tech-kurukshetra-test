import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { EVENTS } from '@/lib/dummy-data';

// Shared mutable reference — for a real app, use a database
const store: any[] = [...EVENTS];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const idx = store.findIndex((e) => e.id === id);
  if (idx < 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  store[idx] = { ...store[idx], ...body };
  return NextResponse.json({ success: true, data: store[idx] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const idx = store.findIndex((e) => e.id === id);
  if (idx >= 0) store.splice(idx, 1);
  return NextResponse.json({ success: true });
}

