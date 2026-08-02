import type { BuilderState, DayHours } from '../../types/builder';
import type { PreviewPage, PreparedWebsite } from '../../types/website-config';
import type { BuilderFiles } from './files';
import { buildPageSeo } from './generator/seo';
import { buildWebsiteConfig } from './website-config';
import { getSlugPreview } from './slug';
import {
  PREMIUM_PACKAGE_FEATURES,
  getFreePackageFeatures,
  renderPackageFeatureList,
} from './packages';
import {
  BUILDER_PLACEHOLDERS,
  placeholderBusinessName,
  placeholderDescription,
  placeholderRegion,
} from './placeholders';

export interface GeneratedCopy {
  localTitle: string;
  slogan: string;
  homeIntro: string;
  heroDescription: string;
  aboutIntro: string;
  aboutBody: string;
  aboutExtended: string;
  servicesIntro: string;
  contactIntro: string;
  privacyIntro: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  canonicalUrl: string;
  h1: string;
  ctaLabel: string;
}

/** "Bedrijfsnaam in Plaats" — centrale lokale SEO-formule. */
export function localBusinessTitle(name: string, city: string): string {
  const business = placeholderBusinessName(name);
  const place = city.trim();
  return place ? `${business} in ${place}` : business;
}

export function generateCopy(state: BuilderState): GeneratedCopy {
  const { business, contact } = state;
  const name = placeholderBusinessName(business.name);
  const slug = getSlugPreview(business.name);
  const localTitle = localBusinessTitle(business.name, contact.city.trim());

  const hasDescription = Boolean(business.description.trim());
  const hasIndustry = Boolean(business.industry.trim());
  const hasCity = Boolean(contact.city.trim());

  const description = placeholderDescription(business.description);
  const regionDisplay = placeholderRegion(contact.city);

  const aboutBody = hasDescription
    ? `${name} is een ${business.industry.trim().toLowerCase()} in ${hasCity ? contact.city.trim() : regionDisplay}. ${business.description.trim()}`
    : BUILDER_PLACEHOLDERS.description;

  const aboutExtended = hasDescription
    ? `${aboutBody} Als ${business.industry.trim().toLowerCase()} in ${hasCity ? contact.city.trim() : regionDisplay} staan wij bekend om betrouwbare service, duidelijke communicatie en een professionele aanpak. Neem gerust contact op — wij denken graag met u mee.`
    : BUILDER_PLACEHOLDERS.description;

  const slogan =
    hasIndustry && hasCity
      ? `Professionele ${business.industry.trim().toLowerCase()} in ${contact.city.trim()}`
      : hasIndustry
        ? `Professionele ${business.industry.trim().toLowerCase()}`
        : BUILDER_PLACEHOLDERS.industry;

  const homeIntro =
    hasDescription || hasIndustry || hasCity
      ? `Welkom bij ${localTitle}. Uw betrouwbare ${hasIndustry ? business.industry.trim().toLowerCase() : BUILDER_PLACEHOLDERS.industry.toLowerCase()} in de regio.`
      : BUILDER_PLACEHOLDERS.description;

  const seoTitle =
    hasCity || hasIndustry ? `${localTitle}${hasIndustry ? ` | ${business.industry.trim()}` : ''}` : name;

  const seoDescription =
    hasCity && hasIndustry
      ? `${localTitle} — ${business.industry.trim().toLowerCase()}. Bekijk diensten, openingstijden en neem direct contact op.`
      : description;

  return {
    localTitle,
    slogan,
    homeIntro,
    heroDescription: description,
    aboutIntro: `Over ${name}`,
    aboutBody,
    aboutExtended,
    servicesIntro: hasCity || hasIndustry ? `Ontdek wat ${localTitle} voor u kan betekenen.` : BUILDER_PLACEHOLDERS.description,
    contactIntro: hasCity || hasIndustry
      ? `Neem contact op met ${localTitle}. Wij reageren zo snel mogelijk op uw vraag.`
      : BUILDER_PLACEHOLDERS.description,
    privacyIntro: `${name} hecht waarde aan uw privacy. Op deze pagina leest u hoe wij omgaan met uw gegevens.`,
    seoTitle,
    seoDescription,
    ogTitle: localTitle,
    canonicalUrl: slug.slug ? `https://${slug.domain}/` : `https://${BUILDER_PLACEHOLDERS.domain}/`,
    h1: localTitle,
    ctaLabel: state.ctaQuoteLabel?.trim() || 'Offerte aanvragen',
  };
}

export function formatAddress(state: BuilderState): string {
  const { street, postcode, city, country } = state.contact;
  const parts = [street.trim(), [postcode.trim(), city.trim()].filter(Boolean).join(' '), country.trim()].filter(
    Boolean,
  );
  return parts.join(', ');
}

export function formatStreetLine(state: BuilderState): string {
  return state.contact.street.trim();
}

export function formatCityLine(state: BuilderState): string {
  const { postcode, city } = state.contact;
  return [postcode.trim(), city.trim()].filter(Boolean).join(' ');
}

export function formatHoursLine(day: DayHours): string {
  if (day.closed) return 'Gesloten';
  if (day.open24) return '24 uur geopend';
  return `${day.openTime} – ${day.closeTime}`;
}

export function formatPhoneLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('31') ? `+${digits}` : digits.startsWith('0') ? `+31${digits.slice(1)}` : `+${digits}`;
}

export function formatWhatsAppLink(whatsapp: string): string {
  const link = formatPhoneLink(whatsapp);
  if (!link) return '';
  return `https://wa.me/${link.replace('+', '')}?text=${encodeURIComponent('Hallo, ik wil graag meer informatie.')}`;
}

export function formatTelLink(phone: string): string {
  const link = formatPhoneLink(phone);
  return link ? `tel:${link}` : '';
}

export function formatEmailLink(email: string): string {
  const value = email.trim();
  return value ? `mailto:${value}` : '';
}

export function mapsRouteUrl(state: BuilderState): string {
  const address = formatAddress(state);
  if (!address) return '#';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function futureDomain(state: BuilderState): string {
  return getSlugPreview(state.business.name).domain;
}

export function applyPreviewSeo(state: BuilderState, files: BuilderFiles): void {
  const website = buildWebsiteConfig(state, files);
  applySeoBundle(website.seo.title, {
    title: website.seo.title,
    description: website.seo.description,
    ogTitle: website.seo.ogTitle,
    ogDescription: website.seo.description,
    canonicalUrl: website.seo.canonicalUrl,
  }, website.localBusinessSchema);
}

export function applyPreparedPreviewSeo(prepared: PreparedWebsite, page: PreviewPage): void {
  const seo = prepared.seoByPage?.[page] ?? buildPageSeo(prepared.config, page);
  applySeoBundle(seo.title, seo, prepared.config.localBusinessSchema);
}

function applySeoBundle(
  documentTitle: string,
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    canonicalUrl: string;
  },
  localBusinessSchema: Record<string, unknown>,
): void {
  document.title = documentTitle;

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  setMeta('name', 'description', seo.description);
  setMeta('property', 'og:title', seo.ogTitle);
  setMeta('property', 'og:description', seo.ogDescription);
  setMeta('property', 'og:url', seo.canonicalUrl);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = seo.canonicalUrl;

  let schemaScript = document.querySelector('#builder-preview-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'builder-preview-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(localBusinessSchema);
}

export function resetPreviewSeo(): void {
  document.title = 'Gratis website maken | Website Builder | Star Local';
  document.querySelector('#builder-preview-schema')?.remove();
}

export function renderPremiumBlock(state: BuilderState): string {
  const domain = futureDomain(state);
  const freeFeatures = getFreePackageFeatures(domain);

  return `
    <section class="builder-premium-block" aria-labelledby="premium-block-title">
      <h2 id="premium-block-title">Kies uw pakket</h2>
      <div class="builder-premium-grid">
        <article class="builder-premium-card">
          <h3>Gratis</h3>
          ${renderPackageFeatureList(freeFeatures)}
        </article>
        <article class="builder-premium-card builder-premium-card--highlight">
          <h3>Premium</h3>
          ${renderPackageFeatureList(PREMIUM_PACKAGE_FEATURES)}
          <button type="button" class="btn btn-secondary" data-premium-upgrade>Upgrade naar Premium</button>
        </article>
      </div>
    </section>
  `;
}
