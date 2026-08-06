import type { PublicationPackage } from '../../types/publication';

import type { WebsiteConfig } from '../../types/website-config';

import { websiteGenerator } from '../builder/generator/website-generator.service';

import { buildPublicationPackage, verifyPublicationPackage } from '../publish/publication-package.builder';

import { AdminQueueRepository } from './admin-queue.repository';

import { parseConfigSnapshot } from './config-snapshot';

import type { AdminWebsiteRecord } from './queue.types';

import type { D1Database } from '../db/d1';

import type { R2Bucket } from '../media/r2';

import { runPublicationExportEngine } from '../publication/export-engine';



export interface AdminPublicationStep {

  id: string;

  label: string;

  ok: boolean;

  detail?: string;

}



export interface AdminPublicationLog {

  websiteId: string;

  businessName: string;

  subdomain: string;

  startedAt: string;

  finishedAt: string;

  steps: AdminPublicationStep[];

  pageCount: number;

  fileCount: number;

  packageHash: string;

  liveUrl: string;

  versionLabel?: string;

  previousVersion?: string | null;

  canonicalBaseUrl?: string;

  assetCount?: number;

  totalSizeBytes?: number;

  packageSummary?: Record<string, unknown>;

}



export interface AdminPublicationResult {

  ok: boolean;

  log: AdminPublicationLog;

  package?: PublicationPackage;

  message?: string;

  versionLabel?: string;

  packageRoot?: string;

}



export async function runAdminPublicationOnServer(

  db: D1Database,

  record: AdminWebsiteRecord,

  configSnapshotJson: string | null,

  media?: R2Bucket | null,

): Promise<AdminPublicationResult> {

  const result = await runPublicationExportEngine(record, configSnapshotJson, { db, media });

  return {

    ok: result.ok,

    log: result.log,

    message: result.message,

    versionLabel: result.versionLabel,

    packageRoot: result.packageRoot,

  };

}



export function parsePublicationSteps(stepsJson: string): AdminPublicationStep[] {

  try {

    const parsed = JSON.parse(stepsJson) as AdminPublicationStep[];

    return Array.isArray(parsed) ? parsed : [];

  } catch {

    return [];

  }

}



export function hydrateConfigFromSnapshot(config: WebsiteConfig): WebsiteConfig {

  return config;

}



/** @deprecated Use runPublicationExportEngine — kept for generator re-exports */

export function generateFromSnapshot(record: AdminWebsiteRecord, configSnapshotJson: string | null) {

  const snapshot = parseConfigSnapshot(configSnapshotJson);

  if (!snapshot) return null;

  return websiteGenerator.generate({ ...snapshot, preparedAt: record.createdAt });

}



export { verifyPublicationPackage, buildPublicationPackage };


