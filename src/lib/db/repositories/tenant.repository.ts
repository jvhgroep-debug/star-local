import type {
  CreateTenantInput,
  TenantRow,
  UpdateTenantInput,
} from '../../../types/database';
import type { D1Database } from '../d1';
import { mapTenantRow } from '../mappers';
import type { TenantRepository } from './types';

export class D1TenantRepository implements TenantRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM tenants WHERE id = ? LIMIT 1')
      .bind(id)
      .first<TenantRow>();
    return row ? mapTenantRow(row) : null;
  }

  async findBySlug(slug: string) {
    const row = await this.db
      .prepare('SELECT * FROM tenants WHERE slug = ? LIMIT 1')
      .bind(slug)
      .first<TenantRow>();
    return row ? mapTenantRow(row) : null;
  }

  async list(limit = 100, offset = 0) {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM tenants ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<TenantRow>();
    return results.map(mapTenantRow);
  }

  async create(input: CreateTenantInput) {
    await this.db
      .prepare(
        `INSERT INTO tenants (id, slug, name, branche, description, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.slug,
        input.bedrijfsnaam,
        input.branche,
        input.description ?? '',
        input.status ?? 'draft',
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const created = await this.findById(input.id);
    if (!created) throw new Error('Failed to create tenant');
    return created;
  }

  async update(id: string, input: UpdateTenantInput) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.db
      .prepare(
        `UPDATE tenants
         SET slug = ?, name = ?, branche = ?, description = ?, status = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.slug ?? existing.slug,
        input.bedrijfsnaam ?? existing.bedrijfsnaam,
        input.branche ?? existing.branche,
        input.description ?? existing.description,
        input.status ?? existing.status,
        input.updatedAt,
        id,
      )
      .run();

    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.db.prepare('DELETE FROM tenants WHERE id = ?').bind(id).run();
    return result.success;
  }
}
