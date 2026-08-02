import type { WebsiteConfig } from '../../../types/website-config';
import { TENANT_SITEMAP_PATH } from './sitemap';

function baseUrl(config: WebsiteConfig): string {
  return config.slug.url.replace(/\/$/, '');
}

/** Build robots.txt for a generated tenant website. */
export function buildTenantRobots(config: WebsiteConfig): string {
  const siteUrl = baseUrl(config);
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/${TENANT_SITEMAP_PATH}\n`;
}
