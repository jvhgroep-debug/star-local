import {
  fetchAdminChangeRequests,
  renderChangeRequestsAdminShell,
  updateAdminChangeRequest,
} from './change-requests-render';
import type { ChangeRequestStatus } from '../../types/change-request';

interface AdminChangeRequestsContext {
  items: Awaited<ReturnType<typeof fetchAdminChangeRequests>>;
  selectedId: string | null;
  loadError: string | null;
}

let ctx: AdminChangeRequestsContext = {
  items: [],
  selectedId: null,
  loadError: null,
};

function getRoot(): HTMLElement {
  const root = document.getElementById('admin-change-requests-root');
  if (!root) throw new Error('Admin change requests root not found');
  return root;
}

function render(): void {
  const root = getRoot();
  const errorBanner = ctx.loadError
    ? `<p class="admin-dev-banner admin-dev-banner--error" role="alert">${ctx.loadError}</p>`
    : '';
  root.innerHTML = `${errorBanner}${renderChangeRequestsAdminShell(ctx.items, ctx.selectedId)}`;
  bindEvents();
}

async function reload(): Promise<void> {
  try {
    ctx.items = await fetchAdminChangeRequests();
    ctx.loadError = null;
  } catch (error) {
    ctx.loadError = error instanceof Error ? error.message : 'Laden mislukt.';
  }
}

function bindEvents(): void {
  const root = getRoot();

  root.querySelectorAll('[data-cr-select]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ctx.selectedId = (btn as HTMLElement).dataset.crSelect ?? null;
      render();
    });
  });

  root.querySelectorAll('[data-cr-update]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.crUpdate;
      if (!id) return;
      const status = (root.querySelector('#admin-cr-status') as HTMLSelectElement | null)?.value as ChangeRequestStatus;
      const adminNotes = (root.querySelector('#admin-cr-notes') as HTMLTextAreaElement | null)?.value.trim();
      try {
        await updateAdminChangeRequest(id, status, adminNotes);
        await reload();
        ctx.selectedId = id;
        render();
      } catch (error) {
        ctx.loadError = error instanceof Error ? error.message : 'Opslaan mislukt.';
        render();
      }
    });
  });
}

export async function initAdminChangeRequests(): Promise<void> {
  await reload();
  if (ctx.items.length > 0 && !ctx.selectedId) {
    ctx.selectedId = ctx.items[0].id;
  }
  render();
}
