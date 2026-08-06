import type { ApprovalStatus } from '../../types/approval';
import type { AdminPublicationLog, AdminPublicationStep } from './admin-publication.service';
import type { AdminWebsiteRecord } from './queue.types';

interface ApiListResponse {
  ok: boolean;
  items?: AdminWebsiteRecord[];
  message?: string;
}

interface ApiRecordResponse {
  ok: boolean;
  item?: AdminWebsiteRecord;
  configSnapshotJson?: string | null;
  message?: string;
}

interface ApiMutationResponse {
  ok: boolean;
  item?: AdminWebsiteRecord;
  message?: string;
}

interface ApiPublicationResponse {
  ok: boolean;
  log?: AdminPublicationLog;
  message?: string;
}

interface ApiPublicationLogResponse {
  ok: boolean;
  log?: AdminPublicationLog;
  packageJson?: string | null;
  message?: string;
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchAdminQueue(): Promise<AdminWebsiteRecord[]> {
  const response = await fetch('/api/admin/websites/', { headers: { Accept: 'application/json' } });
  const data = await parseJson<ApiListResponse>(response);
  if (!response.ok || !data.ok) {
    throw new Error(data.message ?? 'Admin-wachtrij laden mislukt.');
  }
  return data.items ?? [];
}

export async function fetchAdminWebsite(id: string): Promise<{ record: AdminWebsiteRecord; configSnapshotJson: string | null }> {
  const response = await fetch(`/api/admin/websites/?id=${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
  });
  const data = await parseJson<ApiRecordResponse>(response);
  if (!response.ok || !data.ok || !data.item) {
    throw new Error(data.message ?? 'Website niet gevonden.');
  }
  return { record: data.item, configSnapshotJson: data.configSnapshotJson ?? null };
}

export async function updateAdminWebsiteStatus(
  id: string,
  approvalStatus: ApprovalStatus,
  options: { rejectionReason?: string; rejectionCategory?: string } = {},
): Promise<AdminWebsiteRecord> {
  const response = await fetch('/api/admin/websites/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id, approvalStatus, ...options }),
  });
  const data = await parseJson<ApiMutationResponse>(response);
  if (!response.ok || !data.ok || !data.item) {
    throw new Error(data.message ?? 'Status bijwerken mislukt.');
  }
  return data.item;
}

export async function deleteAdminWebsite(id: string): Promise<void> {
  const response = await fetch('/api/admin/websites/', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await parseJson<ApiMutationResponse>(response);
  if (!response.ok || !data.ok) {
    throw new Error(data.message ?? 'Verwijderen mislukt.');
  }
}

export interface GoLiveResult {
  liveUrl: string;
  versionLabel: string;
  siteObjectCount: number;
  archiveObjectCount: number;
}

export async function goLiveAdminWebsite(id: string): Promise<GoLiveResult> {
  const response = await fetch('/api/admin/websites/go-live/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await parseJson<{
    ok: boolean;
    liveUrl?: string;
    versionLabel?: string;
    siteObjectCount?: number;
    archiveObjectCount?: number;
    message?: string;
  }>(response);
  if (!response.ok || !data.ok || !data.liveUrl || !data.versionLabel) {
    throw new Error(data.message ?? 'Live zetten mislukt.');
  }
  return {
    liveUrl: data.liveUrl,
    versionLabel: data.versionLabel,
    siteObjectCount: data.siteObjectCount ?? 0,
    archiveObjectCount: data.archiveObjectCount ?? 0,
  };
}

export async function publishSiteAdminWebsite(id: string): Promise<{ liveUrl: string; slug: string }> {
  const response = await fetch('/api/admin/websites/publish-site/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await parseJson<{ ok: boolean; liveUrl?: string; slug?: string; message?: string }>(response);
  if (!response.ok || !data.ok || !data.liveUrl || !data.slug) {
    throw new Error(data.message ?? 'Publiceren mislukt.');
  }
  return { liveUrl: data.liveUrl, slug: data.slug };
}

export async function publishAdminWebsite(id: string): Promise<AdminPublicationLog> {
  const response = await fetch('/api/admin/websites/publish/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await parseJson<ApiPublicationResponse>(response);
  if (!response.ok || !data.ok || !data.log) {
    throw new Error(data.message ?? 'Publicatie mislukt.');
  }
  return data.log;
}

export async function fetchAdminPublicationLog(id: string): Promise<{ log: AdminPublicationLog; packageJson: string | null }> {
  const response = await fetch(`/api/admin/websites/publication-log/?id=${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
  });
  const data = await parseJson<ApiPublicationLogResponse>(response);
  if (!response.ok || !data.ok || !data.log) {
    throw new Error(data.message ?? 'Geen publicatielog gevonden.');
  }
  return { log: data.log, packageJson: data.packageJson ?? null };
}

export async function submitGeneratedWebsite(payload: {
  savePayload: import('../../types/save').SaveWebsitePayload;
  configSnapshotJson: string;
}): Promise<{ websiteId: string; tenantId: string; slug: string }> {
  const response = await fetch('/api/website/save/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...payload.savePayload,
      approvalStatus: 'pending_review',
      configSnapshotJson: payload.configSnapshotJson,
    }),
  });
  const data = await parseJson<{ ok: boolean; result?: { websiteId: string; tenantId: string; slug: string }; message?: string }>(response);
  if (!response.ok || !data.ok || !data.result) {
    throw new Error(data.message ?? 'Website indienen mislukt.');
  }
  return {
    websiteId: data.result.websiteId,
    tenantId: data.result.tenantId,
    slug: data.result.slug,
  };
}
