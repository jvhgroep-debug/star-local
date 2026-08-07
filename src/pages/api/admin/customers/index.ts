import type { APIRoute } from 'astro';
import { AuthRepository } from '../../../../lib/auth/repository';
import { isAdminApiDenied, requireAdminApiAccess } from '../../../../lib/admin/api-guard';
import { CustomerRepository, WebsitePermissionRepository } from '../../../../lib/customer-portal/repositories';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ locals, request, url }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

  const customers = new CustomerRepository(db);
  const permissions = new WebsitePermissionRepository(db);
  const authRepo = new AuthRepository(db);

  const list = await customers.listAll();
  const items = await Promise.all(
    list.map(async (customer) => {
      const websites = await permissions.listWebsitesForCustomer(customer.id);
      const sessions = await authRepo.listSessionsForCustomer(customer.id);
      return {
        ...customer,
        websiteCount: websites.length,
        activeSessions: sessions.length,
      };
    }),
  );

  return json({ ok: true, items });
};

export const POST: APIRoute = async ({ request, locals, url }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

  let body: { customerId?: string; action?: 'revoke_magic_links' | 'revoke_sessions' };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  const customerId = body.customerId?.trim();
  if (!customerId || !body.action) {
    return json({ ok: false, message: 'customerId en action zijn verplicht.' }, 400);
  }

  const authRepo = new AuthRepository(db);
  if (body.action === 'revoke_magic_links') {
    const count = await authRepo.revokeMagicLinksForCustomer(customerId);
    return json({ ok: true, revoked: count });
  }
  if (body.action === 'revoke_sessions') {
    const count = await authRepo.revokeSessionsForCustomer(customerId);
    return json({ ok: true, revoked: count });
  }

  return json({ ok: false, message: 'Onbekende actie.' }, 400);
};
