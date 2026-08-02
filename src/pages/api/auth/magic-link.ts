import type { APIRoute } from 'astro';
import { FROM_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import type { D1Database } from '../../../lib/db/d1';
import {
  AuthValidationError,
  createAuthServiceFromEnv,
  normalizeEmail,
} from '../../../lib/auth';
import { AUTH_ROUTES } from '../../../lib/auth/constants';

export const prerender = false;

type MagicLinkPayload = {
  email?: string;
  tenantId?: string;
};

function json(body: { ok: boolean; message?: string }, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getDatabase(locals: App.Locals): D1Database | null {
  const runtime = locals.runtime as { env?: { DB?: D1Database } } | undefined;
  return runtime?.env?.DB ?? null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDatabase(locals);
  if (!db) {
    return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);
  }

  let payload: MagicLinkPayload;
  try {
    payload = (await request.json()) as MagicLinkPayload;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON-payload.' }, 400);
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const tenantId = typeof payload.tenantId === 'string' ? payload.tenantId.trim() : undefined;

  if (!email) {
    return json({ ok: false, message: 'Voer een e-mailadres in.' }, 400);
  }

  const auth = createAuthServiceFromEnv(db, request, {
    resendApiKey: RESEND_API_KEY,
    fromEmail: FROM_EMAIL,
  });

  try {
    await auth.requestMagicLink({ email, tenantId, origin: new URL(request.url).origin });
    return json({ ok: true, redirect: `${AUTH_ROUTES.checkEmail}?email=${encodeURIComponent(normalizeEmail(email))}` }, 200);
  } catch (error) {
    if (error instanceof AuthValidationError) {
      return json({ ok: false, message: error.message }, 400);
    }
    return json(
      { ok: false, message: error instanceof Error ? error.message : 'Inloglink verzenden mislukt.' },
      500,
    );
  }
};
