import type { PreviewPage } from './builder';

/** Pipeline status for one-click publication (phase 4 — local package only). */
export type PublicationPipelineStatus = 'draft' | 'building' | 'published' | 'failed';

export const PUBLICATION_PIPELINE_LABELS: Record<PublicationPipelineStatus, string> = {
  draft: 'Draft',
  building: 'Building',
  published: 'Published',
  failed: 'Failed',
};

/** Single file in a local publication package. */
export interface PublicationPackageFile {
  path: string;
  content: string;
  contentHash: string;
  mimeType: string;
}

/** Complete local publication package (not uploaded to production). */
export interface PublicationPackage {
  tenantKey: string;
  businessName: string;
  slug: string;
  baseUrl: string;
  files: PublicationPackageFile[];
  pageCount: number;
  imageCount: number;
  seoScore: number;
  builtAt: string;
  packageHash: string;
}

/** Persisted publication log entry. */
export interface PublicationLogEntry {
  id: string;
  tenantKey: string;
  websiteId: string | null;
  status: PublicationPipelineStatus;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  pageCount: number;
  imageCount: number;
  seoScore: number;
  errors: string[];
  changedFiles: string[];
  republish: boolean;
  packageHash: string | null;
}

export interface BuildPublicationOptions {
  tenantKey: string;
  websiteId?: string | null;
  republish?: boolean;
  previousPackage?: PublicationPackage | null;
}

export interface BuildPublicationResult {
  ok: true;
  status: 'published';
  log: PublicationLogEntry;
  package: PublicationPackage;
  overview: PublicationOverview;
  sourceHashes: Record<string, string>;
}

export interface BuildPublicationFailure {
  ok: false;
  status: 'failed';
  log: PublicationLogEntry;
  message: string;
}

export type BuildPublicationResponse = BuildPublicationResult | BuildPublicationFailure;

/** Summary shown in dashboard confirmation dialog. */
export interface PublicationOverview {
  businessName: string;
  slug: string;
  subdomain: string;
  url: string;
  pageCount: number;
  pages: Array<{ label: string; path: string }>;
  imageCount: number;
  seoScore: number;
  packageFiles: string[];
}

export const REQUIRED_PACKAGE_PATHS = [
  'index.html',
  'over-ons/index.html',
  'diensten/index.html',
  'contact/index.html',
  'privacy/index.html',
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest',
  'favicon.svg',
] as const;

export const PAGE_SOURCE_KEYS: Record<PreviewPage, string[]> = {
  home: ['business', 'contact', 'branding', 'media', 'seo', 'copy', 'services', 'hours', 'heroTitle', 'heroSubtitle'],
  about: ['business', 'contact', 'branding', 'copy', 'whyChooseUs'],
  services: ['business', 'contact', 'services', 'copy', 'branding'],
  contact: ['business', 'contact', 'hours', 'copy', 'branding'],
  privacy: ['business', 'contact', 'privacySections', 'copy'],
};
