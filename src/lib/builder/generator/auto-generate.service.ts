import type { BuilderState, PreviewPage } from '../../../types/builder';
import type { GeneratedWebsiteResult } from './website-generator.service';
import { websiteGenerator } from './website-generator.service';
import type { BuilderFiles } from '../files';
import { savePreparedWebsite } from '../publish/storage';
import { WEBSITE_PAGES } from '../../../types/website-config';
import { TENANT_DOCUMENT_PATHS } from './sitemap';
import { loadWebsiteList, saveWebsiteList, type StoredWebsiteSummary } from '../../dashboard/website-list.storage';
const PAGE_LABELS: Record<PreviewPage, string> = {
  home: 'Homepage',
  about: 'Over ons',
  services: 'Diensten',
  contact: 'Contact',
  privacy: 'Privacybeleid',
};

export interface AutoGenerateSummary {
  businessName: string;
  slug: string;
  domain: string;
  pages: Array<{ id: PreviewPage; label: string; path: string }>;
  menuItems: string[];
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  canonicalUrl: string;
  hasJsonLd: boolean;
  hasRobots: boolean;
  hasSitemap: boolean;
  generatedAt: string;
  pageCount: number;
}

export interface AutoGenerateResult {
  ok: true;
  generated: GeneratedWebsiteResult;
  summary: AutoGenerateSummary;
}

export interface AutoGenerateFailure {
  ok: false;
  errors: Record<string, string>;
}

export type AutoGenerateResponse = AutoGenerateResult | AutoGenerateFailure;

/** Validate minimum wizard data required for automatic generation. */
export function validateForAutoGenerate(state: BuilderState, hasLogo: boolean): AutoGenerateFailure | null {
  const errors: Record<string, string> = {};

  if (!state.business.name.trim()) errors.name = 'Vul uw bedrijfsnaam in.';
  if (!state.business.industry.trim()) errors.industry = 'Kies een branche.';
  if (!state.contact.city.trim()) errors.city = 'Vul uw plaats in.';
  if (!state.contact.email.trim()) errors.email = 'Vul uw e-mailadres in.';
  if (!state.contact.phone.trim() && !state.contact.whatsapp.trim()) {
    errors.phone = 'Vul telefoon of WhatsApp in.';
  }
  if (!hasLogo) errors.logo = 'Upload een logo om uw website te genereren.';
  const services = state.business.services.filter((s) => s.title.trim());
  if (services.length === 0) errors.services = 'Voeg minimaal één dienst toe.';
  const description = state.business.description.trim();
  if (description.length < 40) {
    errors.businessDescription = 'Vul een bedrijfsomschrijving in van minimaal 40 tekens.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return null;
}

/**
 * Automatic Website Generator (MVP) — builds all pages, SEO, menu, footer
 * from wizard data and saves locally. No production upload.
 */
export function autoGenerateWebsite(state: BuilderState, files: BuilderFiles): AutoGenerateResponse {
  const validation = validateForAutoGenerate(state, Boolean(files.logoUrl));
  if (validation) return validation;

  const generated = websiteGenerator.generateFromBuilder(state, files, {
    package: state.selectedPackage ?? 'free',
    publishEmail: state.publishEmailConfirmed || state.contact.email,
    preparedAt: new Date().toISOString(),
  });

  savePreparedWebsite(generated);

  const { config, seoByPage } = generated;
  const homeSeo = seoByPage.home;

  const summary: AutoGenerateSummary = {
    businessName: config.business.name,
    slug: config.slug.slug,
    domain: config.slug.domain,
    pages: WEBSITE_PAGES.filter((page) => config.enabledPages?.[page] !== false).map((page) => ({
      id: page,
      label: PAGE_LABELS[page],
      path: TENANT_DOCUMENT_PATHS[page],
    })),
    menuItems: ['Home', 'Over ons', 'Diensten', 'Contact', 'Privacy'],
    seoTitle: homeSeo.title,
    metaDescription: homeSeo.description,
    ogTitle: homeSeo.ogTitle,
    canonicalUrl: homeSeo.canonicalUrl,
    hasJsonLd: Boolean(config.localBusinessSchema),
    hasRobots: Boolean(generated.robots),
    hasSitemap: Boolean(generated.sitemap),
    generatedAt: generated.generation.generatedAt,
    pageCount: generated.generation.pageCount,
  };

  return { ok: true, generated, summary };
}

/** Register generated website in local dashboard list (no D1). */
export function syncGeneratedToWebsiteList(generated: GeneratedWebsiteResult): void {
  if (typeof window === 'undefined') return;

  const { config } = generated;
  const slug = config.slug.slug;
  const id = `local:${slug}`;
  const entry: StoredWebsiteSummary = {
    id,
    tenantId: null,
    websiteId: null,
    businessName: config.business.name,
    slug,
    subdomain: `${slug}.starlocal.nl`,
    url: config.slug.domain.startsWith('http') ? config.slug.domain : `https://${config.slug.domain}`,
    status: 'draft',
    statusLabel: 'Concept',
    pipelineStatus: 'draft',
    lastUpdated: generated.generation.generatedAt,
    primaryColor: config.branding.primaryColor,
    logoName: config.media.logoName ?? null,
    source: 'local',
  };

  const list = loadWebsiteList().filter((item) => item.id !== id);
  list.unshift(entry);
  saveWebsiteList(list);
}
/** Check generated website has all required MVP pages. */
export function verifyAutoGeneratedWebsite(generated: GeneratedWebsiteResult): {
  valid: boolean;
  missing: string[];
  checks: Record<string, boolean>;
} {
  const checks: Record<string, boolean> = {};
  const missing: string[] = [];

  for (const page of WEBSITE_PAGES) {
    const html = generated.pages[page] ?? '';
    const label = PAGE_LABELS[page];
    checks[page] = html.length > 100;
    if (!checks[page]) missing.push(label);
  }

  const homeHtml = generated.pages.home ?? '';
  checks.menu = homeHtml.includes('tenant-nav');
  checks.footer = homeHtml.includes('tenant-footer');
  checks.seo = homeHtml.includes('data-seo-title') || homeHtml.includes('tenant-seo-sr');
  checks.jsonLd = homeHtml.includes('application/ld+json');
  checks.phoneLink = homeHtml.includes('tel:') || homeHtml.includes('tenant-btn--primary');
  checks.contactForm = (generated.pages.contact ?? '').includes('tenant-form');

  if (!checks.menu) missing.push('menu');
  if (!checks.footer) missing.push('footer');
  if (!checks.seo) missing.push('seo');

  return { valid: missing.length === 0, missing, checks };
}
