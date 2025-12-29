/**
 * Centralized security configuration helpers.
 *
 * NOTE:
 * - Never ship with a hardcoded JWT secret fallback.
 */

export function getJwtSecret(): string {
  const secret = (process.env.SECRET_KEY || '').trim();
  if (!secret) {
    throw new Error('Missing required environment variable: SECRET_KEY');
  }
  return secret;
}
