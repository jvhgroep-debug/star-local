import type { DashboardSection, DashboardViewModel, DashboardWebsiteCardItem } from '../../types/dashboard';
import type { PublicationLogEntry } from '../../types/publication';
import { BUILDER_START_PATH, DASHBOARD_HUB_SECTIONS, EDITOR_PATH, DASHBOARD_SECTIONS } from './constants';
import { formatLastUpdated } from './get-dashboard-data';
import {
  previewLinkAttrs,
  resolveMyWebsiteContext,
  type MyWebsiteContext,
} from './my-website';
import { renderPremiumUpgradeAnchor } from '../premium/upgrade';
import {
  bindChangeRequestForm,
  fetchCustomerChangeRequests,
  renderChangeRequestForm,
  renderChangeRequestsList,
} from './change-requests-ui';
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

function statusGroupBadgeClass(group: string): string {
  switch (group) {
    case 'Gepubliceerd':
      return 'dashboard-status-badge--published';
    case 'In review':
      return 'dashboard-status-badge--review';
    default:
      return 'dashboard-status-badge--concept';
  }
}

function renderMyWebsiteHero(ctx: MyWebsiteContext): string {
  const { site, stats } = ctx;
  const initial = (site.businessName.trim()[0] ?? 'W').toUpperCase();

  return `
    <section class="dashboard-my-website" aria-labelledby="my-website-title">
      <div class="dashboard-my-website__hero">
        <div class="dashboard-my-website__identity">
          <div class="dashboard-my-website__logo" style="--site-color: ${escapeHtml(site.primaryColor)}">
            <span aria-hidden="true">${escapeHtml(initial)}</span>
          </div>
          <div>
            <p class="dashboard-my-website__eyebrow">Mijn website</p>
            <h2 id="my-website-title">${escapeHtml(site.businessName)}</h2>
            <p class="dashboard-my-website__domain">${escapeHtml(site.subdomain)}</p>
          </div>
        </div>
        <div class="dashboard-my-website__status-wrap">
          <span class="dashboard-status-badge ${statusGroupBadgeClass(stats.statusGroup)}">${escapeHtml(stats.statusGroup)}</span>
          <p class="dashboard-my-website__status-detail">${escapeHtml(stats.statusLabel)}</p>
          <button type="button" class="btn btn-primary dashboard-my-website__cta" data-dashboard-section="change_request_new">Wijziging aanvragen</button>
        </div>
      </div>
    </section>
  `;
}

function renderMyWebsiteStats(ctx: MyWebsiteContext): string {
  const { stats } = ctx;
  const cards = [
    { icon: 'pages', label: "Pagina's", value: stats.pageCount, placeholder: false },
    { icon: 'photos', label: "Foto's", value: stats.photoCount, placeholder: false },
    { icon: 'clock', label: 'Laatste wijziging', value: stats.lastUpdated, placeholder: false },
    { icon: 'status', label: 'Status', value: stats.statusGroup, placeholder: false },
    { icon: 'seo', label: 'SEO-score', value: stats.seoScore, placeholder: stats.seoScore === '—' },
    { icon: 'visitors', label: 'Bezoekers', value: stats.visitors, placeholder: true },
  ];

  return `
    <section class="dashboard-my-website__stats" aria-label="Website statistieken">
      <h3 class="dashboard-section-title">Statistieken</h3>
      <div class="dashboard-metric-grid">
        ${cards
          .map(
            (card) => `
          <article class="dashboard-metric-card${card.placeholder ? ' dashboard-metric-card--placeholder' : ''}">
            <span class="dashboard-metric-card__icon dashboard-metric-card__icon--${card.icon}" aria-hidden="true"></span>
            <span class="dashboard-metric-card__value">${escapeHtml(card.value)}</span>
            <span class="dashboard-metric-card__label">${escapeHtml(card.label)}</span>
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderQuickActions(ctx: MyWebsiteContext): string {
  const { site, viewUrl, editUrl } = ctx;
  const previewAttrs = previewLinkAttrs(site);
  const actions = [
    {
      id: 'view',
      label: 'Website bekijken',
      description: 'Open preview of live site',
      href: viewUrl,
      attrs: previewAttrs,
      icon: 'view',
      primary: true,
    },
    {
      id: 'edit',
      label: 'Website bewerken',
      description: 'Open de website-editor',
      href: editUrl,
      attrs: '',
      icon: 'edit',
      primary: true,
    },
    {
      id: 'data',
      label: 'Gegevens wijzigen',
      description: 'Contact, openingstijden en teksten',
      href: editUrl,
      attrs: '',
      icon: 'data',
      primary: false,
    },
    {
      id: 'request',
      label: 'Nieuw verzoek indienen',
      description: 'Dien wijzigingen in voor review',
      href: '',
      attrs: '',
      icon: 'request',
      primary: false,
      section: 'change_request_new' as const,
    },
    {
      id: 'contact',
      label: 'Contact opnemen',
      description: 'Star Local support',
      href: '/contact/',
      attrs: '',
      icon: 'contact',
      primary: false,
    },
    {
      id: 'logout',
      label: 'Uitloggen',
      description: 'Veilig afmelden',
      href: '/logout/',
      attrs: '',
      icon: 'logout',
      primary: false,
    },
  ];

  return `
    <section class="dashboard-quick-actions" aria-label="Snelle acties">
      <h3 class="dashboard-section-title">Snelle acties</h3>
      <div class="dashboard-quick-actions__grid">
        ${actions
          .map((action) => {
            const cls = `dashboard-action-card${action.primary ? ' dashboard-action-card--primary' : ''}`;
            const inner = `
            <span class="dashboard-action-card__icon dashboard-action-card__icon--${action.icon}" aria-hidden="true"></span>
            <span class="dashboard-action-card__label">${escapeHtml(action.label)}</span>
            <span class="dashboard-action-card__desc">${escapeHtml(action.description)}</span>`;
            if ('section' in action && action.section) {
              return `<button type="button" class="${cls}" data-dashboard-section="${action.section}">${inner}</button>`;
            }
            return `<a class="${cls}" href="${escapeHtml(action.href)}" ${action.attrs}>${inner}</a>`;
          })
          .join('')}
      </div>
    </section>
  `;
}

function renderPremiumUpgradeBlock(): string {
  const features = [
    'Eigen domein',
    'Eigen kleuren',
    'Meer pagina\'s',
    'Prioriteit support',
    'Extra SEO',
    'Professionele uitstraling',
  ];

  return `
    <aside class="dashboard-premium-block" aria-label="Premium upgrade">
      <div class="dashboard-premium-block__content">
        <p class="dashboard-premium-block__eyebrow">Premium</p>
        <h3 class="dashboard-premium-block__title">Premium aanvragen</h3>
        <p class="dashboard-premium-block__lead">
          Geef uw website een professionele uitstraling met een eigen domein, volledige huisstijl en extra SEO. Premium kost €9,95 per maand.
        </p>
        <ul class="dashboard-premium-block__features">
          ${features.map((feature) => `<li><span aria-hidden="true">✦</span> ${escapeHtml(feature)}</li>`).join('')}
        </ul>
      </div>
      <div class="dashboard-premium-block__cta">
        ${renderPremiumUpgradeAnchor('btn btn-primary dashboard-premium-block__button')}
        <p class="dashboard-premium-block__note">Vraag Premium aan via het contactformulier — wij nemen contact met u op.</p>
      </div>
    </aside>
  `;
}

function renderMyWebsitePanel(model: DashboardViewModel): string {
  const ctx = resolveMyWebsiteContext(model);
  if (!ctx) return '';

  return `
    ${renderMyWebsiteHero(ctx)}
    ${renderMyWebsiteStats(ctx)}
    ${renderQuickActions(ctx)}
    ${renderPremiumUpgradeBlock()}
  `;
}

function renderBetaStatusCard(model: DashboardViewModel): string {
  const primary = resolveMyWebsiteContext(model);
  const isPublished = primary?.stats.statusGroup === 'Gepubliceerd';

  if (isPublished) return '';

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

  const conceptCount = model.websiteList.filter((item) => item.status === 'concept' || item.status === 'rejected').length;
  const inReviewCount = model.websiteList.filter(
    (item) =>
      item.status === 'pending_review' ||
      item.status === 'approved' ||
      item.pendingChangesStatus === 'in_review',
  ).length;
  const publishedCount = model.websiteList.filter((item) => item.status === 'published').length;
  const welcomeName = model.customerBusinessName || model.businessName || 'ondernemer';

  return `
    <section class="dashboard-panel dashboard-panel--hub">
      ${renderMyWebsitePanel(model)}
      ${!resolveMyWebsiteContext(model) ? renderPremiumUpgradeBlock() : ''}
      <header class="dashboard-panel__head dashboard-panel__head--compact">
        <div>
          <p class="eyebrow">Overzicht</p>
          <h2>Welkom ${escapeHtml(welcomeName)}</h2>
          <p class="dashboard-lead">Beheer al uw websites vanuit uw Star Local klantportaal.</p>
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
          <span class="dashboard-stat-card__value">${inReviewCount}</span>
          <span class="dashboard-stat-card__label">In review</span>
        </article>
        <article class="dashboard-stat-card">
          <span class="dashboard-stat-card__value">${publishedCount}</span>
          <span class="dashboard-stat-card__label">Gepubliceerd</span>
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

function renderWebsiteCard(site: DashboardWebsiteCardItem, options?: { hidePublish?: boolean }): string {
  const editorUrl = site.editPath || (site.tenantId ? `/dashboard/website/?tenantId=${encodeURIComponent(site.tenantId)}&websiteId=${encodeURIComponent(site.websiteId ?? site.id)}` : BUILDER_START_PATH);
  const previewUrl = site.previewPath || (site.status === 'published' ? site.liveUrl || `/sites/${site.slug}/` : `/admin/preview/?id=${encodeURIComponent(site.websiteId ?? site.id)}`);
  const previewAttrs = site.status === 'published' ? ' target="_blank" rel="noopener noreferrer"' : '';
  const statusClass = site.status === 'published' ? 'builder-status-badge--published' : statusBadgeClass(site.status);

  return `
    <article class="dashboard-website-card" data-website-id="${escapeHtml(site.id)}">
      ${renderWebsiteCardLogo(site)}
      <div class="dashboard-website-card__body">
        <h3>${escapeHtml(site.businessName)}</h3>
        <p class="dashboard-website-card__domain">${escapeHtml(site.slug)}.starlocal.nl</p>
        <p class="dashboard-website-card__meta">
          <span class="builder-status-badge ${statusClass}">${escapeHtml(site.statusLabel || site.pipelineLabel)}</span>
          <span class="dashboard-muted">${escapeHtml(formatLastUpdated({ lastUpdated: site.lastUpdated } as DashboardViewModel))}</span>
        </p>
      </div>
      <div class="dashboard-website-card__actions">
        <a class="btn btn-secondary btn-sm" href="${editorUrl}">Bewerken</a>
        <a class="btn btn-secondary btn-sm" href="${previewUrl}"${previewAttrs}>Preview</a>
        ${options?.hidePublish === false ? `<button type="button" class="btn btn-primary btn-sm" data-open-publish-section>Publiceren</button>` : ''}
      </div>
    </article>
  `;
}

function renderWebsiteList(model: DashboardViewModel, filter?: 'concepts' | 'in_review' | 'published'): string {
  let list = model.websiteList;
  if (filter === 'concepts') {
    list = list.filter((item) => item.status === 'concept' || item.status === 'rejected');
  }
  if (filter === 'in_review') {
    list = list.filter(
      (item) =>
        item.status === 'pending_review' ||
        item.status === 'approved' ||
        item.pendingChangesStatus === 'in_review',
    );
  }
  if (filter === 'published') {
    list = list.filter((item) => item.status === 'published');
  }

  const title =
    filter === 'concepts'
      ? 'Concepten'
      : filter === 'in_review'
        ? 'In review'
        : filter === 'published'
          ? 'Gepubliceerd'
          : 'Mijn websites';
  const emptyMarkup =
    filter === undefined
      ? `
        <div class="dashboard-empty dashboard-empty--websites">
          <div class="dashboard-empty__icon" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="44" height="36" rx="6" stroke="currentColor" stroke-width="2"/>
              <path d="M6 20h44" stroke="currentColor" stroke-width="2"/>
              <circle cx="14" cy="15" r="2" fill="currentColor"/>
              <circle cx="20" cy="15" r="2" fill="currentColor"/>
              <circle cx="26" cy="15" r="2" fill="currentColor"/>
              <path d="M16 32h24M16 38h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="dashboard-empty__title">Nog geen websites?</h3>
          <p class="dashboard-empty__text">Maak nu gratis uw eerste website.</p>
          <a class="btn btn-primary dashboard-empty__cta" href="${BUILDER_START_PATH}">Gratis website maken</a>
        </div>
      `
      : `
        <div class="dashboard-empty dashboard-empty--inline">
          <p class="dashboard-lead">${
            filter === 'concepts'
              ? 'Geen concepten gevonden. Start een nieuwe website via de builder.'
              : 'Nog geen gepubliceerde websites.'
          }</p>
          <a class="btn btn-primary" href="${BUILDER_START_PATH}">Website maken</a>
        </div>
      `;

  return `
    <section class="dashboard-panel">
      <div class="dashboard-panel__head">
        <h2>${title}</h2>
        <a class="btn btn-primary" href="${BUILDER_START_PATH}">+ Nieuwe website</a>
      </div>
      ${filter === undefined ? renderMyWebsitePanel(model) : ''}
      ${list.length === 0 ? emptyMarkup : `<div class="dashboard-website-grid">${list.map((site) => renderWebsiteCard(site)).join('')}</div>`}
    </section>
  `;
}

function renderStatsPlaceholder(model: DashboardViewModel): string {
  const ctx = resolveMyWebsiteContext(model);
  const statsBlock = ctx ? renderMyWebsiteStats(ctx) : '';

  return `
    <section class="dashboard-panel">
      <h2>Statistieken</h2>
      <p class="dashboard-lead">Bezoekers, paginaweergaven en SEO-prestaties volgen in een latere fase.</p>
      ${statsBlock}
      <div class="dashboard-stats-placeholder">
        <article class="dashboard-stat-card dashboard-stat-card--large dashboard-stat-card--placeholder">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Bezoekers (30 dagen)</span>
        </article>
        <article class="dashboard-stat-card dashboard-stat-card--large dashboard-stat-card--placeholder">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Paginaweergaven</span>
        </article>
        <article class="dashboard-stat-card dashboard-stat-card--large dashboard-stat-card--placeholder">
          <span class="dashboard-stat-card__value">—</span>
          <span class="dashboard-stat-card__label">Gemiddelde SEO-score</span>
        </article>
      </div>
      ${renderPremiumUpgradeBlock()}
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
    case 'in_review':
      return renderWebsiteList(model, 'in_review');
    case 'published':
      return renderWebsiteList(model, 'published');
    case 'stats':
      return renderStatsPlaceholder(model);
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
    case 'change_requests':
      return renderChangeRequestsList(model.changeRequests ?? []);
    case 'change_request_new':
      return renderChangeRequestForm(model.websiteList);
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

  const primaryCtx = resolveMyWebsiteContext(model);
  const topbarTitle =
    section === 'overview' && primaryCtx ? primaryCtx.site.businessName : sectionTitle(section);
  const topbarEyebrow = section === 'overview' && primaryCtx ? 'Mijn website' : 'Klantendashboard';
  const topbarStatus = primaryCtx ? primaryCtx.stats.statusGroup : model.statusLabel;
  const topbarDomain = primaryCtx ? primaryCtx.site.subdomain : model.subdomain;
  const topbarBadgeClass = primaryCtx
    ? statusGroupBadgeClass(primaryCtx.stats.statusGroup)
    : statusBadgeClass(model.status);

  return `
    <div class="dashboard-shell">
      <aside class="dashboard-sidebar" aria-label="Dashboard menu">
        <div class="dashboard-sidebar__brand">
          <span>Star Local</span>
          <small>${escapeHtml(primaryCtx?.site.businessName ?? model.businessName)}</small>
        </div>
        <nav class="dashboard-nav">${nav}</nav>
        <div class="dashboard-sidebar__footer">
          <a class="dashboard-sidebar__link" href="${BUILDER_START_PATH}">Website builder</a>
        </div>
      </aside>
      <div class="dashboard-main">
        <header class="dashboard-topbar">
          <div>
            <p class="dashboard-topbar__eyebrow">${escapeHtml(topbarEyebrow)}</p>
            <h1>${escapeHtml(topbarTitle)}</h1>
          </div>
          <div class="dashboard-topbar__meta">
            <span class="dashboard-status-badge ${topbarBadgeClass}">${escapeHtml(topbarStatus)}</span>
            <span class="dashboard-topbar__domain">${escapeHtml(topbarDomain)}</span>
          </div>
        </header>
        ${renderBetaStatusCard(model)}
        <div class="dashboard-content">${renderSection(section, model)}</div>
      </div>
    </div>
  `;
}
