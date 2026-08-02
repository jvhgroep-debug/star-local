import type {
  CreateServiceInput,
  ServiceRow,
  UpdateServiceInput,
} from '../../../types/database';
import type { D1Database } from '../d1';
import { mapServiceRow } from '../mappers';
import type { ServiceRepository } from './types';

export class D1ServiceRepository implements ServiceRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM services WHERE id = ? LIMIT 1')
      .bind(id)
      .first<ServiceRow>();
    return row ? mapServiceRow(row) : null;
  }

  async listByTenantId(tenantId: string) {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM services WHERE tenant_id = ? ORDER BY sort_order ASC, created_at ASC')
      .bind(tenantId)
      .all<ServiceRow>();
    return results.map(mapServiceRow);
  }

  async create(input: CreateServiceInput) {
    await this.db
      .prepare(
        `INSERT INTO services (
          id, tenant_id, titel, omschrijving, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.titel,
        input.omschrijving ?? '',
        input.sortOrder ?? 0,
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const created = await this.findById(input.id);
    if (!created) throw new Error('Failed to create service');
    return created;
  }

  async update(id: string, input: UpdateServiceInput) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.db
      .prepare(
        `UPDATE services SET titel = ?, omschrijving = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(
        input.titel ?? existing.titel,
        input.omschrijving ?? existing.omschrijving,
        input.sortOrder ?? existing.sortOrder,
        input.updatedAt,
        id,
      )
      .run();

    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.db.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    return result.success;
  }

  async deleteByTenantId(tenantId: string) {
    const result = await this.db
      .prepare('DELETE FROM services WHERE tenant_id = ?')
      .bind(tenantId)
      .run();
    return Number(result.meta.changes ?? 0);
  }
}
