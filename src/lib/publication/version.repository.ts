import type { D1Database } from '../db/d1';
import { versionLabelFromNumber } from '../../config/publication';

export interface PublicationVersionRow {
  id: string;
  tenant_id: string;
  website_id: string;
  version_label: string;
  version_number: number;
  status: string;
  domain: string;
  slug: string;
  package_root: string;
  page_count: number;
  asset_count: number;
  total_size_bytes: number;
  package_hash: string;
  publication_id: string;
  created_at: string;
}

export interface PublicationVersionRecord {
  id: string;
  tenantId: string;
  websiteId: string;
  versionLabel: string;
  versionNumber: number;
  status: 'preview' | 'package_ready' | 'published' | 'failed' | 'superseded';
  domain: string;
  slug: string;
  packageRoot: string;
  pageCount: number;
  assetCount: number;
  totalSizeBytes: number;
  packageHash: string;
  publicationId: string;
  createdAt: string;
}

function mapRow(row: PublicationVersionRow): PublicationVersionRecord {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    websiteId: row.website_id,
    versionLabel: row.version_label,
    versionNumber: row.version_number,
    status: row.status as PublicationVersionRecord['status'],
    domain: row.domain,
    slug: row.slug,
    packageRoot: row.package_root,
    pageCount: row.page_count,
    assetCount: row.asset_count,
    totalSizeBytes: row.total_size_bytes,
    packageHash: row.package_hash,
    publicationId: row.publication_id,
    createdAt: row.created_at,
  };
}

export class PublicationVersionRepository {
  constructor(private readonly db: D1Database) {}

  async getLatestVersionNumber(websiteId: string): Promise<number> {
    const row = await this.db
      .prepare('SELECT MAX(version_number) AS max_version FROM publication_versions WHERE website_id = ?')
      .bind(websiteId)
      .first<{ max_version: number | null }>();
    return row?.max_version ?? 0;
  }

  async getNextVersionLabel(websiteId: string): Promise<{ versionNumber: number; versionLabel: string }> {
    const next = (await this.getLatestVersionNumber(websiteId)) + 1;
    return { versionNumber: next, versionLabel: versionLabelFromNumber(next) };
  }

  async listByWebsite(websiteId: string): Promise<PublicationVersionRecord[]> {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM publication_versions WHERE website_id = ? ORDER BY version_number DESC')
      .bind(websiteId)
      .all<PublicationVersionRow>();
    return results.map(mapRow);
  }

  async findByWebsiteAndVersion(websiteId: string, versionLabel: string): Promise<PublicationVersionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM publication_versions WHERE website_id = ? AND version_label = ? LIMIT 1')
      .bind(websiteId, versionLabel)
      .first<PublicationVersionRow>();
    return row ? mapRow(row) : null;
  }

  async findActiveVersion(websiteId: string): Promise<PublicationVersionRecord | null> {
    const row = await this.db
      .prepare(
        `SELECT pv.* FROM publication_versions pv
         INNER JOIN websites w ON w.id = pv.website_id
         WHERE pv.website_id = ? AND pv.version_label = w.active_publication_version
         LIMIT 1`,
      )
      .bind(websiteId)
      .first<PublicationVersionRow>();
    return row ? mapRow(row) : null;
  }

  async createVersion(input: {
    id: string;
    tenantId: string;
    websiteId: string;
    versionLabel: string;
    versionNumber: number;
    status: PublicationVersionRecord['status'];
    domain: string;
    slug: string;
    packageRoot: string;
    pageCount: number;
    assetCount: number;
    totalSizeBytes: number;
    packageHash: string;
    publicationId: string;
    createdAt: string;
  }): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO publication_versions (
          id, tenant_id, website_id, version_label, version_number, status,
          domain, slug, package_root, page_count, asset_count, total_size_bytes,
          package_hash, publication_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.websiteId,
        input.versionLabel,
        input.versionNumber,
        input.status,
        input.domain,
        input.slug,
        input.packageRoot,
        input.pageCount,
        input.assetCount,
        input.totalSizeBytes,
        input.packageHash,
        input.publicationId,
        input.createdAt,
      )
      .run();
  }

  async markPreviousVersionsSuperseded(websiteId: string, exceptVersionLabel: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE publication_versions SET status = 'superseded'
         WHERE website_id = ? AND version_label != ? AND status = 'package_ready'`,
      )
      .bind(websiteId, exceptVersionLabel)
      .run();
  }
}
