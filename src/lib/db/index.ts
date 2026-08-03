import type { D1Database } from './d1';
import { D1ContactRepository } from './repositories/contact.repository';
import { D1MediaItemRepository } from './repositories/media.repository';
import { D1OpeningHoursRepository } from './repositories/opening-hours.repository';
import { D1ServiceRepository } from './repositories/service.repository';
import { D1TenantRepository } from './repositories/tenant.repository';
import type { DatabaseRepositories } from './repositories/types';
import { D1WebsitePageRepository } from './repositories/website-page.repository';
import { D1WebsiteRepository } from './repositories/website.repository';

export function createRepositories(db: D1Database): DatabaseRepositories {
  return {
    tenants: new D1TenantRepository(db),
    websites: new D1WebsiteRepository(db),
    contacts: new D1ContactRepository(db),
    services: new D1ServiceRepository(db),
    openingHours: new D1OpeningHoursRepository(db),
    websitePages: new D1WebsitePageRepository(db),
    mediaItems: new D1MediaItemRepository(db),
  };
}

export type { D1Database, D1PreparedStatement, D1Result, StarLocalDbEnv } from './d1';
export * from './mappers';
export type {
  ContactRepository,
  DatabaseRepositories,
  OpeningHoursRepository,
  ServiceRepository,
  TenantRepository,
  WebsiteRepository,
} from './repositories/types';
export { D1ContactRepository } from './repositories/contact.repository';
export { D1OpeningHoursRepository } from './repositories/opening-hours.repository';
export { D1ServiceRepository } from './repositories/service.repository';
export { D1TenantRepository } from './repositories/tenant.repository';
export { D1WebsiteRepository } from './repositories/website.repository';
export { D1WebsitePageRepository } from './repositories/website-page.repository';
export { D1MediaItemRepository } from './repositories/media.repository';
