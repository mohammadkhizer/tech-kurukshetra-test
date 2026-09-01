/**
 * Non-Blocking Async Queue Processor
 * Handles background tasks (Google Sheets sync, confirmation emails) asynchronously
 * without delaying or blocking user HTTP responses.
 */

export interface QueueJob {
  id: string;
  type: 'SHEETS_SYNC' | 'CONFIRMATION_EMAIL' | 'NOTIFICATION_EMAIL';
  payload: Record<string, any>;
  attempts: number;
  maxRetries: number;
  createdAt: string;
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

// In-memory audit log of failed queue jobs
const failedJobsStore: QueueJob[] = [];

/**
 * Enqueues a job for background processing.
 * Executes asynchronously using non-blocking execution so the caller (HTTP handler)
 * receives an immediate response.
 */
export function enqueueJob(
  type: QueueJob['type'],
  payload: Record<string, any>,
  maxRetries = MAX_RETRIES
): void {
  const job: QueueJob = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    attempts: 0,
    maxRetries,
    createdAt: new Date().toISOString(),
  };

  // Schedule background processing without blocking the execution stack
  if (typeof setImmediate !== 'undefined') {
    setImmediate(() => processJob(job));
  } else {
    setTimeout(() => processJob(job), 0);
  }
}

async function processJob(job: QueueJob): Promise<void> {
  job.attempts += 1;

  try {
    switch (job.type) {
      case 'SHEETS_SYNC':
        await syncToGoogleSheets(job.payload);
        console.log(`[QueueProcessor] Job ${job.id} (SHEETS_SYNC) succeeded on attempt ${job.attempts}.`);
        break;

      case 'CONFIRMATION_EMAIL':
        await sendConfirmationEmail(job.payload);
        console.log(`[QueueProcessor] Job ${job.id} (CONFIRMATION_EMAIL) succeeded on attempt ${job.attempts}.`);
        break;

      case 'NOTIFICATION_EMAIL':
        await sendNotificationEmail(job.payload);
        console.log(`[QueueProcessor] Job ${job.id} (NOTIFICATION_EMAIL) succeeded on attempt ${job.attempts}.`);
        break;

      default:
        console.warn(`[QueueProcessor] Unknown job type: ${(job as any).type}`);
    }
  } catch (err: any) {
    console.error(
      `[QueueProcessor] Job ${job.id} (${job.type}) failed attempt ${job.attempts}/${job.maxRetries}:`,
      err?.message || err
    );

    if (job.attempts < job.maxRetries) {
      const backoffMs = INITIAL_BACKOFF_MS * Math.pow(3, job.attempts - 1);
      console.log(`[QueueProcessor] Retrying job ${job.id} in ${backoffMs}ms...`);
      setTimeout(() => processJob(job), backoffMs);
    } else {
      console.error(
        `[QueueProcessor] EXHAUSTED RETRIES for job ${job.id} (${job.type}). Payload:`,
        JSON.stringify(job.payload)
      );
      failedJobsStore.push(job);
    }
  }
}

/**
 * Worker helper to post registration data to Google Apps Script
 */
async function syncToGoogleSheets(payload: Record<string, any>): Promise<void> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.log('[QueueProcessor] Google Script URL not configured. Skipping external Sheets sync.');
    return;
  }

  const mappedPayload = {
    'ORDER ID': payload.orderId || '',
    'NAME': payload.name || '',
    'EMAIL': payload.email || '',
    'MOBILE NO.': payload.phone || '',
    'INSTITUTION NAME': payload.college || '',
    'BRACH & SEM': payload.rawPayload?.course || payload.rawPayload?.yearOfStudy || '',
    'EVENT NAME': payload.eventSlug || '',
    'CATEGORY': payload.rawPayload?.eventCategory || 'TECH',
    'TEAM NAME': payload.teamName || '',
    'TEAM MEMBERS': JSON.stringify(payload.rawPayload?.players || []),
    'AMOUNT': payload.rawPayload?.amount || 0,
    'STATUS': payload.paymentStatus || 'completed',
    'UTR': payload.orderId || '',
    'DATE & TIME': new Date().toISOString(),
  };

  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(mappedPayload),
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script HTTP error ${response.status}: ${response.statusText}`);
  }
}

import { sendContactAdminNotification, sendRegistrationAdminNotification } from './email-service';

/**
 * Worker helper for sending registration admin notification email
 */
async function sendConfirmationEmail(payload: Record<string, any>): Promise<void> {
  await sendRegistrationAdminNotification(payload as any);
}

/**
 * Worker helper for sending contact form admin notification email
 */
async function sendNotificationEmail(payload: Record<string, any>): Promise<void> {
  await sendContactAdminNotification(payload as any);
}

/**
 * Get audit list of failed jobs for admin review
 */
export function getFailedQueueJobs(): QueueJob[] {
  return [...failedJobsStore];
}
