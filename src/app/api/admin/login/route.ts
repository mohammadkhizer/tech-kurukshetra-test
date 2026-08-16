import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from '@/lib/admin-auth';
import { sanitizeString } from '@/lib/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = sanitizeString(body?.username);
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'admin';

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = await cookies();
      const sessionToken = createAdminSessionToken();

      cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true, message: 'Authentication successful' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials provided.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
