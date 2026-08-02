import type { IsoDateTime, TenantStatus, TenantUserRole } from './tenant';

/** Application-layer user record. */
export interface User {
  id: string;
  email: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/** D1 row shape for `users`. */
export interface UserRow {
  id: string;
  email: string;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

/** Application-layer magic link record (token hash only, never plain token). */
export interface MagicLink {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: IsoDateTime;
  usedAt: IsoDateTime | null;
  createdAt: IsoDateTime;
}

/** D1 row shape for `magic_links`. */
export interface MagicLinkRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: IsoDateTime;
  used_at: IsoDateTime | null;
  created_at: IsoDateTime;
}

/** Application-layer tenant membership record. */
export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantUserRole;
  createdAt: IsoDateTime;
}

/** D1 row shape for `tenant_users`. */
export interface TenantUserRow {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantUserRole;
  created_at: IsoDateTime;
}

/** D1 row shape for `tenants` (snake_case columns). */
export interface TenantRow {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}
