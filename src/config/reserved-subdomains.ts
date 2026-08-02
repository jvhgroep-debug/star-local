export const RESERVED_SUBDOMAINS = [
  'www',
  'app',
  'api',
  'admin',
  'dashboard',
  'account',
  'auth',
  'login',
  'signup',
  'register',
  'mail',
  'email',
  'smtp',
  'ftp',
  'cdn',
  'assets',
  'static',
  'media',
  'images',
  'support',
  'help',
  'status',
  'billing',
  'payments',
  'checkout',
  'docs',
  'blog',
  'shop',
  'store',
  'dev',
  'staging',
  'test',
  'preview',
  'workers',
  'pages',
  'cloudflare',
  'starlocal',
] as const;

const RESERVED_SET = new Set<string>(RESERVED_SUBDOMAINS);

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/\s+/g, '');
}

/** Returns true when the slug matches a reserved Star Local subdomain. */
export function isReservedSubdomain(slug: string): boolean {
  const normalized = normalizeSlug(slug);
  if (!normalized) return true;
  return RESERVED_SET.has(normalized);
}
