import type { BuilderState } from '../../../types/builder';
import type { PreparedWebsite, WebsiteConfig, WebsitePackage } from '../../../types/website-config';
import type { BuilderFiles } from '../files';
import { buildWebsiteConfig } from '../website-config';
import { preparePublication } from './prepare';
import { clearPreparedWebsite, loadPreparedWebsite, savePreparedWebsite } from './storage';

export { preparePublication, generateAllPages } from './prepare';
export { savePreparedWebsite, loadPreparedWebsite, clearPreparedWebsite } from './storage';
export {
  PUBLICATION_STATUS_LABELS,
  WEBSITE_PACKAGE_LABELS,
  publicationStatusBadgeClass,
  nextPublicationStatus,
} from './status';

export interface PublishResult {
  prepared: PreparedWebsite;
  config: WebsiteConfig;
}

/** Run the full publish preparation flow (no DNS, no database). */
export function executePublication(
  state: BuilderState,
  files: BuilderFiles,
  options: {
    package: WebsitePackage;
    publishEmail: string;
  },
): PublishResult {
  const draftConfig = buildWebsiteConfig(state, files, {
    status: 'concept',
    package: options.package,
    publishEmail: options.publishEmail,
  });

  const prepared = preparePublication(draftConfig);
  savePreparedWebsite(prepared);

  return {
    prepared,
    config: prepared.config,
  };
}

export function getActivePreparedWebsite(): PreparedWebsite | null {
  return loadPreparedWebsite();
}

/** Mark website as published (placeholder — no real hosting). */
export function markPublishedPlaceholder(prepared: PreparedWebsite): PreparedWebsite {
  const updated: PreparedWebsite = {
    ...prepared,
    config: {
      ...prepared.config,
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  };
  savePreparedWebsite(updated);
  return updated;
}
