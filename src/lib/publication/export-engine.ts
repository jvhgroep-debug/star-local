import type { R2Bucket } from '../media/r2';
import { createRepositories } from '../db';
import type { D1Database } from '../db/d1';
import { createMediaServiceOrLocal } from '../media';
import { websiteGenerator } from '../builder/generator/website-generator.service';
import { buildPublicationPackage, verifyPublicationPackage } from '../publish/publication-package.builder';
import { parseConfigSnapshot } from '../admin/config-snapshot';
import type { AdminWebsiteRecord } from '../admin/queue.types';
import type { AdminPublicationLog, AdminPublicationStep } from '../admin/admin-publication.service';
import { AdminQueueRepository } from '../admin/admin-queue.repository';
import { productionBaseUrl } from '../../config/publication';
import type { PublicationManifest } from '../../types/publication-package';
import { withProductionUrls } from './production-config';
import { exportTenantAssets } from './asset-exporter';
import { finalizeProductionHtmlFiles } from './html-processor';
import { validateProductionPackage } from './package-validator';
import { buildPublicationManifest, summarizeManifestForLog } from './manifest-builder';
import { cleanupTempPackages, writePublicationPackage, writePublicationManifestFile } from './package-writer';
import { PublicationVersionRepository } from './version.repository';

export interface ExportEngineOptions {
  db: D1Database;
  media?: R2Bucket | null;
}

export interface ExportEngineResult {
  ok: boolean;
  log: AdminPublicationLog;
  manifest?: PublicationManifest;
  versionLabel?: string;
  packageRoot?: string;
  message?: string;
}

export async function runPublicationExportEngine(
  record: AdminWebsiteRecord,
  configSnapshotJson: string | null,
  options: ExportEngineOptions,
): Promise<ExportEngineResult> {
  const { db, media: mediaBucket } = options;
  const repo = new AdminQueueRepository(db);
  const versionRepo = new PublicationVersionRepository(db);
  const repos = createRepositories(db);
  const media = createMediaServiceOrLocal(mediaBucket ?? null);

  const startedAt = new Date().toISOString();
  const steps: AdminPublicationStep[] = [];
  const push = (step: AdminPublicationStep) => steps.push(step);
  const liveUrl = productionBaseUrl(record.slug);
  const tenantId = record.tenantId ?? '';
  const websiteId = record.id;

  if (!tenantId) {
    return failResult(record, startedAt, steps, liveUrl, 'Tenant-ID ontbreekt voor publicatie.');
  }

  await repo.updateApprovalStatus(websiteId, 'preparing');
  const rollbackStatus = record.approvalStatus === 'package_ready' ? 'package_ready' : 'approved';

  try {
    const snapshot = parseConfigSnapshot(configSnapshotJson);
    if (!snapshot) throw new Error('Config-snapshot ontbreekt of is ongeldig.');

    push({ id: 'snapshot', label: 'Config geladen', ok: true, detail: record.businessName });

    const productionConfig = withProductionUrls(snapshot, record.slug);
    const { config: configWithMedia, assets: binaryAssets } = await exportTenantAssets(
      productionConfig,
      tenantId,
      repos,
      media,
    );

    push({ id: 'assets', label: 'Media verwerkt', ok: true, detail: `${binaryAssets.length} asset(s)` });

    const generated = websiteGenerator.generate({
      ...configWithMedia,
      preparedAt: new Date().toISOString(),
    });

    push({ id: 'pages', label: "Pagina's gegenereerd", ok: true, detail: `${generated.generation.pageCount} pagina's` });

    let pkg = buildPublicationPackage(generated, record.slug);
    pkg = { ...pkg, baseUrl: liveUrl, files: finalizeProductionHtmlFiles(pkg.files) };

    const baseVerification = verifyPublicationPackage(pkg);
    push({ id: 'build', label: 'Pakket samengesteld', ok: baseVerification.valid, detail: `${pkg.files.length} bestanden` });
    if (!baseVerification.valid) {
      throw new Error([...baseVerification.missing, ...baseVerification.errors].join('; '));
    }

    const validation = validateProductionPackage(pkg, record.slug);
    push({ id: 'seo', label: 'SEO gevalideerd', ok: validation.checks.canonicals && validation.checks.openGraph, detail: liveUrl });
    push({ id: 'sitemap', label: 'Sitemap gevalideerd', ok: validation.checks.sitemap, detail: 'sitemap.xml' });
    push({ id: 'robots', label: 'Robots gevalideerd', ok: validation.checks.robots, detail: 'robots.txt' });
    push({ id: 'manifest', label: 'Manifest gevalideerd', ok: validation.checks.manifest, detail: 'manifest.webmanifest' });
    push({ id: 'links', label: 'Interne links gecontroleerd', ok: validation.checks.noForbiddenLinks, detail: 'Geen admin/builder links' });
    if (!validation.valid) throw new Error(validation.errors.join('; '));

    const { versionNumber, versionLabel } = await versionRepo.getNextVersionLabel(websiteId);
    const previousVersionRow = await versionRepo.findActiveVersion(websiteId);
    const previousVersion = previousVersionRow?.versionLabel ?? null;
    const publicationId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const preliminaryManifest = buildPublicationManifest({
      publicationId,
      tenantId,
      websiteId,
      slug: record.slug,
      versionLabel,
      versionNumber,
      status: 'package_ready',
      createdAt,
      pkg,
      fileHashes: [],
      totalSizeBytes: 0,
      activeVersion: versionLabel,
      previousVersion,
    });

    const writeResult = await writePublicationPackage(
      tenantId,
      websiteId,
      versionLabel,
      pkg,
      preliminaryManifest,
      binaryAssets.map((a) => ({ relativePath: a.relativePath, bytes: a.bytes, mimeType: a.mimeType })),
    );

    const finalManifest = buildPublicationManifest({
      publicationId,
      tenantId,
      websiteId,
      slug: record.slug,
      versionLabel,
      versionNumber,
      status: 'package_ready',
      createdAt,
      pkg,
      fileHashes: writeResult.fileHashes,
      totalSizeBytes: writeResult.totalSizeBytes,
      activeVersion: versionLabel,
      previousVersion,
      assetCountOverride: writeResult.fileHashes.filter((h) => h.path.startsWith('assets/')).length,
    });

    await writePublicationManifestFile(writeResult.packageRoot, finalManifest);

    await versionRepo.markPreviousVersionsSuperseded(websiteId, versionLabel);
    await versionRepo.createVersion({
      id: publicationId,
      tenantId,
      websiteId,
      versionLabel,
      versionNumber,
      status: 'package_ready',
      domain: `${record.slug}.starlocal.nl`,
      slug: record.slug,
      packageRoot: writeResult.relativeRoot,
      pageCount: pkg.pageCount,
      assetCount: finalManifest.assetCount,
      totalSizeBytes: writeResult.totalSizeBytes,
      packageHash: pkg.packageHash,
      publicationId,
      createdAt,
    });

    await repo.markPackageReady(websiteId, {
      versionLabel,
      previousVersion,
      packageGeneratedAt: createdAt,
      canonicalBaseUrl: liveUrl,
    });

    const finishedAt = new Date().toISOString();
    const log: AdminPublicationLog = {
      websiteId,
      businessName: record.businessName,
      subdomain: record.subdomain,
      startedAt,
      finishedAt,
      steps: [
        ...steps,
        {
          id: 'complete',
          label: 'Publicatiepakket gereed',
          ok: true,
          detail: `${versionLabel} · ${pkg.pageCount} pagina's · ${finalManifest.assetCount} assets · ${formatBytes(writeResult.totalSizeBytes)}`,
        },
      ],
      pageCount: pkg.pageCount,
      fileCount: writeResult.filesWritten,
      packageHash: pkg.packageHash,
      liveUrl,
      versionLabel,
      previousVersion,
      canonicalBaseUrl: liveUrl,
      assetCount: finalManifest.assetCount,
      totalSizeBytes: writeResult.totalSizeBytes,
      packageSummary: summarizeManifestForLog(finalManifest),
    };

    await repo.savePublicationLog({
      id: crypto.randomUUID(),
      websiteId,
      tenantId,
      businessName: record.businessName,
      subdomain: record.subdomain,
      startedAt,
      finishedAt,
      stepsJson: JSON.stringify(log.steps),
      pageCount: pkg.pageCount,
      fileCount: writeResult.filesWritten,
      packageHash: pkg.packageHash,
      packageJson: JSON.stringify({ manifest: finalManifest, versionLabel, packageRoot: writeResult.relativeRoot }),
      liveUrl,
    });

    return { ok: true, log, manifest: finalManifest, versionLabel, packageRoot: writeResult.packageRoot };
  } catch (error) {
    await cleanupTempPackages(tenantId, websiteId);
    await repo.updateApprovalStatus(websiteId, rollbackStatus);

    const message = error instanceof Error ? error.message : 'Pakketgeneratie mislukt.';
    push({ id: 'complete', label: 'Publicatiepakket mislukt', ok: false, detail: message });
    return failResult(record, startedAt, steps, liveUrl, message);
  }
}

function failResult(
  record: AdminWebsiteRecord,
  startedAt: string,
  steps: AdminPublicationStep[],
  liveUrl: string,
  message: string,
): ExportEngineResult {
  return {
    ok: false,
    message,
    log: {
      websiteId: record.id,
      businessName: record.businessName,
      subdomain: record.subdomain,
      startedAt,
      finishedAt: new Date().toISOString(),
      steps,
      pageCount: 0,
      fileCount: 0,
      packageHash: '',
      liveUrl,
    },
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
