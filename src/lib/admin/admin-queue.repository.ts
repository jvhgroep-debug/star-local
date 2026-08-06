import type { ApprovalStatus } from '../../types/approval';
import type { D1Database } from '../db/d1';
import type { AdminWebsiteRecord } from './queue.types';

export interface AdminQueueListRow {
  website_id: string;
  tenant_id: string;
  slug: string;
  business_name: string;
  email: string | null;
  city: string | null;
  industry: string | null;
  primary_color: string;
  approval_status: string;
  rejection_reason: string | null;
  rejection_category: string | null;
  config_snapshot_json: string | null;
  live_url: string | null;
  last_published_at: string | null;
  active_publication_version: string | null;
  previous_publication_version: string | null;
  package_generated_at: string | null;
  created_at: string;
}

function mapRow(row: AdminQueueListRow): AdminWebsiteRecord {
  return {
    id: row.website_id,
    businessName: row.business_name,
    slug: row.slug,
    subdomain: `${row.slug}.starlocal.nl`,
    email: row.email ?? '',
    city: row.city ?? '',
    industry: row.industry ?? '',
    createdAt: row.created_at,
    approvalStatus: row.approval_status as ApprovalStatus,
    rejectionReason: row.rejection_reason ?? undefined,
    rejectionCategory: row.rejection_category ?? undefined,
    tenantId: row.tenant_id,
    websiteId: row.website_id,
    primaryColor: row.primary_color,
    configSnapshot: undefined,
    publishedAt: row.last_published_at ?? undefined,
    liveUrl: row.live_url ?? undefined,
    hasConfigSnapshot: Boolean(row.config_snapshot_json),
    activePublicationVersion: row.active_publication_version ?? undefined,
    previousPublicationVersion: row.previous_publication_version ?? undefined,
    packageGeneratedAt: row.package_generated_at ?? undefined,
  };
}

const LIST_QUERY = `
  SELECT
    w.id AS website_id,
    w.tenant_id,
    t.slug,
    t.name AS business_name,
    c.email,
    c.plaats AS city,
    t.branche AS industry,
    w.primary_color,
    w.approval_status,
    w.rejection_reason,
    w.rejection_category,
    w.config_snapshot_json,
    w.live_url,
    w.last_published_at,
    w.active_publication_version,
    w.previous_publication_version,
    w.package_generated_at,
    w.created_at
  FROM websites w
  INNER JOIN tenants t ON t.id = w.tenant_id
  LEFT JOIN contacts c ON c.tenant_id = w.tenant_id
  ORDER BY w.created_at DESC
  LIMIT 500
`;

const FIND_QUERY = `
  SELECT
    w.id AS website_id,
    w.tenant_id,
    t.slug,
    t.name AS business_name,
    c.email,
    c.plaats AS city,
    t.branche AS industry,
    w.primary_color,
    w.approval_status,
    w.rejection_reason,
    w.rejection_category,
    w.config_snapshot_json,
    w.live_url,
    w.last_published_at,
    w.active_publication_version,
    w.previous_publication_version,
    w.package_generated_at,
    w.created_at
  FROM websites w
  INNER JOIN tenants t ON t.id = w.tenant_id
  LEFT JOIN contacts c ON c.tenant_id = w.tenant_id
  WHERE w.id = ?
  LIMIT 1
`;

export class AdminQueueRepository {
  constructor(private readonly db: D1Database) {}

  async list(): Promise<AdminWebsiteRecord[]> {
    const { results = [] } = await this.db.prepare(LIST_QUERY).all<AdminQueueListRow>();
    return results.map(mapRow);
  }

  async findById(websiteId: string): Promise<AdminWebsiteRecord | null> {
    const row = await this.db.prepare(FIND_QUERY).bind(websiteId).first<AdminQueueListRow>();
    return row ? mapRow(row) : null;
  }

  async findByIdWithSnapshot(websiteId: string): Promise<(AdminWebsiteRecord & { configSnapshotJson: string | null }) | null> {
    const row = await this.db.prepare(FIND_QUERY).bind(websiteId).first<AdminQueueListRow>();
    if (!row) return null;
    return {
      ...mapRow(row),
      configSnapshotJson: row.config_snapshot_json,
    };
  }

  async updateApprovalStatus(
    websiteId: string,
    approvalStatus: ApprovalStatus,
    options: { rejectionReason?: string; rejectionCategory?: string } = {},
  ): Promise<boolean> {
    const now = new Date().toISOString();
    const unpublish = approvalStatus === 'concept';
    const result = await this.db
      .prepare(
        `UPDATE websites SET
          approval_status = ?,
          rejection_reason = ?,
          rejection_category = ?,
          status = CASE WHEN ? THEN 'draft' ELSE status END,
          published = CASE WHEN ? THEN 0 ELSE published END,
          live_url = CASE WHEN ? THEN NULL ELSE live_url END,
          updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        approvalStatus,
        approvalStatus === 'rejected' ? (options.rejectionReason ?? null) : null,
        approvalStatus === 'rejected' ? (options.rejectionCategory ?? null) : null,
        unpublish ? 1 : 0,
        unpublish ? 1 : 0,
        unpublish ? 1 : 0,
        now,
        websiteId,
      )
      .run();
    return result.success && (result.meta.changes ?? 0) > 0;
  }

  async markPublished(websiteId: string, liveUrl: string): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await this.db
      .prepare(
        `UPDATE websites SET
          approval_status = 'published',
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

  async markPackageReady(
    websiteId: string,
    input: {
      versionLabel: string;
      previousVersion: string | null;
      packageGeneratedAt: string;
      canonicalBaseUrl: string;
    },
  ): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await this.db
      .prepare(
        `UPDATE websites SET
          approval_status = 'package_ready',
          active_publication_version = ?,
          previous_publication_version = ?,
          package_generated_at = ?,
          live_url = ?,
          publication_status = 'draft',
          updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.versionLabel,
        input.previousVersion,
        input.packageGeneratedAt,
        input.canonicalBaseUrl,
        now,
        websiteId,
      )
      .run();
    return result.success && (result.meta.changes ?? 0) > 0;
  }

  async setConfigSnapshot(websiteId: string, configSnapshotJson: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .prepare('UPDATE websites SET config_snapshot_json = ?, updated_at = ? WHERE id = ?')
      .bind(configSnapshotJson, now, websiteId)
      .run();
  }

  async setApprovalStatus(websiteId: string, approvalStatus: ApprovalStatus): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .prepare('UPDATE websites SET approval_status = ?, updated_at = ? WHERE id = ?')
      .bind(approvalStatus, now, websiteId)
      .run();
  }

  async deleteWebsite(websiteId: string): Promise<boolean> {
    const row = await this.db.prepare('SELECT tenant_id FROM websites WHERE id = ?').bind(websiteId).first<{ tenant_id: string }>();
    if (!row) return false;
    await this.db.prepare('DELETE FROM websites WHERE id = ?').bind(websiteId).run();
    await this.db.prepare('DELETE FROM tenants WHERE id = ?').bind(row.tenant_id).run();
    return true;
  }

  async savePublicationLog(input: {
    id: string;
    websiteId: string;
    tenantId: string;
    businessName: string;
    subdomain: string;
    startedAt: string;
    finishedAt: string;
    stepsJson: string;
    pageCount: number;
    fileCount: number;
    packageHash: string;
    packageJson: string | null;
    liveUrl: string;
  }): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .prepare(
        `INSERT INTO admin_publication_logs (
          id, website_id, tenant_id, business_name, subdomain,
          started_at, finished_at, steps_json, page_count, file_count,
          package_hash, package_json, live_url, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.websiteId,
        input.tenantId,
        input.businessName,
        input.subdomain,
        input.startedAt,
        input.finishedAt,
        input.stepsJson,
        input.pageCount,
        input.fileCount,
        input.packageHash,
        input.packageJson,
        input.liveUrl,
        now,
      )
      .run();
  }

  async findLatestPublicationLog(websiteId: string): Promise<{
    stepsJson: string;
    pageCount: number;
    fileCount: number;
    packageHash: string;
    packageJson: string | null;
    liveUrl: string;
    businessName: string;
    subdomain: string;
    startedAt: string;
    finishedAt: string;
  } | null> {
    const row = await this.db
      .prepare(
        `SELECT steps_json, page_count, file_count, package_hash, package_json,
                live_url, business_name, subdomain, started_at, finished_at
         FROM admin_publication_logs
         WHERE website_id = ?
         ORDER BY created_at DESC
         LIMIT 1`,
      )
      .bind(websiteId)
      .first<{
        steps_json: string;
        page_count: number;
        file_count: number;
        package_hash: string;
        package_json: string | null;
        live_url: string;
        business_name: string;
        subdomain: string;
        started_at: string;
        finished_at: string;
      }>();
    if (!row) return null;
    return {
      stepsJson: row.steps_json,
      pageCount: row.page_count,
      fileCount: row.file_count,
      packageHash: row.package_hash,
      packageJson: row.package_json,
      liveUrl: row.live_url,
      businessName: row.business_name,
      subdomain: row.subdomain,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
    };
  }
}
