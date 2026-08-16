import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'tk_admin_session';

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'tk_fallback_secret_key_2027_secure'
  );
}

/**
 * Creates an edge-compatible signed session token containing timestamp, nonce, and hash signature.
 */
export function createAdminSessionToken(): string {
  const secret = getSecretKey();
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const payload = `admin:${timestamp}:${nonce}`;

  let hash = 0;
  const combined = `${payload}:${secret}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const signature = Math.abs(hash).toString(36);
  const rawToken = `${payload}:${signature}`;

  return typeof btoa !== 'undefined'
    ? btoa(rawToken)
    : Buffer.from(rawToken).toString('base64');
}

/**
 * Verifies incoming admin session token string. Works natively in Edge Middleware and Node.js.
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token) return false;

  try {
    const decoded = typeof atob !== 'undefined'
      ? atob(token)
      : Buffer.from(token, 'base64').toString('utf-8');

    const parts = decoded.split(':');
    if (parts.length !== 4) return false;

    const [user, timestampStr, nonce, signature] = parts;
    if (user !== 'admin') return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Expiration check (7 days)
    const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > MAX_AGE_MS) return false;

    const secret = getSecretKey();
    const combined = `${user}:${timestampStr}:${nonce}:${secret}`;

    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const expectedSignature = Math.abs(hash).toString(36);

    return signature === expectedSignature;
  } catch (err) {
    return false;
  }
}

/**
 * Server-side function to verify admin authentication from cookies.
 */
export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!session?.value) return false;

  return verifyAdminSessionToken(session.value);
}

export { ADMIN_COOKIE_NAME };
