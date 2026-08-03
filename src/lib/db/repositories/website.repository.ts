import type {
  CreateWebsiteInput,
  UpdateWebsiteInput,
  WebsiteRow,
} from '../../../types/database';
import type { D1Database } from '../d1';
import { booleanToInt, mapWebsiteRow } from '../mappers';
import type { WebsiteRepository } from './types';

export class D1WebsiteRepository implements WebsiteRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM websites WHERE id = ? LIMIT 1')
      .bind(id)
      .first<WebsiteRow>();
    return row ? mapWebsiteRow(row) : null;
  }

  async findByTenantId(tenantId: string) {
    const row = await this.db
      .prepare('SELECT * FROM websites WHERE tenant_id = ? LIMIT 1')
      .bind(tenantId)
      .first<WebsiteRow>();
    return row ? mapWebsiteRow(row) : null;
  }

  async listByTenantId(tenantId: string) {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM websites WHERE tenant_id = ? ORDER BY created_at DESC')
      .bind(tenantId)
      .all<WebsiteRow>();
    return results.map(mapWebsiteRow);
  }

  async create(input: CreateWebsiteInput) {
    await this.db
      .prepare(
        `INSERT INTO websites (
          id, tenant_id, seo_title, meta_description, theme,
          primary_color, secondary_color, font_family, status, package, logo_key,
          published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.seoTitle ?? '',
        input.metaDescription ?? '',
        input.theme ?? 'default',
        input.primaryColor ?? '#1a2332',
        input.secondaryColor ?? '#cdb880',
        input.fontFamily ?? 'system',
        input.status ?? 'draft',
        input.package ?? 'free',
        input.logoKey ?? null,
        booleanToInt(input.published ?? false),
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const created = await this.findById(input.id);
    if (!created) throw new Error('Failed to create website');
    return created;
  }

  async update(id: string, input: UpdateWebsiteInput) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.db
      .prepare(
        `UPDATE websites SET
          seo_title = ?, meta_description = ?, theme = ?,
          primary_color = ?, secondary_color = ?, font_family = ?, status = ?, package = ?,
          logo_key = ?, published = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.seoTitle ?? existing.seoTitle,
        input.metaDescription ?? existing.metaDescription,
        input.theme ?? existing.theme,
        input.primaryColor ?? existing.primaryColor,
        input.secondaryColor ?? existing.secondaryColor,
        input.fontFamily ?? existing.fontFamily,
        input.status ?? existing.status,
        input.package ?? existing.package,
        input.logoKey !== undefined ? input.logoKey : existing.logoKey,
        booleanToInt(input.published ?? existing.published),
        input.updatedAt,
        id,
      )
      .run();

    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.db.prepare('DELETE FROM websites WHERE id = ?').bind(id).run();
    return result.success;
  }
}
