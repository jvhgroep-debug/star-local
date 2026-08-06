import type { ApprovalStatus } from '../../types/approval';
import { APPROVAL_STATUS_LABELS, REJECTION_CATEGORIES } from '../../types/approval';
import type { AdminWebsiteRecord } from './queue.types';
import type { AdminPublicationLog } from './admin-publication.service';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function approvalBadgeClass(status: ApprovalStatus): string {
  switch (status) {
    case 'approved':
    case 'package_ready':
      return 'builder-status-badge--ready';
    case 'preparing':
      return 'builder-status-badge--draft';
    case 'published':
      return 'builder-status-badge--published';
    case 'rejected':
      return 'builder-status-badge--concept';
    case 'pending_review':
      return 'builder-status-badge--draft';
    default:
      return 'builder-status-badge--draft';
  }
}

export function renderAdminStats(stats: Record<ApprovalStatus | 'total', number>): string {
  const cards = [
    { key: 'concept', label: 'Concepten' },
    { key: 'pending_review', label: 'In review' },
    { key: 'approved', label: 'Goedgekeurd' },
    { key: 'package_ready', label: 'Pakket gereed' },
    { key: 'published', label: 'Gepubliceerd' },
    { key: 'rejected', label: 'Afgekeurd' },
    { key: 'total', label: 'Totaal websites' },
  ] as const;

  return `
    <div class="admin-stats-grid">
      ${cards
        .map(
          (card) => `
        <article class="dashboard-stat-card admin-stat-card">
          <span class="dashboard-stat-card__value">${stats[card.key]}</span>
          <span class="dashboard-stat-card__label">${card.label}</span>
        </article>
      `,
        )
        .join('')}
    </div>
  `;
}

export function renderAdminFilters(options: {
  status: string;
  city: string;
  industry: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  cities: string[];
  industries: string[];
}): string {
  const statusOptions = (Object.keys(APPROVAL_STATUS_LABELS) as ApprovalStatus[])
    .map(
      (value) =>
        `<option value="${value}"${options.status === value ? ' selected' : ''}>${APPROVAL_STATUS_LABELS[value]}</option>`,
    )
    .join('');

  const cityOptions = options.cities
    .map((city) => `<option value="${escapeHtml(city)}"${options.city === city ? ' selected' : ''}>${escapeHtml(city)}</option>`)
    .join('');

  const industryOptions = options.industries
    .map(
      (industry) =>
        `<option value="${escapeHtml(industry)}"${options.industry === industry ? ' selected' : ''}>${escapeHtml(industry)}</option>`,
    )
    .join('');

  return `
    <section class="admin-filters" aria-label="Filters">
      <div class="admin-filters__search">
        <label for="admin-search">Zoeken</label>
        <input id="admin-search" type="search" placeholder="Bedrijfsnaam, e-mail of subdomein" value="${escapeHtml(options.search)}" data-admin-search />
      </div>
      <div class="admin-filters__grid">
        <label>Status
          <select data-admin-filter="status">
            <option value="">Alle statussen</option>
            ${statusOptions}
          </select>
        </label>
        <label>Gemeente
          <select data-admin-filter="city">
            <option value="">Alle gemeenten</option>
            ${cityOptions}
          </select>
        </label>
        <label>Branche
          <select data-admin-filter="industry">
            <option value="">Alle branches</option>
            ${industryOptions}
          </select>
        </label>
        <label>Datum vanaf
          <input type="date" data-admin-filter="dateFrom" value="${escapeHtml(options.dateFrom)}" />
        </label>
        <label>Datum t/m
          <input type="date" data-admin-filter="dateTo" value="${escapeHtml(options.dateTo)}" />
        </label>
      </div>
    </section>
  `;
}

function renderAdminRow(item: AdminWebsiteRecord, publishingIds: Set<string>): string {
  const isPublishing = publishingIds.has(item.id) || item.approvalStatus === 'preparing';
  const statusLabel = isPublishing ? 'Bezig met voorbereiden…' : APPROVAL_STATUS_LABELS[item.approvalStatus];
  const statusClass = isPublishing ? 'builder-status-badge--ready' : approvalBadgeClass(item.approvalStatus);
  const sitePath = item.liveUrl || `/sites/${item.slug}/`;

  let actions = '';

  const previewBtn = `<button type="button" class="btn btn-secondary btn-sm" data-admin-preview="${escapeHtml(item.id)}">Preview</button>`;
  const editBtn = `<a class="btn btn-secondary btn-sm" href="/gratis-website/wizard/?websiteId=${encodeURIComponent(item.id)}">Bewerken</a>`;
  const conceptBtn = `<button type="button" class="btn btn-secondary btn-sm" data-admin-to-concept="${escapeHtml(item.id)}">Terug naar concept</button>`;
  const rejectBtn = `<button type="button" class="btn btn-secondary btn-sm" data-admin-reject="${escapeHtml(item.id)}"${item.approvalStatus === 'rejected' ? ' disabled' : ''}>Afkeuren</button>`;

  if (item.approvalStatus === 'published') {
    actions = `
      <a class="btn btn-primary btn-sm" href="${escapeHtml(sitePath)}" target="_blank" rel="noopener noreferrer">Bekijk website</a>
      ${previewBtn}
      ${editBtn}
      ${conceptBtn}
    `;
  } else if (item.approvalStatus === 'package_ready') {
    const version = item.activePublicationVersion ? ` · ${escapeHtml(item.activePublicationVersion)}` : '';
    const isGoingLive = publishingIds.has(item.id);
    actions = `
      <button type="button" class="btn btn-primary btn-sm" data-admin-go-live="${escapeHtml(item.id)}"${isGoingLive ? ' disabled aria-busy="true"' : ''}>
        ${isGoingLive ? '<span class="admin-spinner" aria-hidden="true"></span> Live zetten…' : 'Live zetten (R2)'}
      </button>
      <button type="button" class="btn btn-secondary btn-sm" data-admin-production-preview="${escapeHtml(item.id)}">Productiepreview</button>
      <button type="button" class="btn btn-secondary btn-sm" data-admin-view-log="${escapeHtml(item.id)}">Publicatielog</button>
      <button type="button" class="btn btn-secondary btn-sm" data-admin-publish="${escapeHtml(item.id)}" title="Genereert een nieuwe pakketversie">Nieuwe versie</button>
      <span class="admin-table__sub">Pakket gereed${version}</span>
    `;
  } else if (item.approvalStatus === 'approved') {
    actions = `
      ${previewBtn}
      ${editBtn}
      <button type="button" class="btn btn-primary btn-sm" data-admin-publish-site="${escapeHtml(item.id)}"${isPublishing ? ' disabled aria-busy="true"' : ''}>
        ${isPublishing ? '<span class="admin-spinner" aria-hidden="true"></span> Publiceren…' : 'Publiceren'}
      </button>
      ${rejectBtn}
      ${conceptBtn}
    `;
  } else if (item.approvalStatus === 'pending_review') {
    actions = `
      ${previewBtn}
      ${editBtn}
      <button type="button" class="btn btn-primary btn-sm" data-admin-approve="${escapeHtml(item.id)}">Goedkeuren</button>
      ${rejectBtn}
      ${conceptBtn}
    `;
  } else if (item.approvalStatus === 'concept') {
    actions = `
      ${previewBtn}
      ${editBtn}
      <button type="button" class="btn btn-secondary btn-sm" data-admin-to-review="${escapeHtml(item.id)}">Naar review</button>
      ${rejectBtn}
    `;
  } else {
    actions = `
      ${previewBtn}
      ${editBtn}
      ${conceptBtn}
      <button type="button" class="btn btn-secondary btn-sm admin-btn-danger" data-admin-delete="${escapeHtml(item.id)}"${isPublishing ? ' disabled' : ''}>Verwijderen</button>
    `;
  }

  return `
    <tr data-admin-row="${escapeHtml(item.id)}">
      <td data-label="Bedrijf">
        <strong>${escapeHtml(item.businessName)}</strong>
        <span class="admin-table__sub">${escapeHtml(item.email || '—')}</span>
      </td>
      <td data-label="Subdomein">${escapeHtml(item.subdomain)}</td>
      <td data-label="Gemeente">${escapeHtml(item.city || '—')}</td>
      <td data-label="Branche">${escapeHtml(item.industry || '—')}</td>
      <td data-label="Aangemaakt">${escapeHtml(formatDate(item.createdAt))}</td>
      <td data-label="Status">
        <span class="builder-status-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
      </td>
      <td data-label="Acties">
        <div class="admin-row-actions">${actions}</div>
      </td>
    </tr>
  `;
}

export function renderAdminTable(items: AdminWebsiteRecord[], publishingIds: Set<string> = new Set()): string {
  if (items.length === 0) {
    return `
      <div class="dashboard-empty dashboard-empty--websites">
        <p>Geen websites gevonden voor de huidige filters.</p>
      </div>
    `;
  }

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Bedrijfsnaam</th>
            <th>Subdomein</th>
            <th>Gemeente</th>
            <th>Branche</th>
            <th>Datum aangemaakt</th>
            <th>Status</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item) => renderAdminRow(item, publishingIds)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function renderPublicationLogContent(log: AdminPublicationLog): string {
  const steps = log.steps
    .map(
      (step) => `
      <li class="admin-pub-log__step${step.ok ? ' admin-pub-log__step--ok' : ' admin-pub-log__step--fail'}">
        <span class="admin-pub-log__icon" aria-hidden="true">${step.ok ? '✓' : '✗'}</span>
        <span class="admin-pub-log__label">${escapeHtml(step.label)}</span>
        ${step.detail ? `<span class="admin-pub-log__detail">${escapeHtml(step.detail)}</span>` : ''}
      </li>
    `,
    )
    .join('');

  return `
    <div class="admin-pub-log">
      <p class="admin-pub-log__meta">
        <strong>${escapeHtml(log.businessName)}</strong><br />
        ${escapeHtml(log.subdomain)} · ${escapeHtml(formatDate(log.finishedAt))}
      </p>
      <ul class="admin-pub-log__steps">${steps}</ul>
      <p class="admin-pub-log__summary">
        ${log.versionLabel ? `Versie ${escapeHtml(log.versionLabel)} · ` : ''}
        ${log.pageCount} pagina's · ${log.fileCount} bestanden
        ${log.assetCount != null ? ` · ${log.assetCount} assets` : ''}
        ${log.totalSizeBytes != null ? ` · ${formatBytes(log.totalSizeBytes)}` : ''}
        ${log.canonicalBaseUrl ? `<br />Canonical: ${escapeHtml(log.canonicalBaseUrl)}` : ''}
        ${log.previousVersion ? `<br />Vorige versie: ${escapeHtml(log.previousVersion)}` : ''}
      </p>
    </div>
  `;
}

export function renderPublicationLogDialog(): string {
  return `
    <dialog class="admin-dialog admin-dialog--wide" id="admin-pub-log-dialog">
      <div class="admin-dialog__form">
        <h2>Publicatie log</h2>
        <div id="admin-pub-log-body"></div>
        <div class="admin-dialog__actions">
          <button type="button" class="btn btn-secondary" data-admin-dialog-cancel>Sluiten</button>
        </div>
      </div>
    </dialog>
  `;
}

export function renderRejectDialog(): string {
  const options = REJECTION_CATEGORIES.map(
    (category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`,
  ).join('');

  return `
    <dialog class="admin-dialog" id="admin-reject-dialog">
      <form method="dialog" class="admin-dialog__form" id="admin-reject-form">
        <h2>Website afkeuren</h2>
        <p class="admin-dialog__lead">Kies een reden en geef optioneel een toelichting.</p>
        <label>Reden
          <select name="category" required>
            ${options}
          </select>
        </label>
        <label>Toelichting
          <textarea name="reason" rows="4" placeholder="Optionele toelichting voor de ondernemer"></textarea>
        </label>
        <div class="admin-dialog__actions">
          <button type="button" class="btn btn-secondary" data-admin-dialog-cancel>Afbreken</button>
          <button type="submit" class="btn btn-primary admin-btn-danger" value="confirm">Afkeuren</button>
        </div>
      </form>
    </dialog>
  `;
}

export function renderDeleteDialog(): string {
  return `
    <dialog class="admin-dialog" id="admin-delete-dialog">
      <form method="dialog" class="admin-dialog__form" id="admin-delete-form">
        <h2>Website verwijderen</h2>
        <p class="admin-dialog__lead">Weet u zeker dat u deze website wilt verwijderen?</p>
        <p class="admin-dialog__target" id="admin-delete-target"></p>
        <div class="admin-dialog__actions">
          <button type="button" class="btn btn-secondary" data-admin-dialog-cancel>Afbreken</button>
          <button type="submit" class="btn btn-primary admin-btn-danger" value="confirm">Definitief verwijderen</button>
        </div>
      </form>
    </dialog>
  `;
}

export function renderAdminShell(options: {
  stats: Record<ApprovalStatus | 'total', number>;
  filters: Parameters<typeof renderAdminFilters>[0];
  items: AdminWebsiteRecord[];
  publishingIds?: Set<string>;
}): string {
  return `
    <div class="admin-shell">
      <header class="dashboard-panel__head admin-panel__head">
        <div>
          <p class="eyebrow">Star Local beheer</p>
          <h1>Website-goedkeuring</h1>
          <p class="dashboard-lead">Beoordeel nieuwe websites voordat ze live gaan.</p>
        </div>
        <a class="btn btn-secondary" href="/dashboard/">Klantendashboard</a>
      </header>
      ${renderAdminStats(options.stats)}
      ${renderAdminFilters(options.filters)}
      ${renderAdminTable(options.items, options.publishingIds ?? new Set())}
      ${renderRejectDialog()}
      ${renderDeleteDialog()}
      ${renderPublicationLogDialog()}
    </div>
  `;
}
