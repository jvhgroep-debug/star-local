import type { D1Database } from '../db/d1';
import { AUTH_ROUTES } from './constants';
import { getAuthSession, getSessionTokenFromRequest } from './server';
import type { AuthSessionContext } from './types';

export interface RequireAuthResult {
  session: AuthSessionContext;
  tenantId: string | null;
}

export type AuthGuardResult = RequireAuthResult | { redirect: string };

export async function requireAuthSession(
  request: Request,
  db: D1Database | null | undefined,
  url: URL,
): Promise<AuthGuardResult> {
  if (!db) {
    return { redirect: `${AUTH_ROUTES.login}?error=unavailable` };
  }

  const sessionToken = getSessionTokenFromRequest(request);
  const authSession = sessionToken ? await getAuthSession(db, sessionToken) : null;
  if (!authSession) {
    const next = `${url.pathname}${url.search}`;
    return { redirect: `${AUTH_ROUTES.login}?next=${encodeURIComponent(next)}` };
  }

  let tenantId = url.searchParams.get('tenantId');
  const sessionTenantId = authSession.session.tenantId;
  if (sessionTenantId) {
    if (tenantId && tenantId !== sessionTenantId) {
      return { redirect: `${AUTH_ROUTES.dashboard}?tenantId=${encodeURIComponent(sessionTenantId)}` };
    }
    tenantId = sessionTenantId;
  }

  return { session: authSession, tenantId };
}

export function isAuthRedirect(value: AuthGuardResult): value is { redirect: string } {
  return 'redirect' in value;
}
