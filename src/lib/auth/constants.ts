export const SESSION_COOKIE_NAME = 'starlocal_session';
export const AUTH_NEXT_COOKIE = 'starlocal_auth_next';
export const AUTH_ADMIN_NEXT_COOKIE = 'starlocal_admin_auth_next';

/** Magic link validity — 15 minutes (OPDRACHT 80). */
export const MAGIC_LINK_TTL_SECONDS = 15 * 60;

/** Session cookie validity — 30 days. */
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

export const AUTH_ROUTES = {
  login: '/login/',
  adminLogin: '/admin/login/',
  adminCheckEmail: '/admin/check-email/',
  adminDefault: '/admin/websites/',
  checkEmail: '/check-email/',
  magic: '/auth/magic/',
  adminMagic: '/auth/admin-magic/',
  logout: '/logout/',
  dashboard: '/dashboard/',
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
