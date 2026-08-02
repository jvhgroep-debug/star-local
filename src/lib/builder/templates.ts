import type { BuilderState, DayHours } from '../../types/builder';
import type { BuilderFiles } from './files';
import { buildWebsiteConfig } from './website-config';
import { getSlugPreview } from './slug';

export interface GeneratedCopy {
  localTitle: string;
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

function industryLabel(industry: string): string {
  const value = industry.trim().toLowerCase();
  return value || 'dienstverlener';
}

/** "Bedrijfsnaam in Plaats" — centrale lokale SEO-formule. */
export function localBusinessTitle(name: string, city: string): string {
  const business = name.trim() || 'Uw bedrijf';
  const place = city.trim();
  return place ? `${business} in ${place}` : business;
}

export function generateCopy(state: BuilderState): GeneratedCopy {
  const { business, contact } = state;
  const name = business.name.trim() || 'Uw bedrijf';
  const industry = industryLabel(business.industry);
  const industryDisplay = business.industry.trim() || 'Lokale dienstverlener';
  const city = contact.city.trim() || 'uw regio';
  const slug = getSlugPreview(business.name);
  const localTitle = localBusinessTitle(name, contact.city.trim());
  const description =
    business.description.trim() ||
    `Wij helpen klanten in ${city} met vakkundige ${industryDisplay.toLowerCase()} en duidelijke afspraken.`;

  const aboutBody = `${name} is een ${industryDisplay.toLowerCase()} in ${city}. ${description}`;
  const aboutExtended = `${aboutBody} Als ${industryDisplay.toLowerCase()} in ${city} staan wij bekend om betrouwbare service, duidelijke communicatie en een professionele aanpak. Neem gerust contact op — wij denken graag met u mee.`;

  return {
    localTitle,
    homeIntro: `Welkom bij ${localTitle}. Uw betrouwbare ${industry} in de regio.`,
    heroDescription: description,
    aboutIntro: `Over ${name}`,
    aboutBody,
    aboutExtended,
    servicesIntro: `Ontdek wat ${localTitle} voor u kan betekenen.`,
    contactIntro: `Neem contact op met ${localTitle}. Wij reageren zo snel mogelijk op uw vraag.`,
    privacyIntro: `${name} hecht waarde aan uw privacy. Op deze pagina leest u hoe wij omgaan met uw gegevens.`,
    seoTitle: `${localTitle} | ${industryDisplay}`,
    seoDescription: `${localTitle} — ${industryDisplay.toLowerCase()}. Bekijk diensten, openingstijden en neem direct contact op.`,
    ogTitle: localTitle,
    canonicalUrl: slug.slug ? `https://${slug.domain}/` : 'https://uw-bedrijf.starlocal.nl/',
    h1: localTitle,
    ctaLabel: 'Offerte aanvragen',
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

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  setMeta('name', 'description', website.seo.description);
  setMeta('property', 'og:title', website.seo.ogTitle);
  setMeta('property', 'og:description', website.seo.description);
  setMeta('property', 'og:url', website.seo.canonicalUrl);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = website.seo.canonicalUrl;

  let schemaScript = document.querySelector('#builder-preview-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'builder-preview-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(website.localBusinessSchema);
}

export function resetPreviewSeo(): void {
  document.title = 'Gratis website maken | Website Builder | Star Local';
  document.querySelector('#builder-preview-schema')?.remove();
}

export function renderPremiumBlock(state: BuilderState): string {
  const domain = futureDomain(state);
  return `
    <section class="builder-premium-block" aria-labelledby="premium-block-title">
      <h2 id="premium-block-title">Kies uw pakket</h2>
      <div class="builder-premium-grid">
        <article class="builder-premium-card">
          <h3>Gratis</h3>
          <ul>
            <li>✓ ${domain}</li>
          </ul>
        </article>
        <article class="builder-premium-card builder-premium-card--highlight">
          <h3>Premium</h3>
          <ul>
            <li>✓ Eigen domein</li>
            <li>✓ Eigen e-mail</li>
            <li>✓ Meer SEO</li>
            <li>✓ Prioriteit</li>
          </ul>
          <button type="button" class="btn btn-secondary" data-premium-upgrade>Later upgraden</button>
        </article>
      </div>
    </section>
  `;
}
