import gemeentes from '../gemeentes.json';

import { getEnrichment } from './enrichment';

import { getGemeenteServices } from './shared-services';

import {

  buildCityHighlights,

  buildFaqs,

  buildIndustriesParagraphs,

  buildLocalIntroParagraphs,

  buildLocalSeoParagraphs,

  buildMarketParagraphs,

  buildNationalGrowthParagraphs,

  buildSectors,

  buildUsps,

  buildWhyStarLocalParagraphs,

  buildWhyWebsiteParagraphs,

  businessAreasText,

  defaultDistricts,

  generateBusinessAreas,

  generateLandmarks,

  getEconomicTraits,

  hashSlug,

  retailAreasText,

  uniqueHeroIntro,

  uniqueMetaDescription,

} from './content-variations';

import type {

  GemeenteNeighbor,

  GemeentePageContent,

  GemeenteRecord,

  GemeenteStat,

  GemeenteStep,

} from './types';



function getProvincie(gemeente: GemeenteRecord): string {

  const enrichment = getEnrichment(gemeente.slug);

  if (enrichment?.provincie) return enrichment.provincie;

  if (gemeente.provincie && gemeente.provincie !== 'Nederland') return gemeente.provincie;

  return 'Nederland';

}



export function getNeighbors(gemeente: GemeenteRecord, count = 7): GemeenteNeighbor[] {

  const provincie = getProvincie(gemeente);

  const sameProv = (gemeentes as GemeenteRecord[]).filter(

    (g) => g.slug !== gemeente.slug && getProvincie(g) === provincie,

  );

  const pool =

    sameProv.length >= count

      ? sameProv

      : (gemeentes as GemeenteRecord[]).filter((g) => g.slug !== gemeente.slug);



  const sorted = [...pool].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));

  const offset = hashSlug(gemeente.slug) % Math.max(1, sorted.length - count + 1);

  return sorted.slice(offset, offset + count).map((g) => ({ naam: g.naam, slug: g.slug }));

}



function buildSteps(naam: string): GemeenteStep[] {

  return [

    {

      number: '01',

      title: 'Kennismaking',

      description: `We bespreken uw doelen, markt in ${naam} en wat uw website concreet moet opleveren.`,

    },

    {

      number: '02',

      title: 'Design & bouw',

      description: 'Professioneel ontwerp, snelle Astro-techniek en content die bij uw merk past.',

    },

    {

      number: '03',

      title: 'Lancering',

      description: `Livegang met lokale SEO-basis — zichtbaar in ${naam} vanaf dag één.`,

    },

    {

      number: '04',

      title: 'Groei',

      description: 'Optimaliseren en uitbreiden wanneer u nieuwe wijken of diensten toevoegt.',

    },

  ];

}



function buildStats(): GemeenteStat[] {

  return [

    { value: '< 2s', label: 'Typische laadtijd op mobiel' },

    { value: '8', label: 'Diensten onder één dak' },

    { value: '100%', label: 'Mobile-first ontwerp' },

    { value: 'NL', label: 'Lokaal én landelijk inzetbaar' },

  ];

}



export function buildGemeenteContent(gemeente: GemeenteRecord): GemeentePageContent {

  const { naam, slug } = gemeente;

  const provincie = getProvincie(gemeente);

  const traits = getEconomicTraits(provincie, slug);

  const business = businessAreasText(naam, slug);

  const retail = retailAreasText(naam, slug);



  return {

    slug,

    naam,

    provincie,

    seo: {

      title: `Website laten maken ${naam} | Lokale SEO | Star Local`,

      description: uniqueMetaDescription(naam, provincie, slug, traits),

    },

    hero: {

      eyebrow: `Star Local · ${naam}`,

      h1: `Website laten maken in ${naam}`,

      intro: uniqueHeroIntro(naam, slug, traits),

    },

    services: getGemeenteServices(naam),

    localIntro: {

      title: `Ondernemen in ${naam}`,

      paragraphs: buildLocalIntroParagraphs(naam, slug, provincie, traits, business),

    },

    whyWebsite: {

      title: `Waarom een professionele website belangrijk is in ${naam}`,

      paragraphs: buildWhyWebsiteParagraphs(naam, slug),

    },

    localSeo: {

      title: `Lokaal gevonden worden in ${naam}`,

      paragraphs: buildLocalSeoParagraphs(naam, slug),

    },

    nationalGrowth: {

      title: 'Van lokale zichtbaarheid naar landelijke groei',

      paragraphs: buildNationalGrowthParagraphs(naam, slug, provincie),

    },

    aboutCity: {

      title: `${naam} als ondernemersmarkt`,

      paragraphs: buildMarketParagraphs(naam, slug, traits, retail),

    },

    industries: {

      title: `Voor welke bedrijven wij werken in ${naam}`,

      paragraphs: buildIndustriesParagraphs(naam, slug, traits),

      sectors: buildSectors(provincie, slug, traits),

    },

    whyStarLocal: {

      title: 'Waarom Star Local',

      paragraphs: buildWhyStarLocalParagraphs(naam, slug, provincie),

    },

    districts: {

      title: `Wijken en belangrijke gebieden in ${naam}`,

      intro: `Online zichtbaarheid in ${naam} is niet alleen een centrum-verhaal. Star Local ondersteunt ondernemers in heel de gemeente.`,

      items: defaultDistricts(naam, slug),

      businessAreas: generateBusinessAreas(naam, slug),

      landmarks: generateLandmarks(naam, slug),

    },

    usps: buildUsps(naam, slug),

    steps: buildSteps(naam),

    stats: buildStats(),

    cityHighlights: buildCityHighlights(naam, provincie, slug),

    faqs: buildFaqs(naam, provincie, slug),

    neighbors: getNeighbors(gemeente),

    bottomCta: {

      title: `Klaar om online te groeien in ${naam}?`,

      text: `Laat een professionele website bouwen die lokaal zichtbaar is in ${naam}. Vraag een vrijblijvend gesprek aan — we denken graag met u mee.`,

      primaryLabel: 'Gratis offerte',

      secondaryLabel: 'Neem contact op',

    },

  };

}


