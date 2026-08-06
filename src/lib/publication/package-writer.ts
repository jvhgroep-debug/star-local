import fs from 'node:fs/promises';
import path from 'node:path';
import type { PublicationPackage, PublicationPackageFile } from '../../types/publication';
import type { PublicationManifest } from '../../types/publication-package';
import { hashContent } from '../publish/hash';
import { resolvePackageDirectory, resolvePackageFile } from './paths';

export interface PackageWriteResult {
  packageRoot: string;
  relativeRoot: string;
  filesWritten: number;
  totalSizeBytes: number;
  fileHashes: PublicationManifest['fileHashes'];
}

/** Write publication package + binary assets to disk atomically. */
export async function writePublicationPackage(
  tenantId: string,
  websiteId: string,
  versionLabel: string,
  pkg: PublicationPackage,
  manifest: PublicationManifest,
  binaryAssets: Array<{ relativePath: string; bytes: Uint8Array; mimeType: string }> = [],
): Promise<PackageWriteResult> {
  const resolved = resolvePackageDirectory(tenantId, websiteId, versionLabel);
  if (!resolved.ok) throw new Error(resolved.message);

  const tempRoot = `${resolved.absolutePath}.tmp-${Date.now()}`;
  await fs.mkdir(tempRoot, { recursive: true });

  const fileHashes: PublicationManifest['fileHashes'] = [];
  let totalSizeBytes = 0;

  try {
    for (const file of pkg.files) {
      const written = await writePackageFile(tempRoot, file);
      fileHashes.push(written);
      totalSizeBytes += written.sizeBytes;
    }

    for (const asset of binaryAssets) {
      const written = await writeBinaryAsset(tempRoot, asset.relativePath, asset.bytes, asset.mimeType);
      fileHashes.push(written);
      totalSizeBytes += written.sizeBytes;
    }

    const manifestJson = JSON.stringify(manifest, null, 2);
    const manifestBytes = new TextEncoder().encode(manifestJson);
    await writePackageFile(tempRoot, {
      path: 'publication.json',
      content: manifestJson,
      contentHash: hashContent(manifestJson),
      mimeType: 'application/json; charset=utf-8',
    });
    fileHashes.push({
      path: 'publication.json',
      sha256: hashContent(manifestJson),
      sizeBytes: manifestBytes.byteLength,
    });
    totalSizeBytes += manifestBytes.byteLength;

    await fs.rm(resolved.absolutePath, { recursive: true, force: true });
    try {
      await fs.rename(tempRoot, resolved.absolutePath);
    } catch {
      await fs.cp(tempRoot, resolved.absolutePath, { recursive: true });
      await fs.rm(tempRoot, { recursive: true, force: true });
    }

    return {
      packageRoot: resolved.absolutePath,
      relativeRoot: resolved.relativePath,
      filesWritten: fileHashes.length,
      totalSizeBytes,
      fileHashes,
    };
  } catch (error) {
    await fs.rm(tempRoot, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
}

async function writePackageFile(
  packageRoot: string,
  file: PublicationPackageFile,
): Promise<PublicationManifest['fileHashes'][number]> {
  const resolved = resolvePackageFile(packageRoot, file.path);
  if (!resolved.ok) throw new Error(resolved.message);

  await fs.mkdir(path.dirname(resolved.absolutePath), { recursive: true });
  await fs.writeFile(resolved.absolutePath, file.content, 'utf8');

  const sizeBytes = new TextEncoder().encode(file.content).byteLength;
  return {
    path: file.path.replace(/\\/g, '/'),
    sha256: file.contentHash,
    sizeBytes,
  };
}

/** Write binary asset to package. */
export async function writeBinaryAsset(
  packageRoot: string,
  relativePath: string,
  bytes: Uint8Array,
  mimeType: string,
): Promise<PublicationManifest['fileHashes'][number]> {
  const resolved = resolvePackageFile(packageRoot, relativePath);
  if (!resolved.ok) throw new Error(resolved.message);

  await fs.mkdir(path.dirname(resolved.absolutePath), { recursive: true });
  await fs.writeFile(resolved.absolutePath, bytes);

  const hash = hashBinary(bytes);
  return {
    path: relativePath.replace(/\\/g, '/'),
    sha256: hash,
    sizeBytes: bytes.byteLength,
  };
}

function hashBinary(bytes: Uint8Array): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i += 1) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** Read a text file from an existing package. */
export async function readPackageTextFile(packageRoot: string, relativePath: string): Promise<string | null> {
  const resolved = resolvePackageFile(packageRoot, relativePath);
  if (!resolved.ok) return null;
  try {
    return await fs.readFile(resolved.absolutePath, 'utf8');
  } catch {
    return null;
  }
}

/** Overwrite publication.json after all files are written. */
export async function writePublicationManifestFile(
  packageRoot: string,
  manifest: PublicationManifest,
): Promise<void> {
  const resolved = resolvePackageFile(packageRoot, 'publication.json');
  if (!resolved.ok) throw new Error(resolved.message);
  await fs.writeFile(resolved.absolutePath, JSON.stringify(manifest, null, 2), 'utf8');
}

/** Read publication.json from package root. */
export async function readPublicationManifest(packageRoot: string): Promise<PublicationManifest | null> {
  const raw = await readPackageTextFile(packageRoot, 'publication.json');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PublicationManifest;
  } catch {
    return null;
  }
}

/** Remove incomplete temp directories for a website. */
export async function cleanupTempPackages(tenantId: string, websiteId: string): Promise<void> {
  const resolved = resolvePackageDirectory(tenantId, websiteId, 'v1');
  if (!resolved.ok) return;
  const parent = path.dirname(resolved.absolutePath);
  try {
    const entries = await fs.readdir(parent);
    for (const entry of entries) {
      if (entry.includes('.tmp-')) {
        await fs.rm(path.join(parent, entry), { recursive: true, force: true });
      }
    }
  } catch {
    /* ignore */
  }
}
