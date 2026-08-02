const TENANT_ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export const TENANT_SITE_FOLDER = 'site';

export function assertSafeTenantId(tenantId: string): void {
  const trimmed = tenantId.trim();
  if (!trimmed || !TENANT_ID_PATTERN.test(trimmed)) {
    throw new RangeError('Invalid tenant id for site storage.');
  }
}

/** Build R2 object key: `{tenantId}/site/{relativePath}`. */
export function buildSiteObjectKey(tenantId: string, relativePath: string): string {
  assertSafeTenantId(tenantId);
  const safe = relativePath.replace(/^\/+/, '').replace(/\\/g, '/');
  if (!safe || safe.includes('..')) {
    throw new RangeError('Invalid site object path.');
  }
  return `${tenantId}/${TENANT_SITE_FOLDER}/${safe}`;
}

export function buildSitePrefix(tenantId: string): string {
  assertSafeTenantId(tenantId);
  return `${tenantId}/${TENANT_SITE_FOLDER}/`;
}

/** Map a request pathname to a relative site object path. */
export function resolveSiteRelativePath(pathname: string): string {
  const normalized = pathname.split('?')[0]?.split('#')[0] ?? '/';
  if (normalized === '/' || normalized === '') return 'index.html';

  const trimmed = normalized.replace(/^\//, '').replace(/\/$/, '');
  if (!trimmed) return 'index.html';
  if (trimmed.includes('.')) return trimmed;

  return `${trimmed}/index.html`;
}

export function contentTypeForSitePath(relativePath: string): string {
  const lower = relativePath.toLowerCase();
  if (lower.endsWith('.html')) return 'text/html; charset=utf-8';
  if (lower.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (lower.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (lower.endsWith('.webmanifest')) return 'application/manifest+json; charset=utf-8';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}
