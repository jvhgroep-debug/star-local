import { getSubdomainFromHostname } from './hostname';
import { createRepositories } from '../db';
import type { D1Database } from '../db/d1';
import type { R2Bucket } from '../media/r2';
import { SiteStorageService } from '../publish/site-storage.service';
import { contentTypeForSitePath, resolveSiteRelativePath } from '../publish/site-paths';
import { renderTenantErrorPage } from './tenant-error-page';

type PublicationPipelineStatus = 'draft' | 'building' | 'published' | 'failed';

function readPublicationStatus(website: { publicationStatus: PublicationPipelineStatus }): PublicationPipelineStatus {
  return website.publicationStatus ?? 'draft';
}

function isWebsitePubliclyAvailable(website: {
  published: boolean;
  status: string;
  publicationStatus: PublicationPipelineStatus;
}): boolean {
  if (!website.published || website.status !== 'published') {
    return false;
  }

  const pipelineStatus = readPublicationStatus(website);

  // building → temporarily unavailable; failed → keep serving last published R2 content
  if (pipelineStatus === 'building') {
    return false;
  }

  return true;
}

export async function serveTenantSiteRequest(
  request: Request,
  db: D1Database,
  mediaBucket: R2Bucket,
): Promise<Response> {
  const host = request.headers.get('host') ?? '';
  const slug = getSubdomainFromHostname(host);

  if (!slug) {
    return renderTenantErrorPage('not_found');
  }

  const repos = createRepositories(db);
  const tenant = await repos.tenants.findBySlug(slug);

  if (!tenant || tenant.status !== 'active') {
    return renderTenantErrorPage('not_found', { slug });
  }

  const website = await repos.websites.findByTenantId(tenant.id);

  if (!website) {
    return renderTenantErrorPage('not_published', { slug });
  }

  const pipelineStatus = readPublicationStatus(website);

  if (pipelineStatus === 'building') {
    return renderTenantErrorPage('building', { slug });
  }

  if (!isWebsitePubliclyAvailable(website)) {
    return renderTenantErrorPage('not_published', { slug });
  }

  const url = new URL(request.url);
  const relativePath = resolveSiteRelativePath(url.pathname);
  const storage = new SiteStorageService(mediaBucket);
  const object = await storage.getSiteObject(tenant.id, relativePath);

  if (!object) {
    return renderTenantErrorPage('page_not_found', { slug });
  }

  const headers = new Headers({
    'Content-Type': object.contentType || contentTypeForSitePath(relativePath),
    'Cache-Control': 'public, max-age=300',
  });

  return new Response(object.body, { status: 200, headers });
}
