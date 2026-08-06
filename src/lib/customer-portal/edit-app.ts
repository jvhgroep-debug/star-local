import type { CustomerWebsiteEditPayload } from './edit.service';

interface EditFormState extends CustomerWebsiteEditPayload {
  statusLabel?: string;
  pendingChangesStatus?: string;
}

let csrfToken = '';

function getRoot(): HTMLElement {
  const root = document.getElementById('customer-edit-root');
  if (!root) throw new Error('Customer edit root not found');
  return root;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderField(id: string, label: string, value: string, type = 'text'): string {
  return `
    <div class="dashboard-field">
      <label for="${id}">${escapeHtml(label)}</label>
      <input class="dashboard-input" id="${id}" name="${id}" type="${type}" value="${escapeHtml(value)}" />
    </div>
  `;
}

function renderTextarea(id: string, label: string, value: string): string {
  return `
    <div class="dashboard-field">
      <label for="${id}">${escapeHtml(label)}</label>
      <textarea class="dashboard-input" id="${id}" name="${id}" rows="4">${escapeHtml(value)}</textarea>
    </div>
  `;
}

function renderServices(services: EditFormState['services']): string {
  const items = (services ?? [])
    .map(
      (service, index) => `
        <div class="dashboard-service-row" data-service-index="${index}">
          ${renderField(`service-title-${index}`, 'Dienst', service.title ?? '')}
          ${renderTextarea(`service-desc-${index}`, 'Omschrijving', service.description ?? '')}
        </div>
      `,
    )
    .join('');

  return `
    <section class="dashboard-panel">
      <h2>Diensten</h2>
      <div id="services-list">${items || '<p class="dashboard-muted">Nog geen diensten.</p>'}</div>
      <button type="button" class="btn btn-secondary btn-sm" id="add-service">Dienst toevoegen</button>
    </section>
  `;
}

function renderForm(state: EditFormState): string {
  const pendingBanner =
    state.pendingChangesStatus === 'in_review'
      ? `<p class="auth-alert auth-alert--info" role="status">Er staan wijzigingen in review. Uw live website blijft online.</p>`
      : '';

  return `
    ${pendingBanner}
    <form id="customer-edit-form" class="dashboard-edit-form">
      <section class="dashboard-panel">
        <h2>Bedrijfsgegevens</h2>
        ${renderField('businessName', 'Bedrijfsnaam', state.businessName ?? '')}
        ${renderField('industry', 'Branche', state.industry ?? '')}
        ${renderTextarea('description', 'Omschrijving', state.description ?? '')}
      </section>

      <section class="dashboard-panel">
        <h2>Contact</h2>
        ${renderField('phone', 'Telefoon', state.phone ?? '')}
        ${renderField('whatsapp', 'WhatsApp', state.whatsapp ?? '')}
        ${renderField('email', 'E-mail', state.email ?? '', 'email')}
        ${renderField('website', 'Website', state.website ?? '', 'url')}
        ${renderField('street', 'Adres', state.street ?? '')}
        ${renderField('postcode', 'Postcode', state.postcode ?? '')}
        ${renderField('city', 'Plaats', state.city ?? '')}
      </section>

      ${renderServices(state.services)}

      <section class="dashboard-panel">
        <h2>Social media</h2>
        ${renderField('facebook', 'Facebook', state.social?.facebook ?? '', 'url')}
        ${renderField('instagram', 'Instagram', state.social?.instagram ?? '', 'url')}
        ${renderField('linkedin', 'LinkedIn', state.social?.linkedin ?? '', 'url')}
      </section>

      <section class="dashboard-panel">
        <h2>Teksten</h2>
        ${renderField('heroTitle', 'Hero titel', state.heroTitle ?? '')}
        ${renderField('heroSubtitle', 'Hero ondertitel', state.heroSubtitle ?? '')}
        ${renderTextarea('seoMetaDescription', 'SEO meta description', state.seoMetaDescription ?? '')}
      </section>

      <div class="dashboard-edit-actions">
        <a class="btn btn-secondary" href="/dashboard/">Terug naar dashboard</a>
        <button type="submit" class="btn btn-primary" id="save-edit">Opslaan</button>
      </div>
      <p id="edit-message" class="dashboard-muted" role="status" hidden></p>
    </form>
  `;
}

function collectServices(): NonNullable<EditFormState['services']> {
  const rows = document.querySelectorAll('[data-service-index]');
  return Array.from(rows).map((row, index) => {
    const rowIndex = (row as HTMLElement).dataset.serviceIndex ?? String(index);
    const title = (document.getElementById(`service-title-${rowIndex}`) as HTMLInputElement | null)?.value ?? '';
    const description = (document.getElementById(`service-desc-${rowIndex}`) as HTMLTextAreaElement | null)?.value ?? '';
    return { id: `service-${rowIndex}`, title, description };
  });
}

function collectPayload(state: EditFormState): CustomerWebsiteEditPayload {
  const value = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';

  return {
    websiteId: state.websiteId!,
    tenantId: state.tenantId!,
    businessName: value('businessName'),
    industry: value('industry'),
    description: value('description'),
    phone: value('phone'),
    whatsapp: value('whatsapp'),
    email: value('email'),
    website: value('website'),
    street: value('street'),
    postcode: value('postcode'),
    city: value('city'),
    services: collectServices(),
    social: {
      facebook: value('facebook'),
      instagram: value('instagram'),
      linkedin: value('linkedin'),
    },
    heroTitle: value('heroTitle'),
    heroSubtitle: value('heroSubtitle'),
    seoMetaDescription: value('seoMetaDescription'),
  };
}

function bindForm(state: EditFormState): void {
  const form = document.getElementById('customer-edit-form');
  const message = document.getElementById('edit-message');
  const addService = document.getElementById('add-service');

  addService?.addEventListener('click', () => {
    const list = document.getElementById('services-list');
    if (!list) return;
    const index = list.querySelectorAll('[data-service-index]').length;
    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-service-row';
    wrapper.dataset.serviceIndex = String(index);
    wrapper.innerHTML = `
      ${renderField(`service-title-${index}`, 'Dienst', '')}
      ${renderTextarea(`service-desc-${index}`, 'Omschrijving', '')}
    `;
    list.appendChild(wrapper);
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (message) {
      message.hidden = true;
      message.textContent = '';
    }

    const payload = collectPayload(state);
    const response = await fetch('/api/customer/website/edit/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    if (message) {
      message.hidden = false;
      message.className = result.ok ? 'auth-alert auth-alert--success' : 'auth-alert auth-alert--error';
      message.textContent = result.message ?? (result.ok ? 'Opgeslagen.' : 'Opslaan mislukt.');
    }
  });
}

export async function initCustomerWebsiteEdit(tenantId: string, websiteId: string): Promise<void> {
  const root = getRoot();
  root.innerHTML = '<p class="dashboard-muted">Website laden…</p>';

  try {
    const csrfResponse = await fetch('/api/customer/csrf/', { headers: { Accept: 'application/json' } });
    const csrfData = (await csrfResponse.json()) as { token?: string };
    csrfToken = csrfData.token ?? '';
  } catch {
    csrfToken = '';
  }

  const response = await fetch(
    `/api/customer/website/?tenantId=${encodeURIComponent(tenantId)}&websiteId=${encodeURIComponent(websiteId)}`,
    { headers: { Accept: 'application/json' } },
  );
  const result = (await response.json()) as { ok: boolean; data?: EditFormState; message?: string };
  if (!result.ok || !result.data) {
    root.innerHTML = `<p class="auth-alert auth-alert--error">${escapeHtml(result.message ?? 'Website kon niet worden geladen.')}</p>`;
    return;
  }

  root.innerHTML = renderForm(result.data);
  bindForm(result.data);
}
