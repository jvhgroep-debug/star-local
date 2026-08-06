import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { requireAuthSession, isAuthRedirect } from '../../../../lib/auth/guard';
import { CustomerRepository } from '../../../../lib/customer-portal/repositories';
import { readCsrfCookie, validateCsrfToken } from '../../../../lib/customer-portal/csrf';
import { ChangeRequestService, type CreateChangeRequestPayload } from '../../../../lib/change-requests/service';
import { CHANGE_REQUEST_STATUS_LABELS, CHANGE_REQUEST_TYPE_LABELS } from '../../../../types/change-request';

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

export const GET: APIRoute = async ({ request, locals, url }) => {
  const db = getDb(locals);
  if (!db) return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);

  const auth = await requireAuthSession(request, db, url);
  if (isAuthRedirect(auth)) return json({ ok: false, message: 'Niet ingelogd.' }, 401);

  const customers = new CustomerRepository(db);
  const customer = await customers.upsertFromUser({
    userId: auth.session.user.id,
    email: auth.session.user.email,
  });

  const service = new ChangeRequestService(db);
  const items = await service.listForCustomer(customer.id);

  return json({
    ok: true,
    items: items.map((item) => ({
      ...item,
      typeLabel: CHANGE_REQUEST_TYPE_LABELS[item.requestType],
      statusLabel: CHANGE_REQUEST_STATUS_LABELS[item.status],
    })),
  });
};

export const POST: APIRoute = async ({ request, locals, url }) => {
  const db = getDb(locals);
  if (!db) return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);

  if (!validateCsrfToken(request, readCsrfCookie(request))) {
    return json({ ok: false, message: 'CSRF-validatie mislukt.' }, 403);
  }

  const auth = await requireAuthSession(request, db, url);
  if (isAuthRedirect(auth)) return json({ ok: false, message: 'Niet ingelogd.' }, 401);

  let payload: CreateChangeRequestPayload;
  try {
    payload = (await request.json()) as CreateChangeRequestPayload;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  const customers = new CustomerRepository(db);
  const customer = await customers.upsertFromUser({
    userId: auth.session.user.id,
    email: auth.session.user.email,
  });

  try {
    const service = new ChangeRequestService(db);
    const result = await service.createForCustomer(customer.id, payload);
    return json({
      ok: true,
      item: {
        ...result.record,
        typeLabel: result.typeLabel,
        statusLabel: CHANGE_REQUEST_STATUS_LABELS[result.record.status],
      },
      message: result.message,
    });
  } catch (error) {
    return json({ ok: false, message: error instanceof Error ? error.message : 'Indienen mislukt.' }, 400);
  }
};
