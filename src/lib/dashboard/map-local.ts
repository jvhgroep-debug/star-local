import type { DashboardViewModel } from '../../types/dashboard';
import type { PreparedWebsite } from '../../types/website-config';
import { WEBSITE_PACKAGE_LABELS } from '../builder/publish/status';
import { WEBSITE_STATUS_LABELS } from '../publish';
import { DASHBOARD_PAGES } from './constants';
import { mapOpeningHoursRows } from './format';
import type { DashboardSession } from './storage';

export function mapPreparedWebsiteToDashboard(
  prepared: PreparedWebsite,
  session: DashboardSession | null = null,
): DashboardViewModel {
  const { config } = prepared;
  const subdomain = config.slug.domain;
  const url = config.slug.url.replace(/\/$/, '');

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
    seoScore: '—',
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
  };
}
