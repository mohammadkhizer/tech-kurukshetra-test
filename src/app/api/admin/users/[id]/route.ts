import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const updated = await Admin.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, select: '-passwordHash' }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Admin user not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error('[PUT /api/admin/users/[id]] Error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update admin user' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Admin user not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Admin user deleted successfully' });
  } catch (err: any) {
    console.error('[DELETE /api/admin/users/[id]] Error:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete admin user' }, { status: 500 });
  }
}
