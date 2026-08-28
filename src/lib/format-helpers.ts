/**
 * Shared formatting helpers for event metadata display.
 * Import from here instead of defining local one-offs per page.
 */

/**
 * Formats a teamSize value (string, number, or {min, max} object) into a
 * human-readable string safe to render as a React child.
 *
 * Rules:
 *   min === max === 1  → "Solo"
 *   min === max > 1    → "${min} Players"
 *   min !== max        → "${min}-${max} Players"
 *   string / number    → returned as-is
 *   falsy              → "Solo"
 */
export function formatTeamSize(ts: any): string {
  if (!ts) return 'Solo';

  if (typeof ts === 'object' && ts !== null) {
    const min = Number(ts.min) || 1;
    const max = Number(ts.max) || 1;
    if (min === 1 && max === 1) return 'Solo';
    if (min === max) return `${min} Player${min > 1 ? 's' : ''}`;
    return `${min}-${max} Players`;
  }

  // Already a string/number — return as-is
  return String(ts);
}

/**
 * Formats a coordinatorContact object into a safe display string.
 * Falls back to empty string so it can be used with && guards.
 */
export function formatCoordinatorContact(
  contact: any
): { name: string; phone: string; email: string } | null {
  if (!contact || typeof contact !== 'object') return null;
  return {
    name: String(contact.name || ''),
    phone: String(contact.phone || ''),
    email: String(contact.email || ''),
  };
}
