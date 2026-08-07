import { AUTH_ROUTES } from '../auth/constants';

export function buildMagicLinkUrl(origin: string, plainToken: string, magicRoute = AUTH_ROUTES.magic): string {
  const base = origin.replace(/\/$/, '');
  return `${base}${magicRoute}?token=${encodeURIComponent(plainToken)}`;
}

export function renderMagicLinkEmail(options: { magicUrl: string; minutesValid: number }): { subject: string; html: string; text: string } {
  const subject = 'Uw Star Local inloglink';
  const text = `Open deze link om in te loggen op uw Star Local dashboard (geldig ${options.minutesValid} minuten):\n\n${options.magicUrl}\n\nAls u dit niet heeft aangevraagd, negeer deze e-mail.`;

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#111;">
      <h1 style="color:#1a2332;font-size:22px;">Inloggen bij Star Local</h1>
      <p>Klik op de knop hieronder om uw dashboard te openen en uw website te beheren.</p>
      <p style="margin:24px 0;">
        <a href="${options.magicUrl}" style="display:inline-block;background:#cdb880;color:#111;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;">
          Dashboard openen
        </a>
      </p>
      <p style="color:#666;font-size:14px;">Deze link is ${options.minutesValid} minuten geldig en kan maar één keer gebruikt worden.</p>
      <p style="color:#666;font-size:13px;word-break:break-all;">${options.magicUrl}</p>
    </div>
  `;

  return { subject, html, text };
}
