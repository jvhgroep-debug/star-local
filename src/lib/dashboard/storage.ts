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
