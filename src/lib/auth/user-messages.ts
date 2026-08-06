const TECHNICAL_ERROR_PATTERN =
  /D1_ERROR|SQLITE_ERROR|SQLITE_|no such table|ECONNREFUSED|internal error/i;

/** Map auth/database failures to a safe user-facing message (never expose stack/SQL). */
export function sanitizeAuthOperationError(error: unknown, fallback: string): string {
  if (import.meta.env.DEV) {
    console.error('[auth]', error);
  }

  if (error instanceof Error && error.message && !TECHNICAL_ERROR_PATTERN.test(error.message)) {
    return error.message;
  }

  return fallback;
}

export const AUTH_UNAVAILABLE_MESSAGE =
  'Inloggen is tijdelijk niet beschikbaar. Probeer het later opnieuw.';

export const AUTH_MAGIC_LINK_FAILED_MESSAGE =
  'Inloglink verzenden mislukt. Probeer het opnieuw.';
