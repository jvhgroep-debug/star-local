import type { ContactRecord, OpeningHoursRecord, ServiceRecord, TenantRecord, WebsiteRecord } from './database';

export type DashboardSection =
  | 'overview'
  | 'website'
  | 'pages'
  | 'services'
  | 'contact'
  | 'hours'
  | 'seo'
  | 'images'
  | 'publish'
  | 'settings';

export interface DashboardPageItem {
  id: string;
  label: string;
  path: string;
}

export interface DashboardServiceItem {
  title: string;
  description: string;
}

export interface DashboardHoursItem {
  dayKey: string;
  label: string;
  value: string;
}

export interface DashboardContactView {
  phone: string;
  whatsapp: string;
  email: string;
  street: string;
  postcode: string;
  city: string;
}

/** Aggregated dashboard view — D1 or local fallback. */
export interface DashboardViewModel {
  source: 'd1' | 'local';
  tenantId: string | null;
  websiteId: string | null;
  businessName: string;
  industry: string;
  description: string;
  slug: string;
  subdomain: string;
  url: string;
  status: string;
  statusLabel: string;
  package: string;
  packageLabel: string;
  lastUpdated: string | null;
  pageCount: number;
  seoScore: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  contact: DashboardContactView;
  services: DashboardServiceItem[];
  hours: DashboardHoursItem[];
  pages: DashboardPageItem[];
  logoKey: string | null;
  logoName: string | null;
  primaryColor: string;
  accentColor: string;
  publishEmail: string | null;
}

export interface DashboardDbBundle {
  tenant: TenantRecord;
  website: WebsiteRecord;
  contact: ContactRecord | null;
  services: ServiceRecord[];
  hours: OpeningHoursRecord[];
}
