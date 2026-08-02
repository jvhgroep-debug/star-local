import type { IsoDateTime, TenantStatus, WebsiteStatus } from './tenant';
import type { WebsitePackage } from './website-config';

/** 0 = Monday … 6 = Sunday (matches builder DayKey order). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WebsiteTheme = 'default' | 'classic' | 'fresh' | 'professional';

// ---------------------------------------------------------------------------
// Application-layer models (camelCase)
// ---------------------------------------------------------------------------

export interface TenantRecord {
  id: string;
  slug: string;
  /** bedrijfsnaam — stored as `name` in D1 */
  bedrijfsnaam: string;
  branche: string;
  description: string;
  status: TenantStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WebsiteRecord {
  id: string;
  tenantId: string;
  seoTitle: string;
  metaDescription: string;
  theme: WebsiteTheme;
  primaryColor: string;
  secondaryColor: string;
  status: WebsiteStatus;
  package: WebsitePackage;
  logoKey: string | null;
  published: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ContactRecord {
  id: string;
  tenantId: string;
  telefoon: string;
  whatsapp: string;
  email: string;
  adres: string;
  postcode: string;
  plaats: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ServiceRecord {
  id: string;
  tenantId: string;
  titel: string;
  omschrijving: string;
  sortOrder: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface OpeningHoursRecord {
  id: string;
  tenantId: string;
  weekday: Weekday;
  openTime: string | null;
  closeTime: string | null;
  closed: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

// ---------------------------------------------------------------------------
// D1 row shapes (snake_case columns)
// ---------------------------------------------------------------------------

export interface TenantRow {
  id: string;
  slug: string;
  name: string;
  branche: string;
  description: string;
  status: TenantStatus;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface WebsiteRow {
  id: string;
  tenant_id: string;
  seo_title: string;
  meta_description: string;
  theme: string;
  primary_color: string;
  secondary_color: string;
  status: string;
  package: string;
  logo_key: string | null;
  published: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface ContactRow {
  id: string;
  tenant_id: string;
  telefoon: string;
  whatsapp: string;
  email: string;
  adres: string;
  postcode: string;
  plaats: string;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface ServiceRow {
  id: string;
  tenant_id: string;
  titel: string;
  omschrijving: string;
  sort_order: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface OpeningHoursRow {
  id: string;
  tenant_id: string;
  weekday: number;
  open_time: string | null;
  close_time: string | null;
  closed: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

// ---------------------------------------------------------------------------
// Create / update inputs (repository layer)
// ---------------------------------------------------------------------------

export interface CreateTenantInput {
  id: string;
  slug: string;
  bedrijfsnaam: string;
  branche: string;
  description?: string;
  status?: TenantStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface UpdateTenantInput {
  slug?: string;
  bedrijfsnaam?: string;
  branche?: string;
  description?: string;
  status?: TenantStatus;
  updatedAt: IsoDateTime;
}

export interface CreateWebsiteInput {
  id: string;
  tenantId: string;
  seoTitle?: string;
  metaDescription?: string;
  theme?: WebsiteTheme;
  primaryColor?: string;
  secondaryColor?: string;
  status?: WebsiteStatus;
  package?: WebsitePackage;
  logoKey?: string | null;
  published?: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface UpdateWebsiteInput {
  seoTitle?: string;
  metaDescription?: string;
  theme?: WebsiteTheme;
  primaryColor?: string;
  secondaryColor?: string;
  status?: WebsiteStatus;
  package?: WebsitePackage;
  logoKey?: string | null;
  published?: boolean;
  updatedAt: IsoDateTime;
}

export interface CreateContactInput {
  id: string;
  tenantId: string;
  telefoon?: string;
  whatsapp?: string;
  email?: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface UpdateContactInput {
  telefoon?: string;
  whatsapp?: string;
  email?: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  updatedAt: IsoDateTime;
}

export interface CreateServiceInput {
  id: string;
  tenantId: string;
  titel: string;
  omschrijving?: string;
  sortOrder?: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface UpdateServiceInput {
  titel?: string;
  omschrijving?: string;
  sortOrder?: number;
  updatedAt: IsoDateTime;
}

export interface CreateOpeningHoursInput {
  id: string;
  tenantId: string;
  weekday: Weekday;
  openTime?: string | null;
  closeTime?: string | null;
  closed?: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface UpdateOpeningHoursInput {
  openTime?: string | null;
  closeTime?: string | null;
  closed?: boolean;
  updatedAt: IsoDateTime;
}
