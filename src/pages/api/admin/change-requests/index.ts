import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { ChangeRequestService } from '../../../../lib/change-requests/service';
import {
  CHANGE_REQUEST_STATUS_LABELS,
  CHANGE_REQUEST_TYPE_LABELS,
  PHOTO_PLACEMENT_LABELS,
  type ChangeRequestStatus,
} from '../../../../types/change-request';
import { formatMediaSummary } from '../../../../lib/media/pending-media.resolver';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getDb(locals: App.Locals): D1Database | null {
  return (locals.runtime as { env?: { DB?: D1Database } })?.env?.DB ?? null;
}

export const GET: APIRoute = async ({ locals, url }) => {
  const db = getDb(locals);
  if (!db) return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);

  const service = new ChangeRequestService(db);
  const id = url.searchParams.get('id');

  if (id) {
    const items = await service.listForAdmin();
    const item = items.find((row) => row.id === id);
    if (!item) return json({ ok: false, message: 'Verzoek niet gevonden.' }, 404);
    return json({
      ok: true,
      item: enrichAdminItem(item),
    });
  }

  const items = await service.listForAdmin();
  return json({
    ok: true,
    items: items.map(enrichAdminItem),
  });
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  const db = getDb(locals);
  if (!db) return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);

  let body: { id?: string; status?: ChangeRequestStatus; adminNotes?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  if (!body.id || !body.status) {
    return json({ ok: false, message: 'id en status zijn verplicht.' }, 400);
  }

  try {
    const service = new ChangeRequestService(db);
    const updated = await service.updateStatusAdmin(body.id, body.status, body.adminNotes);
    return json({
      ok: true,
      item: {
        ...updated,
        typeLabel: CHANGE_REQUEST_TYPE_LABELS[updated.requestType],
        statusLabel: CHANGE_REQUEST_STATUS_LABELS[updated.status],
      },
    });
  } catch (error) {
    return json({ ok: false, message: error instanceof Error ? error.message : 'Bijwerken mislukt.' }, 400);
  }
};

function enrichAdminItem(item: Awaited<ReturnType<ChangeRequestService['listForAdmin']>>[number]) {
  const placement = item.mediaMetadata?.placement;
  const placementLabel =
    placement && placement in PHOTO_PLACEMENT_LABELS
      ? PHOTO_PLACEMENT_LABELS[placement as keyof typeof PHOTO_PLACEMENT_LABELS]
      : placement || item.requestedLocation;

  return {
    ...item,
    typeLabel: CHANGE_REQUEST_TYPE_LABELS[item.requestType],
    statusLabel: CHANGE_REQUEST_STATUS_LABELS[item.status],
    mediaSummary: formatMediaSummary(item.mediaMetadata),
    placementLabel: placementLabel || null,
  };
}
