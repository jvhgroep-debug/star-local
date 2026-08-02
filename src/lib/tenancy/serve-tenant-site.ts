import { getSubdomainFromHostname } from '../tenancy/hostname';
import { createRepositories } from '../db';
import type { D1Database } from '../db/d1';
import type { R2Bucket } from '../media/r2';
import { SiteStorageService } from '../publish/site-storage.service';
import { contentTypeForSitePath, resolveSiteRelativePath } from '../publish/site-paths';

export async function serveTenantSiteRequest(
  request: Request,
  db: D1Database,
  mediaBucket: R2Bucket,
): Promise<Response | null> {
  const host = request.headers.get('host') ?? '';
  const slug = getSubdomainFromHostname(host);
  if (!slug) return null;

  const repos = createRepositories(db);
  const tenant = await repos.tenants.findBySlug(slug);
  if (!tenant || tenant.status !== 'active') {
    return new Response('Website niet gevonden.', { status: 404 });
  }

  const website = await repos.websites.findByTenantId(tenant.id);
  if (!website?.published || website.status !== 'published') {
    return new Response('Deze website is nog niet gepubliceerd.', { status: 404 });
  }

  const url = new URL(request.url);
  const relativePath = resolveSiteRelativePath(url.pathname);
  const storage = new SiteStorageService(mediaBucket);
  const object = await storage.getSiteObject(tenant.id, relativePath);

  if (!object) {
    return new Response('Pagina niet gevonden.', { status: 404 });
  }

  const headers = new Headers({
    'Content-Type': object.contentType || contentTypeForSitePath(relativePath),
    'Cache-Control': 'public, max-age=300',
  });

  return new Response(object.body, { status: 200, headers });
}
