import type { PreviewPage, WebsiteConfig } from '../../../types/website-config';
import { WEBSITE_PAGES } from '../../../types/website-config';
import { TENANT_PAGE_PATHS } from './seo';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function baseUrl(config: WebsiteConfig): string {
  return config.slug.url.replace(/\/$/, '');
}

function pageLoc(config: WebsiteConfig, page: PreviewPage): string {
  const base = baseUrl(config);
  const path = TENANT_PAGE_PATHS[page];
  return path === '/' ? `${base}/` : `${base}${path}`;
}

/** Build sitemap.xml for a generated tenant website. */
export function buildTenantSitemap(config: WebsiteConfig): string {
  const lastmod = (config.preparedAt ?? new Date().toISOString()).slice(0, 10);
  const urls = WEBSITE_PAGES.map((page) => {
    const loc = pageLoc(config, page);
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Relative output paths for generated tenant HTML documents. */
export const TENANT_DOCUMENT_PATHS: Record<PreviewPage, string> = {
  home: 'index.html',
  about: 'over-ons/index.html',
  services: 'diensten/index.html',
  contact: 'contact/index.html',
  privacy: 'privacy/index.html',
};

export const TENANT_SITEMAP_PATH = 'sitemap.xml';
export const TENANT_ROBOTS_PATH = 'robots.txt';
