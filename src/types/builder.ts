export interface BuilderService {
  id: string;
  title: string;
  description: string;
}

export interface DayHours {
  day: string;
  dayKey: DayKey;
  closed: boolean;
  open24: boolean;
  openTime: string;
  closeTime: string;
}

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface BuilderBusiness {
  name: string;
  industry: string;
  description: string;
  services: BuilderService[];
}

export interface BuilderContact {
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  street: string;
  postcode: string;
  city: string;
  country: string;
  kvk: string;
}

export interface BuilderLocation {
  gemeenteSlug: string;
  gemeenteNaam: string;
  provincie: string;
}

export interface BuilderBranding {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  logoName: string;
  photoNames: string[];
  heroImageName: string;
  socialImageName: string;
}

export type BuilderFontFamily = 'system' | 'serif' | 'modern' | 'display';
export type BuilderButtonStyle = 'solid' | 'soft' | 'outline';
export type BuilderCornerRadius = 'sharp' | 'rounded' | 'pill';
export type BuilderShadowLevel = 'none' | 'soft' | 'medium';

export interface BuilderDesignSettings {
  fontFamily: BuilderFontFamily;
  buttonStyle: BuilderButtonStyle;
  cornerRadius: BuilderCornerRadius;
  shadow: BuilderShadowLevel;
}

export const DEFAULT_DESIGN_SETTINGS: BuilderDesignSettings = {
  fontFamily: 'system',
  buttonStyle: 'solid',
  cornerRadius: 'rounded',
  shadow: 'soft',
};

export type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PreviewPage = 'home' | 'about' | 'services' | 'contact' | 'privacy';

export type EnabledPages = Record<PreviewPage, boolean>;

export const DEFAULT_ENABLED_PAGES: EnabledPages = {
  home: true,
  about: true,
  services: true,
  contact: true,
  privacy: true,
};

import type { PublicationStatus, WebsitePackage } from './website-config';

export type BuilderView = 'builder' | 'preview' | 'publish' | 'publish-success' | 'save-success' | 'generate-success';

export interface BuilderState {
  version: 1;
  currentStep: BuilderStep;
  view: BuilderView;
  previewPage: PreviewPage;
  business: BuilderBusiness;
  contact: BuilderContact;
  location: BuilderLocation;
  hours: DayHours[];
  branding: BuilderBranding;
  publicationStatus: PublicationStatus;
  selectedPackage: WebsitePackage;
  publishEmailConfirmed: string;
  publishedAt: string | null;
  ctaQuoteLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  seoMetaDescription: string;
  enabledPages: EnabledPages;
  design: BuilderDesignSettings;
  heroPlaceholder: string;
  galleryPlaceholders: string[];
}

export interface BuilderFileMeta {
  logoObjectUrl: string | null;
  photoObjectUrls: string[];
  logoMissingAfterReload: boolean;
  photosMissingAfterReload: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
