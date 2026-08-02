/** ISO-8601 date-time string (UTC), e.g. 2026-08-02T12:00:00.000Z */
export type IsoDateTime = string;

export type TenantStatus = 'draft' | 'active' | 'suspended' | 'archived';

export type TenantUserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type WebsiteStatus = 'draft' | 'published' | 'archived';

export type DomainType = 'subdomain' | 'custom';

export type DomainStatus = 'pending' | 'active' | 'failed' | 'disabled';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';

export type WebsitePageType = 'home' | 'about' | 'services' | 'contact' | 'privacy';

export type MediaType = 'logo' | 'photo';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantUserRole;
  createdAt: IsoDateTime;
}

export interface Business {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface Website {
  id: string;
  tenantId: string;
  businessId: string;
  slug: string;
  status: WebsiteStatus;
  publishedAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface Domain {
  id: string;
  tenantId: string;
  websiteId: string;
  hostname: string;
  type: DomainType;
  status: DomainStatus;
  isPrimary: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WebsiteSettings {
  id: string;
  tenantId: string;
  websiteId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoMediaId: string | null;
  seoTitle: string;
  seoDescription: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface MediaItem {
  id: string;
  tenantId: string;
  websiteId: string;
  type: MediaType;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  sortOrder: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WebsitePage {
  id: string;
  tenantId: string;
  websiteId: string;
  pageType: WebsitePageType;
  slug: string;
  title: string;
  metaDescription: string;
  contentJson: string;
  published: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface Service {
  id: string;
  tenantId: string;
  websiteId: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface OpeningHour {
  id: string;
  tenantId: string;
  websiteId: string;
  dayOfWeek: number;
  opens: string;
  closes: string;
  closed: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ContactSubmission {
  id: string;
  tenantId: string;
  websiteId: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: IsoDateTime;
}

export interface Subscription {
  id: string;
  tenantId: string;
  plan: string;
  status: SubscriptionStatus;
  startedAt: IsoDateTime;
  canceledAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface AuditLog {
  id: string;
  tenantId: string | null;
  userId: string | null;
  action: string;
  metaJson: string;
  createdAt: IsoDateTime;
}

export interface FeatureFlag {
  id: string;
  tenantId: string | null;
  key: string;
  enabled: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}
