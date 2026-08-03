import type { APIRoute } from 'astro';
import { FROM_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { createAuthServiceFromEnv } from '../../../lib/auth';
import { AuthRepository } from '../../../lib/auth/repository';
import { getAuthSession, getSessionTokenFromRequest } from '../../../lib/auth/server';
import { createRepositories } from '../../../lib/db';
import type { D1Database } from '../../../lib/db/d1';
import { createMediaServiceOrLocal } from '../../../lib/media';
import type { R2Bucket } from '../../../lib/media/r2';
import { SaveValidationError, WebsiteSaveService } from '../../../lib/publish/website-save.service';
import type { SaveWebsitePayload, SaveWebsiteResponse } from '../../../types/save';

export const prerender = false;

function json(body: SaveWebsiteResponse, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getRuntimeEnv(locals: App.Locals): { db: D1Database | null; media: R2Bucket | null } {
  const runtime = locals.runtime as { env?: { DB?: D1Database; MEDIA?: R2Bucket } } | undefined;
  return {
    db: runtime?.env?.DB ?? null,
    media: runtime?.env?.MEDIA ?? null,
  };
}

export const POST: APIRoute = async ({ request, locals }) => {
  const { db, media } = getRuntimeEnv(locals);
  if (!db) {
    return json(
      {
        ok: false,
        code: 'DB_UNAVAILABLE',
        message: 'Database niet beschikbaar. Probeer het later opnieuw.',
      },
      503,
    );
  }

  let payload: SaveWebsitePayload;
  try {
    payload = (await request.json()) as SaveWebsitePayload;
  } catch {
    return json({ ok: false, code: 'INVALID_JSON', message: 'Ongeldige aanvraag.' }, 400);
  }

  const updateTenantId = payload.tenantId?.trim();
  if (updateTenantId) {
    const sessionToken = getSessionTokenFromRequest(request);
    const authSession = sessionToken ? await getAuthSession(db, sessionToken) : null;
    if (!authSession) {
      return json(
        { ok: false, code: 'UNAUTHORIZED', message: 'Log in om wijzigingen op te slaan.' },
        401,
      );
    }
    const authRepo = new AuthRepository(db);
    const allowed =
      authSession.session.tenantId === updateTenantId ||
      (await authRepo.findTenantUser(updateTenantId, authSession.user.id)) !== null;
    if (!allowed) {
      return json({ ok: false, code: 'FORBIDDEN', message: 'Geen toegang tot deze website.' }, 403);
    }
  }

  const service = new WebsiteSaveService(db, createRepositories(db), createMediaServiceOrLocal(media));

  try {
    const result = await service.save(payload);

    let magicLinkSent = false;
    const loginEmail = payload.contact.email?.trim();
    if (!updateTenantId && loginEmail) {
      const auth = createAuthServiceFromEnv(db, request, {
        resendApiKey: RESEND_API_KEY,
        fromEmail: FROM_EMAIL,
      });
      try {
        const linkResult = await auth.requestMagicLink({
          email: loginEmail,
          tenantId: result.tenantId,
          origin: new URL(request.url).origin,
        });
        magicLinkSent = linkResult.emailSent;
      } catch (error) {
        console.error('[website/save] Magic link verzenden mislukt:', error);
      }
    }

    return json({ ok: true, result, magicLinkSent }, 200);
  } catch (error) {
    if (error instanceof SaveValidationError) {
      return json(
        {
          ok: false,
          code: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        400,
      );
    }

    console.error('[website/save]', error);
    return json(
      {
        ok: false,
        code: 'SAVE_FAILED',
        message: 'Opslaan mislukt. Probeer het opnieuw.',
      },
      500,
    );
  }
};
