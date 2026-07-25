/**
 * Location Engine rollout switchboard.
 *
 * Keep `generateAllCities` false until the city template and content are approved.
 * Preview slugs are built so /website-laten-maken/{city} can be verified first.
 */
export const LOCATION_ENGINE = {
  countryCode: 'NL' as const,
  countrySlug: 'netherlands',
  serviceSlug: 'website-laten-maken',
  basePath: '/website-laten-maken',
  /** When true, getStaticPaths builds every municipality in the cleaned dataset. */
  generateAllCities: true,
  /** Limited mock/preview set for engine verification. */
  previewCitySlugs: ['amsterdam', 'rotterdam', 'breda'] as const,
} as const;

export type PreviewCitySlug = (typeof LOCATION_ENGINE.previewCitySlugs)[number];

export function isCityPageEnabled(slug: string): boolean {
  if (LOCATION_ENGINE.generateAllCities) return true;
  return (LOCATION_ENGINE.previewCitySlugs as readonly string[]).includes(slug);
}

export function getEnabledCitySlugs(): string[] {
  if (LOCATION_ENGINE.generateAllCities) {
    return []; // caller should load all municipality slugs
  }
  return [...LOCATION_ENGINE.previewCitySlugs];
}

/** Canonical path for a city landing page under the Location Engine. */
export function getCityOfferPath(citySlug: string): string {
  return `${LOCATION_ENGINE.basePath}/${citySlug}/`;
}
