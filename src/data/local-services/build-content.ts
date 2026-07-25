import gemeentes from '../gemeentes.json';
import { getEnrichment } from '../gemeentes/enrichment';
import { getNeighbors } from '../gemeentes/build-content';
import {
  businessAreasText,
  defaultDistricts,
  getEconomicTraits,
  pick,
  buildSectors,
  traitsSummary,
} from '../gemeentes/content-variations';
import type { GemeenteRecord } from '../gemeentes/types';
import {
  getLocalServiceImagePath,
  getLocalServicePath,
  LOCAL_TO_NATIONAL_SLUG,
} from './config';
import { getServiceDefinition, LOCAL_SERVICE_SLUGS, SERVICE_DEFINITIONS } from './services';
import type { LocalServicePageContent, LocalServiceRelated } from './types';

const CTA = {
  primaryLabel: 'Gratis advies aanvragen',
  secondaryLabel: 'Bekijk onze werkwijze',
} as const;

const SERVICE_DISPLAY_NAMES: Record<string, string> = Object.fromEntries(
  SERVICE_DEFINITIONS.map((s) => [s.slug, s.name]),
);

function getProvincie(gemeente: GemeenteRecord): string {
  const enrichment = getEnrichment(gemeente.slug);
  if (enrichment?.provincie) return enrichment.provincie;
  if (gemeente.provincie && gemeente.provincie !== 'Nederland') return gemeente.provincie;
  return 'Nederland';
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

function variationKey(citySlug: string, serviceSlug: string): string {
  return `${citySlug}:${serviceSlug}`;
}

function getDistricts(gemeente: GemeenteRecord): string[] {
  const enrichment = getEnrichment(gemeente.slug);
  if (enrichment?.districts?.length) return enrichment.districts.slice(0, 10);
  return defaultDistricts(gemeente.naam, gemeente.slug);
}

function relatedLink(
  citySlug: string,
  cityName: string,
  relatedSlug: string,
  descriptionTemplate: string,
): LocalServiceRelated {
  const relatedName = SERVICE_DISPLAY_NAMES[relatedSlug] ?? relatedSlug;
  return {
    title: `${relatedName} ${cityName}`,
    href: getLocalServicePath(citySlug, relatedSlug),
    description: fillTemplate(descriptionTemplate, {
      city: cityName,
      relatedServiceName: relatedName,
    }),
  };
}

function buildMetaDescription(templates: string[], vars: Record<string, string>, key: string): string {
  const template = pick(templates, key);
  let desc = fillTemplate(template, vars);
  if (desc.length > 160) desc = desc.slice(0, 157) + '…';
  if (desc.length < 130) {
    desc = `${vars.serviceName} in ${vars.city}? Star Local helpt ondernemers in ${vars.province} met ${vars.serviceName.toLowerCase()}, lokale vindbaarheid en een online aanpak die converteert.`;
  }
  if (desc.length < 130) {
    desc = `${vars.serviceName} in ${vars.city}? Star Local bouwt voor ondernemers in ${vars.province} een sterke online basis met lokale SEO, snelheid en duidelijke contactroutes.`;
  }
  if (desc.length > 160) desc = desc.slice(0, 157) + '…';
  return desc;
}

function buildSeoTitle(service: ReturnType<typeof getServiceDefinition>, vars: Record<string, string>, key: string): string {
  return fillTemplate(pick(service!.seoTitleTemplates, key), vars);
}

export function buildLocalServicePageContent(
  gemeente: GemeenteRecord,
  serviceSlug: string,
): LocalServicePageContent | undefined {
  const service = getServiceDefinition(serviceSlug);
  if (!service) return undefined;

  const city = gemeente.naam;
  const citySlug = gemeente.slug;
  const province = getProvincie(gemeente);
  const districts = getDistricts(gemeente);
  const district = districts[0] ?? `Centrum ${city}`;
  const district2 = districts[1] ?? district;
  const businessArea = businessAreasText(city, citySlug);
  const traits = getEconomicTraits(province, citySlug);
  const traitsText = traitsSummary(traits, citySlug);
  const neighbors = getNeighbors(gemeente, 6);
  const neighborNames = neighbors.map((n) => n.naam).slice(0, 3).join(', ');
  const vKey = variationKey(citySlug, serviceSlug);
  const sectorItems = buildSectors(province, citySlug, traits).map((s) => s.toLowerCase());

  const vars: Record<string, string> = {
    city,
    province,
    district,
    district2,
    businessArea,
    traits: traitsText,
    serviceName: service.name,
    neighborNames,
  };

  return {
    city,
    citySlug,
    province,
    serviceName: service.name,
    serviceSlug: service.slug,
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG[service.slug] ?? service.slug,
    seo: {
      title: buildSeoTitle(service, vars, vKey),
      description: buildMetaDescription(service.metaDescriptionTemplates, vars, vKey),
    },
    hero: {
      label: `Star Local · ${service.name} · ${city}`,
      h1: fillTemplate(service.h1Template, vars),
      intro: fillTemplate(pick(service.heroIntroTemplates, vKey), vars),
    },
    serviceIntro: {
      title: fillTemplate(service.serviceIntroTitleTemplate, vars),
      paragraphs: service.serviceIntroParagraphs.map((template, i) =>
        fillTemplate(template, {
          ...vars,
          district: pick(districts, vKey, i),
          district2: pick(districts, vKey, i + 1),
        }),
      ),
    },
    localProblem: {
      title: fillTemplate(service.localProblemTitleTemplate, vars),
      paragraphs: service.localProblemParagraphs.map((template, i) =>
        fillTemplate(template, { ...vars, district: pick(districts, vKey, i) }),
      ),
    },
    localSolution: {
      title: fillTemplate(service.localSolutionTitleTemplate, vars),
      paragraphs: service.localSolutionParagraphs.map((template) => fillTemplate(template, vars)),
    },
    benefits: service.benefits.map((benefit, i) => ({
      icon: benefit.icon,
      title: benefit.title,
      description: fillTemplate(benefit.descriptionTemplate, {
        ...vars,
        district: pick(districts, vKey, i),
      }),
    })),
    processSteps: service.processSteps.map((step) => ({
      number: step.number,
      title: step.title,
      description: fillTemplate(step.descriptionTemplate, vars),
    })),
    industries: {
      title: fillTemplate(service.industriesTitleTemplate, vars),
      items: sectorItems,
      paragraphs: service.industriesParagraphs.map((template) => fillTemplate(template, vars)),
    },
    districts: {
      title: fillTemplate(service.districtsTitleTemplate, vars),
      intro: fillTemplate(service.districtsIntroTemplate, { ...vars, district, district2 }),
      items: districts,
    },
    relatedServices: service.relatedSlugs.map((relatedSlug) =>
      relatedLink(citySlug, city, relatedSlug, service.relatedDescriptionTemplate),
    ),
    faqs: service.faqTemplates.map((faq, i) => ({
      question: fillTemplate(faq.questionTemplate, {
        ...vars,
        district: pick(districts, vKey, i),
      }),
      answer: fillTemplate(faq.answerTemplate, vars),
    })),
    neighbors,
    image: getLocalServiceImagePath(service.slug),
    imageAlt: fillTemplate(service.imageAltTemplate, vars),
    bottomCta: {
      title: fillTemplate(service.bottomCtaTitleTemplate, vars),
      text: fillTemplate(service.bottomCtaTextTemplate, vars),
      ...CTA,
    },
  };
}

export function getAllLocalServicePages(): LocalServicePageContent[] {
  return (gemeentes as GemeenteRecord[]).flatMap((gemeente) =>
    LOCAL_SERVICE_SLUGS.map((slug) => buildLocalServicePageContent(gemeente, slug)!),
  );
}

export { LOCAL_SERVICE_SLUGS, SERVICE_DEFINITIONS };
