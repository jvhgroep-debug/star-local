import type { WebsiteConfig } from '../../../types/website-config';

export const TENANT_MANIFEST_PATH = 'manifest.webmanifest';

export function buildTenantManifest(config: WebsiteConfig): string {
  const name = config.business.name.trim() || config.copy.localTitle;
  const startUrl = `${config.slug.url.replace(/\/$/, '')}/`;
  const manifest = {
    name,
    short_name: name.slice(0, 12),
    description: config.seo.description,
    start_url: startUrl,
    scope: startUrl,
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: config.branding.primaryColor,
    lang: 'nl',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}
