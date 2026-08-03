import type { APIRoute } from 'astro';
import { DAY_DEFINITIONS } from '../../../lib/builder/constants';
import { createRepositories } from '../../../lib/db';
import type { D1Database } from '../../../lib/db/d1';
import { AuthRepository } from '../../../lib/auth/repository';
import { getAuthSession, getSessionTokenFromRequest } from '../../../lib/auth/server';
import { createMediaServiceOrLocal } from '../../../lib/media';
import type { R2Bucket } from '../../../lib/media/r2';
import { weekdayToDayKey } from '../../../lib/publish/validation';
import type { LoadWebsiteResponse } from '../../../types/save';
import type { BuilderLocation, DayHours, EnabledPages } from '../../../types/builder';

export const prerender = false;

function arrayBufferToDataUrl(buffer: ArrayBuffer, mimeType: string): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:${mimeType};base64,${btoa(binary)}`;
}

function json(body: LoadWebsiteResponse, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getRuntimeEnv(locals: App.Locals): { db: D1Database | null; media: R2Bucket | null } {
  const runtime = locals.runtime as { env?: { DB?: D1Database; MEDIA?: R2Bucket } } | undefined;
  return {
    db: runtime?.env?.DB ?? null,
    media: runtime?.env?.MEDIA ?? null,
  };
}

function mapHours(rows: Awaited<ReturnType<ReturnType<typeof createRepositories>['openingHours']['listByTenantId']>>): DayHours[] {
  const byWeekday = new Map(rows.map((row) => [row.weekday, row]));
  return DAY_DEFINITIONS.map((day, index) => {
    const row = byWeekday.get(index as typeof rows[0]['weekday']);
    if (!row) {
      return {
        day: day.label,
        dayKey: day.key,
        closed: day.key === 'sunday',
        open24: false,
        openTime: '09:00',
        closeTime: '17:00',
      };
    }
    return {
      day: day.label,
      dayKey: weekdayToDayKey(row.weekday),
      closed: row.closed,
      open24: row.openTime === '00:00' && row.closeTime === '23:59',
      openTime: row.openTime ?? '09:00',
      closeTime: row.closeTime ?? '17:00',
    };
  });
}

export const GET: APIRoute = async ({ url, request, locals }) => {
  const { db, media: mediaBucket } = getRuntimeEnv(locals);
  if (!db) {
    return json({ ok: false, code: 'DB_UNAVAILABLE', message: 'Database niet beschikbaar.' }, 503);
  }

  const mediaService = createMediaServiceOrLocal(mediaBucket);

  const tenantId = url.searchParams.get('tenantId')?.trim();
  if (!tenantId) {
    return json({ ok: false, code: 'MISSING_TENANT', message: 'Tenant-ID ontbreekt.' }, 400);
  }

  const sessionToken = getSessionTokenFromRequest(request);
  const authSession = sessionToken ? await getAuthSession(db, sessionToken) : null;
  if (authSession) {
    const repo = new AuthRepository(db);
    const allowed =
      authSession.session.tenantId === tenantId ||
      (await repo.findTenantUser(tenantId, authSession.user.id)) !== null;
    if (!allowed) {
      return json({ ok: false, code: 'FORBIDDEN', message: 'Geen toegang tot deze website.' }, 403);
    }
  }

  const repos = createRepositories(db);
  const tenant = await repos.tenants.findById(tenantId);
  if (!tenant) {
    return json({ ok: false, code: 'NOT_FOUND', message: 'Website niet gevonden.' }, 404);
  }

  const [website, contact, services, hours, pages, media] = await Promise.all([
    repos.websites.findByTenantId(tenantId),
    repos.contacts.findByTenantId(tenantId),
    repos.services.listByTenantId(tenantId),
    repos.openingHours.listByTenantId(tenantId),
    repos.websitePages.listByTenantId(tenantId),
    repos.mediaItems.listByTenantId(tenantId),
  ]);

  if (!website) {
    return json({ ok: false, code: 'NOT_FOUND', message: 'Website niet gevonden.' }, 404);
  }

  const location: BuilderLocation = {
    gemeenteSlug: contact?.gemeenteSlug ?? '',
    gemeenteNaam: contact?.gemeenteNaam ?? '',
    provincie: contact?.provincie ?? '',
  };

  const enabledPages: EnabledPages = {
    home: true,
    about: pages.some((item) => item.pageKey === 'about'),
    services: pages.some((item) => item.pageKey === 'services'),
    contact: pages.some((item) => item.pageKey === 'contact'),
    privacy: pages.some((item) => item.pageKey === 'privacy'),
  };

  const mediaWithData = await Promise.all(
    media.map(async (item) => {
      let dataUrl: string | undefined;
      const bytes = await mediaService.readObjectBytes(item.storageKey);
      if (bytes) {
        dataUrl = arrayBufferToDataUrl(bytes, item.mimeType);
      }
      return {
        id: item.id,
        mediaType: item.mediaType,
        storageKey: item.storageKey,
        filename: item.filename,
        mimeType: item.mimeType,
        sortOrder: item.sortOrder,
        dataUrl,
      };
    }),
  );

  return json(
    {
      ok: true,
      result: {
        tenantId: tenant.id,
        websiteId: website.id,
        slug: tenant.slug,
        status: website.status,
        heroTitle: website.seoTitle,
        seoMetaDescription: website.metaDescription,
        enabledPages,
        business: {
          name: tenant.bedrijfsnaam,
          industry: tenant.branche,
          description: tenant.description,
          services: services.map((service) => ({
            id: service.id,
            title: service.titel,
            description: service.omschrijving,
          })),
        },
        contact: {
          phone: contact?.telefoon ?? '',
          whatsapp: contact?.whatsapp ?? '',
          email: contact?.email ?? '',
          website: contact?.website ?? '',
          street: contact?.adres ?? '',
          postcode: contact?.postcode ?? '',
          city: contact?.plaats ?? '',
          country: 'Nederland',
          kvk: contact?.kvk ?? '',
        },
        location,
        hours: mapHours(hours),
        branding: {
          primaryColor: website.primaryColor,
          accentColor: website.secondaryColor,
          logoKey: website.logoKey,
        },
        design: {
          fontFamily: (website.fontFamily as 'system' | 'serif' | 'modern' | 'display') ?? 'system',
          buttonStyle: 'solid',
          cornerRadius: 'rounded',
          shadow: 'soft',
        },
        package: website.package,
        pages: pages.map((page) => ({
          pageKey: page.pageKey,
          title: page.title,
          slug: page.slug,
          seoTitle: page.seoTitle,
          metaDescription: page.metaDescription,
          canonicalPath: page.canonicalPath,
          status: page.status,
        })),
        media: mediaWithData,
      },
    },
    200,
  );
};
