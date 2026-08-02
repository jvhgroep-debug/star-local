import type { MediaFolder, PhotoCategory } from '../../types/media';

const TENANT_ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

/** Validate tenant id used in storage keys (no path traversal). */
export function assertSafeTenantId(tenantId: string): void {
  const trimmed = tenantId.trim();
  if (!trimmed || !TENANT_ID_PATTERN.test(trimmed)) {
    throw new RangeError('Invalid tenant id for media storage.');
  }
}

/** Build R2 object key: `{tenantId}/{folder}/{filename}`. */
export function buildMediaKey(tenantId: string, folder: MediaFolder, filename: string): string {
  assertSafeTenantId(tenantId);
  const safeName = filename.replace(/[/\\]/g, '');
  if (!safeName || safeName.includes('..')) {
    throw new RangeError('Invalid media filename.');
  }
  return `${tenantId}/${folder}/${safeName}`;
}

/** Prefix for listing all objects under a tenant folder. */
export function buildMediaPrefix(tenantId: string, folder: MediaFolder): string {
  assertSafeTenantId(tenantId);
  return `${tenantId}/${folder}/`;
}

/** Prefix for listing all tenant media. */
export function buildTenantMediaPrefix(tenantId: string): string {
  assertSafeTenantId(tenantId);
  return `${tenantId}/`;
}

/** Map upload category to storage folder. */
export function photoCategoryToFolder(category: PhotoCategory): MediaFolder {
  return category;
}

/** Folders that count toward the photo limit (excluding logo). */
export const PHOTO_STORAGE_FOLDERS: readonly MediaFolder[] = ['photos', 'hero', 'gallery'] as const;

/** All tenant media folders. */
export const ALL_MEDIA_FOLDERS: readonly MediaFolder[] = ['logo', 'photos', 'hero', 'gallery'] as const;

/** Parse an R2 key into tenant folder components. Returns null when invalid. */
export function parseMediaKey(key: string): { tenantId: string; folder: MediaFolder; filename: string } | null {
  const parts = key.split('/');
  if (parts.length !== 3) return null;

  const [tenantId, folder, filename] = parts;
  if (!tenantId || !filename) return null;
  if (folder !== 'logo' && folder !== 'photos' && folder !== 'hero' && folder !== 'gallery') return null;

  try {
    assertSafeTenantId(tenantId);
  } catch {
    return null;
  }

  return { tenantId, folder, filename };
}
