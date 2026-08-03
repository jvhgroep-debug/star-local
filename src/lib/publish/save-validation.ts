import type { SaveWebsitePayload } from '../../types/save';
import { validateAll } from '../builder/validation';
import { normalizeBuilderSlug } from '../builder/slug';
import { isReservedSubdomain } from '../../config/reserved-subdomains';
import type { BuilderState } from '../../types/builder';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;

function payloadToBuilderState(payload: SaveWebsitePayload): BuilderState {
  return {
    version: 1,
    currentStep: 8,
    view: 'builder',
    previewPage: 'home',
    business: payload.business,
    contact: payload.contact,
    location: payload.location,
    hours: payload.hours,
    branding: {
      primaryColor: payload.branding.primaryColor,
      accentColor: payload.branding.accentColor,
      textColor: '#ffffff',
      logoName: payload.media.find((m) => m.kind === 'logo')?.filename ?? '',
      photoNames: payload.media.filter((m) => m.kind === 'photo').map((m) => m.filename),
      heroImageName: '',
      socialImageName: '',
    },
    publicationStatus: 'concept',
    selectedPackage: payload.package,
    publishEmailConfirmed: payload.contact.email.trim(),
    publishedAt: null,
    ctaQuoteLabel: 'Offerte aanvragen',
    heroTitle: payload.heroTitle?.trim() ?? '',
    heroSubtitle: payload.heroSubtitle?.trim() ?? '',
    seoMetaDescription: payload.seoMetaDescription?.trim() ?? '',
    enabledPages: payload.enabledPages ?? { home: true, about: true, services: true, contact: true, privacy: true },
    design: payload.design,
    heroPlaceholder: 'Hero-afbeelding placeholder',
    galleryPlaceholders: ['Galerij 1', 'Galerij 2', 'Galerij 3'],
  };
}

export function validateSavePayload(payload: SaveWebsitePayload): { valid: boolean; errors: Record<string, string> } {
  const state = payloadToBuilderState(payload);
  const hasLogo = payload.media.some((m) => m.kind === 'logo');
  const wizardValidation = validateAll(state, hasLogo);

  const errors = { ...wizardValidation.errors };

  const slug = normalizeBuilderSlug(payload.business.name);
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.name = errors.name ?? 'Voer een geldige bedrijfsnaam in voor uw website-adres.';
  }

  if (slug && isReservedSubdomain(slug)) {
    errors.name = 'Deze naam is niet beschikbaar. Kies een andere bedrijfsnaam.';
  }

  const website = payload.contact.website.trim();
  if (website && !WEBSITE_PATTERN.test(website)) {
    errors.website = 'Vul een geldige website-URL in.';
  }

  if (!payload.contact.email.trim() || !EMAIL_PATTERN.test(payload.contact.email.trim())) {
    errors.email = errors.email ?? 'Vul een geldig e-mailadres in.';
  }

  const logoCount = payload.media.filter((m) => m.kind === 'logo').length;
  const photoCount = payload.media.filter((m) => m.kind === 'photo').length;
  const socialCount = payload.media.filter((m) => m.kind === 'social').length;
  if (logoCount > 1) errors.logo = 'Upload maximaal één logo.';
  if (photoCount > 5) errors.photos = 'Upload maximaal vijf foto\'s.';
  if (socialCount > 1) errors.socialImage = 'Upload maximaal één social image.';

  for (const file of payload.media) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimeType)) {
      errors.logo = 'Alleen JPG, PNG of WebP is toegestaan.';
    }
    if (file.dataBase64.length > 7 * 1024 * 1024) {
      errors.logo = 'Bestand is te groot (max. 5 MB).';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
