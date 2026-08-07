import { ADMIN_ALLOWED_EMAILS, ADMIN_NOTIFICATION_EMAIL } from 'astro:env/server';
import type { D1Database } from '../db/d1';
import { AUTH_ROUTES } from './constants';
import { normalizeEmail } from './crypto';
import { getAuthSession, getSessionTokenFromRequest } from './server';
import type { AuthSessionContext } from './types';

export type AdminGuardResult =
  | { session: AuthSessionContext; tenantId: null }
  | { redirect: string }
  | { forbidden: true };

function parseAdminAllowedEmails(): Set<string> {
  const raw = ADMIN_ALLOWED_EMAILS?.trim() || ADMIN_NOTIFICATION_EMAIL?.trim() || '';
  return new Set(
    raw
      .split(',')
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string): boolean {
  const allowed = parseAdminAllowedEmails();
  if (allowed.size === 0) return false;
  return allowed.has(normalizeEmail(email));
}

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === '/admin/login' || pathname.startsWith('/admin/login/');
}

export function isAdminCheckEmailPath(pathname: string): boolean {
  return pathname === '/admin/check-email' || pathname.startsWith('/admin/check-email/');
}

/** Admin login/check-email — no session required. */
export function isAdminPublicAuthPath(pathname: string): boolean {
  return isAdminLoginPath(pathname) || isAdminCheckEmailPath(pathname);
}

export function isAdminPagePath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function isAdminApiPath(pathname: string): boolean {
  return pathname === '/api/admin' || pathname.startsWith('/api/admin/');
}

export function buildAdminLoginRedirect(url: URL): string {
  const next = `${url.pathname}${url.search}`;
  return `${AUTH_ROUTES.adminLogin}?next=${encodeURIComponent(next)}`;
}

function sanitizeRelativeRedirectPath(value: string | null | undefined): string | null {
  if (!value) return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

export function sanitizeAdminRedirectPath(value: string | null | undefined): string | null {
  const path = sanitizeRelativeRedirectPath(value);
  if (!path) return null;
  if (path === '/admin' || path.startsWith('/admin/')) {
    if (isAdminPublicAuthPath(path)) return AUTH_ROUTES.adminDefault;
    return path;
  }
  return AUTH_ROUTES.adminDefault;
}

export async function requireAdminSession(
  request: Request,
  db: D1Database | null | undefined,
  url: URL,
): Promise<AdminGuardResult> {
  if (!db) {
    return { redirect: `${AUTH_ROUTES.adminLogin}?error=unavailable` };
  }

  const sessionToken = getSessionTokenFromRequest(request);
  const authSession = sessionToken ? await getAuthSession(db, sessionToken) : null;
  if (!authSession) {
    return { redirect: buildAdminLoginRedirect(url) };
  }

  if (!isAdminEmail(authSession.user.email)) {
    return { forbidden: true };
  }

  return { session: authSession, tenantId: null };
}

export function isAdminForbidden(value: AdminGuardResult): value is { forbidden: true } {
  return 'forbidden' in value;
}

export function isAdminAuthRedirect(value: AdminGuardResult): value is { redirect: string } {
  return 'redirect' in value;
}

export function adminForbiddenRedirect(): string {
  return `${AUTH_ROUTES.adminLogin}?error=forbidden`;
}

export function adminUnauthorizedJson(): Response {
  return new Response(JSON.stringify({ ok: false, message: 'Niet geautoriseerd.' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function adminForbiddenJson(): Response {
  return new Response(JSON.stringify({ ok: false, message: 'Geen admin-toegang.' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}
