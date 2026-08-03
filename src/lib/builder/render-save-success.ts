import type { SaveWebsiteResult } from '../../types/save';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSaveSuccess(result: SaveWebsiteResult, magicLinkSent = false): string {
  const loginNext = encodeURIComponent(result.dashboardUrl);
  return `
    <div class="builder-save-success">
      <header class="builder-save-success__header">
        <p class="eyebrow">Website opgeslagen</p>
        <h1>Uw website is veilig opgeslagen</h1>
        <p class="builder-subtitle">
          Status: <strong>Concept</strong> — uw gegevens staan in ons systeem. Live publicatie volgt in een latere fase.
        </p>
        ${
          magicLinkSent
            ? '<p class="builder-hint">We hebben een inloglink naar uw e-mail gestuurd om het dashboard te openen.</p>'
            : '<p class="builder-hint">Log in met hetzelfde e-mailadres om uw dashboard te openen.</p>'
        }
      </header>

      <dl class="builder-save-success__meta">
        <div>
          <dt>Website-ID</dt>
          <dd><code>${escapeHtml(result.websiteId)}</code></dd>
        </div>
        <div>
          <dt>Toekomstige URL</dt>
          <dd>${escapeHtml(result.url)} <span class="builder-muted">(live na publicatie)</span></dd>
        </div>
        <div>
          <dt>Subdomein</dt>
          <dd>${escapeHtml(result.slug)}.starlocal.nl</dd>
        </div>
        <div>
          <dt>Pagina's opgeslagen</dt>
          <dd>${result.pageCount}</dd>
        </div>
      </dl>

      <div class="builder-save-success__actions">
        <a class="btn btn-primary" href="/login/?next=${loginNext}">Dashboard openen</a>
        <a class="btn btn-secondary" href="${escapeHtml(result.editorUrl)}">Website bewerken</a>
        <button type="button" class="btn btn-secondary" data-back-to-builder>Terug naar wizard</button>
      </div>
    </div>
  `;
}
