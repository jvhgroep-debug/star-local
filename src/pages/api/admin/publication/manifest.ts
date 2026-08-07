import type { APIRoute } from 'astro';
import { isAdminApiDenied, requireAdminApiAccess } from '../../../../lib/admin/api-guard';
import { loadActivePublicationPackage, listPublicationPages } from '../../../../lib/publication/package-reader';
import { PublicationVersionRepository } from '../../../../lib/publication/version.repository';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ url, locals, request }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

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
