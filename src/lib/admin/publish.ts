import type { AdminPublicationLog } from './admin-publication.service';
import { fetchAdminPublicationLog, publishAdminWebsite } from './admin-api.client';
import type { AdminWebsiteRecord } from './queue.types';

export type { AdminPublicationLog, AdminPublicationStep } from './admin-publication.service';

export interface AdminPublicationResult {
  ok: boolean;
  log: AdminPublicationLog;
  message?: string;
}

export async function runAdminPublication(record: AdminWebsiteRecord): Promise<AdminPublicationResult> {
  try {
    const log = await publishAdminWebsite(record.id);
    return { ok: true, log };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Publicatie mislukt.';
    return {
      ok: false,
      message,
      log: {
        websiteId: record.id,
        businessName: record.businessName,
        subdomain: record.subdomain,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        steps: [],
        pageCount: 0,
        fileCount: 0,
        packageHash: '',
        liveUrl: `https://${record.subdomain}`,
      },
    };
  }
}

export async function loadAdminPublication(id: string): Promise<{ log: AdminPublicationLog; packageJson: string | null } | null> {
  try {
    return await fetchAdminPublicationLog(id);
  } catch {
    return null;
  }
}
