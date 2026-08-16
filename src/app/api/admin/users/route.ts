import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: true, data: [] });
    }

    const admins = await Admin.find({}, '-passwordHash').sort({ createdAt: -1 }).lean();
    const formatted = admins.map((item: any) => ({
      ...item,
      id: item._id ? item._id.toString() : '',
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    console.error('[GET /api/admin/users] Error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch admin users' }, { status: 500 });
  }
}
