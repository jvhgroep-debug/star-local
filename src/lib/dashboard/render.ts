import type { DashboardSection, DashboardViewModel, DashboardWebsiteCardItem } from '../../types/dashboard';
import type { PublicationLogEntry } from '../../types/publication';
import { BUILDER_START_PATH, DASHBOARD_HUB_SECTIONS, EDITOR_PATH, DASHBOARD_SECTIONS } from './constants';
import { formatLastUpdated } from './get-dashboard-data';
import { formatDuration, formatLogTime, pipelineStatusBadgeClass } from './publish-client';

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

function renderBetaStatusCard(): string {
  return `
    <aside class="dashboard-beta-card" role="status" aria-label="Bèta status">
      <p class="dashboard-beta-card__label">Bèta status</p>
      <p class="dashboard-beta-card__text">
        Uw website staat momenteel als concept opgeslagen.
        Publiceren wordt geactiveerd zodra de bèta is afgerond.
      </p>
    </aside>
  `;
}

function renderOverview(model: DashboardViewModel): string {
  const hubCards = DASHBOARD_HUB_SECTIONS.map((item) => {
    if (item.href) {
      return `
        <a class="dashboard-hub-card dashboard-hub-card--link" href="${item.href}">
          <span class="dashboard-hub-card__icon" aria-hidden="true">${item.icon}</span>
          <h3>${escapeHtml(item.label)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </a>
      `;
    }
    return `
      <button type="button" class="dashboard-hub-card" data-dashboard-section="${item.id}">
        <span class="dashboard-hub-card__icon" aria-hidden="true">${item.icon}</span>
        <h3>${escapeHtml(item.label)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </button>
    `;
  }).join('');

  const conceptCount = model.websiteList.filter(
    (item) => item.status === 'draft' || item.pipelineStatus === 'draft' || item.pipelineStatus === 'failed',
  ).length;
  const publishedCount = model.websiteList.filter(
    (item) => item.status === 'published' || item.pipelineStatus === 'published',
  ).length;

  return `
    <section class="dashboard-panel dashboard-panel--hub">
      <header class="dashboard-panel__head">
        <div>
          <p class="eyebrow">Welkom terug</p>
          <h2>Website Builder</h2>
          <p class="dashboard-lead">Beheer al uw websites vanuit één professioneel dashboard.</p>
        </div>
      </header>
      <div class="dashboard-hub-grid">${hubCards}</div>
      <div class="dashboard-quick-stats">
        <article class="dashboard-stat-card">
          <span class="dashboard-stat-card__value">${model.websiteList.length}</span>
          <span class="dashboard-stat-card__label">Websites</span>
        </article>
        <article class="dashboard-stat-card">
          <span class="dashboard-stat-card__value">${conceptCount}</span>
          <span class="dashboard-stat-card__label">Concepten</span>
        </article>
        <article class="dashboard-stat-card">
          <span class="dashboard-stat-card__value">${publishedCount}</span>
          <span class="dashboard-stat-card__label">Gepubliceerd</span>
        </article>
        <article class="dashboard-stat-card dashboard-stat-card--placeholder">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Bezoekers (binnenkort)</span>
        </article>
      </div>
      ${model.websiteList.length > 0 ? `
        <h3 class="dashboard-subheading">Recente websites</h3>
        <div class="dashboard-website-grid">${model.websiteList.slice(0, 3).map((site) => renderWebsiteCard(site)).join('')}</div>
      ` : ''}
    </section>
  `;
}

function renderWebsiteCardLogo(site: DashboardWebsiteCardItem): string {
  const initial = (site.businessName.trim()[0] ?? 'W').toUpperCase();
  return `
    <div class="dashboard-website-card__logo" style="--site-color: ${escapeHtml(site.primaryColor)}">
      <span>${escapeHtml(initial)}</span>
    </div>
  `;
}

function renderWebsiteCard(site: DashboardWebsiteCardItem): string {
  const editorUrl = site.tenantId ? `${EDITOR_PATH}?tenantId=${encodeURIComponent(site.tenantId)}` : BUILDER_START_PATH;
  const isPublished = site.status === 'published' || site.pipelineStatus === 'published';
  const previewUrl = isPublished
    ? site.url.startsWith('http')
      ? site.url
      : `https://${site.subdomain}`
    : BUILDER_START_PATH;
  const previewAttrs = isPublished ? ' target="_blank" rel="noopener noreferrer"' : '';
  const previewLabel = isPublished ? 'Live preview' : 'Open wizard';
  const statusClass = site.pipelineStatus === 'published' ? 'builder-status-badge--published' : statusBadgeClass(site.status);

  return `
    <article class="dashboard-website-card" data-website-id="${escapeHtml(site.id)}">
      ${renderWebsiteCardLogo(site)}
      <div class="dashboard-website-card__body">
        <h3>${escapeHtml(site.businessName)}</h3>
        <p class="dashboard-website-card__domain">${escapeHtml(site.subdomain)}</p>
        <p class="dashboard-website-card__meta">
          <span class="builder-status-badge ${statusClass}">${escapeHtml(site.pipelineLabel || site.statusLabel)}</span>
          <span class="dashboard-muted">${escapeHtml(formatLastUpdated({ lastUpdated: site.lastUpdated } as DashboardViewModel))}</span>
        </p>
      </div>
      <div class="dashboard-website-card__actions">
        <a class="btn btn-secondary btn-sm" href="${editorUrl}">Bewerken</a>
        <a class="btn btn-secondary btn-sm" href="${previewUrl}"${previewAttrs}>${previewLabel}</a>
        <button type="button" class="btn btn-primary btn-sm" data-open-publish-section>Publiceren</button>
      </div>
    </article>
  `;
}

function renderWebsiteList(model: DashboardViewModel, filter?: 'concepts' | 'published'): string {
  let list = model.websiteList;
  if (filter === 'concepts') {
    list = list.filter(
      (item) =>
        item.status === 'draft' ||
        item.pipelineStatus === 'draft' ||
        item.pipelineStatus === 'failed',
    );
  }
  if (filter === 'published') {
    list = list.filter(
      (item) => item.status === 'published' || item.pipelineStatus === 'published',
    );
  }

  const title = filter === 'concepts' ? 'Concepten' : filter === 'published' ? 'Gepubliceerd' : 'Mijn Websites';
  const empty = filter === 'concepts'
    ? 'Geen concepten gevonden. Start een nieuwe website via de builder.'
    : filter === 'published'
      ? 'Nog geen gepubliceerde websites.'
      : 'Nog geen websites. Maak uw eerste website aan.';

  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>${title}</h2>
        <a class="btn btn-primary" href="${BUILDER_START_PATH}">+ Nieuwe website</a>
      </div>
      ${list.length === 0 ? `
        <div class="dashboard-empty dashboard-empty--inline">
          <p class="dashboard-lead">${empty}</p>
          <a class="btn btn-primary" href="${BUILDER_START_PATH}">Website maken</a>
        </div>
      ` : `<div class="dashboard-website-grid">${list.map((site) => renderWebsiteCard(site)).join('')}</div>`}
    </section>
  `;
}

function renderStatsPlaceholder(): string {
  return `
    <section class="dashboard-panel">
      <h2>Statistieken</h2>
      <p class="dashboard-lead">Bezoekers, paginaweergaven en SEO-prestaties volgen in een latere fase.</p>
      <div class="dashboard-stats-placeholder">
        <article class="dashboard-stat-card dashboard-stat-card--large">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Bezoekers (30 dagen)</span>
        </article>
        <article class="dashboard-stat-card dashboard-stat-card--large">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Paginaweergaven</span>
        </article>
        <article class="dashboard-stat-card dashboard-stat-card--large">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Gemiddelde SEO-score</span>
        </article>
      </div>
    </section>
  `;
}

function editorUrl(model: DashboardViewModel, pageId?: string): string {
  const base = model.tenantId
    ? `${EDITOR_PATH}?tenantId=${encodeURIComponent(model.tenantId)}`
    : BUILDER_START_PATH;
  if (!pageId) return base;
  const joiner = base.includes('?') ? '&' : '?';
  return `${base}${joiner}page=${encodeURIComponent(pageId)}`;
}

function renderWebsite(model: DashboardViewModel): string {
  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>Opgeslagen websitegegevens</h2>
        <a class="btn btn-primary" href="${editorUrl(model)}">Mijn website bewerken</a>
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
          <td><a class="btn btn-secondary btn-sm" href="${editorUrl(model, page.id)}">Bewerken</a></td>
        </tr>
      `,
    )
    .join('');

  return `
    <section class="dashboard-panel">
      <h2>Pagina's</h2>
      <p class="dashboard-lead">Bewerk elke pagina afzonderlijk in de pro-editor. Alle ${model.pageCount} pagina's worden automatisch gegenereerd.</p>
      <div class="dashboard-table-wrap">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Pagina</th>
              <th>Pad</th>
              <th>Status</th>
              <th>Actie</th>
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
        <a class="btn btn-secondary" href="${editorUrl(model)}">Bewerken</a>
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
        <a class="btn btn-secondary" href="${editorUrl(model)}">Bewerken</a>
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
        <a class="btn btn-secondary" href="${editorUrl(model)}">Bewerken</a>
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

function pipelineBadgeClass(status: string): string {
  switch (status) {
    case 'building':
      return 'builder-status-badge--ready';
    case 'published':
      return 'builder-status-badge--published';
    case 'failed':
      return 'builder-status-badge--concept';
    default:
      return 'builder-status-badge--draft';
  }
}

function renderPublicationLogs(logs: PublicationLogEntry[]): string {
  if (logs.length === 0) {
    return '<p class="dashboard-muted">Nog geen publicaties uitgevoerd.</p>';
  }

  const rows = logs
    .slice(0, 10)
    .map(
      (log) => `
      <tr>
        <td>${escapeHtml(formatLogTime(log.startedAt))}</td>
        <td><span class="builder-status-badge ${pipelineBadgeClass(log.status)}">${escapeHtml(log.status)}</span></td>
        <td>${escapeHtml(formatDuration(log.durationMs))}</td>
        <td>${log.pageCount}</td>
        <td>${log.imageCount}</td>
        <td>${log.seoScore}%</td>
        <td>${log.republish ? 'Ja' : 'Nee'}</td>
        <td>${log.errors.length ? escapeHtml(log.errors.join('; ')) : '—'}</td>
      </tr>
    `,
    )
    .join('');

  return `
    <div class="dashboard-table-wrap">
      <table class="dashboard-table">
        <thead>
          <tr>
            <th>Start</th>
            <th>Status</th>
            <th>Duur</th>
            <th>Pagina's</th>
            <th>Afbeeldingen</th>
            <th>SEO</th>
            <th>Herpublicatie</th>
            <th>Fouten</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderPublish(model: DashboardViewModel): string {
  const isPublished = model.publicationPipelineStatus === 'published';
  const isBuilding = model.publicationPipelineStatus === 'building';
  const isFailed = model.publicationPipelineStatus === 'failed';
  const canRepublish = isPublished || isFailed;
  const statusLabel = model.publicationPipelineLabel;
  const lastLog = model.lastPublicationLog;

  return `
    <section class="dashboard-panel">
      <h2>Publiceren</h2>
      <p class="dashboard-lead">Bouw lokaal een compleet publicatiepakket. Er wordt nog niets live gezet op het internet.</p>

      <div class="dashboard-publish-grid">
        <article class="dashboard-publish-card">
          <p class="dashboard-card__label">Publicatiestatus</p>
          <p class="dashboard-card__value">
            <span class="builder-status-badge ${pipelineStatusBadgeClass(model.publicationPipelineStatus)}" data-publish-status>${escapeHtml(statusLabel)}</span>
          </p>
          ${lastLog ? `<p class="dashboard-muted">Laatste publicatie: ${escapeHtml(formatLogTime(lastLog.finishedAt))}</p>` : '<p class="dashboard-muted">Nog niet gepubliceerd.</p>'}
        </article>

        <article class="dashboard-publish-card">
          <p class="dashboard-card__label">Website publiceren</p>
          <button type="button" class="btn btn-primary" data-publish-action="publish" ${!model.canPublish || isBuilding ? 'disabled' : ''}>
            ${isBuilding ? 'Bezig met publiceren…' : 'Website publiceren'}
          </button>
          ${canRepublish ? `
            <button type="button" class="btn btn-secondary dashboard-publish-republish" data-publish-action="republish" ${isBuilding ? 'disabled' : ''}>
              Opnieuw publiceren
            </button>
          ` : ''}
          ${!model.canPublish ? '<p class="dashboard-muted">Maak eerst een website via de builder.</p>' : ''}
        </article>

        <article class="dashboard-publish-card">
          <p class="dashboard-card__label">Pakket</p>
          <p class="dashboard-card__value">${escapeHtml(model.packageLabel)}</p>
          <p class="dashboard-muted">${model.pageCount} pagina's · SEO-score: ${escapeHtml(model.seoScore)}</p>
        </article>
      </div>

      <div class="dashboard-publish-progress" data-publish-progress hidden>
        <p class="dashboard-publish-progress__label">Publicatie bezig…</p>
        <ul class="dashboard-publish-progress__steps">
          <li data-publish-step="load">Website laden</li>
          <li data-publish-step="pages">Pagina's genereren</li>
          <li data-publish-step="seo">SEO & metadata</li>
          <li data-publish-step="package">Pakket samenstellen</li>
        </ul>
      </div>

      <div class="dashboard-publish-result" data-publish-result hidden></div>

      <h3 class="dashboard-subheading">Publicatielog</h3>
      <div data-publish-logs>${renderPublicationLogs(model.publicationLogs)}</div>
    </section>

    <dialog class="dashboard-publish-dialog" data-publish-dialog>
      <form method="dialog" class="dashboard-publish-dialog__inner">
        <h3>Website publiceren</h3>
        <p class="dashboard-lead">Controleer wat er wordt gebouwd. Er wordt nog niets naar productie geüpload.</p>
        <dl class="dashboard-fields dashboard-publish-overview" data-publish-overview>
          ${renderField('Bedrijf', model.businessName)}
          ${renderField('Subdomein', model.subdomain)}
          ${renderField('Pagina\'s', String(model.pageCount))}
        </dl>
        <ul class="dashboard-publish-filelist" data-publish-filelist>
          <li>index.html</li>
          <li>over-ons/index.html</li>
          <li>diensten/index.html</li>
          <li>contact/index.html</li>
          <li>privacy/index.html</li>
          <li>robots.txt · sitemap.xml · manifest.webmanifest · favicon.svg</li>
        </ul>
        <div class="dashboard-publish-dialog__actions">
          <button type="button" class="btn btn-secondary" data-publish-cancel>Annuleren</button>
          <button type="submit" class="btn btn-primary" value="confirm">Bevestigen en publiceren</button>
        </div>
      </form>
    </dialog>
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
    case 'websites':
      return renderWebsiteList(model);
    case 'concepts':
      return renderWebsiteList(model, 'concepts');
    case 'published':
      return renderWebsiteList(model, 'published');
    case 'stats':
      return renderStatsPlaceholder();
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
        ${renderBetaStatusCard()}
        <div class="dashboard-content">${renderSection(section, model)}</div>
      </div>
    </div>
  `;
}
