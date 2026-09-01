import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import { sanitizeString } from '@/lib/sanitizer';
import { ContactSubmitSchema } from '@/lib/schemas';
import { enqueueJob } from '@/lib/queue-processor';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Server-side validation with Zod
    const parsed = ContactSubmitSchema.safeParse(rawBody);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      // If honeypot is filled, silently return 200 to block bots
      if (issue?.path[0] === 'hp') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { success: false, message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid request.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // 2. Sanitize string fields
    const payload = {
      name:    sanitizeString(name),
      email:   sanitizeString(email),
      subject: sanitizeString(subject),
      message: sanitizeString(message),
      status:  'new' as const,
    };

    // 3. Save directly & synchronously to DB (Contact collection)
    let savedId: string | undefined;
    const conn = await dbConnect();
    if (conn) {
      const record = await Contact.create(payload);
      savedId = record._id?.toString();
    } else {
      console.warn('[POST /api/contact] No DB connection — record not persisted.');
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Enqueue background notification email asynchronously without blocking response
    enqueueJob('NOTIFICATION_EMAIL', payload);

    return NextResponse.json({ success: true, id: savedId });
  } catch (err: any) {
    console.error('[POST /api/contact] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
