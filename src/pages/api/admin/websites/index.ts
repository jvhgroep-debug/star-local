import type { APIRoute } from 'astro';
import { RESEND_API_KEY, FROM_EMAIL } from 'astro:env/server';
import type { ApprovalStatus } from '../../../../types/approval';
import { AdminQueueRepository } from '../../../../lib/admin/admin-queue.repository';
import { isAdminApiDenied, requireAdminApiAccess } from '../../../../lib/admin/api-guard';
import { sendAdminApprovalNotification } from '../../../../lib/email/admin-notifications';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ url, locals, request }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

  const repo = new AdminQueueRepository(db);
  const id = url.searchParams.get('id');

  if (id) {
    const row = await repo.findByIdWithSnapshot(id);
    if (!row) {
      return json({ ok: false, message: 'Website niet gevonden.' }, 404);
    }
    const { configSnapshotJson, ...item } = row;
    return json({ ok: true, item, configSnapshotJson });
  }

  const items = await repo.list();
  return json({ ok: true, items });
};

export const PATCH: APIRoute = async ({ request, locals, url }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

  let body: {
    id?: string;
    approvalStatus?: ApprovalStatus;
    rejectionReason?: string;
    rejectionCategory?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  const id = body.id?.trim();
  const approvalStatus = body.approvalStatus;
  if (!id || !approvalStatus) {
    return json({ ok: false, message: 'id en approvalStatus zijn verplicht.' }, 400);
  }

  const repo = new AdminQueueRepository(db);
  const updated = await repo.updateApprovalStatus(id, approvalStatus, {
    rejectionReason: body.rejectionReason,
    rejectionCategory: body.rejectionCategory,
  });
  if (!updated) {
    return json({ ok: false, message: 'Website niet gevonden.' }, 404);
  }

  const item = await repo.findById(id);

  const apiKey = RESEND_API_KEY?.trim();
  const fromEmail = FROM_EMAIL?.trim();
  if (item && apiKey && fromEmail && item.email) {
    if (approvalStatus === 'approved' || approvalStatus === 'rejected') {
      await sendAdminApprovalNotification(apiKey, fromEmail, {
        to: item.email,
        businessName: item.businessName,
        subdomain: item.subdomain,
        status: approvalStatus === 'approved' ? 'approved' : 'rejected',
      }).catch(() => undefined);
    }
  }

  return json({ ok: true, item });
};

export const DELETE: APIRoute = async ({ request, locals, url }) => {
  const access = await requireAdminApiAccess(request, locals, url);
  if (isAdminApiDenied(access)) return access;
  const { db } = access;

  let body: { id?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, message: 'Ongeldige JSON.' }, 400);
  }

  const id = body.id?.trim();
  if (!id) {
    return json({ ok: false, message: 'id is verplicht.' }, 400);
  }

  const repo = new AdminQueueRepository(db);
  const deleted = await repo.deleteWebsite(id);
  if (!deleted) {
    return json({ ok: false, message: 'Website niet gevonden.' }, 404);
  }

  return json({ ok: true });
};
