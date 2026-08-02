import type { BuilderState } from '../../types/builder';
import type { PreviewPage } from '../../types/builder';
import type { WebsiteConfig } from '../../types/website-config';
import type { BuilderFiles } from './files';
import { buildWebsiteConfig } from './website-config';
import { renderGeneratedWebsiteFromConfig, renderExampleDomainBar } from './generator/template';

export { renderExampleDomainBar, buildWebsiteConfig };
export type { WebsiteConfig, PreparedWebsite, PublicationStatus, WebsitePackage } from '../../types/website-config';

/** @deprecated Use buildWebsiteConfig */
export function generateWebsite(state: BuilderState, files: BuilderFiles): WebsiteConfig {
  return buildWebsiteConfig(state, files);
}

export function renderTenantPreview(
  state: BuilderState,
  files: BuilderFiles,
  page: PreviewPage,
): string {
  return renderGeneratedWebsiteFromConfig(buildWebsiteConfig(state, files), page);
}
