import type { PreviewPage } from '../../../types/builder';
import type { WebsiteConfig, PreparedWebsite } from '../../../types/website-config';
import { WEBSITE_PAGES } from '../../../types/website-config';import { renderGeneratedWebsiteFromConfig } from '../generator/template';

/** Generate all five pages from WebsiteConfig using the shared template. */
export function generateAllPages(config: WebsiteConfig): Record<PreviewPage, string> {
  const pages = {} as Record<PreviewPage, string>;
  for (const page of WEBSITE_PAGES) {
    pages[page] = renderGeneratedWebsiteFromConfig(config, page);
  }
  return pages;
}

/** Prepare a website for publication — full technical flow without DNS or hosting. */
export function preparePublication(config: WebsiteConfig): PreparedWebsite {
  const preparedAt = new Date().toISOString();
  const readyConfig: WebsiteConfig = {
    ...config,
    status: 'ready_for_publication',
    preparedAt,
    publishedAt: null,
  };

  return {
    config: readyConfig,
    pages: generateAllPages(readyConfig),
    preparedAt,
  };
}
