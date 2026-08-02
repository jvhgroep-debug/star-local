import type { BuilderState } from '../../types/builder';
import type { GeneratedCopy } from '../templates';
import { formatAddress, formatTelLink, futureDomain } from '../templates';
import type { BuilderFiles } from '../files';
import { getSlugPreview } from '../slug';
import { placeholderBusinessName } from '../placeholders';

/** Build LocalBusiness JSON-LD from generated website data. */
export function buildLocalBusinessSchema(
  state: BuilderState,
  files: BuilderFiles,
  copy: GeneratedCopy,
): Record<string, unknown> {
  const slug = getSlugPreview(state.business.name);
  const address = formatAddress(state);
  const phone = formatTelLink(state.contact.phone).replace('tel:', '') || undefined;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: placeholderBusinessName(state.business.name),
    description: copy.seoDescription,
    url: copy.canonicalUrl,
    image: files.photoUrls[0] ?? files.logoUrl ?? undefined,
    telephone: phone,
    email: state.contact.email.trim() || undefined,
    priceRange: '€€',
  };

  if (state.contact.street.trim() || state.contact.city.trim()) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: state.contact.street.trim() || undefined,
      postalCode: state.contact.postcode.trim() || undefined,
      addressLocality: state.contact.city.trim() || undefined,
      addressCountry: state.contact.country.trim() || 'NL',
    };
  }

  if (state.contact.city.trim()) {
    schema.areaServed = {
      '@type': 'City',
      name: state.contact.city.trim(),
    };
  }

  const openingHours = state.hours
    .filter((day) => !day.closed && !day.open24)
    .map((day) => {
      const dayMap: Record<string, string> = {
        monday: 'Mo',
        tuesday: 'Tu',
        wednesday: 'We',
        thursday: 'Th',
        friday: 'Fr',
        saturday: 'Sa',
        sunday: 'Su',
      };
      return `${dayMap[day.dayKey]} ${day.openTime}-${day.closeTime}`;
    });

  if (openingHours.length > 0) {
    schema.openingHours = openingHours;
  }

  if (slug.slug) {
    schema.identifier = `https://${futureDomain(state)}`;
  }

  return schema;
}
