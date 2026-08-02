import type { DayKey } from '../../types/builder';
import type { PublishWebsitePayload } from '../../types/publish';
import { getSlugPreview } from '../builder/slug';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasPhoneValue(value: string): boolean {
  return value.replace(/\D/g, '').length >= 9;
}

export function validatePublishPayload(payload: PublishWebsitePayload): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const { business, contact, hours, branding, publishEmail } = payload;

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

  if (!hasPhoneValue(contact.phone) && !hasPhoneValue(contact.whatsapp)) {
    errors.phone = 'Vul een telefoon- of WhatsAppnummer in.';
  }

  if (!contact.email.trim()) {
    errors.email = 'Vul uw e-mailadres in.';
  } else if (!EMAIL_PATTERN.test(contact.email.trim())) {
    errors.email = 'Vul een geldig e-mailadres in.';
  }

  if (!contact.city.trim()) {
    errors.city = 'Vul uw plaats in.';
  }

  const normalizedPublishEmail = publishEmail.trim().toLowerCase();
  if (!normalizedPublishEmail) {
    errors.publishEmail = 'Bevestig uw e-mailadres.';
  } else if (!EMAIL_PATTERN.test(normalizedPublishEmail)) {
    errors.publishEmail = 'Vul een geldig e-mailadres in.';
  } else if (normalizedPublishEmail !== contact.email.trim().toLowerCase()) {
    errors.publishEmail = 'Het e-mailadres komt niet overeen met uw contactgegevens.';
  }

  hours.forEach((day, index) => {
    if (day.closed || day.open24) return;
    if (!day.openTime || !day.closeTime) {
      errors[`hours-${index}`] = `Vul openingstijden in voor ${day.day}.`;
      return;
    }
    if (day.openTime >= day.closeTime) {
      errors[`hours-${index}`] = `Sluitingstijd moet na openingstijd liggen voor ${day.day}.`;
    }
  });

  if (!payload.hasLogo) {
    errors.logo = 'Upload uw logo (JPG, PNG of WebP, max. 5 MB).';
  }

  if (payload.photoCount === 0) {
    errors.photos = 'Upload minimaal één foto (maximaal vijf).';
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(branding.primaryColor)) {
    errors.primaryColor = 'Kies een geldige primaire kleur.';
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(branding.accentColor)) {
    errors.accentColor = 'Kies een geldige accentkleur.';
  }

  if (!payload.siteArtifacts) {
    errors.publish = 'Gegenereerde websitebestanden ontbreken.';
  } else {
    const requiredPages = ['home', 'about', 'services', 'contact', 'privacy'] as const;
    for (const page of requiredPages) {
      if (!payload.siteArtifacts.documents[page]?.trim()) {
        errors.publish = `Gegenereerd HTML-document ontbreekt voor pagina "${page}".`;
        break;
      }
    }
    if (!payload.siteArtifacts.sitemap?.trim()) errors.publish = 'Gegenereerde sitemap ontbreekt.';
    if (!payload.siteArtifacts.robots?.trim()) errors.publish = 'Gegenereerde robots.txt ontbreekt.';
    if (!payload.siteArtifacts.manifest?.trim()) errors.publish = 'Gegenereerd manifest ontbreekt.';
    if (!payload.siteArtifacts.faviconSvg?.trim()) errors.publish = 'Gegenereerde favicon ontbreekt.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

const DAY_KEY_TO_WEEKDAY: Record<DayKey, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function dayKeyToWeekday(dayKey: DayKey): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  return DAY_KEY_TO_WEEKDAY[dayKey];
}
