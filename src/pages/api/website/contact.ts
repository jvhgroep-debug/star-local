import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { FROM_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { createRepositories } from '../../../lib/db';
import type { D1Database } from '../../../lib/db/d1';

export const prerender = false;

const DEFAULT_FROM_EMAIL = 'Star Local <contact@starlocal.nl>';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_PHONE = 40;
const MAX_MESSAGE = 5000;

type TenantContactPayload = {
  tenantId?: string;
  recipientEmail?: string;
  businessName?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  website?: string;
};

function json(body: { ok: boolean; message?: string }, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function getDb(locals: App.Locals): D1Database | null {
  const runtime = locals.runtime as { env?: { DB?: D1Database } } | undefined;
  return runtime?.env?.DB ?? null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: TenantContactPayload;

  try {
    payload = (await request.json()) as TenantContactPayload;
  } catch {
    return json({ ok: false, message: 'Ongeldige aanvraag.' }, 400);
  }

  if (readField(payload.website, 200)) {
    return json({ ok: true });
  }

  const name = readField(payload.name, MAX_NAME);
  const email = readField(payload.email, 254);
  const phone = readField(payload.phone, MAX_PHONE);
  const message = readField(payload.message, MAX_MESSAGE);
  const businessName = readField(payload.businessName, 160) || 'Website';
  const tenantId = readField(payload.tenantId, 64);
  let recipientEmail = readField(payload.recipientEmail, 254);

  if (!name || !email || !message) {
    return json({ ok: false, message: 'Vul naam, e-mail en bericht in.' }, 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return json({ ok: false, message: 'Vul een geldig e-mailadres in.' }, 400);
  }

  const db = getDb(locals);
  if (tenantId && db) {
    const repos = createRepositories(db);
    const contact = await repos.contacts.findByTenantId(tenantId);
    if (contact?.email?.trim()) {
      recipientEmail = contact.email.trim();
    }
  }

  if (!recipientEmail || !EMAIL_PATTERN.test(recipientEmail)) {
    return json({ ok: false, message: 'Contactformulier is nog niet gekoppeld aan een e-mailadres.' }, 400);
  }

  if (!RESEND_API_KEY) {
    return json(
      { ok: false, message: 'Verzending is tijdelijk niet beschikbaar. Neem telefonisch of per e-mail contact op.' },
      503,
    );
  }

  const resend = new Resend(RESEND_API_KEY);
  const subject = `Contactformulier ${businessName}: ${name}`;
  const fromEmail = FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    replyTo: email,
    subject,
    html: `
      <h2>Nieuw contactformulier via ${escapeHtml(businessName)}</h2>
      <p><strong>Naam:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefoon:</strong> ${escapeHtml(phone || '—')}</p>
      <h3>Bericht</h3>
      <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
    `,
    text: [
      `Nieuw contactformulier via ${businessName}`,
      '',
      `Naam: ${name}`,
      `E-mail: ${email}`,
      `Telefoon: ${phone || '—'}`,
      '',
      'Bericht:',
      message,
    ].join('\n'),
  });

  if (error) {
    return json({ ok: false, message: 'Verzenden mislukt. Probeer het later opnieuw.' }, 500);
  }

  return json({ ok: true, message: 'Bedankt! Uw bericht is verzonden.' }, 200);
};
