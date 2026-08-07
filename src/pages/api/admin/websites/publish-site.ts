import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { AdminQueueRepository } from '../../../../lib/admin/admin-queue.repository';
import { isAdminApiDenied, requireAdminApiAccess } from '../../../../lib/admin/api-guard';
import { PublicationEngineService } from '../../../../lib/publication-engine/publish.service';

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

/** Direct publish to /sites/{slug}/ — no R2 (publication engine v1). */
export const POST: APIRoute = async ({ request, locals, url }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

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

  const service = new PublicationEngineService(db);

  try {
    const origin = new URL(url).origin;
    const result = await service.publishApprovedWebsite(id, origin);
    const item = await new AdminQueueRepository(db).findById(id);
    return json({ ok: true, liveUrl: result.liveUrl, slug: result.slug, item });
  } catch (error) {
    return json(
      { ok: false, message: error instanceof Error ? error.message : 'Publiceren mislukt.' },
      400,
    );
  }
};
