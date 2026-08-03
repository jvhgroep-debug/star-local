import type { CreateMediaItemInput, MediaItemRow } from '../../../types/database';
import type { D1Database } from '../d1';
import { mapMediaItemRow } from '../mappers';
import type { MediaItemRepository } from './types';

export class D1MediaItemRepository implements MediaItemRepository {
  constructor(private readonly db: D1Database) {}

  async listByTenantId(tenantId: string) {
    const { results = [] } = await this.db
      .prepare('SELECT * FROM media_items WHERE tenant_id = ? ORDER BY media_type ASC, sort_order ASC')
      .bind(tenantId)
      .all<MediaItemRow>();
    return results.map(mapMediaItemRow);
  }

  async create(input: CreateMediaItemInput) {
    await this.db
      .prepare(
        `INSERT INTO media_items (
          id, tenant_id, media_type, storage_key, filename, mime_type, size_bytes, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.mediaType,
        input.storageKey,
        input.filename,
        input.mimeType,
        input.sizeBytes,
        input.sortOrder ?? 0,
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const row = await this.db
      .prepare('SELECT * FROM media_items WHERE id = ? LIMIT 1')
      .bind(input.id)
      .first<MediaItemRow>();
    if (!row) throw new Error('Failed to create media item');
    return mapMediaItemRow(row);
  }

  async deleteByTenantId(tenantId: string) {
    const result = await this.db.prepare('DELETE FROM media_items WHERE tenant_id = ?').bind(tenantId).run();
    return result.meta.changes ?? 0;
  }
}
