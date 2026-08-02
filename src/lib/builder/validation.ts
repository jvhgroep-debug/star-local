import type { BuilderState, ValidationResult } from '../../types/builder';
import { getSlugPreview } from './slug';
import { isValidHexColor } from './colors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasPhoneValue(value: string): boolean {
  return value.replace(/\D/g, '').length >= 9;
}

export function validateStep1(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};
  const { business } = state;

  if (!business.name.trim()) {
    errors.name = 'Vul uw bedrijfsnaam in.';
  } else {
    const slug = getSlugPreview(business.name);
    if (!slug.available) {
      errors.name = slug.message;
    }
  }

  if (!business.industry.trim()) {
    errors.industry = 'Kies een branche.';
  }

  if (business.description.trim().length < 20) {
    errors.description = 'Vul een korte omschrijving in (minimaal 20 tekens).';
  }

  const validServices = business.services.filter((service) => service.title.trim());
  if (validServices.length === 0) {
    errors.services = 'Voeg minimaal één dienst toe.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};
  const { contact } = state;

  if (!hasPhoneValue(contact.phone) && !hasPhoneValue(contact.whatsapp)) {
    errors.phone = 'Vul een telefoon- of WhatsAppnummer in.';
    errors.whatsapp = 'Vul een telefoon- of WhatsAppnummer in.';
  }

  if (!contact.email.trim()) {
    errors.email = 'Vul uw e-mailadres in.';
  } else if (!EMAIL_PATTERN.test(contact.email.trim())) {
    errors.email = 'Vul een geldig e-mailadres in.';
  }

  if (!contact.city.trim()) {
    errors.city = 'Vul uw plaats in.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(state: BuilderState): ValidationResult {
  const errors: Record<string, string> = {};

  state.hours.forEach((day, index) => {
    if (day.closed || day.open24) return;
    if (!day.openTime || !day.closeTime) {
      errors[`hours-${index}`] = `Vul openingstijden in voor ${day.day}.`;
      return;
    }
    if (day.openTime >= day.closeTime) {
      errors[`hours-${index}`] = `Sluitingstijd moet na openingstijd liggen voor ${day.day}.`;
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep4(
  state: BuilderState,
  hasLogo: boolean,
  photoCount: number,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!hasLogo) {
    errors.logo = 'Upload uw logo (JPG, PNG of WebP, max. 5 MB).';
  }

  if (photoCount === 0) {
    errors.photos = 'Upload minimaal één foto (maximaal vijf).';
  }

  if (!isValidHexColor(state.branding.primaryColor)) {
    errors.primaryColor = 'Kies een geldige primaire kleur.';
  }

  if (!isValidHexColor(state.branding.accentColor)) {
    errors.accentColor = 'Kies een geldige accentkleur.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAll(
  state: BuilderState,
  hasLogo: boolean,
  photoCount: number,
): ValidationResult {
  const steps = [
    validateStep1(state),
    validateStep2(state),
    validateStep3(state),
    validateStep4(state, hasLogo, photoCount),
  ];

  const errors = steps.reduce<Record<string, string>>((acc, step) => ({ ...acc, ...step.errors }), {});
  return { valid: Object.keys(errors).length === 0, errors };
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
