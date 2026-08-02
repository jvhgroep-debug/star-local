import type {
  CreateOpeningHoursInput,
  OpeningHoursRow,
  UpdateOpeningHoursInput,
  Weekday,
} from '../../../types/database';
import type { D1Database } from '../d1';
import { booleanToInt, mapOpeningHoursRow } from '../mappers';
import type { OpeningHoursRepository } from './types';

export class D1OpeningHoursRepository implements OpeningHoursRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM opening_hours WHERE id = ? LIMIT 1')
      .bind(id)
      .first<OpeningHoursRow>();
    return row ? mapOpeningHoursRow(row) : null;
  }

  async findByTenantAndWeekday(tenantId: string, weekday: Weekday) {
    const row = await this.db
      .prepare('SELECT * FROM opening_hours WHERE tenant_id = ? AND weekday = ? LIMIT 1')
      .bind(tenantId, weekday)
      .first<OpeningHoursRow>();
    return row ? mapOpeningHoursRow(row) : null;
  }

  async listByTenantId(tenantId: string) {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM opening_hours WHERE tenant_id = ? ORDER BY weekday ASC')
      .bind(tenantId)
      .all<OpeningHoursRow>();
    return results.map(mapOpeningHoursRow);
  }

  async create(input: CreateOpeningHoursInput) {
    await this.db
      .prepare(
        `INSERT INTO opening_hours (
          id, tenant_id, weekday, open_time, close_time, closed, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.weekday,
        input.openTime ?? null,
        input.closeTime ?? null,
        booleanToInt(input.closed ?? false),
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const created = await this.findById(input.id);
    if (!created) throw new Error('Failed to create opening hours');
    return created;
  }

  async update(id: string, input: UpdateOpeningHoursInput) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.db
      .prepare(
        `UPDATE opening_hours SET
          open_time = ?, close_time = ?, closed = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.openTime !== undefined ? input.openTime : existing.openTime,
        input.closeTime !== undefined ? input.closeTime : existing.closeTime,
        booleanToInt(input.closed ?? existing.closed),
        input.updatedAt,
        id,
      )
      .run();

    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.db.prepare('DELETE FROM opening_hours WHERE id = ?').bind(id).run();
    return result.success;
  }

  async deleteByTenantId(tenantId: string) {
    const result = await this.db
      .prepare('DELETE FROM opening_hours WHERE tenant_id = ?')
      .bind(tenantId)
      .run();
    return Number(result.meta.changes ?? 0);
  }
}
