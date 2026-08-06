/** Production publication package manifest (publication.json). */

export interface PublicationFileHash {
  path: string;
  sha256: string;
  sizeBytes: number;
}

export interface PublicationManifest {
  publicationId: string;
  tenantId: string;
  websiteId: string;
  slug: string;
  domain: string;
  version: string;
  versionNumber: number;
  status: 'preview' | 'package_ready' | 'published';
  createdAt: string;
  pageCount: number;
  assetCount: number;
  totalSizeBytes: number;
  sitemapPath: string;
  robotsPath: string;
  manifestPath: string;
  faviconPath: string;
  canonicalBaseUrl: string;
  fileHashes: PublicationFileHash[];
  packageHash: string;
  generatorVersion: string;
  activeVersion: string;
  previousVersion: string | null;
}

export interface PublicationExportResult {
  ok: true;
  manifest: PublicationManifest;
  packageRoot: string;
  versionLabel: string;
  log: import('../lib/admin/admin-publication.service').AdminPublicationLog;
}

export interface PublicationExportFailure {
  ok: false;
  message: string;
  log: import('../lib/admin/admin-publication.service').AdminPublicationLog;
}

export type PublicationExportResponse = PublicationExportResult | PublicationExportFailure;
