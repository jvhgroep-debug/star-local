import path from 'node:path';
import {
  PUBLICATIONS_ROOT_DIR,
  sanitizePublicationId,
  sanitizePublicationSlug,
  versionLabelFromNumber,
} from '../../config/publication';

/** Resolve absolute project root (cwd). */
export function getProjectRoot(): string {
  return process.cwd();
}

/** Resolve safe publications root directory. */
export function getPublicationsRoot(): string {
  return path.join(getProjectRoot(), PUBLICATIONS_ROOT_DIR);
}

/** Build tenant/website/version package directory — rejects path traversal. */
export function resolvePackageDirectory(
  tenantId: string,
  websiteId: string,
  versionLabel: string,
): { ok: true; absolutePath: string; relativePath: string } | { ok: false; message: string } {
  const safeTenant = sanitizePublicationId(tenantId);
  const safeWebsite = sanitizePublicationId(websiteId);
  const safeVersion = /^v\d+$/.test(versionLabel) ? versionLabel : null;

  if (!safeTenant || !safeWebsite || !safeVersion) {
    return { ok: false, message: 'Ongeldige tenant-, website- of versie-identificatie.' };
  }

  const relativePath = path.join(safeTenant, safeWebsite, safeVersion);
  const absolutePath = path.join(getPublicationsRoot(), relativePath);

  const normalizedRoot = path.resolve(getPublicationsRoot());
  const normalizedTarget = path.resolve(absolutePath);
  if (!normalizedTarget.startsWith(normalizedRoot + path.sep) && normalizedTarget !== normalizedRoot) {
    return { ok: false, message: 'Pakketpad valt buiten de toegestane publicatiemap.' };
  }

  return { ok: true, absolutePath, relativePath: relativePath.replace(/\\/g, '/') };
}

/** Resolve a file inside a package — no traversal beyond package root. */
export function resolvePackageFile(
  packageRoot: string,
  relativeFile: string,
): { ok: true; absolutePath: string } | { ok: false; message: string } {
  const normalizedRoot = path.resolve(packageRoot);
  const safeRelative = relativeFile.replace(/\\/g, '/').replace(/^\/+/, '');
  if (safeRelative.includes('..') || safeRelative.includes('\0')) {
    return { ok: false, message: 'Ongeldig bestandspad in pakket.' };
  }
  const absolutePath = path.resolve(normalizedRoot, safeRelative);
  if (!absolutePath.startsWith(normalizedRoot + path.sep) && absolutePath !== normalizedRoot) {
    return { ok: false, message: 'Bestand valt buiten pakketroot.' };
  }
  return { ok: true, absolutePath };
}

export function safeAssetFilename(original: string, fallback: string): string {
  const base = path.basename(original).replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
  return base.length > 0 ? base : fallback;
}

export { sanitizePublicationSlug, versionLabelFromNumber };
