import type { PreviewPage } from '../../types/builder';
import type { PublicationPackage, PublicationPackageFile } from '../../types/publication';
import type { GeneratedWebsiteResult } from '../builder/generator/website-generator.service';
import { TENANT_FAVICON_PATH } from '../builder/generator/favicon';
import { TENANT_MANIFEST_PATH } from '../builder/generator/manifest';
import { TENANT_DOCUMENT_PATHS, TENANT_ROBOTS_PATH, TENANT_SITEMAP_PATH } from '../builder/generator/sitemap';
import { computeSeoScore, countPackageImages } from './seo-score';
import { hashContent, hashObject } from './hash';

function mimeForPath(path: string): string {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (path.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (path.endsWith('.webmanifest')) return 'application/manifest+json; charset=utf-8';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

function fileEntry(path: string, content: string): PublicationPackageFile {
  return {
    path,
    content,
    contentHash: hashContent(content),
    mimeType: mimeForPath(path),
  };
}

/** Assemble a complete publication package from generated website output. */
export function buildPublicationPackage(
  generated: GeneratedWebsiteResult,
  tenantKey: string,
): PublicationPackage {
  const files: PublicationPackageFile[] = [];

  for (const page of generated.generation.pages) {
    const docPath = TENANT_DOCUMENT_PATHS[page];
    files.push(fileEntry(docPath, generated.documents[page]));
  }

  files.push(fileEntry(TENANT_SITEMAP_PATH, generated.sitemap));
  files.push(fileEntry(TENANT_ROBOTS_PATH, generated.robots));
  files.push(fileEntry(TENANT_MANIFEST_PATH, generated.manifest));
  files.push(fileEntry(TENANT_FAVICON_PATH, generated.faviconSvg));

  const pageCount = generated.generation.pageCount;
  const imageCount = countPackageImages(generated.config, generated.documents);
  const seoScore = computeSeoScore(generated.documents, generated.seoByPage);
  const builtAt = generated.generation.generatedAt;
  const packageHash = hashObject(files.map((file) => ({ path: file.path, hash: file.contentHash })));

  return {
    tenantKey,
    businessName: generated.config.business.name,
    slug: generated.config.slug.slug,
    baseUrl: generated.config.slug.url.replace(/\/$/, ''),
    files,
    pageCount,
    imageCount,
    seoScore,
    builtAt,
    packageHash,
  };
}

export function packageToRecord(pkg: PublicationPackage): Record<string, string> {
  return Object.fromEntries(pkg.files.map((file) => [file.path, file.content]));
}

export function getPackageFile(pkg: PublicationPackage, path: string): PublicationPackageFile | undefined {
  return pkg.files.find((file) => file.path === path);
}

export function verifyPublicationPackage(pkg: PublicationPackage): { valid: boolean; missing: string[]; errors: string[] } {
  const missing: string[] = [];
  const errors: string[] = [];
  const required = [
    'index.html',
    'over-ons/index.html',
    'diensten/index.html',
    'contact/index.html',
    'privacy/index.html',
    'robots.txt',
    'sitemap.xml',
    'manifest.webmanifest',
    'favicon.svg',
  ];

  for (const path of required) {
    if (!getPackageFile(pkg, path)) {
      missing.push(path);
    }
  }

  const index = getPackageFile(pkg, 'index.html');
  if (index) {
    if (!index.content.includes('rel="canonical"')) errors.push('index.html mist canonical tag');
    if (!index.content.includes('property="og:title"')) errors.push('index.html mist Open Graph');
    if (!index.content.includes('application/ld+json')) errors.push('index.html mist JSON-LD');
    if (!index.content.includes('charset="utf-8"')) errors.push('index.html mist charset');
    if (!index.content.includes('name="viewport"')) errors.push('index.html mist viewport');
  }

  return { valid: missing.length === 0 && errors.length === 0, missing, errors };
}

export type { PreviewPage };
