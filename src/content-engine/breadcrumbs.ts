import type { ContentBreadcrumb, LocationContext } from './types';

/** Home > Website laten maken > Gemeente */
export function buildBreadcrumbs(ctx: LocationContext): ContentBreadcrumb[] {
  return [
    { label: 'Home', href: '/' },
    { label: ctx.serviceName, href: `/${ctx.serviceSlug}/` },
    { label: ctx.city },
  ];
}
