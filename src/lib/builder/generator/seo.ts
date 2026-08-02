import type { PreviewPage, WebsiteConfig } from '../../../types/website-config';

export interface PageSeoBundle {
  title: string;
  description: string;
  h1: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
}

const PAGE_PATHS: Record<PreviewPage, string> = {
  home: '/',
  about: '/over-ons/',
  services: '/diensten/',
  contact: '/contact/',
  privacy: '/privacy/',
};

export const TENANT_PAGE_PATHS = PAGE_PATHS;

export function tenantPagePath(page: PreviewPage): string {
  return PAGE_PATHS[page];
}

function baseUrl(config: WebsiteConfig): string {
  return config.slug.url.replace(/\/$/, '');
}

/** Build per-page SEO bundle from WebsiteConfig. */
export function buildPageSeo(config: WebsiteConfig, page: PreviewPage): PageSeoBundle {
  const { copy, seo, business, contact } = config;
  const local = copy.localTitle;
  const canonicalUrl = `${baseUrl(config)}${PAGE_PATHS[page] === '/' ? '/' : PAGE_PATHS[page]}`;

  switch (page) {
    case 'about':
      return {
        title: `${copy.aboutIntro} | ${local}`,
        description: copy.aboutBody.slice(0, 160),
        h1: copy.aboutIntro,
        canonicalUrl,
        ogTitle: `${copy.aboutIntro} | ${local}`,
        ogDescription: copy.aboutExtended.slice(0, 160),
      };
    case 'services':
      return {
        title: `Diensten | ${local}`,
        description: copy.servicesIntro,
        h1: 'Onze diensten',
        canonicalUrl,
        ogTitle: `Diensten | ${local}`,
        ogDescription: copy.servicesIntro,
      };
    case 'contact':
      return {
        title: `Contact | ${local}`,
        description: copy.contactIntro,
        h1: copy.localTitle,
        canonicalUrl,
        ogTitle: `Contact | ${local}`,
        ogDescription: `${copy.contactIntro} Tel: ${contact.phone || contact.whatsapp || contact.email}.`,
      };
    case 'privacy':
      return {
        title: `Privacybeleid | ${business.name || local}`,
        description: copy.privacyIntro,
        h1: 'Privacybeleid',
        canonicalUrl,
        ogTitle: `Privacybeleid | ${business.name || local}`,
        ogDescription: copy.privacyIntro,
      };
    default:
      return {
        title: seo.title,
        description: seo.description,
        h1: seo.h1,
        canonicalUrl,
        ogTitle: seo.ogTitle,
        ogDescription: seo.description,
      };
  }
}

export function buildAllPageSeo(config: WebsiteConfig): Record<PreviewPage, PageSeoBundle> {
  return {
    home: buildPageSeo(config, 'home'),
    about: buildPageSeo(config, 'about'),
    services: buildPageSeo(config, 'services'),
    contact: buildPageSeo(config, 'contact'),
    privacy: buildPageSeo(config, 'privacy'),
  };
}
