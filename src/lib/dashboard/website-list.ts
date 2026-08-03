import type { DashboardViewModel, DashboardWebsiteCardItem } from '../../types/dashboard';
import type { StoredWebsiteSummary } from './website-list.storage';
import { upsertWebsiteFromModel } from './website-list.storage';
import { pipelineStatusLabel } from './publish-client';

export function mapStoredToCard(item: StoredWebsiteSummary): DashboardWebsiteCardItem {
  return {
    id: item.id,
    tenantId: item.tenantId,
    websiteId: item.websiteId,
    businessName: item.businessName,
    slug: item.slug,
    subdomain: item.subdomain,
    url: item.url,
    status: item.status,
    statusLabel: item.statusLabel,
    pipelineStatus: item.pipelineStatus,
    pipelineLabel: pipelineStatusLabel(item.pipelineStatus),
    lastUpdated: item.lastUpdated,
    primaryColor: item.primaryColor,
    logoName: item.logoName,
    source: item.source,
  };
}

export function modelToWebsiteCard(model: DashboardViewModel): DashboardWebsiteCardItem {
  return {
    id: model.tenantId ?? `local:${model.slug}`,
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
  };
}

export function buildWebsiteListForModel(
  model: DashboardViewModel,
  stored: StoredWebsiteSummary[],
): DashboardWebsiteCardItem[] {
  const current = modelToWebsiteCard(model);
  const merged = [current, ...stored.filter((item) => item.id !== current.id).map(mapStoredToCard)];
  return merged;
}

export function enrichDashboardModel(model: DashboardViewModel): DashboardViewModel {
  const stored = upsertWebsiteFromModel(model);
  return {
    ...model,
    websiteList: buildWebsiteListForModel(model, stored),
  };
}
