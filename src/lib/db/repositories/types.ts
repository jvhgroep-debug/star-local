import type {
  ContactRecord,
  CreateContactInput,
  CreateMediaItemInput,
  CreateOpeningHoursInput,
  CreateServiceInput,
  CreateTenantInput,
  CreateWebsiteInput,
  CreateWebsitePageInput,
  MediaItemRecord,
  OpeningHoursRecord,
  ServiceRecord,
  TenantRecord,
  UpdateContactInput,
  UpdateOpeningHoursInput,
  UpdateServiceInput,
  UpdateTenantInput,
  UpdateWebsiteInput,
  WebsitePageRecord,
  WebsiteRecord,
  Weekday,
} from '../../types/database';

export interface TenantRepository {
  findById(id: string): Promise<TenantRecord | null>;
  findBySlug(slug: string): Promise<TenantRecord | null>;
  findBySlugIgnoreCase(slug: string): Promise<TenantRecord | null>;
  list(limit?: number, offset?: number): Promise<TenantRecord[]>;
  create(input: CreateTenantInput): Promise<TenantRecord>;
  update(id: string, input: UpdateTenantInput): Promise<TenantRecord | null>;
  delete(id: string): Promise<boolean>;
}

export interface WebsiteRepository {
  findById(id: string): Promise<WebsiteRecord | null>;
  findByTenantId(tenantId: string): Promise<WebsiteRecord | null>;
  listByTenantId(tenantId: string): Promise<WebsiteRecord[]>;
  create(input: CreateWebsiteInput): Promise<WebsiteRecord>;
  update(id: string, input: UpdateWebsiteInput): Promise<WebsiteRecord | null>;
  delete(id: string): Promise<boolean>;
}

export interface ContactRepository {
  findById(id: string): Promise<ContactRecord | null>;
  findByTenantId(tenantId: string): Promise<ContactRecord | null>;
  create(input: CreateContactInput): Promise<ContactRecord>;
  update(id: string, input: UpdateContactInput): Promise<ContactRecord | null>;
  delete(id: string): Promise<boolean>;
}

export interface ServiceRepository {
  findById(id: string): Promise<ServiceRecord | null>;
  listByTenantId(tenantId: string): Promise<ServiceRecord[]>;
  create(input: CreateServiceInput): Promise<ServiceRecord>;
  update(id: string, input: UpdateServiceInput): Promise<ServiceRecord | null>;
  delete(id: string): Promise<boolean>;
  deleteByTenantId(tenantId: string): Promise<number>;
}

export interface OpeningHoursRepository {
  findById(id: string): Promise<OpeningHoursRecord | null>;
  findByTenantAndWeekday(tenantId: string, weekday: Weekday): Promise<OpeningHoursRecord | null>;
  listByTenantId(tenantId: string): Promise<OpeningHoursRecord[]>;
  create(input: CreateOpeningHoursInput): Promise<OpeningHoursRecord>;
  update(id: string, input: UpdateOpeningHoursInput): Promise<OpeningHoursRecord | null>;
  delete(id: string): Promise<boolean>;
  deleteByTenantId(tenantId: string): Promise<number>;
}

export interface WebsitePageRepository {
  listByTenantId(tenantId: string): Promise<WebsitePageRecord[]>;
  create(input: CreateWebsitePageInput): Promise<WebsitePageRecord>;
  deleteByTenantId(tenantId: string): Promise<number>;
}

export interface MediaItemRepository {
  listByTenantId(tenantId: string): Promise<MediaItemRecord[]>;
  create(input: CreateMediaItemInput): Promise<MediaItemRecord>;
  deleteByTenantId(tenantId: string): Promise<number>;
}

export interface DatabaseRepositories {
  tenants: TenantRepository;
  websites: WebsiteRepository;
  contacts: ContactRepository;
  services: ServiceRepository;
  openingHours: OpeningHoursRepository;
  websitePages: WebsitePageRepository;
  mediaItems: MediaItemRepository;
}
