import { TOP20_LOCAL_AREAS } from './top20-local-areas';
import { getGemeenteServices } from '../shared-services';

import type { GemeenteBenefit, GemeenteCityProfile, GemeentePageContent, GemeenteStep } from '../types';



function defaultUsps(naam: string): GemeenteBenefit[] {

  return [

    {

      icon: 'design',

      title: `Design voor ${naam}`,

      description: 'Uitstraling die past bij uw markt — geen generiek template.',

    },

    {

      icon: 'speed',

      title: 'Razendsnel op mobiel',

      description: 'Essentieel voor klanten die onderweg zoeken en direct vergelijken.',

    },

    {

      icon: 'seo',

      title: 'Lokaal zichtbaar',

      description: `Gevonden worden in ${naam} wanneer prospects naar uw dienst zoeken.`,

    },

    {

      icon: 'growth',

      title: 'Klaar om te schalen',

      description: `Van ${naam} naar de regio en verder — zonder opnieuw te beginnen.`,

    },

  ];

}



function defaultSteps(naam: string): GemeenteStep[] {

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



function defaultCityHighlights(naam: string): GemeenteBenefit[] {

  return [

    {

      icon: 'custom',

      title: `Kennis van ${naam}`,

      description: 'We begrijpen hoe lokale klanten in uw stad online zoeken en kiezen.',

    },

    {

      icon: 'communication',

      title: 'Persoonlijk contact',

      description: 'Direct schakelen, heldere planning, geen verrassingen achteraf.',

    },

    {

      icon: 'scale',

      title: 'Schaalbaar platform',

      description: `Eén website die meegroeit wanneer u buiten ${naam} uitbreidt.`,

    },

  ];

}



export function buildGemeentePageFromProfile(profile: GemeenteCityProfile): GemeentePageContent {

  const { naam, slug, provincie } = profile;
  const localAreas = TOP20_LOCAL_AREAS[slug];



  return {

    slug,

    naam,

    provincie,

    seo: {

      title: `Website laten maken ${naam} | Lokale SEO | Star Local`,

      description: profile.seoDescription,

    },

    hero: {

      eyebrow: `Star Local · ${naam}`,

      h1: `Website laten maken in ${naam}`,

      intro: profile.heroIntro,

    },

    services: getGemeenteServices(naam),

    localIntro: {

      title: `Ondernemen in ${naam}`,

      paragraphs: profile.businessIntro,

    },

    whyWebsite: {

      title: `Waarom een professionele website belangrijk is in ${naam}`,

      paragraphs: profile.websiteImportance,

    },

    localSeo: {

      title: `Lokaal gevonden worden in ${naam}`,

      paragraphs: [
        ...profile.localSeoContent,
        ...(localAreas?.localSeoExtra ?? []),
      ],

    },

    nationalGrowth: {

      title: 'Van lokale zichtbaarheid naar landelijke groei',

      paragraphs: profile.nationalGrowthContent,

    },

    aboutCity: {

      title: `${naam} als ondernemersmarkt`,

      paragraphs: profile.marketDescription,

    },

    industries: {

      title: `Voor welke bedrijven wij werken in ${naam}`,

      paragraphs: profile.industriesContent,

      sectors: profile.sectors,

    },

    whyStarLocal: {

      title: 'Waarom Star Local',

      paragraphs: profile.whyStarLocal,

    },

    districts: {

      title: `Wijken en belangrijke gebieden in ${naam}`,

      intro:

        profile.districtsIntro ??

        `Online zichtbaarheid in ${naam} is niet alleen een centrum-verhaal. Star Local ondersteunt ondernemers in heel de gemeente.`,

      items: profile.districts,

      businessAreas: localAreas?.businessAreas ?? [],

      landmarks: localAreas?.landmarks ?? [],

    },

    usps: profile.usps ?? defaultUsps(naam),

    steps: defaultSteps(naam),

    stats: [

      { value: '< 2s', label: 'Typische laadtijd op mobiel' },

      { value: '8', label: 'Diensten onder één dak' },

      { value: '100%', label: 'Mobile-first ontwerp' },

      { value: 'NL', label: 'Lokaal én landelijk inzetbaar' },

    ],

    cityHighlights: profile.cityHighlights ?? defaultCityHighlights(naam),

    faqs: profile.faqs,

    neighbors: profile.neighbors,

    bottomCta: {

      title: profile.bottomCta?.title ?? `Klaar om online te groeien in ${naam}?`,

      text:

        profile.bottomCta?.text ??

        `Laat een professionele website bouwen die lokaal zichtbaar is in ${naam}. Vraag een vrijblijvend gesprek aan — we denken graag met u mee.`,

      primaryLabel: profile.bottomCta?.primaryLabel ?? 'Gratis offerte',

      secondaryLabel: profile.bottomCta?.secondaryLabel ?? 'Neem contact op',

    },

  };

}


