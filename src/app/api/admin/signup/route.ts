import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { ADMIN_COOKIE_NAME, createAdminSessionToken, hashPassword } from '@/lib/admin-auth';
import { sanitizeString } from '@/lib/sanitizer';

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'Public admin signup is disabled.' },
    { status: 403 }
  );
}
