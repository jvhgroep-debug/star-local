import { defineMiddleware } from 'astro:middleware';
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
  const db = context.locals.runtime?.env?.DB;
  const media = context.locals.runtime?.env?.MEDIA;

  if (db && media) {
    return serveTenantSiteRequest(context.request, db, media);
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
