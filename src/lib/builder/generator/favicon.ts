import type { WebsiteConfig } from '../../../types/website-config';

export const TENANT_FAVICON_PATH = 'favicon.svg';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function businessInitial(config: WebsiteConfig): string {
  const name = config.business.name.trim() || config.copy.localTitle;
  const match = name.match(/[A-Za-z0-9]/);
  return (match?.[0] ?? 'S').toUpperCase();
}

/** Generate a simple SVG favicon from tenant branding. */
export function buildTenantFavicon(config: WebsiteConfig): string {
  const initial = escapeXml(businessInitial(config));
  const primary = escapeXml(config.branding.primaryColor || '#1a2332');
  const accent = escapeXml(config.branding.accentColor || '#cdb880');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(config.business.name || 'Website')}">
  <rect width="64" height="64" rx="14" fill="${primary}"/>
  <circle cx="48" cy="16" r="8" fill="${accent}"/>
  <text x="32" y="41" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${initial}</text>
</svg>
`;
}
