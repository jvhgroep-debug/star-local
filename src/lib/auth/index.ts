/**
 * Star Local SaaS — authentication (magic link + session cookies).
 */

export type {
  AuthSessionContext,
  CreateMagicLinkInput,
  CreateMagicLinkResult,
  CreateSessionInput,
  CreateSessionResult,
  DestroySessionInput,
  Session,
  ValidateMagicLinkInput,
  ValidateMagicLinkResult,
} from './types';

export { AUTH_ROUTES, SESSION_COOKIE_NAME, AUTH_NEXT_COOKIE, MAGIC_LINK_TTL_SECONDS } from './constants';
export { AuthService, createAuthService, sanitizeAuthRedirectPath } from './auth.service';
export { AuthValidationError, MagicLinkExpiredError, MagicLinkInvalidError } from './errors';
export { createMagicLink, validateMagicLink } from './magic-link';
export { createSession, destroySession } from './session';
export { normalizeEmail } from './crypto';
export { requireAuthSession, isAuthRedirect } from './guard';
export {
  buildSessionCookie,
  clearSessionCookie,
  createAuthServiceFromEnv,
  getAuthSession,
  getSessionCookieName,
  getSessionTokenFromRequest,
  isSecureRequest,
} from './server';
