import type { ContactRecord, OpeningHoursRecord, ServiceRecord, TenantRecord, WebsitePageRecord, WebsiteRecord } from './database';
import type { ChangeRequestRecord } from './change-request';
import type { PublicationLogEntry, PublicationPipelineStatus } from './publication';

export type DashboardSection =
  | 'overview'
  | 'websites'
  | 'concepts'
  | 'in_review'
  | 'published'
  | 'stats'
  | 'website'
  | 'pages'
  | 'services'
  | 'contact'
  | 'hours'
  | 'seo'
  | 'images'
  | 'publish'
  | 'settings'
  | 'change_requests'
  | 'change_request_new';

export interface DashboardWebsiteCardItem {
  id: string;
  tenantId: string | null;
  websiteId: string | null;
  businessName: string;
  slug: string;
  subdomain: string;
  url: string;
  status: string;
  statusLabel: string;
  pipelineStatus: PublicationPipelineStatus;
  pipelineLabel: string;
  lastUpdated: string | null;
  primaryColor: string;
  logoName: string | null;
  source: 'd1' | 'local';
  approvalStatus?: string;
  pendingChangesStatus?: 'none' | 'in_review';
  liveUrl?: string | null;
  previewPath?: string;
  editPath?: string;
}

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
  publicationPipelineStatus: PublicationPipelineStatus;
  publicationPipelineLabel: string;
  publicationLogs: PublicationLogEntry[];
  lastPublicationLog: PublicationLogEntry | null;
  canPublish: boolean;
  websiteList: DashboardWebsiteCardItem[];
  customerBusinessName?: string;
  customerEmail?: string;
  changeRequests?: Array<ChangeRequestRecord & { typeLabel: string; statusLabel: string }>;
}

export interface DashboardDbBundle {
  tenant: TenantRecord;
  website: WebsiteRecord;
  contact: ContactRecord | null;
  services: ServiceRecord[];
  hours: OpeningHoursRecord[];
  pages: WebsitePageRecord[];
}
