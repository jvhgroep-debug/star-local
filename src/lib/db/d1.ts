/** Minimal D1 types for repository CRUD (no @cloudflare/workers-types dependency). */

export interface D1Result<T = unknown> {
  success: boolean;
  meta: Record<string, unknown>;
  results?: T[];
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

/** Cloudflare Pages / Workers runtime binding (development). */
export interface StarLocalDbEnv {
  DB: D1Database;
}
