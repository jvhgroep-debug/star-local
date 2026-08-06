/** Production publication URL configuration (OPDRACHT 61). */

export const PRODUCTION_BASE_DOMAIN = 'starlocal.nl';

export const PUBLICATION_GENERATOR_VERSION = '1.0.0';

export const PUBLICATIONS_ROOT_DIR = 'publications';

/** Canonical production base URL for a tenant slug. Never uses localhost. */
export function productionBaseUrl(slug: string): string {
  const safe = sanitizePublicationSlug(slug);
  return `https://${safe}.${PRODUCTION_BASE_DOMAIN}`;
}

/** Production canonical URL for a page path. */
export function productionPageUrl(slug: string, pagePath: string): string {
  const base = productionBaseUrl(slug).replace(/\/$/, '');
  if (!pagePath || pagePath === '/') return `${base}/`;
  const normalized = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  return `${base}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

/** Safe slug for URLs and paths — lowercase alphanumeric + hyphens only. */
export function sanitizePublicationSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Validate UUID-like tenant/website ids for path safety. */
export function sanitizePublicationId(id: string): string | null {
  const trimmed = id.trim();
  if (!/^[a-f0-9-]{8,64}$/i.test(trimmed)) return null;
  if (trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) return null;
  return trimmed;
}

/** Version label from number: 1 → v1 */
export function versionLabelFromNumber(versionNumber: number): string {
  return `v${Math.max(1, versionNumber)}`;
}
