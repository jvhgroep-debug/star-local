import type {
  BuilderBranding,
  BuilderBusiness,
  BuilderContact,
  BuilderDesignSettings,
  DayHours,
  PreviewPage,
} from './builder';
import type { GeneratedCopy } from '../lib/builder/templates';
import type { PageSeoBundle } from '../lib/builder/generator/seo';

export type { PageSeoBundle };

export type PublicationStatus = 'concept' | 'ready_for_publication' | 'published';

export type WebsitePackage = 'free' | 'premium';

export interface WebsiteSlug {
  slug: string;
  domain: string;
  url: string;
  available: boolean;
}

export interface WebsiteMedia {
  logoUrl: string | null;
  logoName: string;
  photoUrls: string[];
  photoNames: string[];
  heroImageUrl: string | null;
  galleryImageUrls: string[];
}

export interface WebsiteSeo {
  title: string;
  description: string;
  h1: string;
  ogTitle: string;
  canonicalUrl: string;
}

export interface WebsiteService {
  id: string;
  title: string;
  description: string;
  summary: string;
  detail: string;
}

/** Central website configuration — single source for preview and publication. */
export interface WebsiteConfig {
  version: 1;
  status: PublicationStatus;
  package: WebsitePackage;
  slug: WebsiteSlug;
  business: BuilderBusiness;
  contact: BuilderContact;
  hours: DayHours[];
  branding: BuilderBranding;
  media: WebsiteMedia;
  services: WebsiteService[];
  seo: WebsiteSeo;
  copy: GeneratedCopy;
  localBusinessSchema: Record<string, unknown>;
  privacySections: {
    intro: string;
    dataProcessing: string;
    contact: string;
    retention: string;
  };
  whyChooseUs: string[];
  publishEmail: string;
  publishedAt: string | null;
  preparedAt: string | null;
  heroTitle: string;
  heroSubtitle: string;
  design: BuilderDesignSettings;
}

export interface PreparedWebsite {
  config: WebsiteConfig;
  pages: Record<PreviewPage, string>;
  seoByPage?: Record<PreviewPage, PageSeoBundle>;
  /** Full standalone HTML documents per page (production-ready, not deployed). */
  documents?: Record<PreviewPage, string>;
  /** Generated tenant sitemap.xml content. */
  sitemap?: string;
  /** Generated tenant robots.txt content. */
  robots?: string;
  /** Generated web app manifest. */
  manifest?: string;
  /** Generated SVG favicon. */
  faviconSvg?: string;
  generation?: {
    pageCount: number;
    pages: PreviewPage[];
    documentPaths: Record<PreviewPage, string>;
    sitemapPath: string;
    robotsPath: string;
    manifestPath?: string;
    faviconPath?: string;
    generatedAt: string;
  };
  preparedAt: string;
}

export const WEBSITE_PAGES: PreviewPage[] = ['home', 'about', 'services', 'contact', 'privacy'];
