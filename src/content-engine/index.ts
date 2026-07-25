/**
 * Star Local pSEO Content Engine
 *
 * Modular, template-based page composition.
 * No AI calls yet — see ./ai/enhance.ts for the future hook.
 */

export type {
  CitySizeBand,
  ComposedPageContent,
  ContentBreadcrumb,
  ContentCta,
  ContentFaqItem,
  ContentLanguage,
  ContentLink,
  ContentServiceItem,
  LocationContext,
  NearbyCity,
} from './types';

export { composePage, composePageFromMunicipality, municipalityToContext } from './compose';
export type { ComposePageOptions } from './compose';

export { buildSeoTitle } from './seo-title';
export { buildMetaDescription } from './meta-description';
export { buildH1 } from './h1';
export { buildIntro } from './intro';
export { buildWhyUs } from './why-us';
export { buildServices } from './services';
export { buildLocalSeo } from './local-seo';
export { buildFaq } from './faq';
export { buildCta } from './cta';
export { buildSchema } from './schema';
export { buildBreadcrumbs } from './breadcrumbs';
export { buildInternalLinks } from './internal-links';
export { enhanceWithAi } from './ai/enhance';
export type { AiEnhanceOptions } from './ai/enhance';
export { getCitySizeBand, getEconomicTraits } from './context';
export { formatPopulation, pick, hashSeed } from './hash';
