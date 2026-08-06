import type { AstroGlobal } from 'astro';
import type { D1Database } from '../db/d1';
import { servePublishedSiteHtml } from './publish.service';

export async function renderPublishedSiteResponse(
  astro: AstroGlobal,
  subPath: string,
): Promise<Response> {
  const slug = astro.params.slug;
  const runtime = astro.locals.runtime as { env?: { DB?: D1Database } } | undefined;
  const db = runtime?.env?.DB ?? null;

  if (!db || !slug) {
    return new Response('Pagina niet gevonden.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const result = await servePublishedSiteHtml(db, slug, subPath);

  if ('error' in result) {
    const message = result.error === 'not_published' ? 'Deze website is nog niet gepubliceerd.' : 'Pagina niet gevonden.';
    return new Response(message, { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  return new Response(result.html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
