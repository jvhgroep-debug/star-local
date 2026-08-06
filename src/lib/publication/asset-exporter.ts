import type { WebsiteConfig } from '../../types/website-config';
import type { DatabaseRepositories } from '../db/repositories/types';
import type { MediaService } from '../media/types';
import { safeAssetFilename } from './paths';

export interface ExportedAsset {
  relativePath: string;
  bytes: Uint8Array;
  mimeType: string;
  alt: string;
}

export interface AssetExportResult {
  assets: ExportedAsset[];
  config: WebsiteConfig;
}

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
};

function extForMime(mimeType: string): string {
  return MIME_EXT[mimeType] ?? 'bin';
}

/** Load tenant media from D1 + storage and prepare assets/ entries. */
export async function exportTenantAssets(
  config: WebsiteConfig,
  tenantId: string,
  repos: DatabaseRepositories,
  media: MediaService,
): Promise<AssetExportResult> {
  const assets: ExportedAsset[] = [];
  const mediaItems = await repos.mediaItems.listByTenantId(tenantId);

  let logoUrl = config.media.logoUrl;
  let heroImageUrl = config.media.heroImageUrl;
  let socialImageUrl = config.media.socialImageUrl;
  const photoUrls: string[] = [...config.media.photoUrls];
  const galleryImageUrls: string[] = [...config.media.galleryImageUrls];

  for (const item of mediaItems) {
    const bytes = await media.readObjectBytes(item.storageKey);
    if (!bytes || bytes.byteLength === 0) continue;

    const ext = extForMime(item.mimeType);
    let relativePath: string;
    let alt: string;

    if (item.mediaType === 'logo') {
      relativePath = `assets/logo.${ext}`;
      alt = config.media.logoName || `${config.business.name} logo`;
      logoUrl = `/${relativePath}`;
    } else {
      const index = mediaItems.filter((m) => m.mediaType === 'photo').indexOf(item);
      relativePath = `assets/gallery-${index + 1}.${ext}`;
      alt = config.media.photoNames[index] || `Foto ${index + 1}`;
      if (index === 0 && !heroImageUrl) heroImageUrl = `/${relativePath}`;
      if (index < photoUrls.length) photoUrls[index] = `/${relativePath}`;
      else photoUrls.push(`/${relativePath}`);
      galleryImageUrls[index] = `/${relativePath}`;
    }

    assets.push({
      relativePath,
      bytes: new Uint8Array(bytes),
      mimeType: item.mimeType,
      alt,
    });
  }

  if (!socialImageUrl) {
    socialImageUrl = heroImageUrl ?? logoUrl ?? null;
  }

  if (!logoUrl && !heroImageUrl && assets.length === 0) {
    const fallbackSvg = buildFallbackOgSvg(config.branding.primaryColor, config.business.name);
    assets.push({
      relativePath: 'assets/og-fallback.svg',
      bytes: new TextEncoder().encode(fallbackSvg),
      mimeType: 'image/svg+xml',
      alt: config.business.name,
    });
    if (!socialImageUrl) socialImageUrl = '/assets/og-fallback.svg';
  }

  return {
    assets,
    config: {
      ...config,
      media: {
        ...config.media,
        logoUrl,
        heroImageUrl,
        socialImageUrl,
        photoUrls,
        galleryImageUrls,
      },
      localBusinessSchema: {
        ...config.localBusinessSchema,
        image: socialImageUrl ? productionAbsoluteUrl(config.slug.slug, socialImageUrl) : undefined,
      },
    },
  };
}

function productionAbsoluteUrl(slug: string, assetPath: string): string {
  const base = `https://${slug}.starlocal.nl`;
  return assetPath.startsWith('/') ? `${base}${assetPath}` : `${base}/${assetPath}`;
}

function buildFallbackOgSvg(primaryColor: string, name: string): string {
  const label = name.slice(0, 24).replace(/[<>&"]/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${primaryColor}"/><text x="600" y="330" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="48" font-weight="700">${label}</text></svg>`;
}

export function buildSharedStylesAsset(): ExportedAsset {
  const css = `@import url('/assets/site.css');`;
  return {
    relativePath: 'assets/site.css',
    bytes: new TextEncoder().encode(''),
    mimeType: 'text/css',
    alt: '',
  };
}

export function assignSharedCssContent(css: string): ExportedAsset {
  return {
    relativePath: 'assets/site.css',
    bytes: new TextEncoder().encode(css),
    mimeType: 'text/css; charset=utf-8',
    alt: '',
  };
}

export function assignSharedJsContent(js: string): ExportedAsset {
  return {
    relativePath: 'assets/site.js',
    bytes: new TextEncoder().encode(js),
    mimeType: 'application/javascript; charset=utf-8',
    alt: '',
  };
}

export { safeAssetFilename };
