import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { requireAuthSession, isAuthRedirect } from '../../../../lib/auth/guard';
import { CustomerRepository } from '../../../../lib/customer-portal/repositories';
import { CustomerEditService, type CustomerWebsiteEditPayload } from '../../../../lib/customer-portal/edit.service';
import { readCsrfCookie, validateCsrfToken } from '../../../../lib/customer-portal/csrf';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const PATCH: APIRoute = async ({ request, locals, url }) => {
  const db = (locals.runtime as { env?: { DB?: D1Database } })?.env?.DB ?? null;
  if (!db) return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);

  if (!validateCsrfToken(request, readCsrfCookie(request))) {
    return json({ ok: false, message: 'CSRF-validatie mislukt.' }, 403);
  }

  const auth = await requireAuthSession(request, db, url);
  if (isAuthRedirect(auth)) return json({ ok: false, message: 'Niet ingelogd.' }, 401);

  let payload: CustomerWebsiteEditPayload;
  try {
    payload = (await request.json()) as CustomerWebsiteEditPayload;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  if (!payload.websiteId || !payload.tenantId) {
    return json({ ok: false, message: 'websiteId en tenantId zijn verplicht.' }, 400);
  }

  const customers = new CustomerRepository(db);
  const customer = await customers.upsertFromUser({
    userId: auth.session.user.id,
    email: auth.session.user.email,
  });

  try {
    const service = new CustomerEditService(db);
    const result = await service.saveEdits(customer.id, payload);
    return json({
      ok: true,
      pendingReview: result.pendingReview,
      message: result.pendingReview
        ? 'Wijzigingen opgeslagen en in review geplaatst. Uw live website blijft online.'
        : 'Wijzigingen opgeslagen.',
    });
  } catch (error) {
    return json({ ok: false, message: error instanceof Error ? error.message : 'Opslaan mislukt.' }, 400);
  }
};
