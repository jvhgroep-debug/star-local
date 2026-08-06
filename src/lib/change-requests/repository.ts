import type {
  ChangeRequestAdminView,
  ChangeRequestRecord,
  ChangeRequestStatus,
  ChangeRequestType,
  CreateChangeRequestInput,
  PendingMediaMetadata,
} from '../../types/change-request';
import type { D1Database } from '../db/d1';

interface ChangeRequestRow {
  id: string;
  customer_id: string;
  website_id: string;
  tenant_id: string;
  request_type: string;
  description: string;
  media_metadata_json: string | null;
  requested_location: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminRow extends ChangeRequestRow {
  customer_email: string;
  customer_name: string | null;
  website_name: string;
  website_slug: string;
}

function parseMedia(json: string | null): PendingMediaMetadata | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as PendingMediaMetadata;
  } catch {
    return null;
  }
}

function mapRow(row: ChangeRequestRow): ChangeRequestRecord {
  return {
    id: row.id,
    customerId: row.customer_id,
    websiteId: row.website_id,
    tenantId: row.tenant_id,
    requestType: row.request_type as ChangeRequestType,
    description: row.description,
    mediaMetadata: parseMedia(row.media_metadata_json),
    requestedLocation: row.requested_location,
    status: row.status as ChangeRequestStatus,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAdminRow(row: AdminRow): ChangeRequestAdminView {
  return {
    ...mapRow(row),
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    websiteName: row.website_name,
    websiteSlug: row.website_slug,
  };
}

export class ChangeRequestRepository {
  constructor(private readonly db: D1Database) {}

  async create(input: {
    customerId: string;
    websiteId: string;
    tenantId: string;
    requestType: ChangeRequestType;
    description: string;
    mediaMetadata: PendingMediaMetadata | null;
    requestedLocation: string | null;
  }): Promise<ChangeRequestRecord> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO change_requests (
          id, customer_id, website_id, tenant_id, request_type, description,
          media_metadata_json, requested_location, status, admin_notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NULL, ?, ?)`,
      )
      .bind(
        id,
        input.customerId,
        input.websiteId,
        input.tenantId,
        input.requestType,
        input.description,
        input.mediaMetadata ? JSON.stringify(input.mediaMetadata) : null,
        input.requestedLocation,
        now,
        now,
      )
      .run();

    const row = await this.db
      .prepare('SELECT * FROM change_requests WHERE id = ?')
      .bind(id)
      .first<ChangeRequestRow>();
    if (!row) throw new Error('Wijzigingsverzoek aanmaken mislukt.');
    return mapRow(row);
  }

  async findById(id: string): Promise<ChangeRequestRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM change_requests WHERE id = ? LIMIT 1')
      .bind(id)
      .first<ChangeRequestRow>();
    return row ? mapRow(row) : null;
  }

  async listForCustomer(customerId: string, limit = 100): Promise<ChangeRequestRecord[]> {
    const { results = [] } = await this.db
      .prepare(
        `SELECT * FROM change_requests WHERE customer_id = ? ORDER BY created_at DESC LIMIT ?`,
      )
      .bind(customerId, limit)
      .all<ChangeRequestRow>();
    return results.map(mapRow);
  }

  async listForAdmin(limit = 500): Promise<ChangeRequestAdminView[]> {
    const { results = [] } = await this.db
      .prepare(
        `SELECT
          cr.*,
          c.email AS customer_email,
          c.business_name AS customer_name,
          t.name AS website_name,
          t.slug AS website_slug
        FROM change_requests cr
        INNER JOIN customers c ON c.id = cr.customer_id
        INNER JOIN tenants t ON t.id = cr.tenant_id
        ORDER BY cr.created_at DESC
        LIMIT ?`,
      )
      .bind(limit)
      .all<AdminRow>();
    return results.map(mapAdminRow);
  }

  async updateStatus(
    id: string,
    status: ChangeRequestStatus,
    adminNotes?: string | null,
  ): Promise<ChangeRequestRecord | null> {
    const now = new Date().toISOString();
    await this.db
      .prepare(
        `UPDATE change_requests SET status = ?, admin_notes = COALESCE(?, admin_notes), updated_at = ? WHERE id = ?`,
      )
      .bind(status, adminNotes ?? null, now, id)
      .run();
    return this.findById(id);
  }
}
