import type { DashboardViewModel } from '../../types/dashboard';
import type { PreparedWebsite } from '../../types/website-config';
import { WEBSITE_PACKAGE_LABELS } from '../builder/publish/status';
import { WEBSITE_STATUS_LABELS } from '../publish';
import { computeTenantKey } from '../publish/local-publish.service';
import {
  getLastPublicationLog,
  loadPublicationLogs,
  loadPublicationPipelineStatus,
} from '../publish/publication-log.storage';
import { loadPreparedWebsite } from '../builder/publish/storage';
import { DASHBOARD_PAGES } from './constants';
import { mapOpeningHoursRows } from './format';
import type { DashboardSession } from './storage';
import { pipelineStatusLabel } from './publish-client';

function resolvePublicationFields(slug: string, tenantId: string | null) {
  const tenantKey = computeTenantKey(slug, tenantId);
  const status = loadPublicationPipelineStatus(tenantKey);
  const logs = loadPublicationLogs(tenantKey);
  const lastLog = getLastPublicationLog(tenantKey);
  const canPublish = Boolean(loadPreparedWebsite());

  return {
    publicationPipelineStatus: status,
    publicationPipelineLabel: pipelineStatusLabel(status),
    publicationLogs: logs,
    lastPublicationLog: lastLog,
    canPublish,
    seoScoreFromLog: lastLog?.seoScore != null ? String(lastLog.seoScore) : null,
  };
}

export function mapPreparedWebsiteToDashboard(
  prepared: PreparedWebsite,
  session: DashboardSession | null = null,
): DashboardViewModel {
  const { config } = prepared;
  const subdomain = config.slug.domain;
  const url = config.slug.url.replace(/\/$/, '');
  const pub = resolvePublicationFields(config.slug.slug, session?.tenantId ?? null);

  return {
    source: 'local',
    tenantId: session?.tenantId ?? null,
    websiteId: session?.websiteId ?? null,
    businessName: config.business.name,
    industry: config.business.industry,
    description: config.business.description,
    slug: config.slug.slug,
    subdomain,
    url,
    status: 'draft',
    statusLabel: WEBSITE_STATUS_LABELS.draft,
    package: config.package,
    packageLabel: WEBSITE_PACKAGE_LABELS[config.package],
    lastUpdated: prepared.preparedAt,
    pageCount: DASHBOARD_PAGES.length,
    seoTitle: config.seo.title,
    metaDescription: config.seo.description,
    canonicalUrl: config.seo.canonicalUrl,
    ogTitle: config.seo.ogTitle,
    ogDescription: config.seo.description,
    contact: {
      phone: config.contact.phone,
      whatsapp: config.contact.whatsapp,
      email: config.contact.email,
      street: config.contact.street,
      postcode: config.contact.postcode,
      city: config.contact.city,
    },
    services: config.services.map((service) => ({
      title: service.title,
      description: service.description,
    })),
    hours: config.hours.map((day) => ({
      dayKey: day.dayKey,
      label: day.day,
      value: day.closed
        ? 'Gesloten'
        : day.open24
          ? '24 uur open'
          : `${day.openTime} – ${day.closeTime}`,
    })),
    pages: DASHBOARD_PAGES.map((page) => ({
      id: page.id,
      label: page.label,
      path: page.path,
    })),
    logoKey: config.media.logoName ? `pending:${config.media.logoName}` : null,
    logoName: config.media.logoName || null,
    primaryColor: config.branding.primaryColor,
    accentColor: config.branding.accentColor,
    publishEmail: session?.publishEmail ?? config.publishEmail,
    publicationPipelineStatus: pub.publicationPipelineStatus,
    publicationPipelineLabel: pub.publicationPipelineLabel,
    publicationLogs: pub.publicationLogs,
    lastPublicationLog: pub.lastPublicationLog,
    canPublish: pub.canPublish,
    seoScore: pub.seoScoreFromLog ?? '—',
    websiteList: [],
  };
}
