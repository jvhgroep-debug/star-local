import type { BuilderService, BuilderState } from '../../types/builder';
import type {
  PublicationStatus,
  WebsiteConfig,
  WebsitePackage,
  WebsiteService,
} from '../../types/website-config';
import { buildLocalBusinessSchema } from './generator/schema';
import type { BuilderFiles } from './files';
import { heroPhotoUrl } from './files';
import { getSlugPreview } from './slug';
import { formatAddress, generateCopy } from './templates';
import {
  BUILDER_PLACEHOLDERS,
  placeholderBusinessName,
  placeholderDescription,
  placeholderIndustry,
  placeholderRegion,
} from './placeholders';

export interface BuildWebsiteConfigOptions {
  status?: PublicationStatus;
  package?: WebsitePackage;
  publishEmail?: string;
  publishedAt?: string | null;
  preparedAt?: string | null;
}

function generateServices(state: BuilderState, copy: ReturnType<typeof generateCopy>): WebsiteService[] {
  const hasCity = Boolean(state.contact.city.trim());
  const hasName = Boolean(state.business.name.trim());

  return state.business.services
    .filter((service) => service.title.trim())
    .map((service: BuilderService) => {
      const title = service.title.trim();
      const description = service.description.trim();
      const summary =
        description ||
        (hasName && hasCity
          ? `${title} door ${state.business.name.trim()} — professioneel uitgevoerd in ${state.contact.city.trim()}.`
          : BUILDER_PLACEHOLDERS.description);
      const detail =
        description ||
        (hasName && hasCity
          ? `${copy.localTitle} helpt u met ${title.toLowerCase()}. Als ${state.business.industry.trim().toLowerCase()} in ${state.contact.city.trim()} leveren wij vakwerk, duidelijke afspraken en een nette afwerking. Neem contact op voor een vrijblijvende offerte.`
          : BUILDER_PLACEHOLDERS.description);

      return {
        id: service.id,
        title,
        description,
        summary,
        detail,
      };
    });
}

/** Build the central WebsiteConfig from builder form state and uploaded files. */
export function buildWebsiteConfig(
  state: BuilderState,
  files: BuilderFiles,
  options: BuildWebsiteConfigOptions = {},
): WebsiteConfig {
  const copy = generateCopy(state);
  const slugPreview = getSlugPreview(state.business.name);
  const name = placeholderBusinessName(state.business.name);
  const city = placeholderRegion(state.contact.city);
  const industry = placeholderIndustry(state.business.industry);
  const hasIndustry = Boolean(state.business.industry.trim());
  const hasCity = Boolean(state.contact.city.trim());
  const domain = slugPreview.domain;
  const status = options.status ?? state.publicationStatus ?? 'concept';
  const websitePackage = options.package ?? state.selectedPackage ?? 'free';

  return {
    version: 1,
    status,
    package: websitePackage,
    slug: {
      slug: slugPreview.slug,
      domain,
      url: `https://${domain}`,
      available: slugPreview.available,
    },
    business: state.business,
    contact: state.contact,
    hours: state.hours,
    branding: state.branding,
    media: {
      logoUrl: files.logoUrl,
      logoName: files.logoName || state.branding.logoName,
      photoUrls: files.photoUrls,
      photoNames: files.photoNames.length ? files.photoNames : state.branding.photoNames,
      heroImageUrl: heroPhotoUrl(files),
      galleryImageUrls: files.photoUrls.slice(1),
    },
    services: generateServices(state, copy),
    seo: {
      title: copy.seoTitle,
      description: copy.seoDescription,
      h1: copy.h1,
      ogTitle: copy.ogTitle,
      canonicalUrl: copy.canonicalUrl,
    },
    copy,
    localBusinessSchema: buildLocalBusinessSchema(state, files, copy),
    privacySections: {
      intro: `${name} (${industry} in ${city}) verwerkt persoonsgegevens zorgvuldig en in overeenstemming met de AVG.`,
      dataProcessing: `Wij verwerken gegevens die u via ons contactformulier, telefoon, WhatsApp of e-mail verstrekt. Denk aan naam, contactgegevens en de inhoud van uw bericht. Deze gegevens gebruiken wij uitsluitend om uw vraag te beantwoorden of onze diensten uit te voeren.`,
      retention: `Wij bewaren uw gegevens niet langer dan nodig is voor het doel waarvoor u ze heeft verstrekt, tenzij wij wettelijk verplicht zijn gegevens langer te bewaren.`,
      contact: `Voor vragen over privacy kunt u contact opnemen via ${state.contact.email.trim() || 'ons contactformulier'}${state.contact.phone.trim() ? ` of telefonisch via ${state.contact.phone.trim()}` : ''}. Ons adres: ${formatAddress(state) || city}.`,
    },
    whyChooseUs: [
      hasIndustry && hasCity
        ? `${state.business.industry.trim()} in ${state.contact.city.trim()}`
        : hasIndustry
          ? state.business.industry.trim()
          : BUILDER_PLACEHOLDERS.industry,
      'Persoonlijke service en duidelijke communicatie',
      'Transparante afspraken en professionele uitvoering',
      'Bereikbaar via telefoon, WhatsApp en e-mail',
    ],
    publishEmail: options.publishEmail ?? state.publishEmailConfirmed ?? state.contact.email,
    publishedAt: options.publishedAt ?? state.publishedAt ?? null,
    preparedAt: options.preparedAt ?? null,
    heroTitle: state.heroTitle,
    heroSubtitle: state.heroSubtitle,
    design: state.design,
  };
}

/** Minimal BuilderState slice for contact/address helper functions. */
export function configAsBuilderState(config: WebsiteConfig): BuilderState {
  return {
    version: 1,
    currentStep: 1,
    view: 'builder',
    previewPage: 'home',
    business: config.business,
    contact: config.contact,
    hours: config.hours,
    branding: config.branding,
    publicationStatus: config.status,
    selectedPackage: config.package,
    publishEmailConfirmed: config.publishEmail,
    publishedAt: config.publishedAt,
    ctaQuoteLabel: config.copy.ctaLabel,
    heroTitle: config.heroTitle,
    heroSubtitle: config.heroSubtitle,
    design: config.design,
    heroPlaceholder: 'Hero-afbeelding placeholder',
    galleryPlaceholders: ['Galerij 1', 'Galerij 2', 'Galerij 3'],
  };
}
