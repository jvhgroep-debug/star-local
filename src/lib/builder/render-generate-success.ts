import type { AutoGenerateSummary } from './generator/auto-generate.service';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderGenerateSuccess(summary: AutoGenerateSummary): string {
  return `
    <div class="builder-generate-success">
      <header class="builder-generate-success__header">
        <p class="eyebrow">Concept opgeslagen</p>
        <h1>Website succesvol aangemaakt</h1>
        <p class="builder-subtitle">
          Uw website is opgeslagen als concept.
          Na de bèta kunt u deze met één klik publiceren.
        </p>
        <p class="builder-generate-success__meta">
          ${escapeHtml(summary.businessName)} · ${escapeHtml(summary.pageCount)} pagina's · ${escapeHtml(summary.domain)}
        </p>
      </header>

      <div class="builder-generate-success__actions">
        <button type="button" class="btn btn-primary" data-open-generated-preview>Bekijk voorbeeld</button>
        <a class="btn btn-secondary" href="/dashboard/">Naar dashboard</a>
        <button type="button" class="btn btn-secondary" data-edit-generated-website>Website aanpassen</button>
      </div>
    </div>
  `;
}
