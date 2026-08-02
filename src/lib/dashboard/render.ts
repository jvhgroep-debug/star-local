import type { DashboardSection, DashboardViewModel } from '../../types/dashboard';
import { BUILDER_START_PATH, EDITOR_PATH, DASHBOARD_SECTIONS } from './constants';
import { formatLastUpdated } from './get-dashboard-data';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'published':
      return 'builder-status-badge--published';
    case 'ready_for_publication':
      return 'builder-status-badge--ready';
    default:
      return 'builder-status-badge--draft';
  }
}

function renderField(label: string, value: string): string {
  return `
    <div class="dashboard-field">
      <dt>${escapeHtml(label)}</dt>
      <dd>${value.trim() ? escapeHtml(value) : '<span class="dashboard-muted">—</span>'}</dd>
    </div>
  `;
}

function renderOverview(model: DashboardViewModel): string {
  return `
    <div class="dashboard-cards">
      <article class="dashboard-card">
        <p class="dashboard-card__label">Website status</p>
        <p class="dashboard-card__value">
          <span class="builder-status-badge ${statusBadgeClass(model.status)}">${escapeHtml(model.statusLabel)}</span>
        </p>
      </article>
      <article class="dashboard-card">
        <p class="dashboard-card__label">Pakket</p>
        <p class="dashboard-card__value">${escapeHtml(model.packageLabel)}</p>
      </article>
      <article class="dashboard-card">
        <p class="dashboard-card__label">Subdomein</p>
        <p class="dashboard-card__value dashboard-card__value--mono">${escapeHtml(model.subdomain)}</p>
      </article>
      <article class="dashboard-card">
        <p class="dashboard-card__label">Laatste wijziging</p>
        <p class="dashboard-card__value">${escapeHtml(formatLastUpdated(model))}</p>
      </article>
      <article class="dashboard-card">
        <p class="dashboard-card__label">Aantal pagina's</p>
        <p class="dashboard-card__value">${model.pageCount}</p>
      </article>
      <article class="dashboard-card dashboard-card--placeholder">
        <p class="dashboard-card__label">SEO-score</p>
        <p class="dashboard-card__value">${escapeHtml(model.seoScore)}</p>
        <p class="dashboard-card__hint">Placeholder — analyse volgt in een latere fase</p>
      </article>
    </div>
  `;
}

function renderWebsite(model: DashboardViewModel): string {
  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>Opgeslagen websitegegevens</h2>
        <a class="btn btn-primary" href="${EDITOR_PATH}">Mijn website bewerken</a>
      </div>
      <dl class="dashboard-fields">
        ${renderField('Bedrijfsnaam', model.businessName)}
        ${renderField('Branche', model.industry)}
        ${renderField('Omschrijving', model.description)}
        ${renderField('Subdomein', model.subdomain)}
        ${renderField('Webadres', model.url)}
        ${renderField('Pakket', model.packageLabel)}
        ${renderField('Status', model.statusLabel)}
        ${renderField('Primaire kleur', model.primaryColor)}
        ${renderField('Accentkleur', model.accentColor)}
        ${renderField('Bron', model.source === 'd1' ? 'Database (D1)' : 'Lokaal voorbereid')}
      </dl>
    </section>
  `;
}

function renderPages(model: DashboardViewModel): string {
  const rows = model.pages
    .map(
      (page) => `
        <tr>
          <td>${escapeHtml(page.label)}</td>
          <td><code>${escapeHtml(page.path)}</code></td>
          <td><span class="builder-status-badge builder-status-badge--ready">Gegenereerd</span></td>
        </tr>
      `,
    )
    .join('');

  return `
    <section class="dashboard-panel">
      <h2>Pagina's</h2>
      <p class="dashboard-lead">Uw website bevat ${model.pageCount} automatisch gegenereerde pagina's uit het Star Local-template.</p>
      <div class="dashboard-table-wrap">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Pagina</th>
              <th>Pad</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderServices(model: DashboardViewModel): string {
  if (model.services.length === 0) {
    return `
      <section class="dashboard-panel">
        <h2>Diensten</h2>
        <p class="dashboard-muted">Nog geen diensten opgeslagen.</p>
        <a class="btn btn-secondary" href="${BUILDER_START_PATH}">Diensten toevoegen in builder</a>
      </section>
    `;
  }

  const cards = model.services
    .map(
      (service) => `
        <article class="dashboard-list-card">
          <h3>${escapeHtml(service.title)}</h3>
          <p>${escapeHtml(service.description || 'Geen omschrijving')}</p>
        </article>
      `,
    )
    .join('');

  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>Diensten</h2>
        <a class="btn btn-secondary" href="${EDITOR_PATH}">Bewerken</a>
      </div>
      <div class="dashboard-list-cards">${cards}</div>
    </section>
  `;
}

function renderContact(model: DashboardViewModel): string {
  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>Contactgegevens</h2>
        <a class="btn btn-secondary" href="${EDITOR_PATH}">Bewerken</a>
      </div>
      <dl class="dashboard-fields">
        ${renderField('Telefoon', model.contact.phone)}
        ${renderField('WhatsApp', model.contact.whatsapp)}
        ${renderField('E-mail', model.contact.email)}
        ${renderField('Adres', model.contact.street)}
        ${renderField('Postcode', model.contact.postcode)}
        ${renderField('Plaats', model.contact.city)}
      </dl>
    </section>
  `;
}

function renderHours(model: DashboardViewModel): string {
  const rows = model.hours
    .map(
      (day) => `
        <tr>
          <td>${escapeHtml(day.label)}</td>
          <td>${escapeHtml(day.value)}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>Openingstijden</h2>
        <a class="btn btn-secondary" href="${EDITOR_PATH}">Bewerken</a>
      </div>
      <div class="dashboard-table-wrap">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Dag</th>
              <th>Tijden</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSeo(model: DashboardViewModel): string {
  return `
    <section class="dashboard-panel">
      <h2>SEO</h2>
      <dl class="dashboard-fields">
        ${renderField('Homepage titel', model.seoTitle)}
        ${renderField('Meta description', model.metaDescription)}
        ${renderField('Slug', model.slug)}
        ${renderField('Canonical', model.canonicalUrl)}
        ${renderField('OpenGraph titel', model.ogTitle)}
        ${renderField('OpenGraph description', model.ogDescription)}
      </dl>
    </section>
  `;
}

function renderImages(model: DashboardViewModel): string {
  const logoBlock = model.logoName
    ? `
      <div class="dashboard-logo-preview">
        <div class="dashboard-logo-preview__box" style="--dashboard-logo-color:${escapeHtml(model.primaryColor)}">
          <span class="dashboard-logo-preview__label">${escapeHtml(model.logoName)}</span>
        </div>
        <p class="dashboard-muted">Logo opgeslagen als <code>${escapeHtml(model.logoKey ?? model.logoName)}</code></p>
      </div>
    `
    : `
      <div class="dashboard-logo-preview dashboard-logo-preview--empty">
        <p class="dashboard-muted">Nog geen logo geüpload.</p>
      </div>
    `;

  return `
    <section class="dashboard-panel">
      <h2>Afbeeldingen</h2>
      <p class="dashboard-lead">Logo en media-uploads worden in een volgende fase gekoppeld aan R2-opslag.</p>
      ${logoBlock}
      <div class="dashboard-upload-placeholder">
        <p><strong>Toekomstige uploads</strong></p>
        <p class="dashboard-muted">Foto's, hero-afbeeldingen en galerij — binnenkort beschikbaar.</p>
      </div>
    </section>
  `;
}

function renderPublish(model: DashboardViewModel): string {
  return `
    <section class="dashboard-panel">
      <h2>Publiceren</h2>
      <div class="dashboard-publish-grid">
        <article class="dashboard-publish-card">
          <p class="dashboard-card__label">Huidige status</p>
          <p class="dashboard-card__value">
            <span class="builder-status-badge builder-status-badge--concept">Concept</span>
          </p>
          <p class="dashboard-muted">Uw website staat als concept in de database (${escapeHtml(model.statusLabel)}).</p>
        </article>
        <article class="dashboard-publish-card dashboard-publish-card--disabled">
          <p class="dashboard-card__label">Live publiceren</p>
          <button type="button" class="btn btn-primary" disabled title="Live publicatie volgt in een latere fase">Publiceren</button>
          <p class="dashboard-muted">Nog niet beschikbaar — geen DNS of live deployment in deze fase.</p>
        </article>
        <article class="dashboard-publish-card dashboard-publish-card--placeholder">
          <p class="dashboard-card__label">Premium</p>
          <p class="dashboard-card__value">${escapeHtml(model.package === 'premium' ? 'Premium geselecteerd' : 'Gratis pakket')}</p>
          <p class="dashboard-muted">Premium-functies en upgrades volgen in een latere fase.</p>
        </article>
      </div>
    </section>
  `;
}

function renderSettings(model: DashboardViewModel): string {
  return `
    <section class="dashboard-panel">
      <h2>Instellingen</h2>
      <dl class="dashboard-fields">
        ${renderField('Publicatie-e-mail', model.publishEmail ?? '—')}
        ${renderField('Website-ID', model.websiteId ?? '—')}
        ${renderField('Tenant-ID', model.tenantId ?? '—')}
      </dl>
      <aside class="dashboard-note">
        <p>U bent ingelogd via een beveiligde magic link. Uitloggen kan via het menu bovenaan.</p>
      </aside>
    </section>
  `;
}

function renderEmptyState(): string {
  return `
    <section class="dashboard-empty">
      <h2>Nog geen website gevonden</h2>
      <p class="dashboard-lead">Maak eerst uw website aan via de builder. Na publicatie verschijnen uw gegevens hier automatisch.</p>
      <div class="dashboard-empty__actions">
        <a class="btn btn-primary" href="${BUILDER_START_PATH}">Website maken</a>
      </div>
    </section>
  `;
}

function renderSection(section: DashboardSection, model: DashboardViewModel): string {
  switch (section) {
    case 'website':
      return renderWebsite(model);
    case 'pages':
      return renderPages(model);
    case 'services':
      return renderServices(model);
    case 'contact':
      return renderContact(model);
    case 'hours':
      return renderHours(model);
    case 'seo':
      return renderSeo(model);
    case 'images':
      return renderImages(model);
    case 'publish':
      return renderPublish(model);
    case 'settings':
      return renderSettings(model);
    default:
      return renderOverview(model);
  }
}

function sectionTitle(section: DashboardSection): string {
  return DASHBOARD_SECTIONS.find((item) => item.id === section)?.label ?? 'Dashboard';
}

export function renderDashboardShell(section: DashboardSection, model: DashboardViewModel | null): string {
  if (!model) {
    return `
      <div class="dashboard-shell dashboard-shell--empty">
        <aside class="dashboard-sidebar" aria-label="Dashboard menu">
          <div class="dashboard-sidebar__brand">
            <span>Star Local</span>
            <small>Klantendashboard</small>
          </div>
          <nav class="dashboard-nav">
            ${DASHBOARD_SECTIONS.map(
              (item) =>
                `<button type="button" class="dashboard-nav__link" disabled>${escapeHtml(item.label)}</button>`,
            ).join('')}
          </nav>
        </aside>
        <div class="dashboard-main">
          ${renderEmptyState()}
        </div>
      </div>
    `;
  }

  const nav = DASHBOARD_SECTIONS.map((item) => {
    const active = item.id === section ? ' is-active' : '';
    return `<button type="button" class="dashboard-nav__link${active}" data-dashboard-section="${item.id}">${escapeHtml(item.label)}</button>`;
  }).join('');

  return `
    <div class="dashboard-shell">
      <aside class="dashboard-sidebar" aria-label="Dashboard menu">
        <div class="dashboard-sidebar__brand">
          <span>Star Local</span>
          <small>${escapeHtml(model.businessName)}</small>
        </div>
        <nav class="dashboard-nav">${nav}</nav>
        <div class="dashboard-sidebar__footer">
          <a class="dashboard-sidebar__link" href="${BUILDER_START_PATH}">Website builder</a>
        </div>
      </aside>
      <div class="dashboard-main">
        <header class="dashboard-topbar">
          <div>
            <p class="dashboard-topbar__eyebrow">Klantendashboard</p>
            <h1>${escapeHtml(sectionTitle(section))}</h1>
          </div>
          <div class="dashboard-topbar__meta">
            <span class="builder-status-badge ${statusBadgeClass(model.status)}">${escapeHtml(model.statusLabel)}</span>
            <span class="dashboard-topbar__domain">${escapeHtml(model.subdomain)}</span>
          </div>
        </header>
        <div class="dashboard-content">${renderSection(section, model)}</div>
      </div>
    </div>
  `;
}
