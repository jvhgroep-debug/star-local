import type { DashboardDbBundle, DashboardViewModel } from '../../types/dashboard';
import type { DatabaseRepositories } from '../db/repositories/types';
import { WEBSITE_PACKAGE_LABELS } from '../builder/publish/status';
import { WEBSITE_STATUS_LABELS } from '../publish';
import { DASHBOARD_PAGES } from './constants';
import { formatDashboardDate, mapOpeningHoursRows } from './format';

export async function getDashboardDbBundle(
  repos: DatabaseRepositories,
  tenantId: string,
): Promise<DashboardDbBundle | null> {
  const tenant = await repos.tenants.findById(tenantId);
  if (!tenant) return null;

  const [website, contact, services, hours] = await Promise.all([
    repos.websites.findByTenantId(tenantId),
    repos.contacts.findByTenantId(tenantId),
    repos.services.listByTenantId(tenantId),
    repos.openingHours.listByTenantId(tenantId),
  ]);

  if (!website) return null;

  return {
    tenant,
    website,
    contact,
    services,
    hours,
  };
}

export function mapDashboardDbBundle(
  bundle: DashboardDbBundle,
  publishEmail: string | null = null,
): DashboardViewModel {
  const { tenant, website, contact, services, hours } = bundle;
  const subdomain = `${tenant.slug}.starlocal.nl`;
  const url = `https://${subdomain}`;

  return {
    source: 'd1',
    tenantId: tenant.id,
    websiteId: website.id,
    businessName: tenant.bedrijfsnaam,
    industry: tenant.branche,
    description: tenant.description,
    slug: tenant.slug,
    subdomain,
    url,
    status: website.status,
    statusLabel: WEBSITE_STATUS_LABELS[website.status] ?? website.status,
    package: website.package,
    packageLabel: WEBSITE_PACKAGE_LABELS[website.package] ?? website.package,
    lastUpdated: website.updatedAt,
    pageCount: DASHBOARD_PAGES.length,
    seoScore: '—',
    seoTitle: website.seoTitle,
    metaDescription: website.metaDescription,
    canonicalUrl: `${url}/`,
    ogTitle: website.seoTitle,
    ogDescription: website.metaDescription,
    contact: {
      phone: contact?.telefoon ?? '',
      whatsapp: contact?.whatsapp ?? '',
      email: contact?.email ?? '',
      street: contact?.adres ?? '',
      postcode: contact?.postcode ?? '',
      city: contact?.plaats ?? '',
    },
    services: services.map((service) => ({
      title: service.titel,
      description: service.omschrijving,
    })),
    hours: mapOpeningHoursRows(hours),
    pages: DASHBOARD_PAGES.map((page) => ({
      id: page.id,
      label: page.label,
      path: page.path,
    })),
    logoKey: website.logoKey,
    logoName: website.logoKey?.startsWith('pending:')
      ? website.logoKey.replace(/^pending:/, '')
      : website.logoKey,
    primaryColor: website.primaryColor,
    accentColor: website.secondaryColor,
    publishEmail,
  };
}

export function formatLastUpdated(model: DashboardViewModel): string {
  return formatDashboardDate(model.lastUpdated);
}
