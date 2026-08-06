import type { BuilderFontFamily, DayHours } from './builder';

export type WizardV2Step = 1 | 2 | 3;

export interface WizardV2SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface WizardV2State {
  version: 2;
  currentStep: WizardV2Step;
  businessName: string;
  industry: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  street: string;
  postcode: string;
  city: string;
  hours: DayHours[];
  social: WizardV2SocialLinks;
  primaryColor: string;
  accentColor: string;
  fontFamily: BuilderFontFamily;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
