import type { ChangeRequestRecord, ChangeRequestType } from '../../types/change-request';
import {
  CHANGE_REQUEST_TYPES,
  CHANGE_REQUEST_TYPE_LABELS,
  PHOTO_PLACEMENTS,
  PHOTO_PLACEMENT_LABELS,
} from '../../types/change-request';
import type { DashboardWebsiteCardItem } from '../../types/dashboard';
import { CSRF_HEADER_NAME } from '../customer-portal/csrf';

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

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'dashboard-cr-badge--completed';
    case 'approved':
      return 'dashboard-cr-badge--approved';
    case 'rejected':
      return 'dashboard-cr-badge--rejected';
    case 'in_progress':
      return 'dashboard-cr-badge--progress';
    default:
      return 'dashboard-cr-badge--pending';
  }
}

export function renderChangeRequestForm(websites: DashboardWebsiteCardItem[]): string {
  const websiteOptions = websites
    .map(
      (site) =>
        `<option value="${escapeHtml(site.websiteId ?? site.id)}">${escapeHtml(site.businessName)} (${escapeHtml(site.slug)}.starlocal.nl)</option>`,
    )
    .join('');

  const typeOptions = CHANGE_REQUEST_TYPES.map(
    (type) => `<option value="${type}">${escapeHtml(CHANGE_REQUEST_TYPE_LABELS[type])}</option>`,
  ).join('');

  const placementOptions = PHOTO_PLACEMENTS.map(
    (p) => `<option value="${p}">${escapeHtml(PHOTO_PLACEMENT_LABELS[p])}</option>`,
  ).join('');

  return `
    <section class="dashboard-panel dashboard-panel--change-request">
      <header class="dashboard-panel__head">
        <div>
          <p class="eyebrow">Klantportaal</p>
          <h2>Wijziging aanvragen</h2>
          <p class="dashboard-lead">
            Beschrijf uw gewenste wijziging. Star Local controleert elk verzoek handmatig —
            uw live website wordt niet automatisch aangepast.
          </p>
        </div>
        <button type="button" class="btn btn-secondary" data-dashboard-section="change_requests">Mijn verzoeken</button>
      </header>

      ${websites.length === 0 ? `
        <div class="dashboard-empty dashboard-empty--inline">
          <p class="dashboard-lead">U heeft nog geen website om wijzigingen voor aan te vragen.</p>
          <a class="btn btn-primary" href="/gratis-website/start/">Website maken</a>
        </div>
      ` : `
        <form id="change-request-form" class="dashboard-cr-form" novalidate>
          <div class="dashboard-cr-form__grid">
            <label class="dashboard-cr-field">
              <span>Website *</span>
              <select id="cr-website" name="websiteId" required>${websiteOptions}</select>
            </label>
            <label class="dashboard-cr-field">
              <span>Soort wijziging *</span>
              <select id="cr-type" name="requestType" required>${typeOptions}</select>
            </label>
          </div>

          <label class="dashboard-cr-field">
            <span>Omschrijving *</span>
            <textarea id="cr-description" name="description" rows="5" required minlength="10" maxlength="5000" placeholder="Beschrijf zo duidelijk mogelijk wat u wilt wijzigen…"></textarea>
          </label>

          <fieldset id="cr-photo-fields" class="dashboard-cr-photo-fields" hidden>
            <legend>Foto-aanvraag</legend>
            <p class="dashboard-lead dashboard-cr-photo-note">
              Foto-upload naar Cloudflare R2 volgt later. Uw bestandsgegevens worden veilig opgeslagen als pending media-aanvraag.
            </p>
            <label class="dashboard-cr-field">
              <span>Foto selecteren</span>
              <input id="cr-photo-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
            </label>
            <label class="dashboard-cr-field">
              <span>Omschrijving foto</span>
              <input id="cr-photo-caption" type="text" maxlength="500" placeholder="Korte omschrijving van de foto" />
            </label>
            <label class="dashboard-cr-field">
              <span>Waar moet de foto komen?</span>
              <select id="cr-photo-placement">${placementOptions}</select>
            </label>
          </fieldset>

          <p class="auth-alert auth-alert--error" id="cr-form-error" hidden role="alert"></p>
          <p class="auth-alert auth-alert--success" id="cr-form-success" hidden role="status"></p>

          <div class="dashboard-cr-form__actions">
            <button type="submit" class="btn btn-primary" id="cr-submit">Verzoek indienen</button>
            <button type="button" class="btn btn-secondary" data-dashboard-section="change_requests">Annuleren</button>
          </div>
        </form>
      `}
    </section>
  `;
}

export function renderChangeRequestsList(
  items: Array<ChangeRequestRecord & { typeLabel: string; statusLabel: string }>,
): string {
  if (items.length === 0) {
    return `
      <section class="dashboard-panel">
        <header class="dashboard-panel__head">
          <div>
            <h2>Mijn wijzigingsverzoeken</h2>
            <p class="dashboard-lead">U heeft nog geen wijzigingsverzoeken ingediend.</p>
          </div>
          <button type="button" class="btn btn-primary" data-dashboard-section="change_request_new">Wijziging aanvragen</button>
        </header>
      </section>
    `;
  }

  const rows = items
    .map(
      (item) => `
      <article class="dashboard-cr-card">
        <div class="dashboard-cr-card__head">
          <span class="dashboard-cr-badge ${statusBadgeClass(item.status)}">${escapeHtml(item.statusLabel)}</span>
          <time datetime="${escapeHtml(item.createdAt)}">${escapeHtml(formatDate(item.createdAt))}</time>
        </div>
        <h3>${escapeHtml(item.typeLabel)}</h3>
        <p class="dashboard-cr-card__desc">${escapeHtml(item.description.slice(0, 200))}${item.description.length > 200 ? '…' : ''}</p>
        ${item.mediaMetadata ? `<p class="dashboard-muted dashboard-cr-card__media">📎 ${escapeHtml(item.mediaMetadata.filename)}</p>` : ''}
      </article>
    `,
    )
    .join('');

  return `
    <section class="dashboard-panel">
      <header class="dashboard-panel__head">
        <div>
          <h2>Mijn wijzigingsverzoeken</h2>
          <p class="dashboard-lead">Overzicht van al uw ingediende wijzigingsverzoeken.</p>
        </div>
        <button type="button" class="btn btn-primary" data-dashboard-section="change_request_new">Wijziging aanvragen</button>
      </header>
      <div class="dashboard-cr-list">${rows}</div>
    </section>
  `;
}

export async function fetchCustomerChangeRequests(): Promise<
  Array<ChangeRequestRecord & { typeLabel: string; statusLabel: string }>
> {
  const response = await fetch('/api/customer/change-requests/', { headers: { Accept: 'application/json' } });
  if (!response.ok) return [];
  const data = (await response.json()) as { ok: boolean; items?: Array<ChangeRequestRecord & { typeLabel: string; statusLabel: string }> };
  return data.ok && data.items ? data.items : [];
}

let csrfToken = '';

export function bindChangeRequestForm(
  root: HTMLElement,
  onSuccess: () => void,
): void {
  void fetch('/api/customer/csrf/', { headers: { Accept: 'application/json' } })
    .then((r) => r.json())
    .then((data: { token?: string }) => {
      csrfToken = data.token ?? '';
    })
    .catch(() => undefined);

  const form = root.querySelector('#change-request-form') as HTMLFormElement | null;
  const typeSelect = root.querySelector('#cr-type') as HTMLSelectElement | null;
  const photoFields = root.querySelector('#cr-photo-fields') as HTMLElement | null;

  typeSelect?.addEventListener('change', () => {
    const isPhoto = typeSelect.value === 'photo' || typeSelect.value === 'logo';
    if (photoFields) photoFields.hidden = !isPhoto;
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorEl = root.querySelector('#cr-form-error') as HTMLElement | null;
    const successEl = root.querySelector('#cr-form-success') as HTMLElement | null;
    const submitBtn = root.querySelector('#cr-submit') as HTMLButtonElement | null;
    errorEl?.setAttribute('hidden', '');
    successEl?.setAttribute('hidden', '');

    const websiteId = (root.querySelector('#cr-website') as HTMLSelectElement | null)?.value ?? '';
    const requestType = (root.querySelector('#cr-type') as HTMLSelectElement | null)?.value as ChangeRequestType;
    const description = (root.querySelector('#cr-description') as HTMLTextAreaElement | null)?.value.trim() ?? '';
    const fileInput = root.querySelector('#cr-photo-file') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    const payload: Record<string, unknown> = { websiteId, requestType, description };

    if (requestType === 'photo' || requestType === 'logo') {
      if (file) {
        payload.mediaFile = {
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          placement: (root.querySelector('#cr-photo-placement') as HTMLSelectElement | null)?.value,
          caption: (root.querySelector('#cr-photo-caption') as HTMLInputElement | null)?.value.trim(),
        };
      }
      payload.requestedLocation = (root.querySelector('#cr-photo-placement') as HTMLSelectElement | null)?.value;
    }

    submitBtn && (submitBtn.disabled = true);

    try {
      const response = await fetch('/api/customer/change-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          [CSRF_HEADER_NAME]: csrfToken,
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? 'Indienen mislukt.');
      }
      if (successEl) {
        successEl.textContent = data.message ?? 'Verzoek ingediend.';
        successEl.removeAttribute('hidden');
      }
      form.reset();
      if (photoFields) photoFields.hidden = true;
      setTimeout(onSuccess, 1200);
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = error instanceof Error ? error.message : 'Indienen mislukt.';
        errorEl.removeAttribute('hidden');
      }
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
}
