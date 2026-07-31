import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { CONTACT_TO_EMAIL, FROM_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { SITE } from '../../data/site';

export const prerender = false;

const DEFAULT_FROM_EMAIL = 'Star Local <contact@starlocal.nl>';
const DEFAULT_TO_EMAIL = SITE.email;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_COMPANY = 160;
const MAX_PHONE = 40;
const MAX_SUBJECT = 120;
const MAX_MESSAGE = 5000;

type ContactPayload = {
  naam?: string;
  bedrijfsnaam?: string;
  email?: string;
  telefoon?: string;
  onderwerp?: string;
  bericht?: string;
  privacy?: boolean;
  website?: string;
};

function jsonResponse(body: { ok: boolean; message?: string }, status: number) {
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

function buildEmailHtml(data: Required<Pick<ContactPayload, 'naam' | 'email' | 'onderwerp' | 'bericht'>> & {
  bedrijfsnaam: string;
  telefoon: string;
}) {
  const rows = [
    ['Naam', data.naam],
    ['Bedrijfsnaam', data.bedrijfsnaam || '—'],
    ['E-mail', data.email],
    ['Telefoon', data.telefoon || '—'],
    ['Onderwerp', data.onderwerp],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return `
    <h2>Nieuw contactformulier via starlocal.nl</h2>
    <table style="border-collapse:collapse;width:100%;max-width:640px;">${tableRows}</table>
    <h3 style="margin-top:24px;">Bericht</h3>
    <p style="white-space:pre-wrap;">${escapeHtml(data.bericht)}</p>
  `;
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  if (readField(payload.website, 200)) {
    return jsonResponse({ ok: true });
  }

  const naam = readField(payload.naam, MAX_NAME);
  const bedrijfsnaam = readField(payload.bedrijfsnaam, MAX_COMPANY);
  const email = readField(payload.email, 254);
  const telefoon = readField(payload.telefoon, MAX_PHONE);
  const onderwerp = readField(payload.onderwerp, MAX_SUBJECT);
  const bericht = readField(payload.bericht, MAX_MESSAGE);
  const privacy = payload.privacy === true;

  if (!naam || !email || !onderwerp || !bericht || !privacy) {
    return jsonResponse({ ok: false }, 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return jsonResponse({ ok: false }, 400);
  }

  if (!RESEND_API_KEY) {
    return jsonResponse({ ok: false }, 503);
  }

  const resend = new Resend(RESEND_API_KEY);
  const subject = `Contactformulier: ${onderwerp}`;
  const fromEmail = FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const toEmail = CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject,
    html: buildEmailHtml({ naam, bedrijfsnaam, email, telefoon, onderwerp, bericht }),
    text: [
      'Nieuw contactformulier via starlocal.nl',
      '',
      `Naam: ${naam}`,
      `Bedrijfsnaam: ${bedrijfsnaam || '—'}`,
      `E-mail: ${email}`,
      `Telefoon: ${telefoon || '—'}`,
      `Onderwerp: ${onderwerp}`,
      '',
      'Bericht:',
      bericht,
    ].join('\n'),
  });

  if (error) {
    return jsonResponse({ ok: false }, 500);
  }

  return jsonResponse({ ok: true }, 200);
};
