import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { ADMIN_COOKIE_NAME, createAdminSessionToken, verifyPassword } from '@/lib/admin-auth';
import { sanitizeString } from '@/lib/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUsername = body?.username;
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

    const username = sanitizeString(rawUsername)?.toLowerCase();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Try authenticating against MongoDB Admin collection
    const conn = await dbConnect();
    if (conn) {
      const adminDoc = await Admin.findOne({
        $or: [{ username }, { email: username }],
      });

      if (adminDoc) {
        if (adminDoc.status === 'pending') {
          return NextResponse.json(
            { success: false, message: 'Account is pending approval by a superadmin.' },
            { status: 403 }
          );
        }

        const isPasswordValid = await verifyPassword(password, adminDoc.passwordHash);
        if (isPasswordValid) {
          const cookieStore = await cookies();
          const sessionToken = createAdminSessionToken(adminDoc.username);

          cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });

          return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            data: {
              username: adminDoc.username,
              email: adminDoc.email,
              role: adminDoc.role,
            },
          });
        }
      }
    }

    // Fallback to environment default credentials
    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const expectedPass = process.env.ADMIN_PASSWORD || 'admin';

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = await cookies();
      const sessionToken = createAdminSessionToken('admin');

      cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        message: 'Authentication successful (Master Admin)',
        data: { username: 'admin', role: 'superadmin' },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid username or password.' },
      { status: 401 }
    );
  } catch (err: any) {
    console.error('[POST /api/admin/login] Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
