import type { PublicationPackage } from '../../types/publication';
import type { PublicationManifest } from '../../types/publication-package';
import {
  PUBLICATION_GENERATOR_VERSION,
  productionBaseUrl,
} from '../../config/publication';
import { hashContent, hashObject } from '../publish/hash';

export function buildPublicationManifest(input: {
  publicationId: string;
  tenantId: string;
  websiteId: string;
  slug: string;
  versionLabel: string;
  versionNumber: number;
  status: PublicationManifest['status'];
  createdAt: string;
  pkg: PublicationPackage;
  fileHashes: PublicationManifest['fileHashes'];
  totalSizeBytes: number;
  activeVersion: string;
  previousVersion: string | null;
  assetCountOverride?: number;
}): PublicationManifest {
  const domain = `${input.slug}.starlocal.nl`;
  const canonicalBaseUrl = productionBaseUrl(input.slug);
  const assetCount =
    input.assetCountOverride ??
    input.pkg.files.filter((f) => f.path.startsWith('assets/')).length;

  return {
    publicationId: input.publicationId,
    tenantId: input.tenantId,
    websiteId: input.websiteId,
    slug: input.slug,
    domain,
    version: input.versionLabel,
    versionNumber: input.versionNumber,
    status: input.status,
    createdAt: input.createdAt,
    pageCount: input.pkg.pageCount,
    assetCount,
    totalSizeBytes: input.totalSizeBytes,
    sitemapPath: 'sitemap.xml',
    robotsPath: 'robots.txt',
    manifestPath: 'manifest.webmanifest',
    faviconPath: 'favicon.svg',
    canonicalBaseUrl,
    fileHashes: input.fileHashes,
    packageHash: input.pkg.packageHash,
    generatorVersion: PUBLICATION_GENERATOR_VERSION,
    activeVersion: input.activeVersion,
    previousVersion: input.previousVersion,
  };
}

export function summarizeManifestForLog(manifest: PublicationManifest): Record<string, unknown> {
  return {
    publicationId: manifest.publicationId,
    version: manifest.version,
    domain: manifest.domain,
    canonicalBaseUrl: manifest.canonicalBaseUrl,
    pageCount: manifest.pageCount,
    assetCount: manifest.assetCount,
    totalSizeBytes: manifest.totalSizeBytes,
    packageHash: manifest.packageHash,
    sitemapPath: manifest.sitemapPath,
    robotsPath: manifest.robotsPath,
    manifestPath: manifest.manifestPath,
    createdAt: manifest.createdAt,
  };
}

export function computePackageHashFromFiles(files: Array<{ path: string; contentHash: string }>): string {
  return hashObject(files.map((f) => ({ path: f.path, hash: f.contentHash })));
}

export function hashManifest(manifest: PublicationManifest): string {
  return hashContent(JSON.stringify(manifest));
}
