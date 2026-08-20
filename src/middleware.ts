import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  // 1. Set Security Headers across all requests (Helmet equivalent)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://placehold.co;"
  );

  // 2. CORS & CSRF Origin Protection for API Routes
  if (pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');

    if (origin && host) {
      const originHost = origin.replace(/^https?:\/\//, '');
      if (originHost !== host) {
        return NextResponse.json({ success: false, message: 'Cross-origin request blocked.' }, { status: 403 });
      }
    }

    // CSRF verification on state-changing API requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const referer = req.headers.get('referer');
      if (referer) {
        const refererHost = referer.replace(/^https?:\/\//, '').split('/')[0];
        if (host && refererHost !== host) {
          return NextResponse.json({ success: false, message: 'CSRF verification failed.' }, { status: 403 });
        }
      }
    }
  }

  // 2. Rate Limiting for sensitive POST routes
  if (pathname === '/api/admin/login' || pathname === '/api/admin/signup') {
    if (req.method === 'POST') {
      const limitResult = checkRateLimit(req, 'admin_auth', 5, 15 * 60 * 1000);
      response.headers.set('X-RateLimit-Limit', String(limitResult.limit));
      response.headers.set('X-RateLimit-Remaining', String(limitResult.remaining));
      response.headers.set('X-RateLimit-Reset', String(limitResult.resetInSeconds));

      if (!limitResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many attempts. Please try again in ${limitResult.resetInSeconds} seconds.`,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(limitResult.resetInSeconds),
              'X-RateLimit-Limit': String(limitResult.limit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(limitResult.resetInSeconds),
            },
          }
        );
      }
    }
  }

  if (pathname === '/api/registration/save') {
    if (req.method === 'POST') {
      const limitResult = checkRateLimit(req, 'registration_save', 5, 15 * 60 * 1000);
      response.headers.set('X-RateLimit-Limit', String(limitResult.limit));
      response.headers.set('X-RateLimit-Remaining', String(limitResult.remaining));
      response.headers.set('X-RateLimit-Reset', String(limitResult.resetInSeconds));

      if (!limitResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many registration attempts. Please try again in ${limitResult.resetInSeconds} seconds.`,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(limitResult.resetInSeconds),
              'X-RateLimit-Limit': String(limitResult.limit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(limitResult.resetInSeconds),
            },
          }
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

  // 4. Admin API Protection (excluding login and signup)
  const isPublicAdminApi = pathname.startsWith('/api/admin/login') || pathname.startsWith('/api/admin/signup');
  if (pathname.startsWith('/api/admin') && !isPublicAdminApi) {
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
