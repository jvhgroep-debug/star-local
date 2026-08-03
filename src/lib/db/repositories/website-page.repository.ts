import type { CreateWebsitePageInput, WebsitePageRow } from '../../../types/database';
import type { D1Database } from '../d1';
import { mapWebsitePageRow } from '../mappers';
import type { WebsitePageRepository } from './types';

export class D1WebsitePageRepository implements WebsitePageRepository {
  constructor(private readonly db: D1Database) {}

  async listByTenantId(tenantId: string) {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM website_pages WHERE tenant_id = ? ORDER BY page_key ASC')
      .bind(tenantId)
      .all<WebsitePageRow>();
    return results.map(mapWebsitePageRow);
  }

  async create(input: CreateWebsitePageInput) {
    await this.db
      .prepare(
        `INSERT INTO website_pages (
          id, tenant_id, website_id, page_key, title, slug, content_json,
          seo_title, meta_description, canonical_path, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.websiteId,
        input.pageKey,
        input.title,
        input.slug,
        input.contentJson,
        input.seoTitle,
        input.metaDescription,
        input.canonicalPath,
        input.status ?? 'draft',
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const row = await this.db
      .prepare('SELECT * FROM website_pages WHERE id = ? LIMIT 1')
      .bind(input.id)
      .first<WebsitePageRow>();
    if (!row) throw new Error('Failed to create website page');
    return mapWebsitePageRow(row);
  }

  async deleteByTenantId(tenantId: string) {
    const result = await this.db.prepare('DELETE FROM website_pages WHERE tenant_id = ?').bind(tenantId).run();
    return result.meta.changes ?? 0;
  }
}
