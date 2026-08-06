import type { WebsiteConfig } from '../../types/website-config';
import { productionBaseUrl, productionPageUrl } from '../../config/publication';
import { TENANT_PAGE_PATHS } from '../builder/generator/seo';

/** Override config slug/URLs for production canonical generation — never localhost. */
export function withProductionUrls(config: WebsiteConfig, slug: string): WebsiteConfig {
  const safeSlug = slug.trim().toLowerCase();
  const base = productionBaseUrl(safeSlug);
  const domain = `${safeSlug}.starlocal.nl`;

  const homeCanonical = productionPageUrl(safeSlug, '/');

  return {
    ...config,
    slug: {
      slug: safeSlug,
      domain,
      url: `${base}/`,
    },
    seo: {
      ...config.seo,
      canonicalUrl: homeCanonical,
    },
    copy: {
      ...config.copy,
      canonicalUrl: homeCanonical,
    },
    localBusinessSchema: {
      ...config.localBusinessSchema,
      url: homeCanonical,
      identifier: base,
    },
    enabledPages: config.enabledPages ?? {
      home: true,
      about: true,
      services: true,
      contact: true,
      privacy: true,
    },
  };
}

export function isProductionUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.hostname.includes('localhost') && !parsed.hostname.includes('127.0.0.1');
  } catch {
    return false;
  }
}

export { TENANT_PAGE_PATHS, productionBaseUrl, productionPageUrl };
