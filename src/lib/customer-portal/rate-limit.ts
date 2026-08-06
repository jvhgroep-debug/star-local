import type { D1Database } from '../db/d1';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export class AuthRateLimitService {
  constructor(private readonly db: D1Database) {}

  async checkAndIncrement(scope: string, identifier: string): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const row = await this.db
      .prepare('SELECT * FROM auth_rate_limits WHERE scope = ? AND identifier = ? LIMIT 1')
      .bind(scope, identifier)
      .first<{ id: string; attempt_count: number; expires_at: string }>();

    if (!row || new Date(row.expires_at).getTime() < now) {
      const expiresAt = new Date(now + RATE_LIMIT_WINDOW_MS).toISOString();
      if (row) {
        await this.db
          .prepare(
            `UPDATE auth_rate_limits SET attempt_count = 1, window_started_at = ?, expires_at = ?, created_at = ? WHERE id = ?`,
          )
          .bind(nowIso, expiresAt, nowIso, row.id)
          .run();
      } else {
        await this.db
          .prepare(
            `INSERT INTO auth_rate_limits (id, scope, identifier, attempt_count, window_started_at, expires_at, created_at)
             VALUES (?, ?, ?, 1, ?, ?, ?)`,
          )
          .bind(crypto.randomUUID(), scope, identifier, nowIso, expiresAt, nowIso)
          .run();
      }
      return { allowed: true };
    }

    if (row.attempt_count >= MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil((new Date(row.expires_at).getTime() - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    }

    await this.db
      .prepare('UPDATE auth_rate_limits SET attempt_count = attempt_count + 1 WHERE id = ?')
      .bind(row.id)
      .run();
    return { allowed: true };
  }

  async purgeExpired(): Promise<void> {
    await this.db
      .prepare('DELETE FROM auth_rate_limits WHERE expires_at < ?')
      .bind(new Date().toISOString())
      .run();
  }
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
