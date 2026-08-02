import type { PreparedWebsite } from '../../../types/website-config';

export const PREPARED_WEBSITE_STORAGE_KEY = 'starlocal-prepared-website-v1';

export function savePreparedWebsite(prepared: PreparedWebsite): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PREPARED_WEBSITE_STORAGE_KEY, JSON.stringify(prepared));
}

export function loadPreparedWebsite(): PreparedWebsite | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PREPARED_WEBSITE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PreparedWebsite;
    if (!parsed?.config || !parsed?.pages) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPreparedWebsite(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREPARED_WEBSITE_STORAGE_KEY);
}
