interface AdminCustomerItem {
  id: string;
  email: string;
  businessName: string | null;
  status: string;
  websiteCount: number;
  activeSessions: number;
  createdAt: string;
}

function getRoot(): HTMLElement {
  const root = document.getElementById('admin-customers-root');
  if (!root) throw new Error('Admin customers root not found');
  return root;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTable(items: AdminCustomerItem[]): string {
  if (items.length === 0) {
    return '<p class="dashboard-muted">Geen klanten gevonden.</p>';
  }

  const rows = items
    .map(
      (item) => `
        <tr data-customer-id="${escapeHtml(item.id)}">
          <td>${escapeHtml(item.email)}</td>
          <td>${escapeHtml(item.businessName ?? '—')}</td>
          <td>${escapeHtml(item.status)}</td>
          <td>${item.websiteCount}</td>
          <td>${item.activeSessions}</td>
          <td class="admin-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-revoke-links>Magic links intrekken</button>
            <button type="button" class="btn btn-secondary btn-sm" data-revoke-sessions>Sessies beëindigen</button>
          </td>
        </tr>
      `,
    )
    .join('');

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>E-mail</th>
            <th>Bedrijfsnaam</th>
            <th>Status</th>
            <th>Websites</th>
            <th>Actieve sessies</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

async function postAction(customerId: string, action: 'revoke_magic_links' | 'revoke_sessions'): Promise<string> {
  const response = await fetch('/api/admin/customers/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, action }),
  });
  const result = (await response.json()) as { ok: boolean; revoked?: number; message?: string };
  if (!result.ok) return result.message ?? 'Actie mislukt.';
  return action === 'revoke_magic_links'
    ? `${result.revoked ?? 0} magic link(s) ingetrokken.`
    : `${result.revoked ?? 0} sessie(s) beëindigd.`;
}

function bindEvents(onRefresh: () => Promise<void>): void {
  const root = getRoot();
  root.querySelectorAll('[data-revoke-links]').forEach((button) => {
    button.addEventListener('click', async () => {
      const row = button.closest('tr') as HTMLElement | null;
      const customerId = row?.dataset.customerId;
      if (!customerId) return;
      const message = await postAction(customerId, 'revoke_magic_links');
      alert(message);
      await onRefresh();
    });
  });

  root.querySelectorAll('[data-revoke-sessions]').forEach((button) => {
    button.addEventListener('click', async () => {
      const row = button.closest('tr') as HTMLElement | null;
      const customerId = row?.dataset.customerId;
      if (!customerId) return;
      const message = await postAction(customerId, 'revoke_sessions');
      alert(message);
      await onRefresh();
    });
  });
}

async function loadCustomers(): Promise<AdminCustomerItem[]> {
  const response = await fetch('/api/admin/customers/', { headers: { Accept: 'application/json' } });
  const result = (await response.json()) as { ok: boolean; items?: AdminCustomerItem[]; message?: string };
  if (!result.ok || !result.items) throw new Error(result.message ?? 'Klanten laden mislukt.');
  return result.items;
}

export async function initAdminCustomers(): Promise<void> {
  const root = getRoot();

  async function refresh(): Promise<void> {
    root.innerHTML = '<p class="dashboard-muted">Klanten laden…</p>';
    try {
      const items = await loadCustomers();
      root.innerHTML = renderTable(items);
      bindEvents(refresh);
    } catch (error) {
      root.innerHTML = `<p class="auth-alert auth-alert--error">${escapeHtml(error instanceof Error ? error.message : 'Laden mislukt.')}</p>`;
    }
  }

  await refresh();
}
