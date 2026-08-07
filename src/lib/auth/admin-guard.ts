import { ADMIN_ALLOWED_EMAILS, ADMIN_NOTIFICATION_EMAIL } from 'astro:env/server';
import type { D1Database } from '../db/d1';
import { AUTH_ROUTES } from './constants';
import { normalizeEmail } from './crypto';
import { isAuthRedirect, requireAuthSession, type AuthGuardResult, type RequireAuthResult } from './guard';

export type AdminGuardResult = RequireAuthResult | { redirect: string } | { forbidden: true };

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

export async function requireAdminSession(
  request: Request,
  db: D1Database | null | undefined,
  url: URL,
): Promise<AdminGuardResult> {
  const auth = await requireAuthSession(request, db, url);
  if (isAuthRedirect(auth)) {
    return auth;
  }

  if (!isAdminEmail(auth.session.user.email)) {
    return { forbidden: true };
  }

  return auth;
}

export function isAdminForbidden(value: AdminGuardResult): value is { forbidden: true } {
  return 'forbidden' in value;
}

export function adminForbiddenRedirect(): string {
  return `${AUTH_ROUTES.dashboard}?error=admin_forbidden`;
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

export function isAdminPagePath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function isAdminApiPath(pathname: string): boolean {
  return pathname === '/api/admin' || pathname.startsWith('/api/admin/');
}

export async function guardAdminRequest(
  request: Request,
  db: D1Database | null | undefined,
  url: URL,
): Promise<Response | null> {
  if (!isAdminPagePath(url.pathname) && !isAdminApiPath(url.pathname)) {
    return null;
  }

  const auth = await requireAdminSession(request, db, url);

  if (isAdminApiPath(url.pathname)) {
    if (isAuthRedirect(auth)) return adminUnauthorizedJson();
    if (isAdminForbidden(auth)) return adminForbiddenJson();
    return null;
  }

  if (isAuthRedirect(auth)) {
    return Response.redirect(auth.redirect, 302);
  }
  if (isAdminForbidden(auth)) {
    return Response.redirect(adminForbiddenRedirect(), 302);
  }

  return null;
}

/** Narrow auth guard result after admin checks (for route handlers). */
export function assertAdminSession(value: AuthGuardResult | AdminGuardResult): RequireAuthResult | null {
  if (isAuthRedirect(value) || isAdminForbidden(value)) return null;
  return value;
}
