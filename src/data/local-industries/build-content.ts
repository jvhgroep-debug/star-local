import gemeentes from '../gemeentes.json';
import { getEnrichment } from '../gemeentes/enrichment';
import { defaultDistricts, pick } from '../gemeentes/content-variations';
import type { GemeenteRecord } from '../gemeentes/types';
import { getLocalIndustryPath } from './config';
import { getIndustryDefinition, INDUSTRY_DEFINITIONS, INDUSTRY_SLUGS } from './industries';
import { getLocalServicePath, getLocalServiceImagePath } from '../local-services/config';
import type {
  IndustryLocalServicePageContent,
  IndustryLocalServiceRelated,
} from './types';

const SERVICE_NAME = 'Website laten maken';
const SERVICE_SLUG = 'website-laten-maken';
const NATIONAL_SERVICE_SLUG = 'website-laten-maken';
const SERVICE_IMAGE = getLocalServiceImagePath(SERVICE_SLUG);

const CTA = {
  primaryLabel: 'Gratis advies aanvragen',
  secondaryLabel: 'Bekijk onze werkwijze',
} as const;

const RELATED_LOCAL_SERVICE_SLUGS = ['lokale-seo', 'conversie-optimalisatie', 'technische-seo'] as const;

const RELATED_LOCAL_SERVICE_LABELS: Record<(typeof RELATED_LOCAL_SERVICE_SLUGS)[number], string> = {
  'lokale-seo': 'Lokale SEO',
  'conversie-optimalisatie': 'Conversie-optimalisatie',
  'technische-seo': 'Technische SEO',
};

const RELATED_LOCAL_SERVICE_DESCRIPTIONS: Record<(typeof RELATED_LOCAL_SERVICE_SLUGS)[number], string> = {
  'lokale-seo': 'Zorg dat klanten in {city} u vinden via Google en Google Maps.',
  'conversie-optimalisatie': 'Meer aanvragen uit hetzelfde bezoekersaantal met sterkere CTA\'s en een soepeler contactproces.',
  'technische-seo': 'Een snelle, technisch sterke basis zodat uw website optimaal presteert in zoekmachines.',
};

function getProvincie(gemeente: GemeenteRecord): string {
  const enrichment = getEnrichment(gemeente.slug);
  if (enrichment?.provincie) return enrichment.provincie;
  if (gemeente.provincie && gemeente.provincie !== 'Nederland') return gemeente.provincie;
  return 'Nederland';
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

function variationKey(citySlug: string, industrySlug: string, offset = 0): string {
  return `${citySlug}:${industrySlug}:${offset}`;
}

function getDistricts(gemeente: GemeenteRecord): string[] {
  const enrichment = getEnrichment(gemeente.slug);
  if (enrichment?.districts?.length) return enrichment.districts.slice(0, 10);
  return defaultDistricts(gemeente.naam, gemeente.slug);
}

function industryLink(
  citySlug: string,
  industrySlug: string,
  title: string,
  description: string,
): IndustryLocalServiceRelated {
  return {
    title,
    href: getLocalIndustryPath(citySlug, SERVICE_SLUG, industrySlug),
    description,
  };
}

function localServiceLink(
  citySlug: string,
  serviceSlug: string,
  title: string,
  description: string,
): IndustryLocalServiceRelated {
  return {
    title,
    href: getLocalServicePath(citySlug, serviceSlug),
    description,
  };
}

function buildMetaDescription(
  templates: string[],
  vars: Record<string, string>,
  key: string,
): string {
  const template = pick(templates, key);
  let desc = fillTemplate(template, vars);
  if (desc.length > 160) desc = desc.slice(0, 157) + '…';
  if (desc.length < 130) {
    desc = `Website voor ${vars.industryPluralLower} in ${vars.city} laten maken? Star Local bouwt snelle, conversiegerichte websites met lokale SEO.`;
  }
  return desc.length > 160 ? desc.slice(0, 157) + '…' : desc;
}

function buildSeoTitle(naam: string, industryPluralLower: string): string {
  return `Website voor ${industryPluralLower} in ${naam} laten maken | Star Local`;
}

export function buildIndustryLocalServicePageContent(
  gemeente: GemeenteRecord,
  industrySlug: string,
): IndustryLocalServicePageContent | undefined {
  const industry = getIndustryDefinition(industrySlug);
  if (!industry) return undefined;

  const city = gemeente.naam;
  const citySlug = gemeente.slug;
  const province = getProvincie(gemeente);
  const districts = getDistricts(gemeente);
  const district = districts[0] ?? `Centrum ${city}`;
  const district2 = districts[1] ?? districts[0] ?? city;
  const vKey = variationKey(citySlug, industrySlug);

  const vars: Record<string, string> = {
    city,
    province,
    district,
    district2,
    industrySingular: industry.nameSingular,
    industryPluralLower: industry.namePluralLower,
    industryName: industry.name,
  };

  const heroIntro = fillTemplate(pick(industry.heroIntroTemplates, vKey), vars);

  return {
    city,
    citySlug,
    province,
    serviceName: SERVICE_NAME,
    serviceSlug: SERVICE_SLUG,
    nationalServiceSlug: NATIONAL_SERVICE_SLUG,
    industryName: industry.name,
    industrySlug: industry.slug,
    seo: {
      title: buildSeoTitle(city, industry.namePluralLower),
      description: buildMetaDescription(industry.metaDescriptionTemplates, vars, vKey),
    },
    hero: {
      label: `Star Local · Website · ${city} · ${industry.name}`,
      h1: `Website laten maken voor ${industry.namePluralLower} in ${city}`,
      intro: heroIntro,
    },
    localIntro: {
      title: `Een website voor uw ${industry.nameSingular} in ${city}`,
      paragraphs: industry.localIntroParagraphs.map((template, i) =>
        fillTemplate(template, { ...vars, district: pick(districts, vKey, i), district2: pick(districts, vKey, i + 1) }),
      ),
    },
    whyImportant: {
      title: `Waarom een goede website belangrijk is voor uw ${industry.nameSingular}`,
      paragraphs: industry.whyImportantParagraphs.map((template, i) =>
        fillTemplate(template, { ...vars, district: pick(districts, vKey, i) }),
      ),
    },
    industryChallenges: {
      title: `Veelvoorkomende problemen bij ${industry.namePluralLower}-websites`,
      paragraphs: industry.challengesParagraphs.map((template) => fillTemplate(template, vars)),
    },
    websiteRequirements: {
      title: `Wat een goede ${industry.nameSingular}-website nodig heeft`,
      paragraphs: [fillTemplate(industry.requirementsIntro, vars)],
      items: industry.websiteRequirements,
    },
    benefits: industry.benefits.map((benefit, i) => ({
      icon: benefit.icon,
      title: benefit.title,
      description: fillTemplate(benefit.descriptionTemplate, {
        ...vars,
        district: pick(districts, vKey, i),
      }),
    })),
    features: {
      title: `Functionaliteiten voor uw ${industry.nameSingular}-website`,
      items: industry.features,
    },
    processSteps: industry.processSteps.map((step) => ({
      number: step.number,
      title: step.title,
      description: fillTemplate(step.descriptionTemplate, vars),
    })),
    localAreas: {
      title: `Website voor ${industry.namePluralLower} in heel ${city}`,
      intro: fillTemplate(
        `Of u nu actief bent in {district}, {district2} of een andere wijk in {city}: Star Local bouwt een website die klanten uit heel {city} aantrekt.`,
        { ...vars, district, district2 },
      ),
      items: districts,
    },
    relatedIndustries: industry.relatedSlugs.map((relatedSlug) => {
      const related = getIndustryDefinition(relatedSlug)!;
      return industryLink(
        citySlug,
        relatedSlug,
        `Website voor ${related.namePluralLower} in ${city}`,
        fillTemplate(industry.relatedIndustryDescriptionTemplate, {
          city,
          industrySingular: related.nameSingular,
          industryPluralLower: related.namePluralLower,
        }),
      );
    }),
    relatedLocalServices: RELATED_LOCAL_SERVICE_SLUGS.map((slug) =>
      localServiceLink(
        citySlug,
        slug,
        `${RELATED_LOCAL_SERVICE_LABELS[slug]} ${city}`,
        fillTemplate(RELATED_LOCAL_SERVICE_DESCRIPTIONS[slug], { city }),
      ),
    ),
    faqs: industry.faqTemplates.map((faq, i) => ({
      question: fillTemplate(faq.questionTemplate, { ...vars, district: pick(districts, vKey, i) }),
      answer: fillTemplate(faq.answerTemplate, vars),
    })),
    image: SERVICE_IMAGE,
    imageAlt: `Website laten maken voor ${industry.namePluralLower} in ${city} — Star Local`,
    bottomCta: {
      title: fillTemplate(industry.bottomCtaTitleTemplate, vars),
      text: fillTemplate(industry.bottomCtaTextTemplate, vars),
      ...CTA,
    },
  };
}

export function getIndustryLinksForService(citySlug: string, cityName: string): IndustryLocalServiceRelated[] {
  return INDUSTRY_DEFINITIONS.map((industry) =>
    industryLink(
      citySlug,
      industry.slug,
      `Website voor ${industry.namePluralLower}`,
      fillTemplate(industry.relatedIndustryDescriptionTemplate, {
        city: cityName,
        industrySingular: industry.nameSingular,
        industryPluralLower: industry.namePluralLower,
      }),
    ),
  );
}

export function getAllIndustryLocalServicePages(): IndustryLocalServicePageContent[] {
  return (gemeentes as GemeenteRecord[]).flatMap((gemeente) =>
    INDUSTRY_SLUGS.map((industrySlug) => buildIndustryLocalServicePageContent(gemeente, industrySlug)!),
  );
}

export { INDUSTRY_SLUGS, INDUSTRY_DEFINITIONS };
