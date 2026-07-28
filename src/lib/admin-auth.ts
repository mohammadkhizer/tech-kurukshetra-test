import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'tk_admin_session';

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!session?.value) return false;

  const adminPass = process.env.ADMIN_PASSWORD || 'admin';
  const expectedToken = Buffer.from(`admin:${adminPass}`).toString('base64');

  return session.value === expectedToken;
}

export function getExpectedToken(): string {
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';
  return Buffer.from(`admin:${adminPass}`).toString('base64');
}

export { ADMIN_COOKIE_NAME };
