import type { DashboardViewModel } from '../../types/dashboard';
import type { PublicationPipelineStatus } from '../../types/publication';
import type { ApprovalStatus } from '../../types/approval';

export interface StoredWebsiteSummary {
  id: string;
  tenantId: string | null;
  websiteId: string | null;
  businessName: string;
  slug: string;
  subdomain: string;
  url: string;
  status: string;
  statusLabel: string;
  approvalStatus?: ApprovalStatus;
  pipelineStatus: PublicationPipelineStatus;
  lastUpdated: string | null;
  primaryColor: string;
  logoName: string | null;
  source: 'd1' | 'local';
}

export const WEBSITE_LIST_STORAGE_KEY = 'starlocal-website-list-v1';

export function loadWebsiteList(): StoredWebsiteSummary[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(WEBSITE_LIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredWebsiteSummary[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWebsiteList(list: StoredWebsiteSummary[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WEBSITE_LIST_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
}

export function upsertWebsiteFromModel(model: DashboardViewModel): StoredWebsiteSummary[] {
  const id = model.tenantId ?? `local:${model.slug}`;
  const entry: StoredWebsiteSummary = {
    id,
    tenantId: model.tenantId,
    websiteId: model.websiteId,
    businessName: model.businessName,
    slug: model.slug,
    subdomain: model.subdomain,
    url: model.url,
    status: model.status,
    statusLabel: model.statusLabel,
    pipelineStatus: model.publicationPipelineStatus,
    lastUpdated: model.lastUpdated,
    primaryColor: model.primaryColor,
    logoName: model.logoName,
    source: model.source,
  };

  const list = loadWebsiteList().filter((item) => item.id !== id);
  list.unshift(entry);
  saveWebsiteList(list);
  return list;
}

export function syncSavedToWebsiteList(
  result: import('../../types/save').SaveWebsiteResult,
  state: import('../../types/builder').BuilderState,
): void {
  if (typeof window === 'undefined') return;

  const entry: StoredWebsiteSummary = {
    id: result.tenantId,
    tenantId: result.tenantId,
    websiteId: result.websiteId,
    businessName: state.business.name,
    slug: result.slug,
    subdomain: `${result.slug}.starlocal.nl`,
    url: result.url,
    status: 'draft',
    statusLabel: 'Concept',
    approvalStatus: 'concept',
    pipelineStatus: 'draft',
    lastUpdated: result.savedAt,
    primaryColor: state.branding.primaryColor,
    logoName: state.branding.logoName || null,
    source: 'd1',
  };

  const list = loadWebsiteList().filter((item) => item.id !== entry.id);
  list.unshift(entry);
  saveWebsiteList(list);
}

export function filterConcepts(list: StoredWebsiteSummary[]): StoredWebsiteSummary[] {
  return list.filter(
    (item) =>
      item.status === 'draft' ||
      item.pipelineStatus === 'draft' ||
      item.pipelineStatus === 'failed',
  );
}

export function filterPublished(list: StoredWebsiteSummary[]): StoredWebsiteSummary[] {
  return list.filter(
    (item) => item.status === 'published' || item.pipelineStatus === 'published',
  );
}
