import type { PreviewPage } from '../../types/builder';
import type { PreparedWebsite, WebsiteConfig } from '../../types/website-config';
import { WEBSITE_PAGES } from '../../types/website-config';
import type {
  BuildPublicationOptions,
  BuildPublicationResponse,
  PublicationLogEntry,
  PublicationOverview,
  PublicationPackage,
} from '../../types/publication';
import { preparePublication } from '../builder/publish/prepare';
import { buildPublicationPackage, verifyPublicationPackage } from './publication-package.builder';
import { generateWithRepublish } from './republish';
import { hashObject } from './hash';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  about: 'Over ons',
  services: 'Diensten',
  contact: 'Contact',
  privacy: 'Privacy',
};

function createLogId(): string {
  return crypto.randomUUID();
}

function buildOverview(config: WebsiteConfig, pkg: PublicationPackage): PublicationOverview {
  const subdomain = config.slug.domain;
  return {
    businessName: config.business.name,
    slug: config.slug.slug,
    subdomain,
    url: config.slug.url.replace(/\/$/, ''),
    pageCount: pkg.pageCount,
    pages: WEBSITE_PAGES.map((page) => ({
      label: PAGE_LABELS[page] ?? page,
      path: pkg.files.find((f) => f.path.includes(page === 'home' ? 'index.html' : page))?.path ?? page,
    })),
    imageCount: pkg.imageCount,
    seoScore: pkg.seoScore,
    packageFiles: pkg.files.map((file) => file.path),
  };
}

function failedLog(
  tenantKey: string,
  websiteId: string | null | undefined,
  startedAt: string,
  errors: string[],
  republish: boolean,
): PublicationLogEntry {
  const finishedAt = new Date().toISOString();
  return {
    id: createLogId(),
    tenantKey,
    websiteId: websiteId ?? null,
    status: 'failed',
    startedAt,
    finishedAt,
    durationMs: new Date(finishedAt).getTime() - new Date(startedAt).getTime(),
    pageCount: 0,
    imageCount: 0,
    seoScore: 0,
    errors,
    changedFiles: [],
    republish,
    packageHash: null,
  };
}

export interface LocalPublishInput {
  config: WebsiteConfig;
  prepared?: PreparedWebsite | null;
}

/**
 * Local publication service — builds a complete website package without
 * uploading to production, DNS, or Cloudflare.
 */
export class LocalPublishService {
  /** Build overview for confirmation dialog without running full pipeline. */
  buildOverviewFromConfig(config: WebsiteConfig): PublicationOverview {
    const prepared = preparePublication(config);
    const pkg = buildPublicationPackage(
      {
        ...prepared,
        seoByPage: prepared.seoByPage!,
        documents: prepared.documents!,
        sitemap: prepared.sitemap!,
        robots: prepared.robots!,
        manifest: prepared.manifest!,
        faviconSvg: prepared.faviconSvg!,
        generation: prepared.generation!,
      },
      config.slug.slug,
    );
    return buildOverview(config, pkg);
  }

  /** Run full publication pipeline and assemble local package. */
  buildPackage(
    input: LocalPublishInput,
    options: BuildPublicationOptions,
    previousPackage?: PublicationPackage | null,
    previousSourceHashes?: Record<string, string> | null,
  ): BuildPublicationResponse {
    const startedAt = new Date().toISOString();
    const republish = Boolean(options.republish && previousPackage);
    const tenantKey = options.tenantKey;
    const websiteId = options.websiteId ?? null;

    try {
      const readyConfig: WebsiteConfig = {
        ...input.config,
        status: 'ready_for_publication',
        preparedAt: startedAt,
      };

      const { generated, plan, sourceHashes } = generateWithRepublish(
        readyConfig,
        previousPackage,
        previousSourceHashes as Record<PreviewPage, string> | null,
      );

      const pkg = buildPublicationPackage(generated, tenantKey);
      const verification = verifyPublicationPackage(pkg);

      if (!verification.valid) {
        const errors = [
          ...verification.missing.map((path) => `Ontbrekend bestand: ${path}`),
          ...verification.errors,
        ];
        return {
          ok: false,
          status: 'failed',
          message: errors.join(' '),
          log: failedLog(tenantKey, websiteId, startedAt, errors, republish),
        };
      }

      const finishedAt = new Date().toISOString();
      const log: PublicationLogEntry = {
        id: createLogId(),
        tenantKey,
        websiteId,
        status: 'published',
        startedAt,
        finishedAt,
        durationMs: new Date(finishedAt).getTime() - new Date(startedAt).getTime(),
        pageCount: pkg.pageCount,
        imageCount: pkg.imageCount,
        seoScore: pkg.seoScore,
        errors: [],
        changedFiles: republish ? plan.changedFiles : pkg.files.map((f) => f.path),
        republish,
        packageHash: pkg.packageHash,
      };

      return {
        ok: true,
        status: 'published',
        log,
        package: pkg,
        overview: buildOverview(generated.config, pkg),
        sourceHashes,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende publicatiefout.';
      return {
        ok: false,
        status: 'failed',
        message,
        log: failedLog(tenantKey, websiteId, startedAt, [message], republish),
      };
    }
  }

  /** Build from prepared website stored in builder/localStorage. */
  buildFromPrepared(
    prepared: PreparedWebsite,
    options: BuildPublicationOptions,
    previousPackage?: PublicationPackage | null,
    previousSourceHashes?: Record<string, string> | null,
  ): BuildPublicationResponse {
    return this.buildPackage({ config: prepared.config, prepared }, options, previousPackage, previousSourceHashes);
  }
}

export const localPublishService = new LocalPublishService();

export function computeTenantKey(slug: string, tenantId?: string | null): string {
  return tenantId ?? slug;
}

export function hashPreparedWebsite(prepared: PreparedWebsite): string {
  return hashObject({
    config: prepared.config,
    preparedAt: prepared.preparedAt,
  });
}
