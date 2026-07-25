import { buildGemeentePageFromProfile } from './content/factory';
import { getLocalServiceHrefForGemeenteCard } from '../local-services/local-service-links';

import { TOP20_LOCAL_AREAS, TOP20_NEIGHBORS } from './content/top20-local-areas';

import { TOP20_CITY_PROFILES } from './content/top20-cities';

import { amsterdamGemeenteContent } from './content/amsterdam';

import { bredaGemeenteContent } from './content/breda';

import { buildGemeenteContent } from './build-content';

import type { GemeentePageContent, GemeenteRecord } from './types';



export const TOP20_GEMEENTE_SLUGS = [

  'amsterdam',

  'rotterdam',

  'den-haag',

  'utrecht',

  'eindhoven',

  'groningen',

  'tilburg',

  'almere',

  'breda',

  'nijmegen',

  'apeldoorn',

  'arnhem',

  'haarlem',

  'haarlemmermeer',

  'zaanstad',

  'amersfoort',

  'enschede',

  's-hertogenbosch',

  'zwolle',

  'leiden',

] as const;



function applyLocalServiceLinks(content: GemeentePageContent): GemeentePageContent {
  return {
    ...content,
    services: content.services.map((service) => ({
      ...service,
      href: getLocalServiceHrefForGemeenteCard(content.slug, service.href),
    })),
  };
}

function applyTop20Enrichment(content: GemeentePageContent): GemeentePageContent {

  const areas = TOP20_LOCAL_AREAS[content.slug];

  const neighbors = TOP20_NEIGHBORS[content.slug];



  if (!areas && !neighbors) return content;



  const needsAreas = areas && content.districts.businessAreas.length === 0;



  return {

    ...content,

    districts: needsAreas

      ? {

          ...content.districts,

          businessAreas: areas.businessAreas,

          landmarks: areas.landmarks,

        }

      : content.districts,

    localSeo:

      needsAreas && areas.localSeoExtra.length

        ? {

            ...content.localSeo,

            paragraphs: [...content.localSeo.paragraphs, ...areas.localSeoExtra],

          }

        : content.localSeo,

    neighbors: neighbors ?? content.neighbors,

  };

}



const TOP20_PROFILE_CONTENT = Object.fromEntries(

  TOP20_CITY_PROFILES.map((profile) => [

    profile.slug,

    applyTop20Enrichment(buildGemeentePageFromProfile(profile)),

  ]),

) as Record<string, GemeentePageContent>;



const CUSTOM_CONTENT: Record<string, GemeentePageContent> = {

  amsterdam: applyTop20Enrichment(amsterdamGemeenteContent),

  breda: applyTop20Enrichment(bredaGemeenteContent),

  ...TOP20_PROFILE_CONTENT,

};



export function getGemeentePageContent(gemeente: GemeenteRecord): GemeentePageContent {
  const content = CUSTOM_CONTENT[gemeente.slug] ?? buildGemeenteContent(gemeente);
  return applyLocalServiceLinks(content);
}



export function hasCustomGemeentePage(slug: string): boolean {

  return slug in CUSTOM_CONTENT;

}



export function isTop20Gemeente(slug: string): boolean {

  return (TOP20_GEMEENTE_SLUGS as readonly string[]).includes(slug);

}



export function getTop20DatasetCount(): number {

  return Object.keys(CUSTOM_CONTENT).length;

}


