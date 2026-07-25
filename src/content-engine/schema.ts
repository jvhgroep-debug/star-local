import { SITE } from '../data/site';
import type { ContentFaqItem, LocationContext } from './types';

export function buildSchema(
  ctx: LocationContext,
  input: {
    seoTitle: string;
    seoDescription: string;
    faqs: ContentFaqItem[];
  },
): Record<string, unknown>[] {
  const offer = {
    '@type': 'Offer',
    price: ctx.offerPrice,
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: ctx.offerPrice,
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
    },
    description: `Eenmalige actieprijs voor een standaard website met maximaal 5 pagina’s voor ondernemers in ${ctx.city}. Prijs exclusief btw.`,
    url: ctx.pageUrl,
    availability: 'https://schema.org/InStock',
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.seoTitle,
    description: input.seoDescription,
    url: ctx.pageUrl,
    inLanguage: 'nl-NL',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
    },
    about: {
      '@type': 'City',
      name: ctx.city,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: ctx.province,
      },
      ...(ctx.latitude != null && ctx.longitude != null
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: ctx.latitude,
              longitude: ctx.longitude,
            },
          }
        : {}),
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${ctx.serviceName} ${ctx.city}`,
    description: input.seoDescription,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      telephone: SITE.phoneRaw,
    },
    areaServed: {
      '@type': 'City',
      name: ctx.city,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: ctx.province,
      },
    },
    offers: offer,
  };

  const offerSchema = {
    '@context': 'https://schema.org',
    ...offer,
    name: `Website laten maken ${ctx.city} – 5 pagina’s`,
    seller: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return [webPageSchema, serviceSchema, offerSchema, faqSchema];
}
