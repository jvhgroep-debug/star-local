import type {
  ContactRow,
  CreateContactInput,
  UpdateContactInput,
} from '../../../types/database';
import type { D1Database } from '../d1';
import { mapContactRow } from '../mappers';
import type { ContactRepository } from './types';

export class D1ContactRepository implements ContactRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string) {
    const row = await this.db
      .prepare('SELECT * FROM contacts WHERE id = ? LIMIT 1')
      .bind(id)
      .first<ContactRow>();
    return row ? mapContactRow(row) : null;
  }

  async findByTenantId(tenantId: string) {
    const row = await this.db
      .prepare('SELECT * FROM contacts WHERE tenant_id = ? LIMIT 1')
      .bind(tenantId)
      .first<ContactRow>();
    return row ? mapContactRow(row) : null;
  }

  async create(input: CreateContactInput) {
    await this.db
      .prepare(
        `INSERT INTO contacts (
          id, tenant_id, telefoon, whatsapp, email, adres, postcode, plaats, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.id,
        input.tenantId,
        input.telefoon ?? '',
        input.whatsapp ?? '',
        input.email ?? '',
        input.adres ?? '',
        input.postcode ?? '',
        input.plaats ?? '',
        input.createdAt,
        input.updatedAt,
      )
      .run();

    const created = await this.findById(input.id);
    if (!created) throw new Error('Failed to create contact');
    return created;
  }

  async update(id: string, input: UpdateContactInput) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.db
      .prepare(
        `UPDATE contacts SET
          telefoon = ?, whatsapp = ?, email = ?, adres = ?, postcode = ?, plaats = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.telefoon ?? existing.telefoon,
        input.whatsapp ?? existing.whatsapp,
        input.email ?? existing.email,
        input.adres ?? existing.adres,
        input.postcode ?? existing.postcode,
        input.plaats ?? existing.plaats,
        input.updatedAt,
        id,
      )
      .run();

    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.db.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();
    return result.success;
  }
}
