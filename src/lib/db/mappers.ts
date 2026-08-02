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

export function mapWebsiteRow(row: WebsiteRow): WebsiteRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    theme: asTheme(row.theme),
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    status: asWebsiteStatus(row.status ?? 'draft'),
    package: asWebsitePackage(row.package ?? 'free'),
    logoKey: row.logo_key ?? null,
    published: asBoolean(row.published),
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
    adres: row.adres,
    postcode: row.postcode,
    plaats: row.plaats,
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
