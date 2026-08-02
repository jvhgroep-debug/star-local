import type { DashboardSection, DashboardViewModel } from '../../types/dashboard';
import { loadPreparedWebsite } from '../builder/publish/storage';
import { mapPreparedWebsiteToDashboard } from './map-local';
import { renderDashboardShell } from './render';
import { loadDashboardSession } from './storage';

export interface DashboardInitOptions {
  initialData?: DashboardViewModel | null;
  initialSection?: DashboardSection;
  tenantId?: string | null;
}

interface DashboardContext {
  model: DashboardViewModel | null;
  section: DashboardSection;
}

let ctx: DashboardContext = {
  model: null,
  section: 'overview',
};

function getRoot(): HTMLElement {
  const root = document.getElementById('dashboard-root');
  if (!root) throw new Error('Dashboard root element not found');
  return root;
}

function resolveSection(value: string | null | undefined): DashboardSection {
  const allowed: DashboardSection[] = [
    'overview',
    'website',
    'pages',
    'services',
    'contact',
    'hours',
    'seo',
    'images',
    'publish',
    'settings',
  ];
  return allowed.includes(value as DashboardSection) ? (value as DashboardSection) : 'overview';
}

function resolveInitialModel(initialData?: DashboardViewModel | null): DashboardViewModel | null {
  if (initialData) return initialData;

  const session = loadDashboardSession();
  const prepared = loadPreparedWebsite();
  if (prepared) {
    return mapPreparedWebsiteToDashboard(prepared, session);
  }

  return null;
}

function syncTenantQueryParam(model: DashboardViewModel | null): void {
  if (!model?.tenantId || typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (url.searchParams.get('tenantId') === model.tenantId) return;

  url.searchParams.set('tenantId', model.tenantId);
  window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
}

function render(): void {
  const root = getRoot();
  root.innerHTML = renderDashboardShell(ctx.section, ctx.model);
  bindEvents();
}

function bindEvents(): void {
  const root = getRoot();

  root.querySelectorAll('[data-dashboard-section]').forEach((element) => {
    element.addEventListener('click', () => {
      const section = resolveSection((element as HTMLElement).dataset.dashboardSection);
      ctx.section = section;
      render();
    });
  });
}

export function initDashboard(options: DashboardInitOptions = {}): void {
  const session = loadDashboardSession();
  let model = resolveInitialModel(options.initialData);

  if (model && session?.publishEmail && !model.publishEmail) {
    model = { ...model, publishEmail: session.publishEmail };
  }

  ctx = {
    model,
    section: resolveSection(options.initialSection),
  };

  const resolvedTenantId = options.tenantId ?? model?.tenantId ?? session?.tenantId ?? null;
  if (resolvedTenantId) {
    const url = new URL(window.location.href);
    if (url.searchParams.get('tenantId') !== resolvedTenantId) {
      url.searchParams.set('tenantId', resolvedTenantId);
      window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
    }
  }

  syncTenantQueryParam(ctx.model);
  render();
}

export { saveDashboardSession } from './storage';
export type { DashboardSession } from './storage';
