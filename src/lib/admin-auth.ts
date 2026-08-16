import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'tk_admin_session';

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'tk_fallback_secret_key_2027_secure'
  );
}

/**
 * Creates an HMAC-SHA256 signed session token containing timestamp, nonce, and signature.
 */
export function createAdminSessionToken(): string {
  const secret = getSecretKey();
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `admin:${timestamp}:${nonce}`;
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

/**
 * Verifies the HMAC-SHA256 signature and expiration of an incoming admin session token string.
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    
    if (parts.length !== 4) return false;
    const [user, timestampStr, nonce, signature] = parts;

    if (user !== 'admin') return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check expiration (7 days)
    const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > MAX_AGE_MS) return false;

    const secret = getSecretKey();
    const payload = `${user}:${timestampStr}:${nonce}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Timing-safe buffer comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
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
