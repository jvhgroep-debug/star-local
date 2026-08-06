import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { loadActivePublicationPackage, readPublicationBinary, readPublicationFile } from '../../../../lib/publication/package-reader';

export const prerender = false;

function getDatabase(locals: App.Locals): D1Database | null {
  const runtime = locals.runtime as { env?: { DB?: D1Database } } | undefined;
  return runtime?.env?.DB ?? null;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const db = getDatabase(locals);
  if (!db) {
    return new Response(JSON.stringify({ ok: false, message: 'Database niet beschikbaar.' }), { status: 503 });
  }

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
