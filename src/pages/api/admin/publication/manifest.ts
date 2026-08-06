import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { loadActivePublicationPackage, listPublicationPages } from '../../../../lib/publication/package-reader';
import { PublicationVersionRepository } from '../../../../lib/publication/version.repository';

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

  const websiteId = url.searchParams.get('id')?.trim();
  const version = url.searchParams.get('version')?.trim() || undefined;

  if (!websiteId) {
    return json({ ok: false, message: 'id is verplicht.' }, 400);
  }

  const loaded = await loadActivePublicationPackage(db, websiteId, version);
  if (!loaded) {
    return json({ ok: false, message: 'Geen publicatiepakket gevonden.' }, 404);
  }

  const versionRepo = new PublicationVersionRepository(db);
  const allVersions = await versionRepo.listByWebsite(websiteId);

  return json({
    ok: true,
    manifest: loaded.manifest,
    versionLabel: loaded.versionLabel,
    pages: listPublicationPages(),
    versions: allVersions.map((v) => ({
      versionLabel: v.versionLabel,
      status: v.status,
      createdAt: v.createdAt,
      pageCount: v.pageCount,
      assetCount: v.assetCount,
      totalSizeBytes: v.totalSizeBytes,
    })),
  });
};
