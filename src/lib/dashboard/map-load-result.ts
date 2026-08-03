import type { DashboardViewModel } from '../../types/dashboard';
import type { LoadWebsiteResult } from '../../types/save';
import { WEBSITE_PACKAGE_LABELS } from '../builder/publish/status';
import { WEBSITE_STATUS_LABELS } from '../publish';
import { DASHBOARD_PAGES } from './constants';
import { enrichDashboardModel } from './website-list';

function formatHoursValue(day: LoadWebsiteResult['hours'][number]): string {
  if (day.closed) return 'Gesloten';
  if (day.open24) return '24 uur open';
  return `${day.openTime} – ${day.closeTime}`;
}

export function mapLoadResultToDashboard(result: LoadWebsiteResult): DashboardViewModel {
  const subdomain = `${result.slug}.starlocal.nl`;
  const url = `https://${subdomain}`;

  const model: DashboardViewModel = {
    source: 'd1',
    tenantId: result.tenantId,
    websiteId: result.websiteId,
    businessName: result.business.name,
    industry: result.business.industry,
    description: result.business.description,
    slug: result.slug,
    subdomain,
    url,
    status: result.status,
    statusLabel: WEBSITE_STATUS_LABELS[result.status as keyof typeof WEBSITE_STATUS_LABELS] ?? result.status,
    package: result.package,
    packageLabel: WEBSITE_PACKAGE_LABELS[result.package] ?? result.package,
    lastUpdated: null,
    pageCount: result.pages.length || DASHBOARD_PAGES.length,
    seoScore: '—',
    seoTitle: result.heroTitle ?? result.pages.find((page) => page.pageKey === 'home')?.seoTitle ?? '',
    metaDescription: result.seoMetaDescription ?? '',
    canonicalUrl: `${url}/`,
    ogTitle: result.heroTitle ?? '',
    ogDescription: result.seoMetaDescription ?? '',
    contact: {
      phone: result.contact.phone,
      whatsapp: result.contact.whatsapp,
      email: result.contact.email,
      street: result.contact.street,
      postcode: result.contact.postcode,
      city: result.contact.city,
    },
    services: result.business.services.map((service) => ({
      title: service.title,
      description: service.description,
    })),
    hours: result.hours.map((day) => ({
      dayKey: day.dayKey,
      label: day.day,
      value: formatHoursValue(day),
    })),
    pages:
      result.pages.length > 0
        ? result.pages.map((page) => ({
            id: page.pageKey,
            label: page.title,
            path: page.canonicalPath,
          }))
        : DASHBOARD_PAGES.map((page) => ({
            id: page.id,
            label: page.label,
            path: page.path,
          })),
    logoKey: result.branding.logoKey,
    logoName: result.media.find((item) => item.mediaType === 'logo')?.filename ?? null,
    primaryColor: result.branding.primaryColor,
    accentColor: result.branding.accentColor,
    publishEmail: result.contact.email,
    publicationPipelineStatus: result.status === 'published' ? 'published' : 'draft',
    publicationPipelineLabel: result.status === 'published' ? 'Gepubliceerd' : 'Concept',
    publicationLogs: [],
    lastPublicationLog: null,
    canPublish: true,
    websiteList: [],
  };

  return enrichDashboardModel(model);
}
