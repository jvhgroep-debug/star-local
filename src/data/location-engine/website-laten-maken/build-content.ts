import { composePageFromMunicipality } from '../../../content-engine';
import type { Municipality } from '../../netherlands';
import {
  getCityOfferPath,
  getEnabledCitySlugs,
  LOCATION_ENGINE,
} from '../config';
import type { WebsiteLatenMakenCityContent } from '../types';

const CITY_LABELS: Record<string, string> = {
  amsterdam: 'Amsterdam',
  rotterdam: 'Rotterdam',
  breda: 'Breda',
};

/**
 * Build city landing content via the pSEO Content Engine.
 * Only used for the Website laten maken (€199) offer cluster.
 */
export function buildWebsiteLatenMakenCityContent(
  municipality: Municipality,
): WebsiteLatenMakenCityContent {
  const canonicalPath = getCityOfferPath(municipality.slug);
  const composed = composePageFromMunicipality(municipality, {
    language: 'nl',
    serviceName: 'Website laten maken',
    serviceSlug: LOCATION_ENGINE.serviceSlug,
    offerPrice: 199,
    canonicalPath,
    enabledCitySlugs: getEnabledCitySlugs(),
    allPagesGenerated: LOCATION_ENGINE.generateAllCities,
    resolveCityHref: getCityOfferPath,
    resolveCityLabel: (slug) =>
      CITY_LABELS[slug] ??
      municipality.omliggendeGemeenten.find((n) => n.slug === slug)?.naam ??
      slug,
  });

  return {
    municipality,
    canonicalPath,
    composed,
    seo: composed.seo,
    h1: composed.h1,
    eyebrow: composed.eyebrow,
    heroSubtitle: composed.heroSubtitle,
    intro: composed.intro,
    description: composed.localSection.paragraphs.join('\n\n'),
    populationLabel: composed.populationLabel,
    audiences: composed.audiences,
    audienceIntro: composed.audienceIntro,
    localSection: composed.localSection,
    whyUs: composed.whyUs,
    services: composed.services,
    localSeo: composed.localSeo,
    package: composed.package,
    cta: composed.cta,
    breadcrumbs: composed.breadcrumbs,
    faqs: composed.faqs,
    internalLinks: composed.internalLinks,
    neighborLinks: composed.neighborLinks,
    nearbyNames: composed.nearbyNames,
    nationalLink: composed.nationalLink,
    schema: composed.schema,
  };
}
