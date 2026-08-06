import { createResendEmailService } from './resend';

export async function sendAdminApprovalNotification(
  apiKey: string,
  fromEmail: string,
  input: { to: string; businessName: string; subdomain: string; status: 'approved' | 'rejected' },
): Promise<void> {
  const mailer = createResendEmailService(apiKey, fromEmail);
  const subject =
    input.status === 'approved'
      ? `Website goedgekeurd: ${input.businessName}`
      : `Website afgekeurd: ${input.businessName}`;

  const html =
    input.status === 'approved'
      ? `<p>Uw website <strong>${escapeHtml(input.businessName)}</strong> (${escapeHtml(input.subdomain)}) is goedgekeurd.</p><p>Het publicatiepakket wordt voorbereid door Star Local.</p>`
      : `<p>Uw website <strong>${escapeHtml(input.businessName)}</strong> (${escapeHtml(input.subdomain)}) is helaas afgekeurd.</p><p>Neem contact op met Star Local voor meer informatie.</p>`;

  await mailer.send({ to: input.to, subject, html, text: stripHtml(html) });
}

export async function sendPublicationLiveEmail(
  apiKey: string,
  fromEmail: string,
  input: { to: string; businessName: string; liveUrl: string; versionLabel: string },
): Promise<void> {
  const mailer = createResendEmailService(apiKey, fromEmail);
  const subject = `Uw website is live: ${input.businessName}`;
  const html = `<p>Gefeliciteerd! Uw website <strong>${escapeHtml(input.businessName)}</strong> is gepubliceerd.</p>
<p><a href="${escapeHtml(input.liveUrl)}">${escapeHtml(input.liveUrl)}</a></p>
<p>Versie: ${escapeHtml(input.versionLabel)}</p>`;
  await mailer.send({ to: input.to, subject, html, text: stripHtml(html) });
}

export async function sendAdminPublicationNotification(
  apiKey: string,
  fromEmail: string,
  input: { to: string; businessName: string; liveUrl: string; versionLabel: string },
): Promise<void> {
  const mailer = createResendEmailService(apiKey, fromEmail);
  const subject = `[Admin] Website live: ${input.businessName}`;
  const html = `<p>Website <strong>${escapeHtml(input.businessName)}</strong> is live gezet.</p>
<p>URL: <a href="${escapeHtml(input.liveUrl)}">${escapeHtml(input.liveUrl)}</a></p>
<p>Versie: ${escapeHtml(input.versionLabel)}</p>`;
  await mailer.send({ to: input.to, subject, html, text: stripHtml(html) });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
