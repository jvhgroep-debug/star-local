import type {
  BuilderBranding,
  BuilderBusiness,
  BuilderContact,
  DayHours,
  PreviewPage,
} from './builder';
import type { GeneratedCopy } from '../lib/builder/templates';

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
}

export interface PreparedWebsite {
  config: WebsiteConfig;
  pages: Record<PreviewPage, string>;
  preparedAt: string;
}

export const WEBSITE_PAGES: PreviewPage[] = ['home', 'about', 'services', 'contact', 'privacy'];
