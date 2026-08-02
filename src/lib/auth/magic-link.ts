import type { D1Database } from '../db/d1';
import { createAuthService, type AuthServiceOptions } from './auth.service';
import type {
  CreateMagicLinkInput,
  CreateMagicLinkResult,
  CreateSessionInput,
  CreateSessionResult,
  DestroySessionInput,
  ValidateMagicLinkInput,
  ValidateMagicLinkResult,
} from './types';

export async function createMagicLink(db: D1Database, input: CreateMagicLinkInput, options?: AuthServiceOptions): Promise<CreateMagicLinkResult> {
  return createAuthService(db, options).requestMagicLink(input);
}

export async function validateMagicLink(
  db: D1Database,
  input: ValidateMagicLinkInput,
): Promise<ValidateMagicLinkResult> {
  return createAuthService(db).validateMagicLink(input);
}

export async function createSession(db: D1Database, input: CreateSessionInput): Promise<CreateSessionResult> {
  return createAuthService(db).createSession(input);
}

export async function destroySession(db: D1Database, input: DestroySessionInput): Promise<void> {
  return createAuthService(db).destroySession(input);
}
