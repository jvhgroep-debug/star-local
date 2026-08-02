import { isReservedSubdomain } from '../../config/reserved-subdomains';
import { BUILDER_PLACEHOLDERS } from './placeholders';

/** Normalize a business name into a safe tenant subdomain slug. */
export function normalizeBuilderSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface SlugPreviewResult {
  slug: string;
  domain: string;
  available: boolean;
  message: string;
}

export function getSlugPreview(businessName: string): SlugPreviewResult {
  const slug = normalizeBuilderSlug(businessName);

  if (!slug) {
    return {
      slug: '',
      domain: BUILDER_PLACEHOLDERS.domain,
      available: false,
      message: 'Voer een geldige bedrijfsnaam in voor uw website-adres.',
    };
  }

  const domain = `${slug}.starlocal.nl`;

  if (isReservedSubdomain(slug)) {
    return {
      slug,
      domain,
      available: false,
      message: 'Deze naam is niet beschikbaar. Kies een andere bedrijfsnaam.',
    };
  }

  return {
    slug,
    domain,
    available: true,
    message: 'Dit wordt uw toekomstige website-adres.',
  };
}

export function formatSlugPreviewHtml(preview: SlugPreviewResult): string {
  const statusClass = preview.available ? 'builder-slug-live--ok' : 'builder-slug-live--error';
  const domain = preview.domain || BUILDER_PLACEHOLDERS.domain;
  return `
    <div class="builder-slug-live ${statusClass}" aria-live="polite">
      <span class="builder-slug-live__domain">${domain}</span>
      <span class="builder-slug-live__hint">${preview.message}</span>
    </div>
  `;
}
