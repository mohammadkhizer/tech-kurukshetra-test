import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Feedback from '@/lib/models/Feedback';
import { sanitizeString, sanitizeObject } from '@/lib/sanitizer';
import { FeedbackSubmitSchema } from '@/lib/schemas';
import { enqueueJob } from '@/lib/queue-processor';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Server-side validation with Zod
    const parsed = FeedbackSubmitSchema.safeParse(rawBody);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      // If honeypot is filled, silently return 200 to block bots
      if (issue?.path[0] === 'hp') {
        return NextResponse.json({ success: true });
      }

      // Collect field-level error mapping for frontend display
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const fieldName = err.path.join('.');
        if (!errors[fieldName]) {
          errors[fieldName] = err.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid request.',
          errors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      eventsAttended,
      rating,
      likedMost,
      improvements,
      wouldRecommend,
    } = parsed.data;

    // 2. Sanitize fields against XSS/NoSQL injections
    const payload = {
      name: sanitizeString(name),
      email: sanitizeString(email),
      phone: sanitizeString(phone || ''),
      eventsAttended: (eventsAttended || []).map((e) => sanitizeString(e)),
      rating: Number(rating),
      likedMost: sanitizeString(likedMost || ''),
      improvements: sanitizeString(improvements),
      wouldRecommend: sanitizeString(wouldRecommend) as 'Yes' | 'No' | 'Maybe',
      status: 'new' as const,
    };

    // 3. Save directly & synchronously to DB (Feedback collection)
    let savedId: string | undefined;
    const conn = await dbConnect();
    if (conn) {
      const record = await Feedback.create(payload);
      savedId = record._id?.toString();
    } else {
      console.warn('[POST /api/feedback] No DB connection — record not persisted.');
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Enqueue background notification email asynchronously without blocking response
    enqueueJob('FEEDBACK_NOTIFICATION', {
      ...payload,
      id: savedId,
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });

    return NextResponse.json({ success: true, id: savedId });
  } catch (err: any) {
    console.error('[POST /api/feedback] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
