import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import type { R2Bucket } from '../../../../lib/media/r2';
import { AdminQueueRepository } from '../../../../lib/admin/admin-queue.repository';
import { runAdminPublicationOnServer } from '../../../../lib/admin/admin-publication.service';

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

  let body: { id?: string };
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
  const row = await repo.findByIdWithSnapshot(id);
  if (!row) {
    return json({ ok: false, message: 'Website niet gevonden.' }, 404);
  }

  if (row.approvalStatus !== 'approved' && row.approvalStatus !== 'package_ready') {
    return json({ ok: false, message: 'Alleen goedgekeurde websites kunnen een publicatiepakket genereren.' }, 400);
  }

  const { configSnapshotJson, ...record } = row;
  const result = await runAdminPublicationOnServer(db, record, configSnapshotJson, media);
  if (!result.ok) {
    console.error('[admin/publish]', result.message, result.log?.steps?.filter((s) => !s.ok));
    return json({ ok: false, message: result.message ?? 'Pakketgeneratie mislukt.', log: result.log }, 500);
  }

  const item = await repo.findById(id);
  return json({ ok: true, log: result.log, item, versionLabel: result.versionLabel });
};
