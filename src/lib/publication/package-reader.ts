import fs from 'node:fs/promises';
import path from 'node:path';
import type { D1Database } from '../db/d1';
import type { PublicationManifest } from '../../types/publication-package';
import { resolvePackageDirectory, resolvePackageFile } from './paths';
import { readPublicationManifest } from './package-writer';
import { PublicationVersionRepository } from './version.repository';
import { injectPreviewNoindex } from './html-processor';

const PAGE_PATHS = [
  { id: 'home', label: 'Home', file: 'index.html' },
  { id: 'about', label: 'Over ons', file: 'over-ons/index.html' },
  { id: 'services', label: 'Diensten', file: 'diensten/index.html' },
  { id: 'contact', label: 'Contact', file: 'contact/index.html' },
  { id: 'privacy', label: 'Privacy', file: 'privacy/index.html' },
] as const;

export interface LoadedPublicationPackage {
  manifest: PublicationManifest;
  packageRoot: string;
  versionLabel: string;
}

export async function loadActivePublicationPackage(
  db: D1Database,
  websiteId: string,
  versionLabel?: string,
): Promise<LoadedPublicationPackage | null> {
  const versionRepo = new PublicationVersionRepository(db);
  const version = versionLabel
    ? await versionRepo.findByWebsiteAndVersion(websiteId, versionLabel)
    : await versionRepo.findActiveVersion(websiteId);

  if (!version) return null;

  const resolved = resolvePackageDirectory(version.tenantId, version.websiteId, version.versionLabel);
  if (!resolved.ok) return null;

  const manifest = await readPublicationManifest(resolved.absolutePath);
  if (!manifest) return null;

  return {
    manifest,
    packageRoot: resolved.absolutePath,
    versionLabel: version.versionLabel,
  };
}

export async function readPublicationFile(
  packageRoot: string,
  relativePath: string,
  options: { preview?: boolean; previewBase?: string; websiteId?: string; version?: string } = {},
): Promise<{ content: string; mimeType: string } | null> {
  const resolved = resolvePackageFile(packageRoot, relativePath);
  if (!resolved.ok) return null;

  try {
    const stat = await fs.stat(resolved.absolutePath);
    if (stat.isDirectory()) return null;

    if (relativePath.endsWith('.html')) {
      let html = await fs.readFile(resolved.absolutePath, 'utf8');
      if (options.preview) {
        html = injectPreviewNoindex(html);
        if (options.websiteId) {
          html = rewriteHtmlForPreviewServing(html, options.websiteId, options.version);
        }
      }
      return { content: html, mimeType: 'text/html; charset=utf-8' };
    }

    if (relativePath.endsWith('.css')) {
      return { content: await fs.readFile(resolved.absolutePath, 'utf8'), mimeType: 'text/css; charset=utf-8' };
    }
    if (relativePath.endsWith('.js')) {
      return { content: await fs.readFile(resolved.absolutePath, 'utf8'), mimeType: 'application/javascript; charset=utf-8' };
    }
    if (relativePath.endsWith('.svg')) {
      return { content: await fs.readFile(resolved.absolutePath, 'utf8'), mimeType: 'image/svg+xml' };
    }
    if (relativePath.endsWith('.xml')) {
      return { content: await fs.readFile(resolved.absolutePath, 'utf8'), mimeType: 'application/xml; charset=utf-8' };
    }
    if (relativePath.endsWith('.webmanifest')) {
      return { content: await fs.readFile(resolved.absolutePath, 'utf8'), mimeType: 'application/manifest+json' };
    }
    if (relativePath.endsWith('.txt')) {
      return { content: await fs.readFile(resolved.absolutePath, 'utf8'), mimeType: 'text/plain; charset=utf-8' };
    }

    const buffer = await fs.readFile(resolved.absolutePath);
    return { content: buffer.toString('base64'), mimeType: 'application/octet-stream' };
  } catch {
    return null;
  }
}

export function listPublicationPages(): typeof PAGE_PATHS {
  return PAGE_PATHS;
}

export async function readPublicationBinary(
  packageRoot: string,
  relativePath: string,
): Promise<{ bytes: Uint8Array; mimeType: string } | null> {
  const resolved = resolvePackageFile(packageRoot, relativePath);
  if (!resolved.ok) return null;
  try {
    const buffer = await fs.readFile(resolved.absolutePath);
    const ext = path.extname(relativePath).toLowerCase();
    const mimeType =
      ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.png'
          ? 'image/png'
          : ext === '.webp'
            ? 'image/webp'
            : ext === '.svg'
              ? 'image/svg+xml'
              : 'application/octet-stream';
    return { bytes: new Uint8Array(buffer), mimeType };
  } catch {
    return null;
  }
}

function rewriteHtmlForPreviewServing(html: string, websiteId: string, version?: string): string {
  const versionParam = version ? `&version=${encodeURIComponent(version)}` : '';
  const assetPrefix = `/api/admin/publication/file/?id=${encodeURIComponent(websiteId)}${versionParam}&path=`;

  return html
    .replace(/href="\/assets\//g, `href="${assetPrefix}assets/`)
    .replace(/src="\/assets\//g, `src="${assetPrefix}assets/`)
    .replace(/href="\/favicon\.svg"/g, `href="${assetPrefix}favicon.svg"`)
    .replace(/href="\/manifest\.webmanifest"/g, `href="${assetPrefix}manifest.webmanifest"`);
}
