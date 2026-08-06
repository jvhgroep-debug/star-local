import type { APIRoute } from 'astro';
import type { D1Database } from '../../../../lib/db/d1';
import { requireAuthSession, isAuthRedirect } from '../../../../lib/auth/guard';
import { CustomerRepository } from '../../../../lib/customer-portal/repositories';
import { CustomerEditService } from '../../../../lib/customer-portal/edit.service';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ request, locals, url }) => {
  const db = (locals.runtime as { env?: { DB?: D1Database } })?.env?.DB ?? null;
  if (!db) return json({ ok: false, message: 'Database niet beschikbaar.' }, 503);

  const auth = await requireAuthSession(request, db, url);
  if (isAuthRedirect(auth)) return json({ ok: false, message: 'Niet ingelogd.' }, 401);

  const websiteId = url.searchParams.get('websiteId')?.trim();
  const tenantId = url.searchParams.get('tenantId')?.trim();
  if (!websiteId || !tenantId) {
    return json({ ok: false, message: 'websiteId en tenantId zijn verplicht.' }, 400);
  }

  const customers = new CustomerRepository(db);
  const customer = await customers.upsertFromUser({
    userId: auth.session.user.id,
    email: auth.session.user.email,
  });

  try {
    const service = new CustomerEditService(db);
    const data = await service.loadEditData(customer.id, websiteId, tenantId);
    return json({ ok: true, data });
  } catch (error) {
    return json({ ok: false, message: error instanceof Error ? error.message : 'Laden mislukt.' }, 403);
  }
};
