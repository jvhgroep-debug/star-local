import type { PublicationPackage } from '../../types/publication';

export const PUBLICATION_PACKAGE_STORAGE_KEY = 'starlocal-publication-package-v1';

/** Store package metadata and file paths (full HTML omitted to save localStorage quota). */
export interface StoredPublicationPackageMeta {
  tenantKey: string;
  businessName: string;
  slug: string;
  baseUrl: string;
  pageCount: number;
  imageCount: number;
  seoScore: number;
  builtAt: string;
  packageHash: string;
  filePaths: string[];
  fileHashes: Record<string, string>;
}

let inMemoryPackage: PublicationPackage | null = null;

export function savePublicationPackageMeta(pkg: PublicationPackage): void {
  inMemoryPackage = pkg;

  if (typeof window === 'undefined') return;

  const meta: StoredPublicationPackageMeta = {
    tenantKey: pkg.tenantKey,
    businessName: pkg.businessName,
    slug: pkg.slug,
    baseUrl: pkg.baseUrl,
    pageCount: pkg.pageCount,
    imageCount: pkg.imageCount,
    seoScore: pkg.seoScore,
    builtAt: pkg.builtAt,
    packageHash: pkg.packageHash,
    filePaths: pkg.files.map((f) => f.path),
    fileHashes: Object.fromEntries(pkg.files.map((f) => [f.path, f.contentHash])),
  };

  const raw = window.localStorage.getItem(PUBLICATION_PACKAGE_STORAGE_KEY);
  const map: Record<string, StoredPublicationPackageMeta> = raw ? JSON.parse(raw) : {};
  map[pkg.tenantKey] = meta;
  window.localStorage.setItem(PUBLICATION_PACKAGE_STORAGE_KEY, JSON.stringify(map));
}

export function loadPublicationPackageMeta(tenantKey: string): StoredPublicationPackageMeta | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PUBLICATION_PACKAGE_STORAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, StoredPublicationPackageMeta>;
    return map[tenantKey] ?? null;
  } catch {
    return null;
  }
}

export function getInMemoryPublicationPackage(): PublicationPackage | null {
  return inMemoryPackage;
}

export function loadPublicationPackage(tenantKey: string): PublicationPackage | null {
  if (inMemoryPackage?.tenantKey === tenantKey) return inMemoryPackage;
  return null;
}

export function setInMemoryPublicationPackage(pkg: PublicationPackage | null): void {
  inMemoryPackage = pkg;
}
