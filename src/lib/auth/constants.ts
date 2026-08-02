export const SESSION_COOKIE_NAME = 'starlocal_session';

/** Magic link validity — 30 minutes. */
export const MAGIC_LINK_TTL_SECONDS = 30 * 60;

/** Session cookie validity — 30 days. */
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

export const AUTH_ROUTES = {
  login: '/login/',
  checkEmail: '/check-email/',
  magic: '/auth/magic/',
  logout: '/logout/',
  dashboard: '/dashboard/',
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
