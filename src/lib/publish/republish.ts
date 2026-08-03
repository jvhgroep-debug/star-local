import type { PreviewPage } from '../../types/builder';
import type { PublicationPackage } from '../../types/publication';
import { PAGE_SOURCE_KEYS } from '../../types/publication';
import type { WebsiteConfig } from '../../types/website-config';
import { WEBSITE_PAGES } from '../../types/website-config';
import type { GeneratedWebsiteResult } from '../builder/generator/website-generator.service';
import { websiteGenerator } from '../builder/generator/website-generator.service';
import { TENANT_DOCUMENT_PATHS, TENANT_ROBOTS_PATH, TENANT_SITEMAP_PATH } from '../builder/generator/sitemap';
import { TENANT_FAVICON_PATH } from '../builder/generator/favicon';
import { TENANT_MANIFEST_PATH } from '../builder/generator/manifest';
import { hashObject } from './hash';

function pickConfigSlice(config: WebsiteConfig, page: PreviewPage): unknown {
  const keys = PAGE_SOURCE_KEYS[page];
  const slice: Record<string, unknown> = { slug: config.slug.slug, package: config.package };
  for (const key of keys) {
    slice[key] = config[key as keyof WebsiteConfig];
  }
  return slice;
}

export function computePageSourceHashes(config: WebsiteConfig): Record<PreviewPage, string> {
  const hashes = {} as Record<PreviewPage, string>;
  for (const page of WEBSITE_PAGES) {
    hashes[page] = hashObject(pickConfigSlice(config, page));
  }
  return hashes;
}

export interface RepublishPlan {
  changedPages: PreviewPage[];
  regenerateMeta: boolean;
  changedFiles: string[];
}

/** Determine which pages need regeneration on republish. */
export function planRepublish(
  config: WebsiteConfig,
  previousPackage: PublicationPackage | null | undefined,
  previousSourceHashes?: Record<PreviewPage, string> | null,
): RepublishPlan {
  const currentHashes = computePageSourceHashes(config);
  const changedPages: PreviewPage[] = [];

  if (!previousPackage || !previousSourceHashes) {
    return {
      changedPages: [...WEBSITE_PAGES],
      regenerateMeta: true,
      changedFiles: [...WEBSITE_PAGES.map((p) => TENANT_DOCUMENT_PATHS[p]), TENANT_SITEMAP_PATH, TENANT_ROBOTS_PATH, TENANT_MANIFEST_PATH, TENANT_FAVICON_PATH],
    };
  }

  for (const page of WEBSITE_PAGES) {
    if (currentHashes[page] !== previousSourceHashes[page]) {
      changedPages.push(page);
    }
  }

  const regenerateMeta = changedPages.length > 0;
  const changedFiles = [
    ...changedPages.map((page) => TENANT_DOCUMENT_PATHS[page]),
    ...(regenerateMeta ? [TENANT_SITEMAP_PATH, TENANT_ROBOTS_PATH, TENANT_MANIFEST_PATH, TENANT_FAVICON_PATH] : []),
  ];

  return { changedPages, regenerateMeta, changedFiles };
}

/** Merge newly generated output with previous package for incremental republish. */
export function mergeRepublishResult(
  fullGenerated: GeneratedWebsiteResult,
  previousPackage: PublicationPackage,
  plan: RepublishPlan,
): GeneratedWebsiteResult {
  if (plan.changedPages.length === WEBSITE_PAGES.length) {
    return fullGenerated;
  }

  const documents = { ...fullGenerated.documents };
  const pages = { ...fullGenerated.pages };

  for (const page of WEBSITE_PAGES) {
    if (!plan.changedPages.includes(page)) {
      const path = TENANT_DOCUMENT_PATHS[page];
      const previous = previousPackage.files.find((file) => file.path === path);
      if (previous) {
        documents[page] = previous.content;
      }
    }
  }

  return {
    ...fullGenerated,
    documents,
    pages,
    sitemap: plan.regenerateMeta ? fullGenerated.sitemap : previousPackage.files.find((f) => f.path === TENANT_SITEMAP_PATH)?.content ?? fullGenerated.sitemap,
    robots: plan.regenerateMeta ? fullGenerated.robots : previousPackage.files.find((f) => f.path === TENANT_ROBOTS_PATH)?.content ?? fullGenerated.robots,
    manifest: plan.regenerateMeta ? fullGenerated.manifest : previousPackage.files.find((f) => f.path === TENANT_MANIFEST_PATH)?.content ?? fullGenerated.manifest,
    faviconSvg: plan.regenerateMeta ? fullGenerated.faviconSvg : previousPackage.files.find((f) => f.path === TENANT_FAVICON_PATH)?.content ?? fullGenerated.faviconSvg,
  };
}

export function generateWithRepublish(
  config: WebsiteConfig,
  previousPackage: PublicationPackage | null | undefined,
  previousSourceHashes?: Record<PreviewPage, string> | null,
): { generated: GeneratedWebsiteResult; plan: RepublishPlan; sourceHashes: Record<PreviewPage, string> } {
  const plan = planRepublish(config, previousPackage, previousSourceHashes);
  const fullGenerated = websiteGenerator.generate(config);

  if (!previousPackage || plan.changedPages.length === WEBSITE_PAGES.length) {
    return { generated: fullGenerated, plan, sourceHashes: computePageSourceHashes(config) };
  }

  if (plan.changedPages.length === 0) {
    return { generated: fullGenerated, plan, sourceHashes: computePageSourceHashes(config) };
  }

  const merged = mergeRepublishResult(fullGenerated, previousPackage, plan);
  return { generated: merged, plan, sourceHashes: computePageSourceHashes(config) };
}
