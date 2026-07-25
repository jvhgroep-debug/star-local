import type { Municipality } from '../netherlands/types';
import type { ComposedPageContent } from '../../content-engine';

export type { LocationFaq, LocationInternalLink } from './legacy-aliases';

/** City offer page content — composed by the Content Engine. */
export interface WebsiteLatenMakenCityContent {
  municipality: Municipality;
  canonicalPath: string;
  composed: ComposedPageContent;
  seo: ComposedPageContent['seo'];
  h1: string;
  eyebrow: string;
  heroSubtitle: string;
  intro: string;
  description: string;
  populationLabel: string;
  audiences: string[];
  audienceIntro: string;
  localSection: ComposedPageContent['localSection'];
  whyUs: ComposedPageContent['whyUs'];
  services: ComposedPageContent['services'];
  localSeo: ComposedPageContent['localSeo'];
  package: ComposedPageContent['package'];
  cta: ComposedPageContent['cta'];
  breadcrumbs: ComposedPageContent['breadcrumbs'];
  faqs: ComposedPageContent['faqs'];
  internalLinks: ComposedPageContent['internalLinks'];
  neighborLinks: ComposedPageContent['neighborLinks'];
  nearbyNames: string[];
  nationalLink: ComposedPageContent['nationalLink'];
  schema: ComposedPageContent['schema'];
}
