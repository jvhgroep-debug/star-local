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
  fontFamily: string;
  status: WebsiteStatus;
  package: WebsitePackage;
  logoKey: string | null;
  published: boolean;
  publicationStatus: import('./publication').PublicationPipelineStatus;
  lastPublishedAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WebsitePageRecord {
  id: string;
  tenantId: string;
  websiteId: string;
  pageKey: string;
  title: string;
  slug: string;
  contentJson: string;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  status: WebsiteStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface MediaItemRecord {
  id: string;
  tenantId: string;
  mediaType: 'logo' | 'photo';
  storageKey: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  sortOrder: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ContactRecord {
  id: string;
  tenantId: string;
  telefoon: string;
  whatsapp: string;
  email: string;
  website: string;
  kvk: string;
  adres: string;
  postcode: string;
  plaats: string;
  gemeenteSlug: string;
  gemeenteNaam: string;
  provincie: string;
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
  font_family?: string;
  status: string;
  package: string;
  logo_key: string | null;
  published: number;
  publication_status?: string;
  last_published_at?: string | null;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface WebsitePageRow {
  id: string;
  tenant_id: string;
  website_id: string;
  page_key: string;
  title: string;
  slug: string;
  content_json: string;
  seo_title: string;
  meta_description: string;
  canonical_path: string;
  status: string;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface MediaItemRow {
  id: string;
  tenant_id: string;
  media_type: string;
  storage_key: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  sort_order: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

export interface ContactRow {
  id: string;
  tenant_id: string;
  telefoon: string;
  whatsapp: string;
  email: string;
  website?: string;
  kvk?: string;
  adres: string;
  postcode: string;
  plaats: string;
  gemeente_slug?: string;
  gemeente_naam?: string;
  provincie?: string;
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
  fontFamily?: string;
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
  fontFamily?: string;
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
  website?: string;
  kvk?: string;
  adres?: string;
  postcode?: string;
  plaats?: string;
  gemeenteSlug?: string;
  gemeenteNaam?: string;
  provincie?: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CreateWebsitePageInput {
  id: string;
  tenantId: string;
  websiteId: string;
  pageKey: string;
  title: string;
  slug: string;
  contentJson: string;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  status?: WebsiteStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CreateMediaItemInput {
  id: string;
  tenantId: string;
  mediaType: 'logo' | 'photo';
  storageKey: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  sortOrder?: number;
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
