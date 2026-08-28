/**
 * Input sanitization utility functions for form fields and API request bodies.
 */

/**
 * Strips null bytes (\0), NoSQL operators ($ and .), HTML tags, and inline JS handlers.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input
    // Strip null bytes
    .replace(/\0/g, '')
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline JS handlers like onload=, onclick=
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^\s]*/gi, '')
    // Strip NoSQL query operator prefix ($)
    .replace(/^\$/, '')
    // HTML entity escaping
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.trim();
}

/**
 * Sanitizes a URL field. Strips dangerous schemes (javascript:, data:, vbscript:)
 * and null bytes WITHOUT HTML-encoding URL characters like slashes and ampersands.
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  const url = input.replace(/\0/g, '').trim();

  // Decode any previously HTML-encoded entities so we can validate the real URL
  const decoded = decodeHtmlEntities(url);

  // Block dangerous schemes
  if (/^(javascript|data|vbscript):/i.test(decoded.replace(/\s/g, ''))) {
    return '';
  }

  // Strip inline event handler patterns
  const cleaned = decoded
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/<[^>]*>/g, '') // strip any stray HTML tags
    .replace(/^\$/, '');     // NoSQL prefix guard

  return cleaned.trim();
}

/**
 * Decodes HTML entities that may have been stored in the database.
 */
export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#x2F;/gi, '/')
    .replace(/&#x27;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"');
}

/**
 * Sanitizes object keys against NoSQL injection (rejects keys starting with $ or containing .)
 */
export function sanitizeNoSqlKey(key: string): string {
  return key.replace(/\0/g, '').replace(/^\$/, '').replace(/\./g, '_');
}

/**
 * Recursively sanitizes strings and keys inside an object or array.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Prevent prototype pollution and NoSQL key operator injection
      const cleanKey = sanitizeNoSqlKey(sanitizeString(key));
      if (cleanKey !== '__proto__' && cleanKey !== 'constructor' && cleanKey !== 'prototype') {
        sanitizedObj[cleanKey] = sanitizeObject(value);
      }
    }
    return sanitizedObj as T;
  }

  return obj;
}

/**
 * Validates whether an email format is strict and clean.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number format (optional leading +, 7 to 15 digits).
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
  return phoneRegex.test(phone.trim());
}
