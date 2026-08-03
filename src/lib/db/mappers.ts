import type {
  ContactRecord,
  ContactRow,
  OpeningHoursRecord,
  OpeningHoursRow,
  ServiceRecord,
  ServiceRow,
  TenantRecord,
  TenantRow,
  WebsiteRecord,
  WebsiteRow,
  WebsiteTheme,
  Weekday,
} from '../../types/database';
import type { WebsitePackage } from '../../types/website-config';
import type { WebsiteStatus } from '../../types/tenant';

function asBoolean(value: number): boolean {
  return value === 1;
}

function asWeekday(value: number): Weekday {
  if (value < 0 || value > 6) {
    throw new RangeError(`Invalid weekday: ${value}`);
  }
  return value as Weekday;
}

function asTheme(value: string): WebsiteTheme {
  if (value === 'classic' || value === 'fresh' || value === 'professional') {
    return value;
  }
  return 'default';
}

function asWebsiteStatus(value: string): WebsiteStatus {
  if (value === 'published' || value === 'archived') return value;
  return 'draft';
}

function asWebsitePackage(value: string): WebsitePackage {
  return value === 'premium' ? 'premium' : 'free';
}

export function mapTenantRow(row: TenantRow): TenantRecord {
  return {
    id: row.id,
    slug: row.slug,
    bedrijfsnaam: row.name,
    branche: row.branche,
    description: row.description ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function asPublicationStatus(value: string | undefined | null): import('../../types/publication').PublicationPipelineStatus {
  const normalized = value?.toLowerCase();
  if (normalized === 'building' || normalized === 'published' || normalized === 'failed') {
    return normalized;
  }
  return 'draft';
}

export function mapWebsiteRow(row: WebsiteRow): WebsiteRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    theme: asTheme(row.theme),
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    fontFamily: row.font_family ?? 'system',
    status: asWebsiteStatus(row.status ?? 'draft'),
    package: asWebsitePackage(row.package ?? 'free'),
    logoKey: row.logo_key ?? null,
    published: asBoolean(row.published),
    publicationStatus: asPublicationStatus(row.publication_status),
    lastPublishedAt: row.last_published_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWebsitePageRow(row: WebsitePageRow): import('../../types/database').WebsitePageRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    websiteId: row.website_id,
    pageKey: row.page_key,
    title: row.title,
    slug: row.slug,
    contentJson: row.content_json,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    canonicalPath: row.canonical_path,
    status: asWebsiteStatus(row.status ?? 'draft'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMediaItemRow(row: import('../../types/database').MediaItemRow): import('../../types/database').MediaItemRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    mediaType: row.media_type === 'logo' ? 'logo' : 'photo',
    storageKey: row.storage_key,
    filename: row.filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapContactRow(row: ContactRow): ContactRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    telefoon: row.telefoon,
    whatsapp: row.whatsapp,
    email: row.email,
    website: row.website ?? '',
    kvk: row.kvk ?? '',
    adres: row.adres,
    postcode: row.postcode,
    plaats: row.plaats,
    gemeenteSlug: row.gemeente_slug ?? '',
    gemeenteNaam: row.gemeente_naam ?? '',
    provincie: row.provincie ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapServiceRow(row: ServiceRow): ServiceRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    titel: row.titel,
    omschrijving: row.omschrijving,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOpeningHoursRow(row: OpeningHoursRow): OpeningHoursRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    weekday: asWeekday(row.weekday),
    openTime: row.open_time,
    closeTime: row.close_time,
    closed: asBoolean(row.closed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function booleanToInt(value: boolean): number {
  return value ? 1 : 0;
}
