import type { AdminWebsiteRecord } from './queue.types';
import type { BuilderFiles } from '../builder/files';
import { createEmptyFiles } from '../builder/files';
import { loadFilesFromStorage } from '../builder/media-storage';
import { loadPreparedWebsite, PREPARED_WEBSITE_STORAGE_KEY } from '../builder/publish/storage';
import { websiteGenerator } from '../builder/generator/website-generator.service';
import type { GeneratedWebsiteResult } from '../builder/generator/website-generator.service';
import { buildWebsiteConfig } from '../builder/website-config';
import { createDefaultState } from '../builder/storage';
import type { PreviewPage, WebsiteConfig } from '../../types/website-config';
import { WEBSITE_PAGES } from '../../types/website-config';
import { fetchAdminWebsite } from './admin-api.client';
import { parseConfigSnapshot } from './config-snapshot';
import type { PublicationPackage } from '../../types/publication';

const PACKAGE_PAGE_PATHS: Record<PreviewPage, string> = {
  home: 'index.html',
  about: 'over-ons/index.html',
  services: 'diensten/index.html',
  contact: 'contact/index.html',
  privacy: 'privacy/index.html',
};

export async function loadAdminRecord(id: string): Promise<{ record: AdminWebsiteRecord; configSnapshotJson: string | null } | null> {
  try {
    return await fetchAdminWebsite(id);
  } catch {
    return null;
  }
}

export function resolvePreviewPagesFromPackageJson(packageJson: string | null): Record<PreviewPage, string> | null {
  if (!packageJson) return null;
  try {
    const pkg = JSON.parse(packageJson) as PublicationPackage;
    if (!pkg?.files?.length) return null;
    const byPath = new Map(pkg.files.map((file) => [file.path, file.content]));
    const pages = {} as Record<PreviewPage, string>;
    for (const [page, path] of Object.entries(PACKAGE_PAGE_PATHS) as Array<[PreviewPage, string]>) {
      const html = byPath.get(path);
      if (!html) return null;
      pages[page] = html;
    }
    return pages;
  } catch {
    return null;
  }
}

export function resolvePreviewPages(record: AdminWebsiteRecord, configSnapshotJson: string | null): Record<PreviewPage, string> | null {
  const snapshot = parseConfigSnapshot(configSnapshotJson);
  if (snapshot) {
    const files = resolveFilesForPreview(record.slug);
    const config = hydratePreviewConfig(snapshot, files);
    const generated = websiteGenerator.generate({
      ...config,
      preparedAt: record.createdAt,
    });
    return generated.pages;
  }

  const prepared = loadPreparedWebsite();
  if (prepared?.config.slug.slug === record.slug) {
    const files = resolveFilesForPreview(record.slug);
    const config = hydratePreviewConfig(prepared.config, files);
    return websiteGenerator.generate({
      ...config,
      preparedAt: prepared.preparedAt ?? record.createdAt,
    }).pages;
  }

  const fallback = buildFallbackConfigFromRecord(record);
  return websiteGenerator.generate({
    ...fallback,
    preparedAt: record.createdAt,
  }).pages;
}

export function generateWebsiteForRecord(record: AdminWebsiteRecord, configSnapshotJson?: string | null): GeneratedWebsiteResult | null {
  const snapshot = parseConfigSnapshot(configSnapshotJson ?? null);
  if (snapshot) {
    const files = resolveFilesForPreview(record.slug);
    const config = hydratePreviewConfig(snapshot, files);
    return websiteGenerator.generate({
      ...config,
      preparedAt: record.createdAt,
    });
  }

  const prepared = loadPreparedWebsite();
  if (prepared?.config.slug.slug === record.slug) {
    const files = resolveFilesForPreview(record.slug);
    const config = hydratePreviewConfig(prepared.config, files);
    return websiteGenerator.generate({
      ...config,
      preparedAt: prepared.preparedAt ?? record.createdAt,
    });
  }

  const fallback = buildFallbackConfigFromRecord(record);
  return websiteGenerator.generate({
    ...fallback,
    preparedAt: record.createdAt,
  });
}

function buildFallbackConfigFromRecord(record: AdminWebsiteRecord): WebsiteConfig {
  const state = createDefaultState();
  state.business.name = record.businessName;
  state.business.industry = record.industry;
  state.business.description = 'Voorbeeldwebsite voor admin preview.';
  state.contact.city = record.city;
  state.contact.email = record.email;
  return buildWebsiteConfig(state, createEmptyFiles(), { preparedAt: record.createdAt });
}

function resolveFilesForPreview(slug: string): BuilderFiles {
  const files = loadFilesFromStorage() ?? createEmptyFiles();
  const preparedRaw = typeof window !== 'undefined' ? window.localStorage.getItem(PREPARED_WEBSITE_STORAGE_KEY) : null;
  if (!preparedRaw) return files;

  try {
    const parsed = JSON.parse(preparedRaw) as { config?: { slug?: { slug?: string } } };
    if (parsed.config?.slug?.slug === slug) return files;
  } catch {
    return createEmptyFiles();
  }

  return createEmptyFiles();
}

function hydratePreviewConfig(config: WebsiteConfig, files: BuilderFiles): WebsiteConfig {
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

export function listPreviewPageLabels(): Array<{ id: PreviewPage; label: string }> {
  return WEBSITE_PAGES.map((page) => ({
    id: page,
    label:
      page === 'home'
        ? 'Home'
        : page === 'about'
          ? 'Over ons'
          : page === 'services'
            ? 'Diensten'
            : page === 'contact'
              ? 'Contact'
              : 'Privacy',
  }));
}
