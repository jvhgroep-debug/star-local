import type { PreparedWebsite, WebsiteConfig } from '../../../types/website-config';
import type { BuilderFiles } from '../files';
import { createEmptyFiles } from '../files';
import { websiteGenerator } from '../generator/website-generator.service';
import { loadFilesFromStorage } from '../media-storage';

export const PREPARED_WEBSITE_STORAGE_KEY = 'starlocal-prepared-website-v1';

/** Compact persisted shape — HTML pages are rebuilt on load; media URLs live in media storage. */
interface StoredPreparedWebsite {
  storageVersion: 2;
  config: WebsiteConfig;
  seoByPage?: PreparedWebsite['seoByPage'];
  sitemap?: string;
  robots?: string;
  manifest?: string;
  faviconSvg?: string;
  generation?: PreparedWebsite['generation'];
  preparedAt: string;
}

function stripConfigMediaForStorage(config: WebsiteConfig): WebsiteConfig {
  const schema = { ...config.localBusinessSchema };
  delete schema.image;

  return {
    ...config,
    localBusinessSchema: schema,
    media: {
      logoUrl: null,
      logoName: config.media.logoName,
      photoUrls: [],
      photoNames: [...config.media.photoNames],
      heroImageUrl: null,
      galleryImageUrls: [],
      socialImageUrl: null,
      socialImageName: config.media.socialImageName,
    },
  };
}

function hydrateConfigMedia(config: WebsiteConfig, files: BuilderFiles): WebsiteConfig {
  const image = files.photoUrls[0] ?? files.logoUrl ?? undefined;

  return {
    ...config,
    media: {
      logoUrl: files.logoUrl,
      logoName: files.logoName || config.media.logoName,
      photoUrls: [...files.photoUrls],
      photoNames: files.photoNames.length ? files.photoNames : config.media.photoNames,
      heroImageUrl: files.heroUrl,
      galleryImageUrls: [...files.photoUrls],
      socialImageUrl: files.socialImageUrl,
      socialImageName: files.socialImageName || config.media.socialImageName,
    },
    localBusinessSchema: {
      ...config.localBusinessSchema,
      ...(image ? { image } : {}),
    },
  };
}

function resolveFilesForHydration(filesOverride?: BuilderFiles | null): BuilderFiles {
  if (filesOverride) return filesOverride;
  return loadFilesFromStorage() ?? createEmptyFiles();
}

function isLegacyPreparedWebsite(parsed: PreparedWebsite): boolean {
  return Boolean(parsed.pages?.home && parsed.pages.home.length > 100);
}

function rebuildPreparedWebsite(stored: StoredPreparedWebsite, files: BuilderFiles): PreparedWebsite {
  const hydratedConfig = hydrateConfigMedia(stored.config, files);
  const regenerated = websiteGenerator.generate({
    ...hydratedConfig,
    preparedAt: stored.preparedAt,
  });

  return {
    ...regenerated,
    seoByPage: stored.seoByPage ?? regenerated.seoByPage,
    sitemap: stored.sitemap ?? regenerated.sitemap,
    robots: stored.robots ?? regenerated.robots,
    manifest: stored.manifest ?? regenerated.manifest,
    faviconSvg: stored.faviconSvg ?? regenerated.faviconSvg,
    generation: stored.generation ?? regenerated.generation,
    preparedAt: stored.preparedAt,
  };
}

export function savePreparedWebsite(prepared: PreparedWebsite): void {
  if (typeof window === 'undefined') return;

  const stored: StoredPreparedWebsite = {
    storageVersion: 2,
    config: stripConfigMediaForStorage(prepared.config),
    seoByPage: prepared.seoByPage,
    sitemap: prepared.sitemap,
    robots: prepared.robots,
    manifest: prepared.manifest,
    faviconSvg: prepared.faviconSvg,
    generation: prepared.generation,
    preparedAt: prepared.preparedAt,
  };

  window.localStorage.setItem(PREPARED_WEBSITE_STORAGE_KEY, JSON.stringify(stored));
}

export function loadPreparedWebsite(filesOverride?: BuilderFiles | null): PreparedWebsite | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PREPARED_WEBSITE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PreparedWebsite | StoredPreparedWebsite;
    if (!parsed?.config) return null;

    if (isLegacyPreparedWebsite(parsed as PreparedWebsite)) {
      return parsed as PreparedWebsite;
    }

    const stored = parsed as StoredPreparedWebsite;
    const files = resolveFilesForHydration(filesOverride);
    return rebuildPreparedWebsite(stored, files);
  } catch {
    return null;
  }
}

export function clearPreparedWebsite(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREPARED_WEBSITE_STORAGE_KEY);
}
