export type TenantErrorKind = 'not_found' | 'not_published' | 'building' | 'page_not_found' | 'bindings_missing';

interface TenantErrorOptions {
  slug?: string;
  title?: string;
  message?: string;
}

const DEFAULT_COPY: Record<TenantErrorKind, { title: string; message: string; status: number }> = {
  not_found: {
    title: 'Website niet gevonden',
    message: 'Deze website bestaat niet of is niet meer beschikbaar.',
    status: 404,
  },
  not_published: {
    title: 'Website nog niet gepubliceerd',
    message: 'Deze website is nog in voorbereiding en nog niet publiek toegankelijk.',
    status: 404,
  },
  building: {
    title: 'Website wordt bijgewerkt',
    message: 'Deze website wordt momenteel gebouwd. Probeer het over enkele minuten opnieuw.',
    status: 503,
  },
  page_not_found: {
    title: 'Pagina niet gevonden',
    message: 'De opgevraagde pagina bestaat niet op deze website.',
    status: 404,
  },
  bindings_missing: {
    title: 'Website tijdelijk niet beschikbaar',
    message: 'De website-server is tijdelijk niet volledig geconfigureerd. Neem contact op met de beheerder.',
    status: 503,
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Minimal standalone HTML error page for tenant hostnames (no Star Local marketing chrome). */
export function renderTenantErrorPage(kind: TenantErrorKind, options: TenantErrorOptions = {}): Response {
  const defaults = DEFAULT_COPY[kind];
  const title = options.title ?? defaults.title;
  const message = options.message ?? defaults.message;
  const slugHint = options.slug ? `<p class="hint">${escapeHtml(options.slug)}.starlocal.nl</p>` : '';

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: #f8fafc;
      color: #1e293b;
    }
    main {
      max-width: 28rem;
      padding: 2rem;
      text-align: center;
    }
    h1 { margin: 0 0 0.75rem; font-size: 1.5rem; }
    p { margin: 0; line-height: 1.6; color: #64748b; }
    .hint { margin-top: 1rem; font-size: 0.875rem; color: #94a3b8; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    ${slugHint}
  </main>
</body>
</html>`;

  return new Response(html, {
    status: defaults.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
