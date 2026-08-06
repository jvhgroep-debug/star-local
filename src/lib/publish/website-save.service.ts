import type { SaveWebsitePayload } from '../../types/save';
import type { PreviewPage } from '../../types/website-config';
import { WEBSITE_PAGES } from '../../types/website-config';
import { isReservedSubdomain } from '../../config/reserved-subdomains';
import { buildWebsiteConfig } from '../builder/website-config';
import { buildAllPageSeo, tenantPagePath } from '../builder/generator/seo';
import { generateCopy } from '../builder/templates';
import { normalizeBuilderSlug } from '../builder/slug';
import { createEmptyFiles, type BuilderFiles } from '../builder/files';
import type { BuilderState } from '../../types/builder';
import type { D1Database, D1PreparedStatement } from '../db/d1';
import type { DatabaseRepositories } from '../db/repositories/types';
import { booleanToInt } from '../db/mappers';
import type { MediaService } from '../media/types';
import { dayKeyToWeekday } from './validation';
import { validateSavePayload } from './save-validation';
import { LocalMediaAdapter } from '../media/local-media.adapter';
import { AuthRepository } from '../auth/repository';

const SLUG_IN_USE_MESSAGE = 'Deze website-adresnaam is al in gebruik. Kies een andere naam.';

const PAGE_TITLES: Record<PreviewPage, string> = {
  home: 'Home',
  about: 'Over ons',
  services: 'Diensten',
  contact: 'Contact',
  privacy: 'Privacybeleid',
};

export class SaveValidationError extends Error {
  readonly code: string;
  readonly fieldErrors: Record<string, string>;

  constructor(code: string, fieldErrors: Record<string, string>) {
    super(Object.values(fieldErrors)[0] ?? 'Validatie mislukt.');
    this.name = 'SaveValidationError';
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

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
      heroImageName: payload.media.filter((m) => m.kind === 'photo')[0]?.filename ?? '',
      socialImageName: payload.media.find((m) => m.kind === 'social')?.filename ?? '',
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

function decodeBase64(dataBase64: string): ArrayBuffer {
  const binary = atob(dataBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export class WebsiteSaveService {
  constructor(
    private readonly db: D1Database,
    private readonly repos: DatabaseRepositories,
    private readonly media: MediaService,
  ) {}

  async save(payload: SaveWebsitePayload): Promise<{
    tenantId: string;
    websiteId: string;
    slug: string;
    status: 'draft';
    url: string;
    dashboardUrl: string;
    editorUrl: string;
    savedAt: string;
    pageCount: number;
  }> {
    if (payload.tenantId?.trim()) {
      return this.updateExisting(payload.tenantId.trim(), payload);
    }

    const validation = validateSavePayload(payload);
    if (!validation.valid) {
      throw new SaveValidationError('VALIDATION_FAILED', validation.errors);
    }

    const slug = normalizeBuilderSlug(payload.business.name);
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new SaveValidationError('INVALID_SLUG', {
        name: 'Voer een geldige bedrijfsnaam in voor uw website-adres.',
      });
    }

    if (isReservedSubdomain(slug)) {
      throw new SaveValidationError('RESERVED_SLUG', {
        name: 'Deze naam is niet beschikbaar. Kies een andere bedrijfsnaam.',
      });
    }

    const existing = await this.repos.tenants.findBySlugIgnoreCase(slug);
    if (existing) {
      throw new SaveValidationError('SLUG_IN_USE', { name: SLUG_IN_USE_MESSAGE });
    }

    const now = new Date().toISOString();
    const tenantId = crypto.randomUUID();
    const websiteId = crypto.randomUUID();
    const contactId = crypto.randomUUID();
    const uploadedMediaKeys: string[] = [];

    try {
      let logoKey: string | null = null;
      const photoKeys: string[] = [];

      for (const file of payload.media) {
        const buffer = decodeBase64(file.dataBase64);
        const upload = await (file.kind === 'logo'
          ? this.media.uploadLogo({
              tenantId,
              data: buffer,
              mimeType: file.mimeType,
              sizeBytes: buffer.byteLength,
            })
          : this.media.uploadPhoto({
              tenantId,
              data: buffer,
              mimeType: file.mimeType,
              sizeBytes: buffer.byteLength,
            }));

        uploadedMediaKeys.push(upload.object.key);
        if (file.kind === 'logo') {
          logoKey = upload.object.key;
        } else if (file.kind === 'photo') {
          photoKeys.push(upload.object.key);
        }
      }

      const state = payloadToBuilderState(payload);
      const files: BuilderFiles = {
        logoUrl: null,
        logoName: state.branding.logoName,
        photoUrls: [],
        photoNames: state.branding.photoNames,
      };
      const config = buildWebsiteConfig(state, files, { status: 'concept', package: payload.package });
      const copy = generateCopy(state);
      const seoByPage = buildAllPageSeo(config);
      const seoTitle = state.heroTitle.trim() || copy.seoTitle;
      const metaDescription = state.seoMetaDescription.trim() || copy.seoDescription;
      const enabledPages = payload.enabledPages ?? { home: true, about: true, services: true, contact: true, privacy: true };

      const statements: D1PreparedStatement[] = [];

      statements.push(
        this.db
          .prepare(
            `INSERT INTO tenants (id, slug, name, branche, description, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            tenantId,
            slug,
            payload.business.name.trim(),
            payload.business.industry.trim(),
            payload.business.description.trim(),
            'draft',
            now,
            now,
          ),
      );

      statements.push(
        this.db
          .prepare(
            `INSERT INTO websites (
              id, tenant_id, seo_title, meta_description, theme,
              primary_color, secondary_color, font_family, status, package, logo_key,
              published, approval_status, config_snapshot_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            websiteId,
            tenantId,
            seoTitle,
            metaDescription,
            'default',
            payload.branding.primaryColor,
            payload.branding.accentColor,
            payload.design.fontFamily,
            'draft',
            payload.package,
            logoKey,
            booleanToInt(false),
            payload.approvalStatus ?? 'concept',
            payload.configSnapshotJson ?? null,
            now,
            now,
          ),
      );

      statements.push(
        this.db
          .prepare(
            `INSERT INTO contacts (
              id, tenant_id, telefoon, whatsapp, email, website, kvk, adres, postcode, plaats,
              gemeente_slug, gemeente_naam, provincie, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            contactId,
            tenantId,
            payload.contact.phone.trim(),
            payload.contact.whatsapp.trim(),
            payload.contact.email.trim(),
            payload.contact.website.trim(),
            payload.contact.kvk.trim(),
            payload.contact.street.trim(),
            payload.contact.postcode.trim(),
            payload.contact.city.trim(),
            payload.location.gemeenteSlug.trim(),
            payload.location.gemeenteNaam.trim(),
            payload.location.provincie.trim(),
            now,
            now,
          ),
      );

      const services = payload.business.services.filter((s) => s.title.trim());
      for (const [index, service] of services.entries()) {
        statements.push(
          this.db
            .prepare(
              `INSERT INTO services (id, tenant_id, titel, omschrijving, sort_order, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
            )
            .bind(
              crypto.randomUUID(),
              tenantId,
              service.title.trim(),
              service.description.trim(),
              index,
              now,
              now,
            ),
        );
      }

      for (const day of payload.hours) {
        statements.push(
          this.db
            .prepare(
              `INSERT INTO opening_hours (id, tenant_id, weekday, open_time, close_time, closed, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            )
            .bind(
              crypto.randomUUID(),
              tenantId,
              dayKeyToWeekday(day.dayKey),
              day.open24 ? '00:00' : day.openTime,
              day.open24 ? '23:59' : day.closeTime,
              booleanToInt(day.closed),
              now,
              now,
            ),
        );
      }

      for (const page of WEBSITE_PAGES) {
        if (enabledPages[page] === false) continue;
        const seo = seoByPage[page];
        const path = tenantPagePath(page);
        const contentJson = JSON.stringify({
          pageKey: page,
          h1: seo.h1,
          title: PAGE_TITLES[page],
          intro: page === 'home' ? copy.homeIntro : page === 'about' ? copy.aboutIntro : copy.servicesIntro,
        });

        statements.push(
          this.db
            .prepare(
              `INSERT INTO website_pages (
                id, tenant_id, website_id, page_key, title, slug, content_json,
                seo_title, meta_description, canonical_path, status, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            )
            .bind(
              crypto.randomUUID(),
              tenantId,
              websiteId,
              page,
              PAGE_TITLES[page],
              path.replace(/^\//, '').replace(/\/$/, '') || 'home',
              contentJson,
              seo.title,
              seo.description,
              path,
              'draft',
              now,
              now,
            ),
        );
      }

      if (logoKey) {
        const logoFile = payload.media.find((m) => m.kind === 'logo');
        statements.push(
          this.db
            .prepare(
              `INSERT INTO media_items (
                id, tenant_id, media_type, storage_key, filename, mime_type, size_bytes, sort_order, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            )
            .bind(
              crypto.randomUUID(),
              tenantId,
              'logo',
              logoKey,
              logoFile?.filename ?? 'logo',
              logoFile?.mimeType ?? 'image/png',
              logoFile ? decodeBase64(logoFile.dataBase64).byteLength : 0,
              0,
              now,
              now,
            ),
        );
      }

    payload.media
      .filter((m) => m.kind === 'photo')
      .forEach((file, index) => {
        const key = photoKeys[index];
        if (!key) return;
        statements.push(
            this.db
              .prepare(
                `INSERT INTO media_items (
                  id, tenant_id, media_type, storage_key, filename, mime_type, size_bytes, sort_order, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              )
              .bind(
                crypto.randomUUID(),
                tenantId,
                'photo',
                key,
                file.filename,
                file.mimeType,
                decodeBase64(file.dataBase64).byteLength,
                index,
                now,
                now,
              ),
          );
        });

      const results = await this.db.batch(statements);
      const failed = results.some((r) => !r.success);
      if (failed) {
        throw new Error('Database batch insert mislukt.');
      }

      const subdomain = `${slug}.starlocal.nl`;

      const email = payload.contact.email.trim().toLowerCase();
      const authRepo = new AuthRepository(this.db);
      const user = await authRepo.upsertUserByEmail(email);
      await authRepo.ensureTenantOwner(tenantId, user.id);

      const { CustomerRepository, WebsitePermissionRepository } = await import('../customer-portal/repositories');
      const customer = await new CustomerRepository(this.db).upsertFromUser({
        userId: user.id,
        email,
        businessName: payload.business.name.trim(),
      });
      await new WebsitePermissionRepository(this.db).ensurePermission({
        customerId: customer.id,
        tenantId,
        websiteId,
        role: 'owner',
      });

      return {
        tenantId,
        websiteId,
        slug,
        status: 'draft',
        url: `https://${subdomain}`,
        dashboardUrl: `/dashboard/?tenantId=${tenantId}`,
        editorUrl: `/dashboard/editor/?tenantId=${tenantId}`,
        savedAt: now,
        pageCount: WEBSITE_PAGES.filter((page) => enabledPages[page] !== false).length,
      };
    } catch (error) {
      await this.repos.tenants.delete(tenantId).catch(() => undefined);
      if (this.media instanceof LocalMediaAdapter) {
        await this.media.deleteTenantMedia(tenantId).catch(() => undefined);
      } else {
        for (const key of uploadedMediaKeys) {
          await this.media.deleteLogo(tenantId, key).catch(() => undefined);
          await this.media.deletePhoto(tenantId, key).catch(() => undefined);
        }
      }
      throw error;
    }
  }

  private async uploadPayloadMedia(
    tenantId: string,
    payload: SaveWebsitePayload,
  ): Promise<{ logoKey: string | null; photoKeys: string[] }> {
    let logoKey: string | null = null;
    const photoKeys: string[] = [];

    for (const file of payload.media) {
      const buffer = decodeBase64(file.dataBase64);
      const upload = await (file.kind === 'logo'
        ? this.media.uploadLogo({
            tenantId,
            data: buffer,
            mimeType: file.mimeType,
            sizeBytes: buffer.byteLength,
          })
        : this.media.uploadPhoto({
            tenantId,
            data: buffer,
            mimeType: file.mimeType,
            sizeBytes: buffer.byteLength,
          }));

      if (file.kind === 'logo') {
        logoKey = upload.object.key;
      } else if (file.kind === 'photo') {
        photoKeys.push(upload.object.key);
      }
    }

    return { logoKey, photoKeys };
  }

  private async updateExisting(
    tenantId: string,
    payload: SaveWebsitePayload,
  ): Promise<{
    tenantId: string;
    websiteId: string;
    slug: string;
    status: 'draft';
    url: string;
    dashboardUrl: string;
    editorUrl: string;
    savedAt: string;
    pageCount: number;
  }> {
    const validation = validateSavePayload(payload);
    if (!validation.valid) {
      throw new SaveValidationError('VALIDATION_FAILED', validation.errors);
    }

    const tenant = await this.repos.tenants.findById(tenantId);
    if (!tenant) {
      throw new SaveValidationError('NOT_FOUND', { tenant: 'Website niet gevonden.' });
    }

    const website = await this.repos.websites.findByTenantId(tenantId);
    if (!website) {
      throw new SaveValidationError('NOT_FOUND', { tenant: 'Website niet gevonden.' });
    }

    const contact = await this.repos.contacts.findByTenantId(tenantId);
    if (!contact) {
      throw new SaveValidationError('NOT_FOUND', { tenant: 'Contactgegevens niet gevonden.' });
    }

    const now = new Date().toISOString();
    const existingMedia = await this.repos.mediaItems.listByTenantId(tenantId);

    if (this.media instanceof LocalMediaAdapter) {
      await this.media.deleteTenantMedia(tenantId).catch(() => undefined);
    } else {
      for (const item of existingMedia) {
        if (item.mediaType === 'logo') {
          await this.media.deleteLogo(tenantId, item.storageKey).catch(() => undefined);
        } else {
          await this.media.deletePhoto(tenantId, item.storageKey).catch(() => undefined);
        }
      }
    }

    const { logoKey, photoKeys } = await this.uploadPayloadMedia(tenantId, payload);

    const state = payloadToBuilderState(payload);
    const files: BuilderFiles = {
      logoUrl: null,
      logoName: state.branding.logoName,
      heroUrl: null,
      heroName: state.branding.heroImageName,
      photoUrls: [],
      photoNames: state.branding.photoNames,
      socialImageUrl: null,
      socialImageName: state.branding.socialImageName,
    };
    const config = buildWebsiteConfig(state, files, { status: 'concept', package: payload.package });
    const copy = generateCopy(state);
    const seoByPage = buildAllPageSeo(config);
    const seoTitle = state.heroTitle.trim() || copy.seoTitle;
    const metaDescription = state.seoMetaDescription.trim() || copy.seoDescription;
    const enabledPages = payload.enabledPages ?? {
      home: true,
      about: true,
      services: true,
      contact: true,
      privacy: true,
    };

    await this.repos.tenants.update(tenantId, {
      bedrijfsnaam: payload.business.name.trim(),
      branche: payload.business.industry.trim(),
      description: payload.business.description.trim(),
      updatedAt: now,
    });

    await this.repos.websites.update(website.id, {
      seoTitle,
      metaDescription,
      primaryColor: payload.branding.primaryColor,
      secondaryColor: payload.branding.accentColor,
      fontFamily: payload.design.fontFamily,
      logoKey,
      updatedAt: now,
    });

    if (payload.approvalStatus || payload.configSnapshotJson) {
      await this.db
        .prepare(
          `UPDATE websites SET
            approval_status = COALESCE(?, approval_status),
            config_snapshot_json = COALESCE(?, config_snapshot_json),
            updated_at = ?
           WHERE id = ?`,
        )
        .bind(payload.approvalStatus ?? null, payload.configSnapshotJson ?? null, now, website.id)
        .run();
    }

    await this.repos.contacts.update(contact.id, {
      telefoon: payload.contact.phone.trim(),
      whatsapp: payload.contact.whatsapp.trim(),
      email: payload.contact.email.trim(),
      adres: payload.contact.street.trim(),
      postcode: payload.contact.postcode.trim(),
      plaats: payload.contact.city.trim(),
      updatedAt: now,
    });

    await this.repos.services.deleteByTenantId(tenantId);
    const services = payload.business.services.filter((s) => s.title.trim());
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

    await this.repos.openingHours.deleteByTenantId(tenantId);
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

    await this.repos.websitePages.deleteByTenantId(tenantId);
    for (const page of WEBSITE_PAGES) {
      if (enabledPages[page] === false) continue;
      const seo = seoByPage[page];
      const path = tenantPagePath(page);
      const contentJson = JSON.stringify({
        pageKey: page,
        h1: seo.h1,
        title: PAGE_TITLES[page],
        intro:
          page === 'home' ? copy.homeIntro : page === 'about' ? copy.aboutIntro : copy.servicesIntro,
      });

      await this.repos.websitePages.create({
        id: crypto.randomUUID(),
        tenantId,
        websiteId: website.id,
        pageKey: page,
        title: PAGE_TITLES[page],
        slug: path.replace(/^\//, '').replace(/\/$/, '') || 'home',
        contentJson,
        seoTitle: seo.title,
        metaDescription: seo.description,
        canonicalPath: path,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      });
    }

    await this.repos.mediaItems.deleteByTenantId(tenantId);

    if (logoKey) {
      const logoFile = payload.media.find((m) => m.kind === 'logo');
      await this.repos.mediaItems.create({
        id: crypto.randomUUID(),
        tenantId,
        mediaType: 'logo',
        storageKey: logoKey,
        filename: logoFile?.filename ?? 'logo',
        mimeType: logoFile?.mimeType ?? 'image/png',
        sizeBytes: logoFile ? decodeBase64(logoFile.dataBase64).byteLength : 0,
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    const photoFiles = payload.media.filter((m) => m.kind === 'photo');
    for (let index = 0; index < photoFiles.length; index += 1) {
      const file = photoFiles[index];
      const key = photoKeys[index];
      if (!key) continue;
      await this.repos.mediaItems.create({
        id: crypto.randomUUID(),
        tenantId,
        mediaType: 'photo',
        storageKey: key,
        filename: file.filename,
        mimeType: file.mimeType,
        sizeBytes: decodeBase64(file.dataBase64).byteLength,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    }

    const subdomain = `${tenant.slug}.starlocal.nl`;
    return {
      tenantId,
      websiteId: website.id,
      slug: tenant.slug,
      status: 'draft',
      url: `https://${subdomain}`,
      dashboardUrl: `/dashboard/?tenantId=${tenantId}`,
      editorUrl: `/dashboard/editor/?tenantId=${tenantId}`,
      savedAt: now,
      pageCount: WEBSITE_PAGES.filter((page) => enabledPages[page] !== false).length,
    };
  }
}
