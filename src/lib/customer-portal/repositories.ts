import type { CustomerRecord, CustomerWebsiteSummary, WebsitePermissionRecord } from '../../types/customer-portal';
import type { D1Database } from '../db/d1';

interface CustomerRow {
  id: string;
  email: string;
  business_name: string | null;
  user_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function mapCustomer(row: CustomerRow): CustomerRecord {
  return {
    id: row.id,
    email: row.email,
    businessName: row.business_name,
    userId: row.user_id,
    status: row.status as CustomerRecord['status'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class CustomerRepository {
  constructor(private readonly db: D1Database) {}

  async findByEmail(email: string): Promise<CustomerRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM customers WHERE email = ? LIMIT 1')
      .bind(email)
      .first<CustomerRow>();
    return row ? mapCustomer(row) : null;
  }

  async findById(id: string): Promise<CustomerRecord | null> {
    const row = await this.db.prepare('SELECT * FROM customers WHERE id = ? LIMIT 1').bind(id).first<CustomerRow>();
    return row ? mapCustomer(row) : null;
  }

  async findLoginEligibleByEmail(email: string): Promise<CustomerRecord | null> {
    const customer = await this.findByEmail(email);
    if (!customer || customer.status !== 'active') return null;

    const row = await this.db
      .prepare('SELECT COUNT(*) AS count FROM website_permissions WHERE customer_id = ?')
      .bind(customer.id)
      .first<{ count: number }>();

    if (!row || Number(row.count) < 1) return null;
    return customer;
  }

  async linkUserToCustomer(customerId: string, userId: string): Promise<void> {
    await this.db
      .prepare('UPDATE customers SET user_id = ?, updated_at = ? WHERE id = ?')
      .bind(userId, new Date().toISOString(), customerId)
      .run();
  }

  async upsertFromUser(input: {
    userId: string;
    email: string;
    businessName?: string | null;
  }): Promise<CustomerRecord> {
    const existing = await this.findByEmail(input.email);
    const now = new Date().toISOString();
    if (existing) {
      await this.db
        .prepare(
          `UPDATE customers SET user_id = ?, business_name = COALESCE(?, business_name), updated_at = ? WHERE id = ?`,
        )
        .bind(input.userId, input.businessName ?? null, now, existing.id)
        .run();
      return (await this.findById(existing.id))!;
    }

    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO customers (id, email, business_name, user_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'active', ?, ?)`,
      )
      .bind(id, input.email, input.businessName ?? null, input.userId, now, now)
      .run();
    return (await this.findById(id))!;
  }

  async listAll(limit = 200): Promise<CustomerRecord[]> {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM customers ORDER BY created_at DESC LIMIT ?')
      .bind(limit)
      .all<CustomerRow>();
    return results.map(mapCustomer);
  }

  async updateBusinessName(customerId: string, businessName: string): Promise<void> {
    await this.db
      .prepare('UPDATE customers SET business_name = ?, updated_at = ? WHERE id = ?')
      .bind(businessName, new Date().toISOString(), customerId)
      .run();
  }
}

interface PermissionRow {
  id: string;
  customer_id: string;
  tenant_id: string;
  website_id: string;
  role: string;
  created_at: string;
  updated_at: string;
}

function mapPermission(row: PermissionRow): WebsitePermissionRecord {
  return {
    id: row.id,
    customerId: row.customer_id,
    tenantId: row.tenant_id,
    websiteId: row.website_id,
    role: row.role as WebsitePermissionRecord['role'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class WebsitePermissionRepository {
  constructor(private readonly db: D1Database) {}

  async ensurePermission(input: {
    customerId: string;
    tenantId: string;
    websiteId: string;
    role?: WebsitePermissionRecord['role'];
  }): Promise<WebsitePermissionRecord> {
    const existing = await this.db
      .prepare('SELECT * FROM website_permissions WHERE customer_id = ? AND website_id = ? LIMIT 1')
      .bind(input.customerId, input.websiteId)
      .first<PermissionRow>();
    if (existing) return mapPermission(existing);

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO website_permissions (id, customer_id, tenant_id, website_id, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, input.customerId, input.tenantId, input.websiteId, input.role ?? 'owner', now, now)
      .run();
    const row = await this.db.prepare('SELECT * FROM website_permissions WHERE id = ?').bind(id).first<PermissionRow>();
    if (!row) throw new Error('Permission create failed');
    return mapPermission(row);
  }

  async hasAccess(customerId: string, websiteId: string): Promise<boolean> {
    const row = await this.db
      .prepare('SELECT id FROM website_permissions WHERE customer_id = ? AND website_id = ? LIMIT 1')
      .bind(customerId, websiteId)
      .first<{ id: string }>();
    return Boolean(row);
  }

  async listWebsitesForCustomer(customerId: string): Promise<CustomerWebsiteSummary[]> {
    const { results = [] } = await this.db
      .prepare(
        `SELECT
          wp.id AS permission_id,
          wp.customer_id,
          wp.tenant_id,
          wp.website_id,
          wp.role,
          t.name AS business_name,
          t.slug,
          t.branche AS industry,
          c.plaats AS city,
          w.approval_status,
          w.pending_changes_status,
          w.live_url,
          w.updated_at,
          w.created_at
        FROM website_permissions wp
        INNER JOIN websites w ON w.id = wp.website_id
        INNER JOIN tenants t ON t.id = wp.tenant_id
        LEFT JOIN contacts c ON c.tenant_id = wp.tenant_id
        WHERE wp.customer_id = ?
        ORDER BY w.updated_at DESC`,
      )
      .bind(customerId)
      .all<{
        permission_id: string;
        customer_id: string;
        tenant_id: string;
        website_id: string;
        role: string;
        business_name: string;
        slug: string;
        industry: string | null;
        city: string | null;
        approval_status: string;
        pending_changes_status: string;
        live_url: string | null;
        updated_at: string;
        created_at: string;
      }>();

    return results.map((row) => ({
      permissionId: row.permission_id,
      customerId: row.customer_id,
      tenantId: row.tenant_id,
      websiteId: row.website_id,
      role: row.role as WebsitePermissionRecord['role'],
      businessName: row.business_name,
      slug: row.slug,
      industry: row.industry ?? '',
      city: row.city ?? '',
      approvalStatus: row.approval_status,
      pendingChangesStatus: (row.pending_changes_status as 'none' | 'in_review') ?? 'none',
      liveUrl: row.live_url,
      updatedAt: row.updated_at,
      createdAt: row.created_at,
    }));
  }

  async listForWebsite(websiteId: string): Promise<WebsitePermissionRecord[]> {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM website_permissions WHERE website_id = ?')
      .bind(websiteId)
      .all<PermissionRow>();
    return results.map(mapPermission);
  }
}
