import type { APIRoute } from 'astro';
import type { R2Bucket } from '../../../../lib/media/r2';
import { AdminQueueRepository } from '../../../../lib/admin/admin-queue.repository';
import { isAdminApiDenied, requireAdminApiAccess } from '../../../../lib/admin/api-guard';
import { runAdminPublicationOnServer } from '../../../../lib/admin/admin-publication.service';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals, url }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;

  const { db } = access;
  const runtime = locals.runtime as { env?: { MEDIA?: R2Bucket } } | undefined;
  const media = runtime?.env?.MEDIA ?? null;

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
