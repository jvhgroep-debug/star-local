import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { AdminQueueRepository } from '../../../../lib/admin/admin-queue.repository';
import { parsePublicationSteps } from '../../../../lib/admin/admin-publication.service';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getDatabase(locals: App.Locals): D1Database | null {
  const runtime = locals.runtime as { env?: { DB?: D1Database } } | undefined;
  return runtime?.env?.DB ?? null;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const db = getDatabase(locals);
  if (!db) {
    return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);
  }

  const id = url.searchParams.get('id')?.trim();
  if (!id) {
    return json({ ok: false, message: 'id is verplicht.' }, 400);
  }

  const repo = new AdminQueueRepository(db);
  const stored = await repo.findLatestPublicationLog(id);
  if (!stored) {
    return json({ ok: false, message: 'Geen publicatielog gevonden.' }, 404);
  }

  return json({
    ok: true,
    log: {
      websiteId: id,
      businessName: stored.businessName,
      subdomain: stored.subdomain,
      startedAt: stored.startedAt,
      finishedAt: stored.finishedAt,
      steps: parsePublicationSteps(stored.stepsJson),
      pageCount: stored.pageCount,
      fileCount: stored.fileCount,
      packageHash: stored.packageHash,
      liveUrl: stored.liveUrl,
    },
    packageJson: stored.packageJson,
  });
};
