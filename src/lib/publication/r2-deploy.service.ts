import fs from 'node:fs/promises';
import path from 'node:path';
import type { R2Bucket } from '../media/r2';
import { buildSiteObjectKey, contentTypeForSitePath } from '../publish/site-paths';
import { buildPackageArchiveKey } from '../publish/package-r2-paths';
import { resolvePackageFile } from './paths';

export interface R2DeployResult {
  siteObjectCount: number;
  archiveObjectCount: number;
  siteKeys: string[];
  archiveKeys: string[];
}

function contentTypeForFile(relativePath: string): string {
  const lower = relativePath.toLowerCase();
  if (lower.endsWith('.css')) return 'text/css; charset=utf-8';
  if (lower.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return contentTypeForSitePath(relativePath);
}

async function listPackageFiles(packageRoot: string, relativeDir = ''): Promise<string[]> {
  const absoluteDir = relativeDir ? path.join(packageRoot, relativeDir) : packageRoot;
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const rel = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await listPackageFiles(packageRoot, rel)));
    } else if (entry.isFile() && entry.name !== 'publication.json') {
      files.push(rel.replace(/\\/g, '/'));
    }
  }

  return files;
}

/** Deploy a local publication package to R2 live site + version archive. */
export async function deployPublicationPackageToR2(input: {
  bucket: R2Bucket;
  tenantId: string;
  websiteId: string;
  versionLabel: string;
  packageRoot: string;
}): Promise<R2DeployResult> {
  const files = await listPackageFiles(input.packageRoot);
  const siteKeys: string[] = [];
  const archiveKeys: string[] = [];

  for (const relativePath of files) {
    const resolved = resolvePackageFile(input.packageRoot, relativePath);
    if (!resolved.ok) continue;

    const absolutePath = resolved.absolutePath;
    const isBinary = /\.(jpg|jpeg|png|webp|gif|ico)$/i.test(relativePath);
    const body = isBinary ? await fs.readFile(absolutePath) : await fs.readFile(absolutePath, 'utf8');
    const contentType = contentTypeForFile(relativePath);

    const siteKey = buildSiteObjectKey(input.tenantId, relativePath);
    await input.bucket.put(siteKey, body, {
      httpMetadata: { contentType },
      customMetadata: {
        tenantId: input.tenantId,
        websiteId: input.websiteId,
        version: input.versionLabel,
        sitePath: relativePath,
      },
    });
    siteKeys.push(siteKey);

    const archiveKey = buildPackageArchiveKey(input.tenantId, input.versionLabel, relativePath);
    await input.bucket.put(archiveKey, body, {
      httpMetadata: { contentType },
      customMetadata: {
        tenantId: input.tenantId,
        websiteId: input.websiteId,
        version: input.versionLabel,
        archivePath: relativePath,
      },
    });
    archiveKeys.push(archiveKey);
  }

  return {
    siteObjectCount: siteKeys.length,
    archiveObjectCount: archiveKeys.length,
    siteKeys,
    archiveKeys,
  };
}
