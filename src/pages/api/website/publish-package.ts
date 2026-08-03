import type { APIRoute } from 'astro';
import type { D1Database } from '../../../lib/db/d1';
import { createRepositories } from '../../../lib/db';
import { buildWebsiteConfig } from '../../../lib/builder/website-config';
import { createEmptyFiles } from '../../../lib/builder/files';
import { mapLoadResultToBuilderState } from '../../../lib/editor/load-from-d1';
import type { LoadWebsiteResult } from '../../../types/save';
import type { BuildPublicationResponse } from '../../../types/publication';
import { computeTenantKey, localPublishService } from '../../../lib/publish/local-publish.service';

export const prerender = false;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getDb(locals: App.Locals): D1Database | null {
  const runtime = locals.runtime as { env?: { DB?: D1Database } } | undefined;
  return runtime?.env?.DB ?? null;
}

/** POST — build local publication package from D1 website (no R2 upload). */
export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDb(locals);
  if (!db) {
    return json({ ok: false, code: 'DB_UNAVAILABLE', message: 'Database niet beschikbaar.' }, 503);
  }

  let body: { tenantId?: string; republish?: boolean };
  try {
    body = (await request.json()) as { tenantId?: string; republish?: boolean };
  } catch {
    return json({ ok: false, code: 'INVALID_JSON', message: 'Ongeldige aanvraag.' }, 400);
  }

  const tenantId = body.tenantId?.trim();
  if (!tenantId) {
    return json({ ok: false, code: 'MISSING_TENANT', message: 'Tenant-ID ontbreekt.' }, 400);
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

  const loadResult: LoadWebsiteResult = {
    tenantId: tenant.id,
    websiteId: website.id,
    slug: tenant.slug,
    status: website.status,
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
    location: {
      gemeenteSlug: contact?.gemeenteSlug ?? '',
      gemeenteNaam: contact?.gemeenteNaam ?? '',
      provincie: contact?.provincie ?? '',
    },
    hours: hours.map((row) => ({
      day: '',
      dayKey: 'monday' as const,
      closed: row.closed,
      open24: row.openTime === '00:00' && row.closeTime === '23:59',
      openTime: row.openTime ?? '09:00',
      closeTime: row.closeTime ?? '17:00',
    })),
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
    media: media.map((item) => ({
      id: item.id,
      mediaType: item.mediaType,
      storageKey: item.storageKey,
      filename: item.filename,
      mimeType: item.mimeType,
    })),
  };

  const state = mapLoadResultToBuilderState(loadResult);
  const files = createEmptyFiles();
  const config = buildWebsiteConfig(state, files, {
    package: website.package,
    publishEmail: contact?.email ?? '',
  });

  const tenantKey = computeTenantKey(tenant.slug, tenantId);
  const result: BuildPublicationResponse = localPublishService.buildPackage(
    { config },
    { tenantKey, websiteId: website.id, republish: Boolean(body.republish) },
  );

  if (result.ok) {
    const now = new Date().toISOString();
    try {
      await db
        .prepare(
          `INSERT INTO publication_logs (
            id, tenant_id, website_id, status, started_at, finished_at, duration_ms,
            page_count, image_count, seo_score, errors_json, changed_files_json,
            republish, package_hash, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          result.log.id,
          tenantId,
          website.id,
          result.log.status,
          result.log.startedAt,
          result.log.finishedAt,
          result.log.durationMs,
          result.log.pageCount,
          result.log.imageCount,
          result.log.seoScore,
          JSON.stringify(result.log.errors),
          JSON.stringify(result.log.changedFiles),
          result.log.republish ? 1 : 0,
          result.log.packageHash,
          now,
        )
        .run();

      await db
        .prepare('UPDATE websites SET publication_status = ?, last_published_at = ?, updated_at = ? WHERE id = ?')
        .bind('published', result.log.finishedAt, now, website.id)
        .run();
    } catch {
      // Migration may not be applied locally — package still built successfully.
    }

    return json({ ok: true, result }, 200);
  }

  return json({ ok: false, message: result.message, log: result.log }, 422);
};

/** GET — list publication logs for tenant. */
export const GET: APIRoute = async ({ url, locals }) => {
  const db = getDb(locals);
  if (!db) {
    return json({ ok: false, code: 'DB_UNAVAILABLE', message: 'Database niet beschikbaar.' }, 503);
  }

  const tenantId = url.searchParams.get('tenantId')?.trim();
  if (!tenantId) {
    return json({ ok: false, code: 'MISSING_TENANT', message: 'Tenant-ID ontbreekt.' }, 400);
  }

  try {
    const { results = [] } = await db
      .prepare(
        `SELECT id, tenant_id, website_id, status, started_at, finished_at, duration_ms,
                page_count, image_count, seo_score, errors_json, changed_files_json,
                republish, package_hash
         FROM publication_logs WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 20`,
      )
      .bind(tenantId)
      .all<{
        id: string;
        tenant_id: string;
        website_id: string;
        status: string;
        started_at: string;
        finished_at: string | null;
        duration_ms: number | null;
        page_count: number;
        image_count: number;
        seo_score: number;
        errors_json: string;
        changed_files_json: string;
        republish: number;
        package_hash: string | null;
      }>();

    const logs = results.map((row) => ({
      id: row.id,
      tenantKey: row.tenant_id,
      websiteId: row.website_id,
      status: row.status,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      durationMs: row.duration_ms,
      pageCount: row.page_count,
      imageCount: row.image_count,
      seoScore: row.seo_score,
      errors: JSON.parse(row.errors_json || '[]') as string[],
      changedFiles: JSON.parse(row.changed_files_json || '[]') as string[],
      republish: row.republish === 1,
      packageHash: row.package_hash,
    }));

    return json({ ok: true, logs }, 200);
  } catch {
    return json({ ok: true, logs: [] }, 200);
  }
};
