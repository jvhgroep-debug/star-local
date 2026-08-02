import type { PreviewPage, WebsiteConfig } from '../../../types/website-config';
import type { PageSeoBundle } from './seo';
import { TENANT_DOCUMENT_CSS, TENANT_DOCUMENT_SCRIPT } from './document-styles';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveOgImage(config: WebsiteConfig): string | null {
  return config.media.heroImageUrl || config.media.logoUrl || null;
}

function renderDocumentHead(config: WebsiteConfig, seo: PageSeoBundle): string {
  const ogImage = resolveOgImage(config);
  const ogImageTags = ogImage
    ? `
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
    : `
  <meta name="twitter:card" content="summary" />`;

  return `
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(seo.title)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}" />
  <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="nl_NL" />
  <meta property="og:site_name" content="${escapeHtml(config.business.name || config.copy.localTitle)}" />
  <meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />
  <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />${ogImageTags}
  <script type="application/ld+json">${JSON.stringify(config.localBusinessSchema)}</script>
  <style>${TENANT_DOCUMENT_CSS}</style>`;
}

/** Wrap a standalone tenant page body fragment in a complete HTML document. */
export function buildTenantPageDocument(
  config: WebsiteConfig,
  page: PreviewPage,
  bodyHtml: string,
  seo: PageSeoBundle,
): string {
  const lang = 'nl';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>${renderDocumentHead(config, seo)}
</head>
<body>
${bodyHtml}
<script>${TENANT_DOCUMENT_SCRIPT}</script>
</body>
</html>
`;
}

export function buildAllTenantDocuments(
  config: WebsiteConfig,
  pages: Record<PreviewPage, string>,
  seoByPage: Record<PreviewPage, PageSeoBundle>,
): Record<PreviewPage, string> {
  return {
    home: buildTenantPageDocument(config, 'home', pages.home, seoByPage.home),
    about: buildTenantPageDocument(config, 'about', pages.about, seoByPage.about),
    services: buildTenantPageDocument(config, 'services', pages.services, seoByPage.services),
    contact: buildTenantPageDocument(config, 'contact', pages.contact, seoByPage.contact),
    privacy: buildTenantPageDocument(config, 'privacy', pages.privacy, seoByPage.privacy),
  };
}
