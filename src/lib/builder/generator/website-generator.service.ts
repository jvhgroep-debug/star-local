import type { PreviewPage, PreparedWebsite, WebsiteConfig } from '../../../types/website-config';
import { WEBSITE_PAGES } from '../../../types/website-config';
import type { BuildWebsiteConfigOptions } from '../website-config';
import type { BuilderState } from '../../../types/builder';
import type { BuilderFiles } from '../files';
import { buildWebsiteConfig } from '../website-config';
import { buildAllPageSeo, type PageSeoBundle } from './seo';
import { renderGeneratedWebsiteFromConfig } from './template';
import { buildAllTenantDocuments } from './document';
import { buildTenantFavicon, TENANT_FAVICON_PATH } from './favicon';
import { buildTenantManifest, TENANT_MANIFEST_PATH } from './manifest';
import { buildTenantRobots } from './robots';
import { buildTenantSitemap, TENANT_DOCUMENT_PATHS, TENANT_ROBOTS_PATH, TENANT_SITEMAP_PATH } from './sitemap';

export type { PageSeoBundle };

export interface WebsiteGenerationSummary {
  pageCount: number;
  pages: PreviewPage[];
  documentPaths: Record<PreviewPage, string>;
  sitemapPath: string;
  robotsPath: string;
  manifestPath: string;
  faviconPath: string;
  generatedAt: string;
}

export interface GeneratedWebsiteResult extends PreparedWebsite {
  seoByPage: Record<PreviewPage, PageSeoBundle>;
  documents: Record<PreviewPage, string>;
  sitemap: string;
  robots: string;
  manifest: string;
  faviconSvg: string;
  generation: WebsiteGenerationSummary;
}

/**
 * Central website generator — renders all template pages, SEO, full HTML documents,
 * sitemap.xml and robots.txt from WebsiteConfig. No deployment, no DNS.
 */
export class WebsiteGeneratorService {
  /** Generate a complete website (5 pages + SEO + production HTML artifacts). */
  generate(config: WebsiteConfig): GeneratedWebsiteResult {
    const seoByPage = buildAllPageSeo(config);
    const pages = {} as Record<PreviewPage, string>;
    const standalonePages = {} as Record<PreviewPage, string>;

    for (const page of WEBSITE_PAGES) {
      const seo = seoByPage[page];
      pages[page] = renderGeneratedWebsiteFromConfig(config, page, seo, { standalone: false });
      standalonePages[page] = renderGeneratedWebsiteFromConfig(config, page, seo, { standalone: true });
    }

    const preparedAt = config.preparedAt ?? new Date().toISOString();
    const documents = buildAllTenantDocuments(config, standalonePages, seoByPage);
    const sitemap = buildTenantSitemap({ ...config, preparedAt });
    const robots = buildTenantRobots({ ...config, preparedAt });
    const manifest = buildTenantManifest({ ...config, preparedAt });
    const faviconSvg = buildTenantFavicon({ ...config, preparedAt });

    const generation: WebsiteGenerationSummary = {
      pageCount: WEBSITE_PAGES.length,
      pages: [...WEBSITE_PAGES],
      documentPaths: { ...TENANT_DOCUMENT_PATHS },
      sitemapPath: TENANT_SITEMAP_PATH,
      robotsPath: TENANT_ROBOTS_PATH,
      manifestPath: TENANT_MANIFEST_PATH,
      faviconPath: TENANT_FAVICON_PATH,
      generatedAt: preparedAt,
    };

    return {
      config: { ...config, preparedAt },
      pages,
      seoByPage,
      documents,
      sitemap,
      robots,
      manifest,
      faviconSvg,
      generation,
      preparedAt,
    };
  }

  /** Generate from live builder form state and uploaded files. */
  generateFromBuilder(
    state: BuilderState,
    files: BuilderFiles,
    options: BuildWebsiteConfigOptions = {},
  ): GeneratedWebsiteResult {
    const config = buildWebsiteConfig(state, files, {
      ...options,
      preparedAt: options.preparedAt ?? new Date().toISOString(),
    });
    return this.generate(config);
  }
}

export const websiteGenerator = new WebsiteGeneratorService();
