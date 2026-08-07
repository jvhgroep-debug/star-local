import { defineMiddleware } from 'astro:middleware';
import type { D1Database } from './lib/db/d1';
import {
  adminForbiddenRedirect,
  adminForbiddenJson,
  adminUnauthorizedJson,
  isAdminApiPath,
  isAdminAuthRedirect,
  isAdminForbidden,
  isAdminPagePath,
  isAdminPublicAuthPath,
  requireAdminSession,
} from './lib/auth/admin-guard';
import {
  getSubdomainFromHostname,
  isPotentialTenantHostname,
  isStarLocalAppHostname,
} from './lib/tenancy/hostname';
import { serveDevTenantPreview } from './lib/tenancy/dev-tenant-preview';
import { serveTenantSiteRequest } from './lib/tenancy/serve-tenant-site';
import { renderTenantErrorPage } from './lib/tenancy/tenant-error-page';

const isDev = import.meta.env.DEV;

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') ?? '';
  const url = new URL(context.request.url);
  const db = context.locals.runtime?.env?.DB as D1Database | undefined;

  if (
    (isAdminPagePath(url.pathname) || isAdminApiPath(url.pathname)) &&
    !isAdminPublicAuthPath(url.pathname)
  ) {
    const auth = await requireAdminSession(context.request, db, url);

    if (isAdminApiPath(url.pathname)) {
      if (isAdminAuthRedirect(auth)) return adminUnauthorizedJson();
      if (isAdminForbidden(auth)) return adminForbiddenJson();
    } else {
      if (isAdminAuthRedirect(auth)) return context.redirect(auth.redirect);
      if (isAdminForbidden(auth)) return context.redirect(adminForbiddenRedirect());
    }
  }

  // app.starlocal.nl / app.localhost → dashboard (redirect root to /dashboard/)
  if (isStarLocalAppHostname(host)) {
    const url = new URL(context.request.url);
    if (url.pathname === '/' || url.pathname === '') {
      return context.redirect('/dashboard/');
    }
    return next();
  }

  if (!isPotentialTenantHostname(host)) {
    return next();
  }

  const slug = getSubdomainFromHostname(host);
  const tenantDb = context.locals.runtime?.env?.DB;
  const media = context.locals.runtime?.env?.MEDIA;

  if (tenantDb && media) {
    return serveTenantSiteRequest(context.request, tenantDb, media);
  }

  // Dev preview without D1/R2 (e.g. bakkerij-de-markt.localhost:4322)
  if (isDev && slug) {
    const preview = serveDevTenantPreview(slug, context.request);
    if (preview) return preview;
  }

  if (slug) {
    return renderTenantErrorPage('bindings_missing', { slug });
  }

  return next();
});
