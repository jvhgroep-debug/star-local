import type { CreateSessionInput, CreateSessionResult, DestroySessionInput } from './types';

/**
 * Creates a server-side session after successful magic link validation.
 *
 * Planned behaviour (not implemented in this phase):
 * - generate session id + secret token
 * - store session server-side (D1 or KV in a later migration)
 * - return httpOnly cookie parameters for `app.starlocal.nl`
 */
export function createSession(_input: CreateSessionInput): Promise<CreateSessionResult> {
  throw new Error('createSession is not implemented yet.');
}

/**
 * Destroys an active session (logout).
 *
 * Planned behaviour (not implemented in this phase):
 * - invalidate session record
 * - clear client cookie
 */
export function destroySession(_input: DestroySessionInput): Promise<void> {
  throw new Error('destroySession is not implemented yet.');
}
