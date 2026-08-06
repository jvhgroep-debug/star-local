import { generateSecureToken } from '../auth/crypto';

export const CSRF_COOKIE_NAME = 'starlocal_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';

export function generateCsrfToken(): string {
  return generateSecureToken(24);
}

export function csrfCookieHeader(token: string, secure: boolean): string {
  return `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=900; SameSite=Strict${secure ? '; Secure' : ''}`;
}

export function validateCsrfToken(request: Request, cookieToken: string | null): boolean {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (!cookieToken || !headerToken) return false;
  return cookieToken === headerToken;
}

export function readCsrfCookie(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
