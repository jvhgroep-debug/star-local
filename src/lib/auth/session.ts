import type { D1Database } from '../db/d1';
import { createAuthService } from './auth.service';
import type { CreateSessionInput, CreateSessionResult, DestroySessionInput } from './types';

export async function createSession(db: D1Database, input: CreateSessionInput): Promise<CreateSessionResult> {
  return createAuthService(db).createSession(input);
}

export async function destroySession(db: D1Database, input: DestroySessionInput): Promise<void> {
  return createAuthService(db).destroySession(input);
}
