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
        <p class="eyebrow builder-generate-success__status">Concept opgeslagen — wacht op goedkeuring</p>
        <h1>Uw website is succesvol aangemaakt.</h1>
        <p class="builder-subtitle">
          Uw website is opgeslagen als concept en wordt eerst door Star Local gecontroleerd.
          Na goedkeuring zetten wij uw website gratis live.
        </p>
        <p class="builder-generate-success__footnote">
          Zo houden wij Star Local professioneel, veilig en vrij van spam of ongepaste websites.
        </p>
        <p class="builder-generate-success__meta">
          ${escapeHtml(summary.businessName)} · ${summary.pageCount} pagina's · ${escapeHtml(summary.domain)}
        </p>
      </header>

      <div class="builder-generate-success__actions">
        <button type="button" class="btn btn-primary" data-open-generated-preview>Bekijk voorbeeld</button>
        <button type="button" class="btn btn-secondary" data-edit-generated-website>Website aanpassen</button>
        <a class="btn btn-secondary" href="/dashboard/">Naar dashboard</a>
      </div>
    </div>
  `;
}
