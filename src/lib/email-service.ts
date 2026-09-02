import nodemailer from 'nodemailer';

const DEFAULT_ADMIN_EMAIL = 'btech_events@svgu.ac.in';

/**
 * Creates and returns a Nodemailer SMTP transporter instance.
 * Returns null if SMTP credentials/host are not configured in environment.
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Useful timeouts for serverless environments
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Sends internal admin notification email for a new Contact Form submission
 */
export async function sendContactAdminNotification(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt?: string;
}): Promise<boolean> {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;
  const fromAddress = process.env.SMTP_FROM || `"Tech Kurukshetra" <${process.env.SMTP_USER || 'noreply@svgu.ac.in'}>`;
  const submittedAt = payload.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const transporter = getTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #111111; padding: 20px; text-align: center; border-bottom: 3px solid #ff7a2f;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; tracking: 1px;">TECH KURUKSHETRA</h2>
        <p style="color: #ff7a2f; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">New Contact Inquiry</p>
      </div>
      <div style="padding: 24px; color: #333333;">
        <p style="font-size: 14px; color: #666666; margin-top: 0;">A new message was submitted via the Contact Form on the website:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 30%; color: #555555;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111111;">${escapeHtml(payload.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #555555;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111111;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #ff7a2f; text-decoration: none;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #555555;">Subject:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111111;">${escapeHtml(payload.subject || 'General Inquiry')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #555555;">Submitted At:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111111;">${escapeHtml(submittedAt)}</td>
          </tr>
        </table>

        <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #ff7a2f; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 13px; color: #555555;">MESSAGE CONTENT:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #222222; line-height: 1.5;">${escapeHtml(payload.message)}</p>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 12px 24px; font-size: 11px; color: #888888; text-align: center;">
        Tech Kurukshetra Internal Notification System • SVGU
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EmailService] SMTP credentials not set. Simulated sending Contact Notification email to ${recipient}.`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: `New Contact Form Submission - ${payload.name}`,
      html: htmlContent,
    });
    console.log(`[EmailService] Successfully sent Contact Notification email to ${recipient}.`);
    return true;
  } catch (err: any) {
    console.error(`[EmailService] Failed to send Contact Notification email to ${recipient}:`, err?.message || err);
    throw err;
  }
}

/**
 * Sends internal admin notification email for a new Registration Form submission
 */
export async function sendRegistrationAdminNotification(payload: {
  orderId?: string;
  name?: string;
  email?: string;
  phone?: string;
  college?: string;
  mode?: string;
  teamName?: string;
  eventSlug?: string;
  paymentStatus?: string;
  rawPayload?: any;
  submittedAt?: string;
}): Promise<boolean> {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;
  const fromAddress = process.env.SMTP_FROM || `"Tech Kurukshetra" <${process.env.SMTP_USER || 'noreply@svgu.ac.in'}>`;
  const submittedAt = payload.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const raw = payload.rawPayload || {};
  const eventName = payload.eventSlug || raw.eventSlug || 'Festival Event';
  const teamOrName = payload.teamName || payload.name || raw.fullName || 'Participant';
  const players = Array.isArray(raw.players) ? raw.players : [];

  const transporter = getTransporter();

  // Format team players HTML table rows
  let playersHtml = '';
  if (players.length > 0) {
    playersHtml = players
      .map(
        (p: any, idx: number) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
          <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${idx === 0 ? '<strong>Captain</strong>' : `Member ${idx + 1}`}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(p.name || p.fullName || 'N/A')}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(p.email || 'N/A')}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(p.phone || p.mobile || 'N/A')}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(p.college || p.university || 'N/A')}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(p.course || p.branch || 'N/A')}</td>
        </tr>
      `
      )
      .join('');
  } else {
    // Single player row
    playersHtml = `
      <tr>
        <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;"><strong>Participant</strong></td>
        <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(payload.name || 'N/A')}</td>
        <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(payload.email || 'N/A')}</td>
        <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(payload.phone || 'N/A')}</td>
        <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(payload.college || 'N/A')}</td>
        <td style="padding: 8px; border: 1px solid #e0e0e0; font-size: 13px;">${escapeHtml(raw.course || 'N/A')}</td>
      </tr>
    `;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #111111; padding: 20px; text-align: center; border-bottom: 3px solid #ff7a2f;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; tracking: 1px;">TECH KURUKSHETRA</h2>
        <p style="color: #ff7a2f; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">New Event Registration</p>
      </div>
      <div style="padding: 24px; color: #333333;">
        <p style="font-size: 14px; color: #666666; margin-top: 0;">A new registration has been received for Tech Kurukshetra:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #fafafa; border: 1px solid #eeeeee;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%; color: #555555;">Event:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #ff7a2f; font-weight: bold;">${escapeHtml(eventName)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Mode / Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111; text-transform: uppercase;">${escapeHtml(payload.mode || 'Individual')}</td>
          </tr>
          ${
            payload.teamName
              ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Team Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111; font-weight: bold;">${escapeHtml(payload.teamName)}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Order ID / Ref:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111; font-family: monospace;">${escapeHtml(payload.orderId || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Payment Status:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111;">${escapeHtml(payload.paymentStatus || 'completed')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555555;">Submitted At:</td>
            <td style="padding: 10px; color: #111111;">${escapeHtml(submittedAt)}</td>
          </tr>
        </table>

        <h3 style="font-size: 15px; color: #111111; margin: 20px 0 10px 0; border-bottom: 2px solid #ff7a2f; padding-bottom: 4px;">PARTICIPANT / TEAM DETAILS</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #111111; color: #ffffff;">
              <th style="padding: 8px; border: 1px solid #111111; font-size: 12px; text-align: left;">Role</th>
              <th style="padding: 8px; border: 1px solid #111111; font-size: 12px; text-align: left;">Name</th>
              <th style="padding: 8px; border: 1px solid #111111; font-size: 12px; text-align: left;">Email</th>
              <th style="padding: 8px; border: 1px solid #111111; font-size: 12px; text-align: left;">Phone</th>
              <th style="padding: 8px; border: 1px solid #111111; font-size: 12px; text-align: left;">College</th>
              <th style="padding: 8px; border: 1px solid #111111; font-size: 12px; text-align: left;">Branch/Sem</th>
            </tr>
          </thead>
          <tbody>
            ${playersHtml}
          </tbody>
        </table>
      </div>
      <div style="background-color: #f4f4f4; padding: 12px 24px; font-size: 11px; color: #888888; text-align: center;">
        Tech Kurukshetra Internal Registration System • SVGU
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EmailService] SMTP credentials not set. Simulated sending Registration Notification email to ${recipient}.`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: `New Registration - ${eventName} - ${teamOrName}`,
      html: htmlContent,
    });
    console.log(`[EmailService] Successfully sent Registration Notification email to ${recipient}.`);
    return true;
  } catch (err: any) {
    console.error(`[EmailService] Failed to send Registration Notification email to ${recipient}:`, err?.message || err);
    throw err;
  }
}

/**
 * Sends internal admin notification email for a new Feedback Form submission
 */
export async function sendFeedbackAdminNotification(payload: {
  name: string;
  email: string;
  phone?: string;
  eventsAttended?: string[];
  rating: number;
  likedMost?: string;
  improvements: string;
  wouldRecommend: string;
  submittedAt?: string;
}): Promise<boolean> {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;
  const fromAddress = process.env.SMTP_FROM || `"Tech Kurukshetra" <${process.env.SMTP_USER || 'noreply@svgu.ac.in'}>`;
  const submittedAt = payload.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const events = Array.isArray(payload.eventsAttended) && payload.eventsAttended.length > 0
    ? payload.eventsAttended.join(', ')
    : 'General / Overall';

  const starRating = '★'.repeat(Math.max(1, Math.min(5, payload.rating))) +
    '☆'.repeat(5 - Math.max(1, Math.min(5, payload.rating)));

  const transporter = getTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #111111; padding: 20px; text-align: center; border-bottom: 3px solid #ff7a2f;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; tracking: 1px;">TECH KURUKSHETRA</h2>
        <p style="color: #ff7a2f; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">New Event Feedback Submitted</p>
      </div>
      <div style="padding: 24px; color: #333333;">
        <p style="font-size: 14px; color: #666666; margin-top: 0;">A participant has submitted feedback for Tech Kurukshetra:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #fafafa; border: 1px solid #eeeeee;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%; color: #555555;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111;">${escapeHtml(payload.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #ff7a2f; text-decoration: none;">${escapeHtml(payload.email)}</a></td>
          </tr>
          ${payload.phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111;">${escapeHtml(payload.phone)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Events Attended:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111; font-weight: bold;">${escapeHtml(events)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Overall Rating:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #ff7a2f; font-size: 16px; font-weight: bold;">
              ${starRating} (${payload.rating}/5)
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Would Attend/Recommend Again:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #111111; font-weight: bold;">${escapeHtml(payload.wouldRecommend)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555555;">Submitted At:</td>
            <td style="padding: 10px; color: #111111;">${escapeHtml(submittedAt)}</td>
          </tr>
        </table>

        ${payload.likedMost ? `
        <div style="background-color: #f0fdf4; padding: 14px; border-left: 4px solid #22c55e; border-radius: 4px; margin-bottom: 14px;">
          <p style="margin: 0 0 6px 0; font-weight: bold; font-size: 12px; color: #15803d; text-transform: uppercase;">WHAT THEY LIKED MOST:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #166534; line-height: 1.5;">${escapeHtml(payload.likedMost)}</p>
        </div>` : ''}

        <div style="background-color: #fff7ed; padding: 14px; border-left: 4px solid #ff7a2f; border-radius: 4px;">
          <p style="margin: 0 0 6px 0; font-weight: bold; font-size: 12px; color: #c2410c; text-transform: uppercase;">WHAT COULD BE IMPROVED:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #9a3412; line-height: 1.5;">${escapeHtml(payload.improvements)}</p>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 12px 24px; font-size: 11px; color: #888888; text-align: center;">
        Tech Kurukshetra Internal Feedback System • SVGU
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EmailService] SMTP credentials not set. Simulated sending Feedback Notification email to ${recipient}.`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: `New Feedback Submitted - ${payload.name} - ${payload.rating}/5`,
      html: htmlContent,
    });
    console.log(`[EmailService] Successfully sent Feedback Notification email to ${recipient}.`);
    return true;
  } catch (err: any) {
    console.error(`[EmailService] Failed to send Feedback Notification email to ${recipient}:`, err?.message || err);
    throw err;
  }
}

function escapeHtml(str: any): string {

  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
