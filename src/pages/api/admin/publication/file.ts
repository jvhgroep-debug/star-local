import type { APIRoute } from 'astro';
import { isAdminApiDenied, requireAdminApiAccess } from '../../../../lib/admin/api-guard';
import { loadActivePublicationPackage, readPublicationBinary, readPublicationFile } from '../../../../lib/publication/package-reader';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals, request }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

  const websiteId = url.searchParams.get('id')?.trim();
  const filePath = url.searchParams.get('path')?.trim() ?? 'index.html';
  const version = url.searchParams.get('version')?.trim() || undefined;

  if (!websiteId) {
    return new Response(JSON.stringify({ ok: false, message: 'id is verplicht.' }), { status: 400 });
  }

  const loaded = await loadActivePublicationPackage(db, websiteId, version);
  if (!loaded) {
    return new Response(JSON.stringify({ ok: false, message: 'Geen publicatiepakket gevonden.' }), { status: 404 });
  }

  const isAsset = filePath.startsWith('assets/') || /\.(jpg|jpeg|png|webp|gif|svg|ico)$/i.test(filePath);
  if (isAsset && !filePath.endsWith('.html')) {
    const binary = await readPublicationBinary(loaded.packageRoot, filePath);
    if (!binary) {
      return new Response('Not found', { status: 404 });
    }
    return new Response(binary.bytes, {
      status: 200,
      headers: {
        'Content-Type': binary.mimeType,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  const file = await readPublicationFile(loaded.packageRoot, filePath, {
    preview: true,
    websiteId,
    version,
  });
  if (!file) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(file.content, {
    status: 200,
    headers: {
      'Content-Type': file.mimeType,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
