import type { APIRoute } from 'astro';
import type { D1Database } from '../../../lib/db/d1';
import { requireAuthSession, isAuthRedirect } from '../../../lib/auth/guard';
import { CustomerRepository, WebsitePermissionRepository } from '../../../lib/customer-portal/repositories';
import { mapCustomerWebsiteToCard, primaryBusinessName } from '../../../lib/customer-portal/dashboard-mapper';

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

  const customers = new CustomerRepository(db);
  const customer = await customers.upsertFromUser({
    userId: auth.session.user.id,
    email: auth.session.user.email,
  });

  const permissions = new WebsitePermissionRepository(db);
  const websites = (await permissions.listWebsitesForCustomer(customer.id)).map(mapCustomerWebsiteToCard);

  return json({
    ok: true,
    customer: {
      id: customer.id,
      email: customer.email,
      businessName: primaryBusinessName(websites, customer.email),
    },
    websites,
  });
};
