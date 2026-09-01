import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { dbConnect } from '@/lib/mongodb';
import TimelineMilestone from '@/lib/models/TimelineMilestone';
import { sanitizeObject } from '@/lib/sanitizer';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const updated = await TimelineMilestone.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Timeline milestone not found' }, { status: 404 });
    }

    try {
      revalidatePath('/api/timeline');
      revalidatePath('/timeline');
    } catch (cacheErr) {
      console.warn('[PUT /api/admin/timeline/[id]] Cache revalidation error:', cacheErr);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const deleted = await TimelineMilestone.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Timeline milestone not found' }, { status: 404 });
    }

    try {
      revalidatePath('/api/timeline');
      revalidatePath('/timeline');
    } catch (cacheErr) {
      console.warn('[DELETE /api/admin/timeline/[id]] Cache revalidation error:', cacheErr);
    }

    return NextResponse.json({ success: true, message: 'Timeline milestone deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}

