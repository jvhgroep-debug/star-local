import type { APIRoute } from 'astro';
import { FROM_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import type { D1Database } from '../../../lib/db/d1';
import {
  AuthValidationError,
  AUTH_NEXT_COOKIE,
  createAuthServiceFromEnv,
  normalizeEmail,
  sanitizeAuthRedirectPath,
} from '../../../lib/auth';
import { readCsrfCookie, validateCsrfToken } from '../../../lib/customer-portal/csrf';
import { AUTH_ROUTES } from '../../../lib/auth/constants';
import {
  AUTH_MAGIC_LINK_FAILED_MESSAGE,
  AUTH_UNAVAILABLE_MESSAGE,
  sanitizeAuthOperationError,
} from '../../../lib/auth/user-messages';
import { buildMagicLinkUrl } from '../../../lib/email/magic-link-template';

export const prerender = false;

type MagicLinkPayload = {
  email?: string;
  tenantId?: string;
  next?: string;
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
    return json({ ok: false, message: AUTH_UNAVAILABLE_MESSAGE }, 503);
  }

  let payload: MagicLinkPayload;
  try {
    payload = (await request.json()) as MagicLinkPayload;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON-payload.' }, 400);
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const tenantId = typeof payload.tenantId === 'string' ? payload.tenantId.trim() : undefined;
  const nextPath = sanitizeAuthRedirectPath(typeof payload.next === 'string' ? payload.next : undefined);

  if (!email) {
    return json({ ok: false, message: 'Voer een e-mailadres in.' }, 400);
  }

  if (!validateCsrfToken(request, readCsrfCookie(request))) {
    return json({ ok: false, message: 'Beveiligingscontrole mislukt. Vernieuw de pagina en probeer opnieuw.' }, 403);
  }

  const auth = createAuthServiceFromEnv(db, request, {
    resendApiKey: RESEND_API_KEY,
    fromEmail: FROM_EMAIL,
  });

  try {
    const origin = new URL(request.url).origin;
    const { emailSent, plainToken, suppressed } = await auth.requestMagicLink(
      { email, tenantId, origin, existingCustomerOnly: true },
      request,
    );
    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (nextPath) {
      headers.append(
        'Set-Cookie',
        `${AUTH_NEXT_COOKIE}=${encodeURIComponent(nextPath)}; Path=/; Max-Age=1800; SameSite=Lax${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`,
      );
    }

    const redirectParams = new URLSearchParams({ email: normalizeEmail(email) });
    if (!emailSent) {
      redirectParams.set('emailSent', '0');
    }

    const body: Record<string, unknown> = {
      ok: true,
      emailSent,
      redirect: `${AUTH_ROUTES.checkEmail}?${redirectParams.toString()}`,
    };

    if (import.meta.env.DEV && !emailSent && !suppressed && plainToken) {
      const devMagicUrl = buildMagicLinkUrl(origin, plainToken);
      console.info('[auth/dev] Magic link (e-mail niet verzonden):', devMagicUrl);
      body.devMagicUrl = devMagicUrl;
      body.devNotice =
        'Lokale ontwikkelmodus: e-mail is niet verzonden. Gebruik de inloglink op de volgende pagina om te testen.';
    }

    return new Response(JSON.stringify(body), { status: 200, headers });
  } catch (error) {
    if (error instanceof AuthValidationError) {
      return json({ ok: false, message: error.message }, 400);
    }
    return json(
      {
        ok: false,
        message: sanitizeAuthOperationError(error, AUTH_MAGIC_LINK_FAILED_MESSAGE),
      },
      500,
    );
  }
};
