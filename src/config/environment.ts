/** Central environment configuration — no hardcoded secrets. */

export const PRODUCTION_APP_BASE_URL = 'https://www.starlocal.nl';
export const PRODUCTION_DASHBOARD_BASE_URL = 'https://app.starlocal.nl';
export const PRODUCTION_TENANT_BASE_DOMAIN = 'starlocal.nl';

export type RuntimeEnvironment = 'development' | 'staging' | 'production';

export function getRuntimeEnvironment(): RuntimeEnvironment {
  const env = readPlainEnv('ENVIRONMENT');
  if (env === 'staging') return 'staging';
  if (env === 'production') return 'production';
  if (import.meta.env.PROD && !env) return 'production';
  return 'development';
}

export function isProductionRuntime(): boolean {
  return getRuntimeEnvironment() === 'production';
}

export function isStagingRuntime(): boolean {
  return getRuntimeEnvironment() === 'staging';
}

/** Read plain-text env from Astro schema or Cloudflare [vars]. */
export function readPlainEnv(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function getAppBaseUrl(fallbackOrigin?: string): string {
  return readPlainEnv('APP_BASE_URL') ?? fallbackOrigin ?? PRODUCTION_APP_BASE_URL;
}

export function getDashboardBaseUrl(fallbackOrigin?: string): string {
  return readPlainEnv('DASHBOARD_BASE_URL') ?? fallbackOrigin ?? PRODUCTION_DASHBOARD_BASE_URL;
}

export function getTenantBaseDomain(): string {
  return readPlainEnv('TENANT_BASE_DOMAIN') ?? PRODUCTION_TENANT_BASE_DOMAIN;
}

export function getMediaPublicBaseUrl(): string | undefined {
  const value = readPlainEnv('MEDIA_PUBLIC_BASE_URL');
  if (!value || value.includes('REPLACE_WITH')) return undefined;
  return value.replace(/\/$/, '');
}
