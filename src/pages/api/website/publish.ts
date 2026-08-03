import type { APIRoute } from 'astro';
import { FROM_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { createAuthServiceFromEnv } from '../../../lib/auth';
import type { D1Database } from '../../../lib/db/d1';
import type { R2Bucket } from '../../../lib/media/r2';
import { createRepositories } from '../../../lib/db';
import { PublishValidationError, WebsitePublishService } from '../../../lib/publish/website-publish.service';
import type { PublishWebsitePayload, PublishWebsiteResponse } from '../../../types/publish';

export const prerender = false;

function json(body: PublishWebsiteResponse, status: number): Response {
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
        message: 'Database niet beschikbaar. D1-binding ontbreekt in deze omgeving.',
      },
      503,
    );
  }

  let payload: PublishWebsitePayload;
  try {
    payload = (await request.json()) as PublishWebsitePayload;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON-payload.' }, 400);
  }

  const service = new WebsitePublishService(createRepositories(db), media ?? undefined);

  try {
    const result = await service.publish(payload);

    let magicLinkSent = false;
    const publishEmail = payload.publishEmail?.trim();
    if (publishEmail) {
      const auth = createAuthServiceFromEnv(db, request, {
        resendApiKey: RESEND_API_KEY,
        fromEmail: FROM_EMAIL,
      });
      try {
        const linkResult = await auth.requestMagicLink({
          email: publishEmail,
          tenantId: result.tenantId,
          origin: new URL(request.url).origin,
        });
        magicLinkSent = linkResult.emailSent;
      } catch (error) {
        console.error('[publish] Magic link verzenden mislukt:', error);
      }
    }

    return json({ ok: true, result, magicLinkSent }, 200);
  } catch (error) {
    if (error instanceof PublishValidationError) {
      const firstMessage = Object.values(error.errors)[0] ?? 'Validatie mislukt.';
      return json({ ok: false, message: firstMessage, errors: error.errors }, 400);
    }

    return json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Opslaan mislukt.',
      },
      500,
    );
  }
};
