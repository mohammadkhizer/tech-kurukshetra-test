import { NextRequest } from 'next/server';

export function logApiRequest(req: NextRequest, status: number, durationMs?: number) {
  const method = req.method;
  const path = req.nextUrl.pathname;
  const timestamp = new Date().toISOString();

  // Mask IP for privacy compliant logging
  const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const maskedIp = rawIp.split(',')[0].trim().replace(/\.\d+\.\d+$/, '.x.x');

  console.log(`[AUDIT LOG] ${timestamp} | ${method} ${path} | Status: ${status} | IP: ${maskedIp}${durationMs ? ` | ${durationMs}ms` : ''}`);
}
