import { getAllMunicipalities, requireMunicipality } from '../../netherlands';
import { getEnabledCitySlugs, LOCATION_ENGINE } from '../config';
import { buildWebsiteLatenMakenCityContent } from './build-content';
import type { WebsiteLatenMakenCityContent } from '../types';

export function getWebsiteLatenMakenCityContent(citySlug: string): WebsiteLatenMakenCityContent {
  return buildWebsiteLatenMakenCityContent(requireMunicipality(citySlug));
}

/**
 * Static paths for /website-laten-maken/[city].
 * By default only preview cities are generated — never all 350 without approval.
 */
export function getWebsiteLatenMakenCityStaticPaths() {
  const slugs = LOCATION_ENGINE.generateAllCities
    ? getAllMunicipalities().map((m) => m.slug)
    : getEnabledCitySlugs();

  return slugs.map((city) => ({
    params: { city },
    props: {
      content: getWebsiteLatenMakenCityContent(city),
    },
  }));
}
