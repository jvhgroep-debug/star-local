import type { DashboardViewModel, DashboardWebsiteCardItem } from '../../types/dashboard';
import { formatLastUpdated } from './get-dashboard-data';

export type MyWebsiteStatusGroup = 'Concept' | 'In review' | 'Gepubliceerd';

export interface MyWebsiteStats {
  pageCount: string;
  photoCount: string;
  lastUpdated: string;
  statusLabel: string;
  statusGroup: MyWebsiteStatusGroup;
  seoScore: string;
  visitors: string;
}

export interface MyWebsiteContext {
  site: DashboardWebsiteCardItem;
  stats: MyWebsiteStats;
  viewUrl: string;
  editUrl: string;
  dataEditUrl: string;
}

const STATUS_GROUP: Record<string, MyWebsiteStatusGroup> = {
  concept: 'Concept',
  rejected: 'Concept',
  draft: 'Concept',
  pending_review: 'In review',
  approved: 'In review',
  preparing: 'In review',
  package_ready: 'In review',
  published: 'Gepubliceerd',
};

export function resolveStatusGroup(site: DashboardWebsiteCardItem): MyWebsiteStatusGroup {
  if (site.pendingChangesStatus === 'in_review') return 'In review';
  return STATUS_GROUP[site.status] ?? 'Concept';
}

export function resolvePrimaryWebsite(model: DashboardViewModel): DashboardWebsiteCardItem | null {
  if (model.websiteList.length > 0) return model.websiteList[0];

  if (model.tenantId && model.businessName.trim()) {
    return {
      id: model.websiteId ?? model.tenantId,
      tenantId: model.tenantId,
      websiteId: model.websiteId,
      businessName: model.businessName,
      slug: model.slug,
      subdomain: model.subdomain,
      url: model.url,
      status: model.status,
      statusLabel: model.statusLabel,
      pipelineStatus: model.publicationPipelineStatus,
      pipelineLabel: model.publicationPipelineLabel,
      lastUpdated: model.lastUpdated,
      primaryColor: model.primaryColor,
      logoName: model.logoName,
      source: model.source,
      previewPath: model.url ? model.url : undefined,
      editPath: model.tenantId
        ? `/dashboard/website/?tenantId=${encodeURIComponent(model.tenantId)}&websiteId=${encodeURIComponent(model.websiteId ?? '')}`
        : undefined,
    };
  }

  return null;
}

export function resolveMyWebsiteStats(
  site: DashboardWebsiteCardItem,
  model: DashboardViewModel,
): MyWebsiteStats {
  const isActive = Boolean(site.tenantId && site.tenantId === model.tenantId);
  const statusGroup = resolveStatusGroup(site);
  const photoCount = isActive
    ? model.logoName
      ? '1+'
      : '0'
    : site.logoName
      ? '1+'
      : '—';

  return {
    pageCount: isActive && model.pageCount > 0 ? String(model.pageCount) : isActive ? String(model.pages.length || 5) : '5',
    photoCount,
    lastUpdated: site.lastUpdated
      ? formatLastUpdated({ lastUpdated: site.lastUpdated } as DashboardViewModel)
      : '—',
    statusLabel: site.statusLabel || site.pipelineLabel,
    statusGroup,
    seoScore: isActive && model.seoScore !== '—' ? model.seoScore : '—',
    visitors: '—',
  };
}

export function resolveMyWebsiteContext(model: DashboardViewModel): MyWebsiteContext | null {
  const site = resolvePrimaryWebsite(model);
  if (!site) return null;

  const stats = resolveMyWebsiteStats(site, model);
  const editUrl =
    site.editPath ||
    (site.tenantId
      ? `/dashboard/website/?tenantId=${encodeURIComponent(site.tenantId)}&websiteId=${encodeURIComponent(site.websiteId ?? site.id)}`
      : '/gratis-website/start/');

  return {
    site,
    stats,
    viewUrl: resolveViewUrl(site),
    editUrl,
    dataEditUrl: editUrl,
  };
}

export function previewLinkAttrs(site: DashboardWebsiteCardItem): string {
  return site.status === 'published' ? ' target="_blank" rel="noopener noreferrer"' : '';
}

export function resolveViewUrl(site: DashboardWebsiteCardItem): string {
  if (site.status === 'published') {
    return site.liveUrl || site.previewPath || `/sites/${site.slug}/`;
  }
  return site.previewPath || `/admin/preview/?id=${encodeURIComponent(site.websiteId ?? site.id)}`;
}
