import type { PublicationLogEntry } from '../../types/publication';

export const PUBLICATION_LOGS_STORAGE_KEY = 'starlocal-publication-logs-v1';
export const PUBLICATION_STATUS_STORAGE_KEY = 'starlocal-publication-status-v1';
export const PUBLICATION_SOURCE_HASHES_KEY = 'starlocal-publication-source-hashes-v1';

export function loadPublicationLogs(tenantKey: string): PublicationLogEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(PUBLICATION_LOGS_STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, PublicationLogEntry[]>;
    return all[tenantKey] ?? [];
  } catch {
    return [];
  }
}

export function savePublicationLog(tenantKey: string, log: PublicationLogEntry): void {
  if (typeof window === 'undefined') return;

  const raw = window.localStorage.getItem(PUBLICATION_LOGS_STORAGE_KEY);
  const all: Record<string, PublicationLogEntry[]> = raw ? JSON.parse(raw) : {};
  const existing = all[tenantKey] ?? [];
  all[tenantKey] = [log, ...existing].slice(0, 50);
  window.localStorage.setItem(PUBLICATION_LOGS_STORAGE_KEY, JSON.stringify(all));
}

export function loadPublicationPipelineStatus(tenantKey: string): import('../../types/publication').PublicationPipelineStatus {
  if (typeof window === 'undefined') return 'draft';

  try {
    const raw = window.localStorage.getItem(PUBLICATION_STATUS_STORAGE_KEY);
    if (!raw) return 'draft';
    const map = JSON.parse(raw) as Record<string, import('../../types/publication').PublicationPipelineStatus>;
    return map[tenantKey] ?? 'draft';
  } catch {
    return 'draft';
  }
}

export function savePublicationPipelineStatus(
  tenantKey: string,
  status: import('../../types/publication').PublicationPipelineStatus,
): void {
  if (typeof window === 'undefined') return;

  const raw = window.localStorage.getItem(PUBLICATION_STATUS_STORAGE_KEY);
  const map: Record<string, import('../../types/publication').PublicationPipelineStatus> = raw ? JSON.parse(raw) : {};
  map[tenantKey] = status;
  window.localStorage.setItem(PUBLICATION_STATUS_STORAGE_KEY, JSON.stringify(map));
}

export function loadSourceHashes(tenantKey: string): Record<string, string> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PUBLICATION_SOURCE_HASHES_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, Record<string, string>>;
    return map[tenantKey] ?? null;
  } catch {
    return null;
  }
}

export function saveSourceHashes(tenantKey: string, hashes: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  const raw = window.localStorage.getItem(PUBLICATION_SOURCE_HASHES_KEY);
  const map: Record<string, Record<string, string>> = raw ? JSON.parse(raw) : {};
  map[tenantKey] = hashes;
  window.localStorage.setItem(PUBLICATION_SOURCE_HASHES_KEY, JSON.stringify(map));
}

export function getLastPublicationLog(tenantKey: string): PublicationLogEntry | null {
  const logs = loadPublicationLogs(tenantKey);
  return logs[0] ?? null;
}
