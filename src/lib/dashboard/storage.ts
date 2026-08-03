export const DASHBOARD_SESSION_KEY = 'starlocal-dashboard-session-v1';

export interface DashboardSession {
  tenantId: string;
  websiteId: string;
  slug: string;
  subdomain: string;
  publishEmail?: string;
}

export function saveDashboardSession(session: DashboardSession): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DASHBOARD_SESSION_KEY, JSON.stringify(session));
}

export function loadDashboardSession(): DashboardSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(DASHBOARD_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DashboardSession;
    if (!parsed?.tenantId || !parsed?.websiteId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDashboardSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DASHBOARD_SESSION_KEY);
}

export const SAVE_RESULT_STORAGE_KEY = 'starlocal-save-result-v1';

export interface PersistedSavePayload {
  result: import('../../types/save').SaveWebsiteResult;
  magicLinkSent?: boolean;
}

export function persistSaveResult(payload: PersistedSavePayload): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SAVE_RESULT_STORAGE_KEY, JSON.stringify(payload));
}

export function loadPersistedSaveResult(): PersistedSavePayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SAVE_RESULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSavePayload;
  } catch {
    return null;
  }
}

export function clearPersistedSaveResult(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SAVE_RESULT_STORAGE_KEY);
}
