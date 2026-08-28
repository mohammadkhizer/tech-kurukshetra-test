import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { ADMIN_COOKIE_NAME, createAdminSessionToken, verifyPassword } from '@/lib/admin-auth';
import { sanitizeString } from '@/lib/sanitizer';
import { AdminLoginSchema } from '@/lib/schemas';
import { logApiRequest } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = AdminLoginSchema.safeParse(rawBody);

    if (!parsed.success) {
      logApiRequest(req, 400);
      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 400 }
      );
    }

    const { username: rawUsername, password } = parsed.data;
    const username = sanitizeString(rawUsername)?.toLowerCase();

    // Query DB via Mongoose query builder (parameterized)
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
          // Regenerate session ID & signed token to prevent session fixation
          const sessionToken = createAdminSessionToken(adminDoc.username);

          cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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

    // Generic error message on failure — does not reveal whether username or password was wrong
    return NextResponse.json(
      { success: false, message: 'Invalid username or password.' },
      { status: 401 }
    );
  } catch (err: any) {
    console.error('[POST /api/admin/login] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
