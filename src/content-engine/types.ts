/**
 * Shared context for the pSEO Content Engine.
 * Location Engine feeds municipality data into this shape.
 */
export type ContentLanguage = 'nl' | 'en';

export interface NearbyCity {
  name: string;
  slug: string;
}

export interface ContentServiceItem {
  title: string;
  text: string;
}

export interface ContentFaqItem {
  question: string;
  answer: string;
}

export interface ContentLink {
  label: string;
  href: string;
}

export interface ContentBreadcrumb {
  label: string;
  href?: string;
}

export interface ContentCta {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  whatsappHref: string;
  contactNote: string;
  heading: string;
  body: string;
}

/** Normalized input for every content module. */
export interface LocationContext {
  city: string;
  citySlug: string;
  province: string;
  population: number;
  postalCodes: string;
  nearbyCities: NearbyCity[];
  country: string;
  countryCode: string;
  language: ContentLanguage;
  latitude?: number;
  longitude?: number;
  canonicalPath: string;
  pageUrl: string;
  serviceName: string;
  serviceSlug: string;
  offerPrice: number;
}

export type CitySizeBand = 'small' | 'medium' | 'large' | 'metro';

export interface OfferPackageBlock {
  title: string;
  text: string;
}

/** Fully composed page payload from all content modules. */
export interface ComposedPageContent {
  context: LocationContext;
  sizeBand: CitySizeBand;
  populationLabel: string;
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  h1: string;
  eyebrow: string;
  heroSubtitle: string;
  intro: string;
  audiences: string[];
  audienceIntro: string;
  localSection: {
    heading: string;
    paragraphs: string[];
  };
  whyUs: {
    heading: string;
    paragraphs: string[];
    points: string[];
  };
  services: {
    heading: string;
    intro: string;
    items: ContentServiceItem[];
  };
  localSeo: {
    heading: string;
    paragraphs: string[];
  };
  package: {
    trustItems: string[];
    included: OfferPackageBlock[];
    fivePages: OfferPackageBlock[];
    steps: OfferPackageBlock[];
    notIncluded: string[];
  };
  faqs: ContentFaqItem[];
  cta: ContentCta;
  breadcrumbs: ContentBreadcrumb[];
  internalLinks: ContentLink[];
  /** Only links to routes that exist in this offer cluster / preview set. */
  neighborLinks: ContentLink[];
  /** Nearby names for prose only (may not have offer routes yet). */
  nearbyNames: string[];
  nationalLink: ContentLink;
  schema: Record<string, unknown>[];
  variationIds: Record<string, number>;
}
