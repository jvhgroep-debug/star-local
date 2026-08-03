import type { IsoDateTime } from '../../types/tenant';
import type { MagicLink, User } from '../../types/auth';

/** Input for requesting a magic login link. */
export interface CreateMagicLinkInput {
  email: string;
  tenantId?: string;
  redirectPath?: string;
  origin?: string;
}

/** Result of creating a magic link (plain token only returned to mail layer, never stored). */
export interface CreateMagicLinkResult {
  magicLink: MagicLink;
  /** One-time plaintext token for e-mail delivery. Must not be persisted in D1. */
  plainToken: string;
  emailSent: boolean;
}

/** Input for validating a magic link token from a verification URL. */
export interface ValidateMagicLinkInput {
  plainToken: string;
}

/** Result of a successful magic link validation. */
export interface ValidateMagicLinkResult {
  user: User;
  magicLink: MagicLink;
}

/** Opaque session identifier issued after successful magic link validation. */
export interface Session {
  id: string;
  userId: string;
  tenantId: string | null;
  expiresAt: IsoDateTime;
  createdAt: IsoDateTime;
}

/** Input for creating a session after authentication. */
export interface CreateSessionInput {
  userId: string;
  tenantId?: string | null;
  ttlSeconds?: number;
}

/** Result of session creation. */
export interface CreateSessionResult {
  session: Session;
  /** Session token for httpOnly cookie (implementation follows in a later phase). */
  sessionToken: string;
}

/** Input for ending a session. */
export interface DestroySessionInput {
  sessionId?: string;
  sessionToken?: string;
}

export interface AuthSessionContext {
  session: Session;
  user: import('../../types/auth').User;
  sessionToken: string;
}
