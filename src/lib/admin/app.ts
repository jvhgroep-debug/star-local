import type { ApprovalStatus } from '../../types/approval';
import { APPROVAL_STATUS_LABELS } from '../../types/approval';
import {
  deleteAdminWebsite,
  fetchAdminPublicationLog,
  fetchAdminQueue,
  goLiveAdminWebsite,
  publishAdminWebsite,
  publishSiteAdminWebsite,
  updateAdminWebsiteStatus,
} from './admin-api.client';
import { renderAdminShell, renderPublicationLogContent } from './render';
import type { AdminWebsiteRecord } from './queue.types';
import { getAdminQueueStats } from './queue.storage';

interface AdminFilters {
  status: ApprovalStatus | '';
  city: string;
  industry: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

interface AdminContext {
  queue: AdminWebsiteRecord[];
  filters: AdminFilters;
  pendingRejectId: string | null;
  pendingDeleteId: string | null;
  publishingIds: Set<string>;
  goLiveIds: Set<string>;
  loadError: string | null;
}

let ctx: AdminContext = {
  queue: [],
  filters: { status: '', city: '', industry: '', dateFrom: '', dateTo: '', search: '' },
  pendingRejectId: null,
  pendingDeleteId: null,
  publishingIds: new Set(),
  goLiveIds: new Set(),
  loadError: null,
};

function getRoot(): HTMLElement {
  const root = document.getElementById('admin-root');
  if (!root) throw new Error('Admin root element not found');
  return root;
}

function uniqueValues(items: AdminWebsiteRecord[], key: 'city' | 'industry'): string[] {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'nl'));
}

function filterQueue(queue: AdminWebsiteRecord[], filters: AdminFilters): AdminWebsiteRecord[] {
  const search = filters.search.trim().toLowerCase();

  return queue.filter((item) => {
    if (filters.status && item.approvalStatus !== filters.status) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (filters.industry && item.industry !== filters.industry) return false;

    if (filters.dateFrom) {
      const from = new Date(`${filters.dateFrom}T00:00:00`).getTime();
      if (new Date(item.createdAt).getTime() < from) return false;
    }

    if (filters.dateTo) {
      const to = new Date(`${filters.dateTo}T23:59:59`).getTime();
      if (new Date(item.createdAt).getTime() > to) return false;
    }

    if (search) {
      const haystack = `${item.businessName} ${item.email} ${item.subdomain} ${item.slug}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}

function render(): void {
  const root = getRoot();
  const filtered = filterQueue(ctx.queue, ctx.filters);
  const errorBanner = ctx.loadError
    ? `<p class="admin-dev-banner admin-dev-banner--error" role="alert">${ctx.loadError}</p>`
    : '';

  root.innerHTML = `${errorBanner}${renderAdminShell({
    stats: getAdminQueueStats(ctx.queue),
    filters: {
      ...ctx.filters,
      cities: uniqueValues(ctx.queue, 'city'),
      industries: uniqueValues(ctx.queue, 'industry'),
    },
    items: filtered,
    publishingIds: new Set([...ctx.publishingIds, ...ctx.goLiveIds]),
  })}`;
  bindEvents();
}

async function reloadQueue(): Promise<void> {
  try {
    ctx.queue = await fetchAdminQueue();
    ctx.loadError = null;
  } catch (error) {
    ctx.loadError = error instanceof Error ? error.message : 'Admin-wachtrij laden mislukt.';
  }
}

async function handleGoLive(id: string): Promise<void> {
  const record = ctx.queue.find((item) => item.id === id);
  if (!record || record.approvalStatus !== 'package_ready') return;

  if (!window.confirm(`Website "${record.businessName}" live zetten op ${record.subdomain}?`)) {
    return;
  }

  ctx.goLiveIds.add(id);
  render();

  try {
    const result = await goLiveAdminWebsite(id);
    await reloadQueue();
    window.alert(`Website is live: ${result.liveUrl}`);
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Live zetten mislukt.');
  } finally {
    ctx.goLiveIds.delete(id);
    render();
  }
}

async function handlePublishSite(id: string): Promise<void> {
  const record = ctx.queue.find((item) => item.id === id);
  if (!record || record.approvalStatus !== 'approved') return;

  if (!window.confirm(`Website "${record.businessName}" publiceren op /sites/${record.slug}/?`)) {
    return;
  }

  ctx.publishingIds.add(id);
  render();

  try {
    const result = await publishSiteAdminWebsite(id);
    await reloadQueue();
    window.alert(`Website gepubliceerd: ${result.liveUrl}`);
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Publiceren mislukt.');
  } finally {
    ctx.publishingIds.delete(id);
    render();
  }
}

async function handlePublish(id: string): Promise<void> {
  const record = ctx.queue.find((item) => item.id === id);
  if (!record || (record.approvalStatus !== 'approved' && record.approvalStatus !== 'package_ready')) return;

  ctx.publishingIds.add(id);
  render();

  try {
    await publishAdminWebsite(id);
    await reloadQueue();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Pakketgeneratie mislukt.');
  } finally {
    ctx.publishingIds.delete(id);
    render();
  }
}

async function showPublicationLog(id: string): Promise<void> {
  try {
    const stored = await fetchAdminPublicationLog(id);
    const root = getRoot();
    const body = root.querySelector('#admin-pub-log-body');
    const dialog = root.querySelector('#admin-pub-log-dialog') as HTMLDialogElement | null;
    if (!body || !dialog) return;

    body.innerHTML = renderPublicationLogContent(stored.log);
    dialog.showModal();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Geen publicatielog gevonden.');
  }
}

function bindEvents(): void {
  const root = getRoot();

  root.querySelector('[data-admin-search]')?.addEventListener('input', (event) => {
    ctx.filters.search = (event.target as HTMLInputElement).value;
    render();
  });

  root.querySelectorAll('[data-admin-filter]').forEach((element) => {
    element.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const key = target.dataset.adminFilter as keyof AdminFilters;
      if (!key) return;
      ctx.filters[key] = target.value as never;
      render();
    });
  });

  root.querySelectorAll('[data-admin-preview]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminPreview;
      if (!id) return;
      window.open(`/admin/preview/?id=${encodeURIComponent(id)}`, '_blank', 'noopener,noreferrer');
    });
  });

  root.querySelectorAll('[data-admin-go-live]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminGoLive;
      if (!id || ctx.goLiveIds.has(id)) return;
      void handleGoLive(id);
    });
  });

  root.querySelectorAll('[data-admin-publish-site]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminPublishSite;
      if (!id || ctx.publishingIds.has(id)) return;
      void handlePublishSite(id);
    });
  });

  root.querySelectorAll('[data-admin-to-review]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminToReview;
      if (!id) return;
      void (async () => {
        try {
          await updateAdminWebsiteStatus(id, 'pending_review');
          await reloadQueue();
          render();
        } catch (error) {
          window.alert(error instanceof Error ? error.message : 'Status bijwerken mislukt.');
        }
      })();
    });
  });

  root.querySelectorAll('[data-admin-to-concept]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminToConcept;
      if (!id) return;
      if (!window.confirm('Website terugzetten naar concept? De live site is dan niet meer bereikbaar.')) return;
      void (async () => {
        try {
          await updateAdminWebsiteStatus(id, 'concept');
          await reloadQueue();
          render();
        } catch (error) {
          window.alert(error instanceof Error ? error.message : 'Status bijwerken mislukt.');
        }
      })();
    });
  });

  root.querySelectorAll('[data-admin-publish]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminPublish;
      if (!id || ctx.publishingIds.has(id)) return;
      void handlePublish(id);
    });
  });

  root.querySelectorAll('[data-admin-production-preview]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminProductionPreview;
      if (!id) return;
      window.open(`/admin/production-preview/?id=${encodeURIComponent(id)}`, '_blank', 'noopener,noreferrer');
    });
  });

  root.querySelectorAll('[data-admin-view-live]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminViewLive;
      if (!id) return;
      window.open(`/admin/preview/?id=${encodeURIComponent(id)}&live=1`, '_blank', 'noopener,noreferrer');
    });
  });

  root.querySelectorAll('[data-admin-view-log]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminViewLog;
      if (!id) return;
      void showPublicationLog(id);
    });
  });

  root.querySelectorAll('[data-admin-approve]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminApprove;
      if (!id) return;
      void (async () => {
        try {
          await updateAdminWebsiteStatus(id, 'approved');
          await reloadQueue();
          if (ctx.filters.status === 'pending_review') {
            ctx.filters.status = '';
          }
          render();
        } catch (error) {
          window.alert(error instanceof Error ? error.message : 'Goedkeuren mislukt.');
        }
      })();
    });
  });

  root.querySelectorAll('[data-admin-reject]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminReject;
      if (!id) return;
      ctx.pendingRejectId = id;
      const dialog = root.querySelector('#admin-reject-dialog') as HTMLDialogElement | null;
      dialog?.showModal();
    });
  });

  root.querySelectorAll('[data-admin-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.adminDelete;
      if (!id) return;
      const record = ctx.queue.find((item) => item.id === id);
      ctx.pendingDeleteId = id;
      const target = root.querySelector('#admin-delete-target');
      if (target && record) {
        target.textContent = `${record.businessName} (${record.subdomain})`;
      }
      const dialog = root.querySelector('#admin-delete-dialog') as HTMLDialogElement | null;
      dialog?.showModal();
    });
  });

  root.querySelectorAll('[data-admin-dialog-cancel]').forEach((button) => {
    button.addEventListener('click', () => {
      (button.closest('dialog') as HTMLDialogElement | null)?.close();
    });
  });

  root.querySelector('#admin-reject-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!ctx.pendingRejectId) return;
    const form = event.target as HTMLFormElement;
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
    const reason = (form.elements.namedItem('reason') as HTMLTextAreaElement).value.trim();
    const fullReason = reason ? `${category}: ${reason}` : category;
    const rejectId = ctx.pendingRejectId;
    ctx.pendingRejectId = null;
    void (async () => {
      try {
        await updateAdminWebsiteStatus(rejectId, 'rejected', {
          rejectionCategory: category,
          rejectionReason: fullReason,
        });
        await reloadQueue();
        (form.closest('dialog') as HTMLDialogElement | null)?.close();
        render();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Afkeuren mislukt.');
      }
    })();
  });

  root.querySelector('#admin-delete-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!ctx.pendingDeleteId) return;
    const deleteId = ctx.pendingDeleteId;
    ctx.pendingDeleteId = null;
    void (async () => {
      try {
        await deleteAdminWebsite(deleteId);
        await reloadQueue();
        (event.target as HTMLFormElement).closest('dialog')?.close();
        render();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Verwijderen mislukt.');
      }
    })();
  });
}

export async function initAdminWebsites(): Promise<void> {
  await reloadQueue();
  render();
}

export function getApprovalLabel(status: ApprovalStatus): string {
  return APPROVAL_STATUS_LABELS[status];
}
