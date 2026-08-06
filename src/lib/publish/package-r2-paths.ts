import { assertSafeTenantId } from './site-paths';

export const TENANT_PACKAGES_FOLDER = 'packages';
export const TENANT_EXPORTS_FOLDER = 'exports';

/** R2 archive key: `{tenantId}/packages/{version}/{relativePath}` */
export function buildPackageArchiveKey(tenantId: string, versionLabel: string, relativePath: string): string {
  assertSafeTenantId(tenantId);
  if (!/^v\d+$/.test(versionLabel)) {
    throw new RangeError('Invalid package version label.');
  }
  const safe = relativePath.replace(/^\/+/, '').replace(/\\/g, '/');
  if (!safe || safe.includes('..')) {
    throw new RangeError('Invalid package archive path.');
  }
  return `${tenantId}/${TENANT_PACKAGES_FOLDER}/${versionLabel}/${safe}`;
}

/** R2 export key: `{tenantId}/exports/{exportId}/{filename}` */
export function buildExportKey(tenantId: string, exportId: string, filename: string): string {
  assertSafeTenantId(tenantId);
  const safeExport = exportId.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = filename.replace(/[/\\]/g, '');
  if (!safeExport || !safeName || safeName.includes('..')) {
    throw new RangeError('Invalid export path.');
  }
  return `${tenantId}/${TENANT_EXPORTS_FOLDER}/${safeExport}/${safeName}`;
}

export function buildPackageArchivePrefix(tenantId: string, versionLabel: string): string {
  assertSafeTenantId(tenantId);
  return `${tenantId}/${TENANT_PACKAGES_FOLDER}/${versionLabel}/`;
}
