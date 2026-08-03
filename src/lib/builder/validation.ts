import type { BuilderState, ValidationResult } from '../../types/builder';
import { BUILDER_INDUSTRIES } from './constants';
import { getSlugPreview } from './slug';
import { isValidHexColor } from './colors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;

function hasPhoneValue(value: string): boolean {
  return value.replace(/\D/g, '').length >= 9;
}

/** Stap 1 — Bedrijfsgegevens */
export function validateStep1(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};
  const { business, contact } = state;

  if (!business.name.trim()) {
    errors.name = 'Vul uw bedrijfsnaam in.';
  } else {
    const slug = getSlugPreview(business.name);
    if (!slug.available) {
      errors.name = slug.message;
    }
  }

  const industry = business.industry.trim();
  if (!industry) {
    errors.industry = 'Kies een categorie (branche).';
  } else if (!BUILDER_INDUSTRIES.some((item) => item.toLowerCase() === industry.toLowerCase())) {
    errors.industry = 'Kies een categorie uit de lijst.';
  }

  if (!hasPhoneValue(contact.phone)) {
    errors.phone = 'Vul een geldig telefoonnummer in.';
  }

  if (!contact.email.trim()) {
    errors.email = 'Vul uw e-mailadres in.';
  } else if (!EMAIL_PATTERN.test(contact.email.trim())) {
    errors.email = 'Vul een geldig e-mailadres in.';
  }

  const website = contact.website.trim();
  if (website && !WEBSITE_PATTERN.test(website)) {
    errors.website = 'Vul een geldige website-URL in (bijv. www.uwbedrijf.nl).';
  }

  if (!contact.street.trim()) {
    errors.street = 'Vul uw adres in (straat en huisnummer).';
  }

  if (!contact.city.trim()) {
    errors.city = 'Vul uw plaats in.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Stap 2 — Huisstijl */
export function validateStep2(state: BuilderState, hasLogo: boolean): ValidationResult {
  const errors: Record<string, string> = {};

  if (!hasLogo) {
    errors.logo = 'Upload uw logo (JPG, PNG of WebP, max. 5 MB).';
  }

  if (!isValidHexColor(state.branding.primaryColor)) {
    errors.primaryColor = 'Kies een geldige hoofdkleur.';
  }

  if (!isValidHexColor(state.branding.accentColor)) {
    errors.accentColor = 'Kies een geldige accentkleur.';
  }

  if (!state.design.fontFamily) {
    errors.fontFamily = 'Kies een lettertype.';
  }

  if (!state.design.buttonStyle) {
    errors.buttonStyle = 'Kies een knopstijl.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Stap 3 — Pagina's */
export function validateStep3(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};
  const enabledCount = Object.values(state.enabledPages).filter(Boolean).length;

  if (!state.enabledPages.home) {
    errors.pages = 'De homepagina is verplicht en kan niet worden uitgeschakeld.';
  } else if (enabledCount === 0) {
    errors.pages = 'Schakel minimaal één pagina in.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Stap 4 — Diensten */
export function validateStep4(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};
  const validServices = state.business.services.filter((service) => service.title.trim());

  if (validServices.length === 0) {
    errors.services = 'Voeg minimaal één dienst toe.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Stap 5 — Openingstijden */
export function validateStep5(_state: BuilderState): ValidationResult {
  return { valid: true, errors: {} };
}

/** Stap 6 — SEO */
export function validateStep6(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};

  if (!state.heroTitle.trim()) {
    errors.seoTitle = 'Vul een SEO-titel in.';
  } else if (state.heroTitle.trim().length > 70) {
    errors.seoTitle = 'SEO-titel mag maximaal 70 tekens zijn.';
  }

  if (!state.seoMetaDescription.trim()) {
    errors.seoMetaDescription = 'Vul een meta description in.';
  } else if (state.seoMetaDescription.trim().length > 160) {
    errors.seoMetaDescription = 'Meta description mag maximaal 160 tekens zijn.';
  }

  if (!state.business.description.trim()) {
    errors.businessDescription = 'Vul een bedrijfsomschrijving in.';
  } else if (state.business.description.trim().length < 40) {
    errors.businessDescription = 'Bedrijfsomschrijving moet minimaal 40 tekens bevatten.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Stap 7 — Voorbeeld (geen validatie) */
export function validateStep7(_state: BuilderState): ValidationResult {
  return { valid: true, errors: {} };
}

/** Stap 8 — Afronden (geen stap-validatie) */
export function validateStep8(_state: BuilderState): ValidationResult {
  return { valid: true, errors: {} };
}

export function validateAll(state: BuilderState, hasLogo: boolean): ValidationResult {
  const steps = [
    validateStep1(state),
    validateStep2(state, hasLogo),
    validateStep3(state),
    validateStep4(state),
    validateStep5(state),
    validateStep6(state),
  ];

  const errors = steps.reduce<Record<string, string>>((acc, step) => ({ ...acc, ...step.errors }), {});
  return { valid: Object.keys(errors).length === 0, errors };
}

export function firstInvalidStep(state: BuilderState, hasLogo: boolean): number {
  const validators = [
    () => validateStep1(state),
    () => validateStep2(state, hasLogo),
    () => validateStep3(state),
    () => validateStep4(state),
    () => validateStep5(state),
    () => validateStep6(state),
  ];

  for (let index = 0; index < validators.length; index += 1) {
    const result = validators[index]();
    if (!result.valid) return index + 1;
  }

  return 1;
}

export function validatePublishEmail(email: string, expected: string): ValidationResult {
  const errors: Record<string, string> = {};
  const normalized = email.trim().toLowerCase();
  const expectedNormalized = expected.trim().toLowerCase();

  if (!normalized) {
    errors.publishEmail = 'Bevestig uw e-mailadres.';
  } else if (!EMAIL_PATTERN.test(normalized)) {
    errors.publishEmail = 'Vul een geldig e-mailadres in.';
  } else if (normalized !== expectedNormalized) {
    errors.publishEmail = 'Het e-mailadres komt niet overeen met uw contactgegevens.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
