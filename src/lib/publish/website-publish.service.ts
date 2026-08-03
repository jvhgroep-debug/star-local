import type { PublishWebsitePayload } from '../../types/publish';
import type { DatabaseRepositories } from '../db/repositories/types';
import type { R2Bucket } from '../media/r2';
import { generateCopy } from '../builder/templates';
import { getSlugPreview } from '../builder/slug';
import { SiteStorageService } from './site-storage.service';
import { dayKeyToWeekday, validatePublishPayload } from './validation';

export class WebsitePublishService {
  constructor(
    private readonly repos: DatabaseRepositories,
    private readonly mediaBucket?: R2Bucket,
  ) {}

  validate(payload: PublishWebsitePayload): { valid: boolean; errors: Record<string, string> } {
    return validatePublishPayload(payload);
  }

  /**
   * Persist website to D1, upload generated site to R2, activate tenant subdomain.
   */
  async publish(payload: PublishWebsitePayload): Promise<{
    websiteId: string;
    tenantId: string;
    slug: string;
    subdomain: string;
    url: string;
    status: 'published';
    package: PublishWebsitePayload['package'];
    publishEmail: string;
    savedAt: string;
    published: true;
    siteObjectCount: number;
  }> {
    const validation = this.validate(payload);
    if (!validation.valid) {
      throw new PublishValidationError(validation.errors);
    }

    if (!this.mediaBucket) {
      throw new PublishValidationError({
        publish: 'Productie-opslag niet beschikbaar. R2-binding ontbreekt in deze omgeving.',
      });
    }

    if (!payload.siteArtifacts) {
      throw new PublishValidationError({
        publish: 'Gegenereerde websitebestanden ontbreken. Vernieuw de builder en probeer opnieuw.',
      });
    }

    const slugPreview = getSlugPreview(payload.business.name);
    if (!slugPreview.slug) {
      throw new Error('Ongeldige slug voor subdomein.');
    }

    const existingTenant = await this.repos.tenants.findBySlug(slugPreview.slug);
    if (existingTenant) {
      throw new PublishValidationError({
        name: 'Deze subdomeinnaam is al in gebruik. Kies een andere bedrijfsnaam.',
      });
    }

    const now = new Date().toISOString();
    const tenantId = crypto.randomUUID();
    const websiteId = crypto.randomUUID();
    const contactId = crypto.randomUUID();
    const copy = generateCopy({
      version: 1,
      currentStep: 5,
      view: 'builder',
      previewPage: 'home',
      business: payload.business,
      contact: payload.contact,
      hours: payload.hours,
      branding: {
        ...payload.branding,
        textColor: '#ffffff',
        photoNames: [],
      },
      publicationStatus: 'concept',
      selectedPackage: payload.package,
      publishEmailConfirmed: payload.contact.email.trim(),
      publishedAt: now,
      ctaQuoteLabel: 'Offerte aanvragen',
      heroTitle: '',
      heroSubtitle: '',
      design: payload.design ?? { fontFamily: 'system', buttonStyle: 'solid', cornerRadius: 'rounded', shadow: 'soft' },
      location: {
        gemeenteSlug: '',
        gemeenteNaam: payload.contact.city.trim(),
        provincie: '',
      },
      heroPlaceholder: 'Hero-afbeelding placeholder',
      galleryPlaceholders: ['Galerij 1', 'Galerij 2', 'Galerij 3'],
    });

    const logoKey = payload.branding.logoName.trim()
      ? `pending:${payload.branding.logoName.trim()}`
      : null;

    await this.repos.tenants.create({
      id: tenantId,
      slug: slugPreview.slug,
      bedrijfsnaam: payload.business.name.trim(),
      branche: payload.business.industry.trim(),
      description: payload.business.description.trim(),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    await this.repos.websites.create({
      id: websiteId,
      tenantId,
      seoTitle: copy.seoTitle,
      metaDescription: copy.seoDescription,
      theme: 'default',
      primaryColor: payload.branding.primaryColor,
      secondaryColor: payload.branding.accentColor,
      status: 'published',
      package: payload.package,
      logoKey,
      published: true,
      createdAt: now,
      updatedAt: now,
    });

    await this.repos.contacts.create({
      id: contactId,
      tenantId,
      telefoon: payload.contact.phone.trim(),
      whatsapp: payload.contact.whatsapp.trim(),
      email: payload.contact.email.trim(),
      adres: payload.contact.street.trim(),
      postcode: payload.contact.postcode.trim(),
      plaats: payload.contact.city.trim(),
      createdAt: now,
      updatedAt: now,
    });

    const services = payload.business.services.filter((service) => service.title.trim());
    for (const [index, service] of services.entries()) {
      await this.repos.services.create({
        id: crypto.randomUUID(),
        tenantId,
        titel: service.title.trim(),
        omschrijving: service.description.trim(),
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const day of payload.hours) {
      await this.repos.openingHours.create({
        id: crypto.randomUUID(),
        tenantId,
        weekday: dayKeyToWeekday(day.dayKey),
        openTime: day.open24 ? '00:00' : day.openTime,
        closeTime: day.open24 ? '23:59' : day.closeTime,
        closed: day.closed,
        createdAt: now,
        updatedAt: now,
      });
    }

    const storage = new SiteStorageService(this.mediaBucket);
    const upload = await storage.publishSite(tenantId, payload.siteArtifacts);

    return {
      websiteId,
      tenantId,
      slug: slugPreview.slug,
      subdomain: slugPreview.domain,
      url: `https://${slugPreview.domain}`,
      status: 'published',
      package: payload.package,
      publishEmail: payload.publishEmail.trim(),
      savedAt: now,
      published: true,
      siteObjectCount: upload.objectCount,
    };
  }
}

export class PublishValidationError extends Error {
  readonly errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super('Publish validation failed');
    this.name = 'PublishValidationError';
    this.errors = errors;
  }
}
