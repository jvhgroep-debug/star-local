import type { DashboardSection, DashboardViewModel } from '../../types/dashboard';

import { loadPreparedWebsite } from '../builder/publish/storage';

import { computeTenantKey } from '../publish/local-publish.service';

import {

  getLastPublicationLog,

  loadPublicationLogs,

  loadPublicationPipelineStatus,

} from '../publish/publication-log.storage';

import { mapPreparedWebsiteToDashboard } from './map-local';

import { formatDuration, pipelineStatusLabel, runLocalPublication } from './publish-client';
import { enrichDashboardModel, mapStoredToCard } from './website-list';
import { loadWebsiteList } from './website-list.storage';
import { loadWebsiteFromD1 } from '../builder/publish/save-client';
import { mapLoadResultToDashboard } from './map-load-result';

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

  isPublishing: boolean;

}



let ctx: DashboardContext = {

  model: null,

  section: 'overview',

  isPublishing: false,

};



function getRoot(): HTMLElement {

  const root = document.getElementById('dashboard-root');

  if (!root) throw new Error('Dashboard root element not found');

  return root;

}



function resolveSection(value: string | null | undefined): DashboardSection {

  const allowed: DashboardSection[] = [
    'overview',
    'websites',
    'concepts',
    'in_review',
    'published',
    'change_requests',
    'change_request_new',
    'stats',
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

  if (initialData?.source === 'd1') return initialData;

  if (initialData) return initialData;



  const session = loadDashboardSession();

  if (session?.tenantId) {

    return null;

  }



  const prepared = loadPreparedWebsite();

  if (prepared) {

    return mapPreparedWebsiteToDashboard(prepared, session);

  }



  return null;

}



function createPortfolioModel(): DashboardViewModel {
  const stored = loadWebsiteList();
  return {
    source: 'local',
    tenantId: null,
    websiteId: null,
    businessName: '',
    industry: '',
    description: '',
    slug: '',
    subdomain: '',
    url: '',
    status: 'draft',
    statusLabel: 'Draft',
    package: 'free',
    packageLabel: 'Gratis',
    lastUpdated: null,
    pageCount: 0,
    seoScore: '—',
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    contact: { phone: '', whatsapp: '', email: '', street: '', postcode: '', city: '' },
    services: [],
    hours: [],
    pages: [],
    logoKey: null,
    logoName: null,
    primaryColor: '#1a2332',
    accentColor: '#cdb880',
    publishEmail: null,
    publicationPipelineStatus: 'draft',
    publicationPipelineLabel: 'Draft',
    publicationLogs: [],
    lastPublicationLog: null,
    canPublish: false,
    websiteList: stored.map(mapStoredToCard),
  };
}

function refreshPublicationFields(model: DashboardViewModel): DashboardViewModel {
  const tenantKey = computeTenantKey(model.slug, model.tenantId);
  const status = loadPublicationPipelineStatus(tenantKey);
  const logs = loadPublicationLogs(tenantKey);
  const lastLog = getLastPublicationLog(tenantKey);

  return enrichDashboardModel({
    ...model,
    publicationPipelineStatus: status,
    publicationPipelineLabel: pipelineStatusLabel(status),
    publicationLogs: logs,
    lastPublicationLog: lastLog,
    canPublish: Boolean(loadPreparedWebsite()),
    seoScore: lastLog?.seoScore != null ? String(lastLog.seoScore) : model.seoScore,
  });
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



async function ensureChangeRequestsLoaded(): Promise<void> {
  if (!ctx.model) return;
  if (ctx.section !== 'change_requests' && ctx.section !== 'overview') return;
  const { fetchCustomerChangeRequests } = await import('./change-requests-ui');
  ctx.model.changeRequests = await fetchCustomerChangeRequests();
}



async function renderAsync(): Promise<void> {
  await ensureChangeRequestsLoaded();
  render();
}



function setPublishProgress(step: string | null): void {

  const progress = getRoot().querySelector('[data-publish-progress]') as HTMLElement | null;

  if (!progress) return;



  progress.hidden = !step;

  progress.querySelectorAll('[data-publish-step]').forEach((el) => {

    const element = el as HTMLElement;

    const active = step === element.dataset.publishStep;

    element.classList.toggle('is-active', active);

    element.classList.toggle('is-done', Boolean(step && !active && getStepOrder(step) > getStepOrder(element.dataset.publishStep ?? '')));

  });

}



function getStepOrder(step: string): number {

  const order = ['load', 'pages', 'seo', 'package'];

  return order.indexOf(step);

}



function showPublishResult(success: boolean, message: string, log?: { durationMs: number | null; pageCount: number; seoScore: number }): void {

  const result = getRoot().querySelector('[data-publish-result]') as HTMLElement | null;

  if (!result) return;



  result.hidden = false;

  result.className = `dashboard-publish-result dashboard-publish-result--${success ? 'success' : 'error'}`;

  result.innerHTML = success

    ? `<p><strong>Publicatie geslaagd.</strong> ${message}</p>

       <p class="dashboard-muted">${log?.pageCount ?? 0} pagina's · SEO-score ${log?.seoScore ?? 0}% · Duur ${formatDuration(log?.durationMs ?? null)}</p>`

    : `<p><strong>Publicatie mislukt.</strong> ${message}</p>`;

}



async function animatePublishSteps(republish: boolean): Promise<void> {

  const steps = republish ? ['load', 'pages', 'package'] : ['load', 'pages', 'seo', 'package'];

  for (const step of steps) {

    setPublishProgress(step);

    await new Promise((r) => setTimeout(r, 350));

  }

  setPublishProgress(null);

}



async function handlePublish(republish: boolean): Promise<void> {

  if (!ctx.model || ctx.isPublishing) return;



  ctx.isPublishing = true;

  ctx.model = refreshPublicationFields({

    ...ctx.model,

    publicationPipelineStatus: 'building',

    publicationPipelineLabel: pipelineStatusLabel('building'),

  });

  render();



  const progressEl = getRoot().querySelector('[data-publish-progress]') as HTMLElement | null;

  if (progressEl) progressEl.hidden = false;



  const stepsPromise = animatePublishSteps(republish);

  const resultPromise = runLocalPublication(ctx.model, republish);

  const [, result] = await Promise.all([stepsPromise, resultPromise]);



  ctx.isPublishing = false;



  const session = loadDashboardSession();

  const prepared = loadPreparedWebsite();

  if (prepared) {

    ctx.model = mapPreparedWebsiteToDashboard(prepared, session);

  } else if (ctx.model) {

    ctx.model = refreshPublicationFields(ctx.model);

  }



  if (result.ok) {

    showPublishResult(

      true,

      `Status: ${pipelineStatusLabel('published')}. Publicatiepakket lokaal gebouwd (niet live op internet).`,

      result.log,

    );

  } else {

    showPublishResult(false, result.message);

  }



  render();

}



function bindEvents(): void {

  const root = getRoot();



  root.querySelectorAll('[data-dashboard-section]').forEach((element) => {

    element.addEventListener('click', () => {

      const section = resolveSection((element as HTMLElement).dataset.dashboardSection);

      ctx.section = section;

      void renderAsync();

    });

  });

  if (ctx.section === 'change_request_new') {
    void import('./change-requests-ui').then(({ bindChangeRequestForm }) => {
      bindChangeRequestForm(root, () => {
        ctx.section = 'change_requests';
        void renderAsync();
      });
    });
  }



  const dialog = root.querySelector('[data-publish-dialog]') as HTMLDialogElement | null;

  const publishBtn = root.querySelector('[data-publish-action="publish"]');

  const republishBtn = root.querySelector('[data-publish-action="republish"]');

  const cancelBtn = root.querySelector('[data-publish-cancel]');



  publishBtn?.addEventListener('click', () => {

    if (dialog) dialog.showModal();

  });



  cancelBtn?.addEventListener('click', () => dialog?.close());



  dialog?.addEventListener('close', () => {

    if (dialog.returnValue === 'confirm') {

      void handlePublish(false);

    }

  });



  republishBtn?.addEventListener('click', () => {
    void handlePublish(true);
  });

  root.querySelectorAll('[data-premium-upgrade]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.alert(
        'Premium wordt binnenkort beschikbaar. U hoort van ons zodra u kunt upgraden — er is nog geen betaalfunctionaliteit actief.',
      );
    });
  });

  root.querySelectorAll('[data-open-publish-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ctx.section = 'publish';
      render();
    });
  });
}



export async function initDashboard(options: DashboardInitOptions = {}): Promise<void> {

  const session = loadDashboardSession();

  let model = resolveInitialModel(options.initialData);

  try {
    const customerResponse = await fetch('/api/customer/websites/', { headers: { Accept: 'application/json' } });
    if (customerResponse.ok) {
      const customerData = (await customerResponse.json()) as {
        ok: boolean;
        customer?: { businessName: string; email: string };
        websites?: DashboardViewModel['websiteList'];
      };
      if (customerData.ok && customerData.websites) {
        model = {
          ...(model ?? createPortfolioModel()),
          websiteList: customerData.websites,
          customerBusinessName: customerData.customer?.businessName,
          customerEmail: customerData.customer?.email,
          canPublish: false,
        };
      }
    }
  } catch {
    // Fallback to existing model resolution
  }

  const tenantId = options.tenantId ?? model?.tenantId ?? session?.tenantId ?? null;

  if (!model && tenantId) {
    const response = await loadWebsiteFromD1(tenantId);
    if (response.ok) {
      model = mapLoadResultToDashboard(response.result);
    }
  }



  if (model && session?.publishEmail && !model.publishEmail) {

    model = { ...model, publishEmail: session.publishEmail };

  }



  if (model) {
    model = refreshPublicationFields(model);
  } else {
    model = createPortfolioModel();
  }



  ctx = {

    model,

    section: resolveSection(options.initialSection),

    isPublishing: false,

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

  await renderAsync();

}



export { saveDashboardSession } from './storage';

export type { DashboardSession } from './storage';

