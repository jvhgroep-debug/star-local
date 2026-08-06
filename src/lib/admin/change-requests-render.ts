import type { ChangeRequestAdminView, ChangeRequestStatus } from '../../types/change-request';
import {
  CHANGE_REQUEST_STATUS_LABELS,
  CHANGE_REQUEST_TYPE_LABELS,
} from '../../types/change-request';

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

function statusBadgeClass(status: ChangeRequestStatus): string {
  switch (status) {
    case 'completed':
      return 'admin-cr-badge--completed';
    case 'approved':
      return 'admin-cr-badge--approved';
    case 'rejected':
      return 'admin-cr-badge--rejected';
    case 'in_progress':
      return 'admin-cr-badge--progress';
    default:
      return 'admin-cr-badge--pending';
  }
}

export function renderChangeRequestsAdminShell(items: ChangeRequestAdminView[], selectedId: string | null): string {
  const stats = {
    pending: items.filter((i) => i.status === 'pending').length,
    in_progress: items.filter((i) => i.status === 'in_progress').length,
    approved: items.filter((i) => i.status === 'approved').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
    completed: items.filter((i) => i.status === 'completed').length,
    total: items.length,
  };

  const selected = selectedId ? items.find((i) => i.id === selectedId) : null;

  return `
    <div class="admin-cr-layout">
      <div class="admin-stats-grid admin-cr-stats">
        <article class="dashboard-stat-card admin-stat-card"><span class="dashboard-stat-card__value">${stats.pending}</span><span class="dashboard-stat-card__label">Pending</span></article>
        <article class="dashboard-stat-card admin-stat-card"><span class="dashboard-stat-card__value">${stats.in_progress}</span><span class="dashboard-stat-card__label">In behandeling</span></article>
        <article class="dashboard-stat-card admin-stat-card"><span class="dashboard-stat-card__value">${stats.approved}</span><span class="dashboard-stat-card__label">Goedgekeurd</span></article>
        <article class="dashboard-stat-card admin-stat-card"><span class="dashboard-stat-card__value">${stats.completed}</span><span class="dashboard-stat-card__label">Uitgevoerd</span></article>
        <article class="dashboard-stat-card admin-stat-card"><span class="dashboard-stat-card__value">${stats.total}</span><span class="dashboard-stat-card__label">Totaal</span></article>
      </div>

      <div class="admin-cr-grid">
        <div class="admin-cr-list-panel">
          <h2 class="admin-cr-panel-title">Wijzigingsverzoeken</h2>
          ${items.length === 0 ? '<p class="dashboard-lead">Nog geen wijzigingsverzoeken.</p>' : `
            <ul class="admin-cr-list" role="list">
              ${items
                .map(
                  (item) => `
                <li>
                  <button type="button" class="admin-cr-list-item${selectedId === item.id ? ' is-active' : ''}" data-cr-select="${escapeHtml(item.id)}">
                    <span class="admin-cr-badge ${statusBadgeClass(item.status)}">${escapeHtml(CHANGE_REQUEST_STATUS_LABELS[item.status])}</span>
                    <strong>${escapeHtml(item.typeLabel ?? CHANGE_REQUEST_TYPE_LABELS[item.requestType])}</strong>
                    <span class="admin-cr-list-item__meta">${escapeHtml(item.customerEmail)} · ${escapeHtml(item.websiteName)}</span>
                    <time>${escapeHtml(formatDate(item.createdAt))}</time>
                  </button>
                </li>
              `,
                )
                .join('')}
            </ul>
          `}
        </div>

        <div class="admin-cr-detail-panel">
          ${selected ? renderDetailPanel(selected) : '<p class="dashboard-lead">Selecteer een verzoek om details te bekijken.</p>'}
        </div>
      </div>
    </div>
  `;
}

function renderDetailPanel(item: ChangeRequestAdminView & { mediaSummary?: string; placementLabel?: string | null; typeLabel?: string }): string {
  const statuses: ChangeRequestStatus[] = ['pending', 'in_progress', 'approved', 'rejected', 'completed'];

  return `
    <article class="admin-cr-detail">
      <header class="admin-cr-detail__head">
        <span class="admin-cr-badge ${statusBadgeClass(item.status)}">${escapeHtml(CHANGE_REQUEST_STATUS_LABELS[item.status])}</span>
        <h2>${escapeHtml(item.typeLabel ?? CHANGE_REQUEST_TYPE_LABELS[item.requestType])}</h2>
        <p class="dashboard-muted">${escapeHtml(formatDate(item.createdAt))}</p>
      </header>

      <dl class="dashboard-fields admin-cr-detail__fields">
        <div class="dashboard-field"><dt>Klant</dt><dd>${escapeHtml(item.customerEmail)}${item.customerName ? ` (${escapeHtml(item.customerName)})` : ''}</dd></div>
        <div class="dashboard-field"><dt>Website</dt><dd>${escapeHtml(item.websiteName)} · ${escapeHtml(item.websiteSlug)}.starlocal.nl</dd></div>
        <div class="dashboard-field"><dt>Type</dt><dd>${escapeHtml(item.typeLabel ?? CHANGE_REQUEST_TYPE_LABELS[item.requestType])}</dd></div>
        <div class="dashboard-field"><dt>Omschrijving</dt><dd>${escapeHtml(item.description)}</dd></div>
        ${item.mediaMetadata ? `
          <div class="dashboard-field"><dt>Bestand</dt><dd>${escapeHtml(item.mediaSummary ?? item.mediaMetadata.filename)}</dd></div>
          <div class="dashboard-field"><dt>Positie</dt><dd>${escapeHtml(item.placementLabel ?? item.requestedLocation ?? '—')}</dd></div>
          <div class="dashboard-field"><dt>Media status</dt><dd><code>pending</code> — R2-koppeling volgt later</dd></div>
        ` : ''}
      </dl>

      <div class="admin-cr-detail__actions">
        <label class="admin-cr-field">
          <span>Status wijzigen</span>
          <select id="admin-cr-status" data-cr-id="${escapeHtml(item.id)}">
            ${statuses.map((s) => `<option value="${s}"${s === item.status ? ' selected' : ''}>${escapeHtml(CHANGE_REQUEST_STATUS_LABELS[s])}</option>`).join('')}
          </select>
        </label>
        <label class="admin-cr-field">
          <span>Admin-notitie (optioneel)</span>
          <textarea id="admin-cr-notes" rows="3" maxlength="2000" placeholder="Interne notitie…">${escapeHtml(item.adminNotes ?? '')}</textarea>
        </label>
        <div class="admin-cr-detail__buttons">
          <button type="button" class="btn btn-primary" data-cr-update="${escapeHtml(item.id)}">Status opslaan</button>
        </div>
        <p class="dashboard-muted admin-cr-detail__note">Geen automatische wijziging aan de live website. Markeer als uitgevoerd nadat u handmatig heeft gepubliceerd.</p>
      </div>
    </article>
  `;
}

export async function fetchAdminChangeRequests(): Promise<
  Array<ChangeRequestAdminView & { typeLabel: string; statusLabel: string; mediaSummary?: string; placementLabel?: string | null }>
> {
  const response = await fetch('/api/admin/change-requests/', { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Wijzigingsverzoeken laden mislukt.');
  const data = (await response.json()) as { ok: boolean; items?: Array<ChangeRequestAdminView & { typeLabel: string; statusLabel: string; mediaSummary?: string; placementLabel?: string | null }> };
  return data.items ?? [];
}

export async function updateAdminChangeRequest(
  id: string,
  status: ChangeRequestStatus,
  adminNotes?: string,
): Promise<void> {
  const response = await fetch('/api/admin/change-requests/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id, status, adminNotes }),
  });
  const data = (await response.json()) as { ok: boolean; message?: string };
  if (!response.ok || !data.ok) {
    throw new Error(data.message ?? 'Status bijwerken mislukt.');
  }
}
