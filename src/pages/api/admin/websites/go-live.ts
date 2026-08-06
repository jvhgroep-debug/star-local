import type { APIRoute } from 'astro';
import { RESEND_API_KEY, FROM_EMAIL, ADMIN_NOTIFICATION_EMAIL } from 'astro:env/server';
import type { D1Database } from '../../../../lib/db/d1';
import type { R2Bucket } from '../../../../lib/media/r2';
import { AdminQueueRepository } from '../../../../lib/admin/admin-queue.repository';
import { goLivePublicationPackage } from '../../../../lib/publication/go-live.service';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
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
    return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);
  }
  if (!media) {
    return json({ ok: false, message: 'R2-opslag niet beschikbaar.' }, 503);
  }

  let body: { id?: string; versionLabel?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  const id = body.id?.trim();
  if (!id) {
    return json({ ok: false, message: 'id is verplicht.' }, 400);
  }

  const repo = new AdminQueueRepository(db);
  const record = await repo.findById(id);
  if (!record) {
    return json({ ok: false, message: 'Website niet gevonden.' }, 404);
  }

  const apiKey = RESEND_API_KEY?.trim();
  const fromEmail = FROM_EMAIL?.trim();
  const adminEmail = ADMIN_NOTIFICATION_EMAIL?.trim();

  const result = await goLivePublicationPackage({
    db,
    media,
    websiteId: id,
    versionLabel: body.versionLabel?.trim(),
    ownerEmail: record.email || undefined,
    resend: apiKey && fromEmail ? { apiKey, fromEmail, adminEmail: adminEmail || undefined } : undefined,
  });

  if (!result.ok) {
    return json({ ok: false, message: result.message }, 400);
  }

  const item = await repo.findById(id);
  return json({
    ok: true,
    liveUrl: result.liveUrl,
    versionLabel: result.versionLabel,
    siteObjectCount: result.siteObjectCount,
    archiveObjectCount: result.archiveObjectCount,
    item,
  });
};
