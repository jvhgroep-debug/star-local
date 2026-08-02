import { defineMiddleware } from 'astro:middleware';
import { isPotentialTenantHostname } from './lib/tenancy/hostname';
import { serveTenantSiteRequest } from './lib/tenancy/serve-tenant-site';

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') ?? '';

  if (!isPotentialTenantHostname(host)) {
    return next();
  }

  const db = context.locals.runtime?.env?.DB;
  const media = context.locals.runtime?.env?.MEDIA;

  if (db && media) {
    const tenantResponse = await serveTenantSiteRequest(context.request, db, media);
    if (tenantResponse) return tenantResponse;
  }

  return next();
});
