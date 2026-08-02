import { isReservedSubdomain } from '../../config/reserved-subdomains';

export const STARLOCAL_ROOT_DOMAIN = 'starlocal.nl';

const MARKETING_HOSTNAMES = new Set(['starlocal.nl', 'www.starlocal.nl', 'localhost']);

const APP_HOSTNAMES = new Set(['app.starlocal.nl', 'app.localhost']);

/** Known tenant-capable root domains (local dev included). */
const TENANT_ROOT_DOMAINS = ['starlocal.nl', 'starlocal.local', 'localhost'] as const;

/** Strip port, lowercase, trim, remove trailing dot. */
export function normalizeHostname(hostname: string): string {
  let host = hostname.trim().toLowerCase();
  if (!host) return host;

  if (host.endsWith('.')) {
    host = host.slice(0, -1);
  }

  // IPv6 literals may contain colons; only strip a trailing :port for non-bracket hosts.
  if (!host.startsWith('[')) {
    const lastColon = host.lastIndexOf(':');
    if (lastColon > -1 && host.indexOf(':') === lastColon) {
      host = host.slice(0, lastColon);
    }
  }

  return host;
}

function extractSubdomainForRoot(host: string, root: string): string | null {
  if (host === root) return null;
  const suffix = `.${root}`;
  if (!host.endsWith(suffix)) return null;

  const prefix = host.slice(0, -suffix.length);
  if (!prefix || prefix.includes('.')) return null;

  return prefix;
}

/**
 * Returns the first-label subdomain for supported Star Local root domains.
 * Returns null for apex hosts and unrecognized domains.
 */
export function getSubdomainFromHostname(
  hostname: string,
  rootDomain: string = STARLOCAL_ROOT_DOMAIN,
): string | null {
  const host = normalizeHostname(hostname);
  const roots = new Set<string>([normalizeHostname(rootDomain), ...TENANT_ROOT_DOMAINS]);

  for (const root of roots) {
    const subdomain = extractSubdomainForRoot(host, root);
    if (subdomain !== null || host === root) {
      return subdomain;
    }
  }

  return null;
}

export function isStarLocalMarketingHostname(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return MARKETING_HOSTNAMES.has(host);
}

export function isStarLocalAppHostname(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return APP_HOSTNAMES.has(host);
}

function isSupportedTenantRoot(host: string): boolean {
  return TENANT_ROOT_DOMAINS.some((root) => host === root || host.endsWith(`.${root}`));
}

/**
 * True when hostname looks like a tenant site ({slug}.starlocal.nl or local dev equivalent)
 * and the slug is not reserved. External/custom domains return false in this phase.
 */
export function isPotentialTenantHostname(hostname: string): boolean {
  const host = normalizeHostname(hostname);

  if (isStarLocalMarketingHostname(host) || isStarLocalAppHostname(host)) {
    return false;
  }

  if (!isSupportedTenantRoot(host)) {
    return false;
  }

  const subdomain = getSubdomainFromHostname(host);
  if (!subdomain) return false;

  return !isReservedSubdomain(subdomain);
}
