import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { ADMIN_COOKIE_NAME, createAdminSessionToken, hashPassword } from '@/lib/admin-auth';
import { sanitizeString } from '@/lib/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUsername = body?.username;
    const rawEmail = body?.email;
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

    const username = sanitizeString(rawUsername)?.toLowerCase();
    const email = sanitizeString(rawEmail)?.toLowerCase();

    if (!username || username.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Username must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failure.' },
        { status: 500 }
      );
    }

    // Check if user or email already exists
    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'Username' : 'Email';
      return NextResponse.json(
        { success: false, message: `${field} is already registered.` },
        { status: 400 }
      );
    }

    const totalAdmins = await Admin.countDocuments();
    const role = totalAdmins === 0 ? 'superadmin' : 'admin';
    const passwordHash = await hashPassword(password);

    const newAdmin = await Admin.create({
      username,
      email,
      passwordHash,
      role,
      status: 'approved',
    });

    // Auto-login session cookie creation
    const cookieStore = await cookies();
    const sessionToken = createAdminSessionToken(newAdmin.username);

    cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully.',
      data: {
        id: newAdmin._id.toString(),
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
      },
    });
  } catch (err: any) {
    console.error('[POST /api/admin/signup] Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to create admin account.' },
      { status: 500 }
    );
  }
}
