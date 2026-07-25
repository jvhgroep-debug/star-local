import {
  WEBSITE_OFFER_FIVE_PAGES,
  WEBSITE_OFFER_INCLUDED,
  WEBSITE_OFFER_NOT_INCLUDED,
  WEBSITE_OFFER_STEPS,
  WEBSITE_OFFER_TRUST,
  WEBSITE_OFFER_WHY,
} from '../data/offers/website-laten-maken';
import { SITE } from '../data/site';
import type { Municipality } from '../data/netherlands/types';
import { getCitySizeBand } from './context';
import { formatPopulation } from './hash';
import { buildSeoTitle } from './seo-title';
import { buildMetaDescription } from './meta-description';
import { buildH1 } from './h1';
import { buildIntro } from './intro';
import { buildWhyUs } from './why-us';
import { buildLocalSeo } from './local-seo';
import { buildFaq } from './faq';
import { buildCta } from './cta';
import { buildSchema } from './schema';
import { buildBreadcrumbs } from './breadcrumbs';
import { buildInternalLinks } from './internal-links';
import { getCityOfferProfile } from './profiles/nl-website-offer';
import type { ComposedPageContent, ContentLanguage, LocationContext } from './types';

export interface ComposePageOptions {
  language?: ContentLanguage;
  serviceName?: string;
  serviceSlug?: string;
  offerPrice?: number;
  canonicalPath: string;
  enabledCitySlugs: string[];
  /** True when every municipality page is generated (full NL rollout). */
  allPagesGenerated?: boolean;
  resolveCityHref: (slug: string) => string;
  resolveCityLabel?: (slug: string) => string;
}

const COUNTRY_NAMES: Record<string, { nl: string; en: string }> = {
  NL: { nl: 'Nederland', en: 'the Netherlands' },
};

const CITY_LABELS: Record<string, string> = {
  amsterdam: 'Amsterdam',
  rotterdam: 'Rotterdam',
  breda: 'Breda',
};

export function municipalityToContext(
  municipality: Municipality,
  options: ComposePageOptions,
): LocationContext {
  const language = options.language ?? 'nl';
  const countryCode = municipality.countryCode;
  const country = COUNTRY_NAMES[countryCode]?.[language] ?? countryCode;
  const canonicalPath = options.canonicalPath.endsWith('/')
    ? options.canonicalPath
    : `${options.canonicalPath}/`;

  return {
    city: municipality.naam,
    citySlug: municipality.slug,
    province: municipality.provincie,
    population: municipality.inwonersaantal,
    postalCodes: municipality.postcodegebied,
    nearbyCities: municipality.omliggendeGemeenten.map((n) => ({
      name: n.naam,
      slug: n.slug,
    })),
    country,
    countryCode,
    language,
    latitude: municipality.latitude,
    longitude: municipality.longitude,
    canonicalPath,
    pageUrl: `${SITE.url}${canonicalPath}`,
    serviceName: options.serviceName ?? 'Website laten maken',
    serviceSlug: options.serviceSlug ?? 'website-laten-maken',
    offerPrice: options.offerPrice ?? 199,
  };
}

export function composePage(
  ctx: LocationContext,
  options: Pick<
    ComposePageOptions,
    'enabledCitySlugs' | 'allPagesGenerated' | 'resolveCityHref' | 'resolveCityLabel'
  >,
): ComposedPageContent {
  const profile = getCityOfferProfile(ctx.citySlug);
  const seoTitle = buildSeoTitle(ctx);
  const meta = buildMetaDescription(ctx);
  const heading = buildH1(ctx);
  const intro = buildIntro(ctx);
  const whyUs = buildWhyUs(ctx);
  const localSeo = buildLocalSeo(ctx);
  const faq = buildFaq(ctx);
  const cta = buildCta(ctx);
  const links = buildInternalLinks(ctx, {
    contactHref: cta.cta.primaryHref,
    enabledCitySlugs: options.enabledCitySlugs,
    allPagesGenerated: options.allPagesGenerated ?? false,
    resolveCityHref: options.resolveCityHref,
    resolveCityLabel:
      options.resolveCityLabel ?? ((slug) => CITY_LABELS[slug] ?? slug),
  });

  const audiences = profile?.audiences ?? [
    'zzp’ers',
    'starters',
    'horeca',
    'retail',
    'lokale dienstverleners',
  ];

  const audienceIntro = profile
    ? `Dit pakket past bij ondernemers in ${ctx.city} die een professionele basiswebsite nodig hebben zonder direct duizenden euro’s te investeren — denk aan ${profile.sectorFocus}.`
    : `Dit pakket is bedoeld voor ondernemers in ${ctx.city} die een professionele basiswebsite nodig hebben zonder direct duizenden euro’s te investeren.`;

  return {
    context: ctx,
    sizeBand: getCitySizeBand(ctx.population),
    populationLabel: formatPopulation(ctx.population, ctx.language),
    seo: {
      title: seoTitle.title,
      description: meta.description,
      ogTitle: `Website laten maken ${ctx.city} voor €${ctx.offerPrice} | Star Local`,
      ogDescription: meta.ogDescription,
    },
    h1: heading.h1,
    eyebrow: heading.eyebrow,
    heroSubtitle: heading.heroSubtitle,
    intro: intro.intro,
    audiences,
    audienceIntro,
    localSection: {
      heading: localSeo.heading,
      paragraphs: localSeo.paragraphs,
    },
    whyUs: {
      heading: whyUs.heading,
      paragraphs: whyUs.paragraphs,
      points: [...WEBSITE_OFFER_WHY],
    },
    services: {
      heading: `Diensten voor ondernemers in ${ctx.city}`,
      intro: `Het €${ctx.offerPrice}-pakket is de basis. Later kun je uitbreiden met SEO of extra pagina’s.`,
      items: WEBSITE_OFFER_INCLUDED.map((item) => ({ title: item.title, text: item.text })),
    },
    localSeo: {
      heading: localSeo.heading,
      paragraphs: localSeo.paragraphs,
    },
    package: {
      trustItems: [...WEBSITE_OFFER_TRUST],
      included: WEBSITE_OFFER_INCLUDED.map((item) => ({ ...item })),
      fivePages: WEBSITE_OFFER_FIVE_PAGES.map((item) => ({ ...item })),
      steps: WEBSITE_OFFER_STEPS.map((item) => ({ ...item })),
      notIncluded: [...WEBSITE_OFFER_NOT_INCLUDED],
    },
    faqs: faq.faqs,
    cta: cta.cta,
    breadcrumbs: buildBreadcrumbs(ctx),
    internalLinks: links.internalLinks,
    neighborLinks: links.neighborLinks,
    nearbyNames: links.nearbyNames,
    nationalLink: links.nationalLink,
    schema: buildSchema(ctx, {
      seoTitle: seoTitle.title,
      seoDescription: meta.description,
      faqs: faq.faqs,
    }),
    variationIds: {
      seoTitle: seoTitle.variationId,
      meta: meta.variationId,
      h1: heading.variationId,
      intro: intro.variationId,
      whyUs: whyUs.variationId,
      localSeo: localSeo.variationId,
      faq: faq.variationId,
      cta: cta.variationId,
      links: links.variationId,
    },
  };
}

export function composePageFromMunicipality(
  municipality: Municipality,
  options: ComposePageOptions,
): ComposedPageContent {
  const ctx = municipalityToContext(municipality, options);
  return composePage(ctx, options);
}
