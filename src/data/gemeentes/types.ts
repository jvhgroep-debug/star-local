export interface GemeenteRecord {

  naam: string;

  slug: string;

  provincie: string;

}



export interface GemeenteNeighbor {

  naam: string;

  slug: string;

}



export interface GemeenteServiceCard {

  title: string;

  description: string;

  href: string;

  image: string;

  imageAlt: string;

}



export interface GemeenteFAQ {

  question: string;

  answer: string;

}



export type GemeenteBenefitIcon =

  | 'speed'

  | 'design'

  | 'seo'

  | 'mobile'

  | 'communication'

  | 'scale'

  | 'custom'

  | 'growth';



export interface GemeenteBenefit {

  icon: GemeenteBenefitIcon;

  title: string;

  description: string;

}



export interface GemeenteStat {

  value: string;

  label: string;

}



export interface GemeenteStep {

  number: string;

  title: string;

  description: string;

}



export interface GemeenteTextSection {

  title: string;

  paragraphs: string[];

}



export interface GemeentePageContent {

  slug: string;

  naam: string;

  provincie: string;

  seo: {

    title: string;

    description: string;

  };

  hero: {

    h1: string;

    intro: string;

    eyebrow: string;

  };

  services: GemeenteServiceCard[];

  localIntro: GemeenteTextSection;

  whyWebsite: GemeenteTextSection;

  localSeo: GemeenteTextSection;

  nationalGrowth: GemeenteTextSection;

  aboutCity: GemeenteTextSection;

  industries: GemeenteTextSection & { sectors: string[] };

  whyStarLocal: GemeenteTextSection;

  districts: {

    title: string;

    intro: string;

    items: string[];

    businessAreas: string[];

    landmarks: string[];

  };

  usps: GemeenteBenefit[];

  steps: GemeenteStep[];

  stats: GemeenteStat[];

  cityHighlights: GemeenteBenefit[];

  faqs: GemeenteFAQ[];

  neighbors: GemeenteNeighbor[];

  bottomCta: {

    title: string;

    text: string;

    primaryLabel: string;

    secondaryLabel: string;

  };

}



export interface GemeenteCityProfile {

  slug: string;

  naam: string;

  provincie: string;

  seoDescription: string;

  heroIntro: string;

  businessIntro: string[];

  websiteImportance: string[];

  localSeoContent: string[];

  nationalGrowthContent: string[];

  marketDescription: string[];

  districts: string[];

  districtsIntro?: string;

  sectors: string[];

  industriesContent: string[];

  whyStarLocal: string[];

  faqs: GemeenteFAQ[];

  neighbors: GemeenteNeighbor[];

  usps?: GemeenteBenefit[];

  cityHighlights?: GemeenteBenefit[];

  bottomCta?: Partial<GemeentePageContent['bottomCta']>;

}


