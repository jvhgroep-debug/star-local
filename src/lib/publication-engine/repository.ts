import type { D1Database } from '../db/d1';
import type { PublicationSnapshot } from './snapshot';
import { parsePublicationSnapshot } from './snapshot';

export interface PublishedSiteRecord {
  websiteId: string;
  tenantId: string;
  slug: string;
  businessName: string;
  approvalStatus: string;
  snapshot: PublicationSnapshot;
}

interface PublishedSiteRow {
  website_id: string;
  tenant_id: string;
  slug: string;
  business_name: string;
  approval_status: string;
  config_snapshot_json: string | null;
}

const PUBLISHED_SITE_QUERY = `
  SELECT
    w.id AS website_id,
    w.tenant_id,
    t.slug,
    t.name AS business_name,
    w.approval_status,
    w.config_snapshot_json
  FROM websites w
  INNER JOIN tenants t ON t.id = w.tenant_id
  WHERE t.slug = ?
    AND w.approval_status = 'published'
    AND w.published = 1
  LIMIT 1
`;

export class PublicationSiteRepository {
  constructor(private readonly db: D1Database) {}

  async findPublishedBySlug(slug: string): Promise<PublishedSiteRecord | null> {
    const row = await this.db.prepare(PUBLISHED_SITE_QUERY).bind(slug).first<PublishedSiteRow>();
    if (!row?.config_snapshot_json) return null;

    const snapshot = parsePublicationSnapshot(row.config_snapshot_json);
    if (!snapshot) return null;

    return {
      websiteId: row.website_id,
      tenantId: row.tenant_id,
      slug: row.slug,
      businessName: row.business_name,
      approvalStatus: row.approval_status,
      snapshot,
    };
  }
}

export async function publishWebsiteToSitePath(
  db: D1Database,
  websiteId: string,
  liveUrl: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `UPDATE websites SET
        approval_status = 'published',
        status = 'published',
        live_url = ?,
        last_published_at = ?,
        publication_status = 'published',
        published = 1,
        updated_at = ?
       WHERE id = ?`,
    )
    .bind(liveUrl, now, now, websiteId)
    .run();
  return result.success && (result.meta.changes ?? 0) > 0;
}
