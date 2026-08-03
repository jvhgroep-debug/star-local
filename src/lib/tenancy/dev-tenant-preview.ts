/**
 * Dev-only tenant preview — serves generated HTML for known test slugs
 * when D1/R2 bindings are unavailable (local astro dev without wrangler).
 */
import { buildWebsiteConfig } from '../builder/website-config';
import { websiteGenerator } from '../builder/generator/website-generator.service';
import { buildPublicationPackage, packageToRecord } from '../publish/publication-package.builder';
import {
  createBakkerijDeMarktFiles,
  createBakkerijDeMarktState,
} from '../publish/fixtures/bakkerij-de-markt';
import { contentTypeForSitePath, resolveSiteRelativePath } from '../publish/site-paths';
import { renderTenantErrorPage } from './tenant-error-page';

/** Slugs available for local hostname preview without D1/R2. */
export const DEV_PREVIEW_SLUGS = new Set(['bakkerij-de-markt']);

let cachedPackages: Map<string, Record<string, string>> | null = null;

function buildDevPreviewPackage(slug: string): Record<string, string> | null {
  if (slug !== 'bakkerij-de-markt') return null;

  const state = createBakkerijDeMarktState();
  const files = createBakkerijDeMarktFiles();
  const generated = websiteGenerator.generateFromBuilder(state, files, {
    package: 'free',
    publishEmail: 'info@bakkerijdemarkt.nl',
  });
  const pkg = buildPublicationPackage(generated, slug);
  return packageToRecord(pkg);
}

function getDevPreviewFiles(slug: string): Record<string, string> | null {
  if (!cachedPackages) cachedPackages = new Map();
  if (!cachedPackages.has(slug)) {
    const files = buildDevPreviewPackage(slug);
    if (!files) return null;
    cachedPackages.set(slug, files);
  }
  return cachedPackages.get(slug) ?? null;
}

/** Serve a dev preview tenant site for supported slugs. Returns null when slug unsupported. */
export function serveDevTenantPreview(slug: string, request: Request): Response | null {
  if (!DEV_PREVIEW_SLUGS.has(slug)) return null;

  const files = getDevPreviewFiles(slug);
  if (!files) return null;

  const url = new URL(request.url);
  const relativePath = resolveSiteRelativePath(url.pathname);
  const content = files[relativePath];

  if (!content) {
    return renderTenantErrorPage('page_not_found', { slug });
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': contentTypeForSitePath(relativePath),
      'Cache-Control': 'no-store',
      'X-StarLocal-Dev-Preview': slug,
    },
  });
}

export function isDevPreviewSlug(slug: string): boolean {
  return DEV_PREVIEW_SLUGS.has(slug);
}
