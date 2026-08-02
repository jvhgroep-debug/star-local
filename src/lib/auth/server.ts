import type { D1Database } from '../db/d1';
import { createAuthService, type AuthServiceOptions } from './auth.service';
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from './constants';
import type { AuthSessionContext } from './types';

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function buildSessionCookie(sessionToken: string, secure: boolean): string {
  const maxAge = SESSION_TTL_SECONDS;
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionToken)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearSessionCookie(secure: boolean): string {
  const parts = [`${SESSION_COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export async function getAuthSession(
  db: D1Database,
  sessionToken: string | undefined | null,
): Promise<AuthSessionContext | null> {
  return createAuthService(db).getSessionFromToken(sessionToken);
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function isSecureRequest(request: Request): boolean {
  const url = new URL(request.url);
  return url.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
}

export function createAuthServiceFromEnv(db: D1Database, request: Request, env: AuthServiceOptions): ReturnType<typeof createAuthService> {
  const origin = new URL(request.url).origin;
  return createAuthService(db, { ...env, origin });
}
