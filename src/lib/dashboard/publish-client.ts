import type { PreparedWebsite } from '../../types/website-config';
import type { DashboardViewModel } from '../../types/dashboard';
import type { BuildPublicationResponse, PublicationLogEntry, PublicationOverview } from '../../types/publication';
import { loadPreparedWebsite, savePreparedWebsite } from '../builder/publish/storage';
import {
  computeTenantKey,
  localPublishService,
} from '../publish/local-publish.service';
import {
  getLastPublicationLog,
  loadPublicationLogs,
  loadPublicationPipelineStatus,
  loadSourceHashes,
  savePublicationLog,
  savePublicationPipelineStatus,
  saveSourceHashes,
} from '../publish/publication-log.storage';
import {
  loadPublicationPackage,
  savePublicationPackageMeta,
  setInMemoryPublicationPackage,
} from '../publish/publication-package.storage';

export interface PublishFlowState {
  status: import('../../types/publication').PublicationPipelineStatus;
  isPublishing: boolean;
  lastLog: PublicationLogEntry | null;
  logs: PublicationLogEntry[];
  error: string | null;
}

export function getPublishOverview(model: DashboardViewModel): PublicationOverview | null {
  const prepared = loadPreparedWebsite();
  if (!prepared) return null;
  return localPublishService.buildOverviewFromConfig(prepared.config);
}

export function getInitialPublishState(model: DashboardViewModel): PublishFlowState {
  const tenantKey = computeTenantKey(model.slug, model.tenantId);
  return {
    status: loadPublicationPipelineStatus(tenantKey),
    isPublishing: false,
    lastLog: getLastPublicationLog(tenantKey),
    logs: loadPublicationLogs(tenantKey),
    error: null,
  };
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** Run local publication pipeline (no production upload). */
export async function runLocalPublication(
  model: DashboardViewModel,
  republish = false,
): Promise<BuildPublicationResponse> {
  const prepared = loadPreparedWebsite();
  if (!prepared) {
    return {
      ok: false,
      status: 'failed',
      message: 'Geen opgeslagen website gevonden. Maak eerst uw website aan via de builder.',
      log: {
        id: crypto.randomUUID(),
        tenantKey: model.slug,
        websiteId: model.websiteId,
        status: 'failed',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        durationMs: 0,
        pageCount: 0,
        imageCount: 0,
        seoScore: 0,
        errors: ['Geen opgeslagen website gevonden.'],
        changedFiles: [],
        republish,
        packageHash: null,
      },
    };
  }

  const tenantKey = computeTenantKey(model.slug, model.tenantId);
  const previousPackage = loadPublicationPackage(tenantKey);
  const previousSourceHashes = loadSourceHashes(tenantKey);

  savePublicationPipelineStatus(tenantKey, 'building');
  await delay(300);

  const result = localPublishService.buildFromPrepared(prepared, {
    tenantKey,
    websiteId: model.websiteId,
    republish,
  }, previousPackage, previousSourceHashes);

  if (result.ok) {
    savePublicationPipelineStatus(tenantKey, 'published');
    savePublicationLog(tenantKey, result.log);
    saveSourceHashes(tenantKey, result.sourceHashes);
    setInMemoryPublicationPackage(result.package);
    savePublicationPackageMeta(result.package);

    const updatedPrepared: PreparedWebsite = {
      ...prepared,
      config: {
        ...prepared.config,
        status: 'published',
        publishedAt: result.log.finishedAt,
      },
    };
    savePreparedWebsite(updatedPrepared);
  } else {
    savePublicationPipelineStatus(tenantKey, 'failed');
    savePublicationLog(tenantKey, result.log);
  }

  return result;
}

export function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function formatLogTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function pipelineStatusBadgeClass(status: import('../../types/publication').PublicationPipelineStatus): string {
  switch (status) {
    case 'building':
      return 'builder-status-badge--ready';
    case 'published':
      return 'builder-status-badge--published';
    case 'failed':
      return 'builder-status-badge--concept';
    default:
      return 'builder-status-badge--draft';
  }
}

export function pipelineStatusLabel(status: import('../../types/publication').PublicationPipelineStatus): string {
  const labels = {
    draft: 'Draft',
    building: 'Building',
    published: '● Live',
    failed: 'Failed',
  };
  return labels[status];
}
