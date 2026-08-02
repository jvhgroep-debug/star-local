import type { WebsiteConfig, PreparedWebsite } from '../../../types/website-config';
import { websiteGenerator } from '../generator/website-generator.service';

/** Prepare a website for publication — full technical flow without DNS or hosting. */
export function preparePublication(config: WebsiteConfig): PreparedWebsite {
  const preparedAt = new Date().toISOString();
  const readyConfig: WebsiteConfig = {
    ...config,
    status: 'ready_for_publication',
    preparedAt,
    publishedAt: null,
  };

  return websiteGenerator.generate(readyConfig);
}
