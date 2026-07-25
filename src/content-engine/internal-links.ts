import type { ContentLink, LocationContext } from './types';

export interface InternalLinksInput {
  contactHref: string;
  /** Preview allowlist; ignored when allPagesGenerated is true. */
  enabledCitySlugs: string[];
  /** When true, every municipality route exists — link real nearby cities. */
  allPagesGenerated: boolean;
  resolveCityHref: (slug: string) => string;
  resolveCityLabel: (slug: string) => string;
}

export function buildInternalLinks(
  ctx: LocationContext,
  input: InternalLinksInput,
): {
  internalLinks: ContentLink[];
  neighborLinks: ContentLink[];
  nationalLink: ContentLink;
  nearbyNames: string[];
  variationId: number;
} {
  const nationalLink: ContentLink = {
    label: 'Bekijk het landelijke websitepakket',
    href: `/${ctx.serviceSlug}/`,
  };

  const nearbyNames = ctx.nearbyCities.slice(0, 5).map((n) => n.name);

  let neighborSource = ctx.nearbyCities.filter((n) => n.slug !== ctx.citySlug);

  if (!input.allPagesGenerated) {
    neighborSource = neighborSource.filter((n) => input.enabledCitySlugs.includes(n.slug));
    // Preview fallback: link other enabled test cities when no nearby overlap
    if (neighborSource.length === 0) {
      neighborSource = input.enabledCitySlugs
        .filter((slug) => slug !== ctx.citySlug)
        .slice(0, 5)
        .map((slug) => ({
          name: input.resolveCityLabel(slug),
          slug,
        }));
    }
  }

  const neighborLinks = neighborSource.slice(0, 5).map((neighbor) => ({
    label: `Website laten maken ${neighbor.name}`,
    href: input.resolveCityHref(neighbor.slug),
  }));

  const internalLinks: ContentLink[] = [
    nationalLink,
    ...neighborLinks,
    { label: 'Contact', href: input.contactHref },
  ];

  return {
    internalLinks,
    neighborLinks,
    nationalLink,
    nearbyNames,
    variationId: 0,
  };
}
