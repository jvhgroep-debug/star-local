import type { D1Database } from '../db/d1';
import {
  adminForbiddenJson,
  adminUnauthorizedJson,
  isAdminForbidden,
  requireAdminSession,
} from '../auth/admin-guard';
import { isAuthRedirect, type RequireAuthResult } from '../auth/guard';

export function getAdminApiDatabase(locals: App.Locals): D1Database | null {
  return (locals.runtime as { env?: { DB?: D1Database } })?.env?.DB ?? null;
}

export type AdminApiAccess = { db: D1Database; session: RequireAuthResult };

export async function requireAdminApiAccess(
  request: Request,
  locals: App.Locals,
  url: URL,
): Promise<Response | AdminApiAccess> {
  const db = getAdminApiDatabase(locals);
  if (!db) {
    return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);
  }

  const auth = await requireAdminSession(request, db, url);
  if (isAuthRedirect(auth)) return adminUnauthorizedJson();
  if (isAdminForbidden(auth)) return adminForbiddenJson();

  return { db, session: auth };
}

export function isAdminApiDenied(value: Response | AdminApiAccess): value is Response {
  return value instanceof Response;
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
