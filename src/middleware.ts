import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  // 1. Set Security Headers across all requests
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 2. Rate Limiting for sensitive POST routes
  if (pathname === '/api/admin/login') {
    if (req.method === 'POST') {
      const limitResult = checkRateLimit(req, 'admin_login', 5, 15 * 60 * 1000);
      if (!limitResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many login attempts. Please try again in ${limitResult.resetInSeconds} seconds.`,
          },
          { status: 429, headers: { 'Retry-After': String(limitResult.resetInSeconds) } }
        );
      }
    }
  }

  if (pathname === '/api/registration/save') {
    if (req.method === 'POST') {
      const limitResult = checkRateLimit(req, 'registration_save', 5, 15 * 60 * 1000);
      if (!limitResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many registration attempts. Please try again in ${limitResult.resetInSeconds} seconds.`,
          },
          { status: 429, headers: { 'Retry-After': String(limitResult.resetInSeconds) } }
        );
      }
    }
  }

  // 3. Admin Page Protection
  if (pathname.startsWith('/admin/dashboard')) {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME);
    const isAuthenticated = sessionCookie?.value
      ? verifyAdminSessionToken(sessionCookie.value)
      : false;

    if (!isAuthenticated) {
      const authUrl = req.nextUrl.clone();
      authUrl.pathname = '/admin/auth';
      return NextResponse.redirect(authUrl);
    }
  }

  // 4. Admin API Protection (excluding login)
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')) {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME);
    const isAuthenticated = sessionCookie?.value
      ? verifyAdminSessionToken(sessionCookie.value)
      : false;

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/registration/:path*'],
};
