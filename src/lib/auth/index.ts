/**
 * Star Local SaaS — authentication module (foundation only).
 *
 * Magic link login for `app.starlocal.nl`. No implementation in this phase;
 * exports types, placeholders, and module boundaries for later work.
 */

export type {
  CreateMagicLinkInput,
  CreateMagicLinkResult,
  CreateSessionInput,
  CreateSessionResult,
  DestroySessionInput,
  Session,
  ValidateMagicLinkInput,
  ValidateMagicLinkResult,
} from './types';

export { createMagicLink, validateMagicLink } from './magic-link';
export { createSession, destroySession } from './session';
