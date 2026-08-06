import type { PreviewPage } from '../../types/builder';

/** Path-based published site URLs — extensible to subdomains later. */
export function publishedSitePath(slug: string, subPath = '/'): string {
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  const base = `/sites/${slug}`;
  if (normalized === '/' || normalized === '') return `${base}/`;
  return `${base}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

export function publishedSiteLiveUrl(origin: string, slug: string): string {
  const base = origin.replace(/\/$/, '');
  return `${base}${publishedSitePath(slug)}`;
}

export function resolveSiteSubPath(pathSegments: string[] | undefined): string {
  if (!pathSegments?.length) return '/';
  return `/${pathSegments.join('/')}/`;
}

const PAGE_PATH_MAP: Record<string, PreviewPage> = {
  '': 'home',
  'over-ons': 'about',
  diensten: 'services',
  contact: 'contact',
  privacy: 'privacy',
};

export function previewPageFromSitePath(subPath: string): PreviewPage | null {
  const trimmed = subPath.replace(/^\/+|\/+$/g, '');
  return PAGE_PATH_MAP[trimmed] ?? null;
}
