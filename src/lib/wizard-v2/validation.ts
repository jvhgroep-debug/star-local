import type { WizardV2State, ValidationResult } from '../../types/wizard-v2';
import { BUILDER_INDUSTRIES } from './constants';
import { isValidHexColor } from '../builder/colors';
import { getSlugPreview } from '../builder/slug';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
const SOCIAL_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;

function hasPhoneValue(value: string): boolean {
  return value.replace(/\D/g, '').length >= 9;
}

export function validateWizardStep1(state: WizardV2State): ValidationResult {
  const errors: Record<string, string> = {};

  if (!state.businessName.trim()) {
    errors.businessName = 'Bedrijfsnaam is verplicht.';
  } else {
    const slug = getSlugPreview(state.businessName);
    if (!slug.available) errors.businessName = slug.message;
  }

  const industry = state.industry.trim();
  if (!industry) {
    errors.industry = 'Kies uw branche.';
  } else if (!BUILDER_INDUSTRIES.some((item) => item.toLowerCase() === industry.toLowerCase())) {
    errors.industry = 'Kies een branche uit de lijst.';
  }

  if (!state.description.trim()) {
    errors.description = 'Vul een korte omschrijving in.';
  }

  if (!hasPhoneValue(state.phone) && !hasPhoneValue(state.whatsapp)) {
    errors.phone = 'Vul telefoon of WhatsApp in.';
  }

  if (!state.email.trim()) {
    errors.email = 'E-mailadres is verplicht.';
  } else if (!EMAIL_PATTERN.test(state.email.trim())) {
    errors.email = 'Vul een geldig e-mailadres in.';
  }

  const website = state.website.trim();
  if (website && !WEBSITE_PATTERN.test(website)) {
    errors.website = 'Vul een geldige website-URL in.';
  }

  if (!state.street.trim()) errors.street = 'Adres is verplicht.';
  if (!state.city.trim()) errors.city = 'Plaats is verplicht.';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateWizardStep2(state: WizardV2State): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [key, value] of Object.entries(state.social)) {
    const trimmed = value.trim();
    if (trimmed && !SOCIAL_PATTERN.test(trimmed)) {
      errors[key] = 'Vul een geldige URL in.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateWizardStep3(state: WizardV2State): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isValidHexColor(state.primaryColor)) errors.primaryColor = 'Kies een geldige hoofdkleur.';
  if (!state.fontFamily) errors.fontFamily = 'Kies een lettertype.';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateWizardStep(step: WizardV2State['currentStep'], state: WizardV2State): ValidationResult {
  switch (step) {
    case 1:
      return validateWizardStep1(state);
    case 2:
      return validateWizardStep2(state);
    case 3:
      return validateWizardStep3(state);
    default:
      return { valid: true, errors: {} };
  }
}
