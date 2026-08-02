import type {
  CreateMagicLinkInputDb,
  CreateSessionInputDb,
  CreateTenantUserInput,
  CreateUserInput,
  MagicLink,
  MagicLinkRow,
  SessionRecord,
  SessionRow,
  TenantMembership,
  TenantUserRow,
  User,
  UserRow,
} from '../../types/auth';
import type { D1Database } from '../db/d1';

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMagicLinkRow(row: MagicLinkRow): MagicLink {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    usedAt: row.used_at,
    createdAt: row.created_at,
  };
}

function mapSessionRow(row: SessionRow): SessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function mapTenantUserRow(row: TenantUserRow): TenantMembership {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  };
}

export class AuthRepository {
  constructor(private readonly db: D1Database) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const row = await this.db
      .prepare('SELECT * FROM users WHERE email = ? LIMIT 1')
      .bind(email)
      .first<UserRow>();
    return row ? mapUserRow(row) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const row = await this.db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').bind(id).first<UserRow>();
    return row ? mapUserRow(row) : null;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    await this.db
      .prepare('INSERT INTO users (id, email, created_at, updated_at) VALUES (?, ?, ?, ?)')
      .bind(input.id, input.email, input.createdAt, input.updatedAt)
      .run();
    const user = await this.findUserById(input.id);
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async upsertUserByEmail(email: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) return existing;
    const now = new Date().toISOString();
    return this.createUser({ id: crypto.randomUUID(), email, createdAt: now, updatedAt: now });
  }

  async createMagicLink(input: CreateMagicLinkInputDb): Promise<MagicLink> {
    await this.db
      .prepare(
        `INSERT INTO magic_links (id, user_id, tenant_id, token_hash, expires_at, used_at, created_at)
         VALUES (?, ?, ?, ?, ?, NULL, ?)`,
      )
      .bind(input.id, input.userId, input.tenantId, input.tokenHash, input.expiresAt, input.createdAt)
      .run();
    const row = await this.db.prepare('SELECT * FROM magic_links WHERE id = ? LIMIT 1').bind(input.id).first<MagicLinkRow>();
    if (!row) throw new Error('Failed to create magic link');
    return mapMagicLinkRow(row);
  }

  async findMagicLinkByTokenHash(tokenHash: string): Promise<MagicLink | null> {
    const row = await this.db
      .prepare('SELECT * FROM magic_links WHERE token_hash = ? LIMIT 1')
      .bind(tokenHash)
      .first<MagicLinkRow>();
    return row ? mapMagicLinkRow(row) : null;
  }

  async deleteMagicLink(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM magic_links WHERE id = ?').bind(id).run();
  }

  async createTenantUser(input: CreateTenantUserInput): Promise<TenantMembership> {
    await this.db
      .prepare('INSERT INTO tenant_users (id, tenant_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(input.id, input.tenantId, input.userId, input.role, input.createdAt)
      .run();
    const row = await this.db
      .prepare('SELECT * FROM tenant_users WHERE id = ? LIMIT 1')
      .bind(input.id)
      .first<TenantUserRow>();
    if (!row) throw new Error('Failed to create tenant user');
    return mapTenantUserRow(row);
  }

  async findTenantUser(tenantId: string, userId: string): Promise<TenantMembership | null> {
    const row = await this.db
      .prepare('SELECT * FROM tenant_users WHERE tenant_id = ? AND user_id = ? LIMIT 1')
      .bind(tenantId, userId)
      .first<TenantUserRow>();
    return row ? mapTenantUserRow(row) : null;
  }

  async ensureTenantOwner(tenantId: string, userId: string): Promise<TenantMembership> {
    const existing = await this.findTenantUser(tenantId, userId);
    if (existing) return existing;
    return this.createTenantUser({
      id: crypto.randomUUID(),
      tenantId,
      userId,
      role: 'owner',
      createdAt: new Date().toISOString(),
    });
  }

  async createSession(input: CreateSessionInputDb): Promise<SessionRecord> {
    await this.db
      .prepare(
        `INSERT INTO sessions (id, user_id, tenant_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(input.id, input.userId, input.tenantId, input.tokenHash, input.expiresAt, input.createdAt)
      .run();
    const row = await this.db.prepare('SELECT * FROM sessions WHERE id = ? LIMIT 1').bind(input.id).first<SessionRow>();
    if (!row) throw new Error('Failed to create session');
    return mapSessionRow(row);
  }

  async findSessionByTokenHash(tokenHash: string): Promise<SessionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM sessions WHERE token_hash = ? LIMIT 1')
      .bind(tokenHash)
      .first<SessionRow>();
    return row ? mapSessionRow(row) : null;
  }

  async deleteSessionByTokenHash(tokenHash: string): Promise<void> {
    await this.db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
  }

  async deleteSessionById(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM sessions WHERE id = ?').bind(id).run();
  }
}
