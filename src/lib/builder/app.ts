import type { BuilderState, BuilderStep, PreviewPage } from '../../types/builder';
import type { PreparedWebsite } from '../../types/website-config';
import type { PublishWebsiteResult } from '../../types/publish';
import { readableTextColor } from './colors';
import { BUILDER_INDUSTRIES, COLOR_PRESETS, createServiceId, filterIndustries, WORKDAY_KEYS } from './constants';
import {
  addPhotoFile,
  createEmptyFiles,
  movePhoto,
  removePhoto,
  revokeAllFiles,
  setLogoFile,
  syncFileMeta,
  type BuilderFiles,
} from './files';
import { renderPublishForm } from './render-publish';
import { renderPublishSuccessD1 } from './render-publish-d1';
import {
  buildPublishPayload,
  publishWebsiteToD1,
  prepareSiteArtifactsForPublish,
  clearPreparedWebsite,
  executePublication,
  getActivePreparedWebsite,
} from './publish';
import { renderTenantPreview, renderExampleDomainBar } from './render-preview';
import { bindPreviewInteractions } from './preview-interactions';
import {
  renderProgress,
  renderStep1,
  renderStep2,
  renderStep3,
  renderStep4,
  renderStep5,
} from './render-builder';
import {
  clearState,
  createDefaultState,
  hasStoredUploadMeta,
  loadState,
  saveState,
} from './storage';
import { applyPreviewSeo, applyPreparedPreviewSeo, futureDomain, renderPremiumBlock, resetPreviewSeo } from './templates';
import { saveDashboardSession } from '../dashboard/storage';
import { formatSlugPreviewHtml, getSlugPreview } from './slug';
import {
  validateAll,
  validatePublishEmail,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
} from './validation';

interface AppContext {
  state: BuilderState;
  files: BuilderFiles;
  errors: Record<string, string>;
  fileWarning: string | null;
  preparedWebsite: PreparedWebsite | null;
  d1PublishResult: PublishWebsiteResult | null;
  magicLinkSent: boolean;
  usePreparedSite: boolean;
}

let ctx: AppContext;
let previewTimer: ReturnType<typeof setTimeout> | null = null;

function getRoot(): HTMLElement {
  const root = document.getElementById('website-builder-root');
  if (!root) throw new Error('Builder root not found');
  return root;
}

function persist(): void {
  const meta = syncFileMeta(ctx.files);
  ctx.state.branding.logoName = meta.logoName;
  ctx.state.branding.photoNames = meta.photoNames;
  ctx.state.branding.textColor = readableTextColor(ctx.state.branding.primaryColor);
  saveState(ctx.state);
}

function readStep1FromDom(): void {
  const root = getRoot();
  ctx.state.business.name = (root.querySelector('#business-name') as HTMLInputElement)?.value ?? '';
  ctx.state.business.industry = (root.querySelector('#business-industry') as HTMLInputElement)?.value ?? '';
  ctx.state.business.description =
    (root.querySelector('#business-description') as HTMLTextAreaElement)?.value ?? '';

  ctx.state.business.services = [...root.querySelectorAll('.builder-service')].map((element, index) => ({
    id: ctx.state.business.services[index]?.id ?? createServiceId(),
    title: (element.querySelector(`[name="service-title-${index}"]`) as HTMLInputElement)?.value ?? '',
    description:
      (element.querySelector(`[name="service-description-${index}"]`) as HTMLTextAreaElement)?.value ?? '',
  }));
}

function readStep2FromDom(): void {
  const root = getRoot();
  const get = (selector: string) => (root.querySelector(selector) as HTMLInputElement)?.value ?? '';
  ctx.state.contact.phone = get('#contact-phone');
  ctx.state.contact.whatsapp = get('#contact-whatsapp');
  ctx.state.contact.email = get('#contact-email');
  ctx.state.contact.street = get('#contact-street');
  ctx.state.contact.postcode = get('#contact-postcode');
  ctx.state.contact.city = get('#contact-city');
  ctx.state.contact.country = get('#contact-country') || 'Nederland';
}

function readStep3FromDom(): void {
  const root = getRoot();
  ctx.state.hours = ctx.state.hours.map((day, index) => {
    const closed = (root.querySelector(`[name="hours-closed-${index}"]`) as HTMLInputElement)?.checked ?? false;
    const open24 = (root.querySelector(`[name="hours-open24-${index}"]`) as HTMLInputElement)?.checked ?? false;
    const openTime = (root.querySelector(`[name="hours-open-${index}"]`) as HTMLInputElement)?.value ?? '09:00';
    const closeTime = (root.querySelector(`[name="hours-close-${index}"]`) as HTMLInputElement)?.value ?? '17:00';
    return { ...day, closed, open24, openTime, closeTime };
  });
}

function readStep4FromDom(): void {
  const root = getRoot();
  const primary = (root.querySelector('#primary-color') as HTMLInputElement)?.value;
  const accent = (root.querySelector('#accent-color') as HTMLInputElement)?.value;
  if (primary) ctx.state.branding.primaryColor = primary;
  if (accent) ctx.state.branding.accentColor = accent;
}

function readAllStepsFromDom(): void {
  const root = getRoot();
  if (root.querySelector('#business-name')) readStep1FromDom();
  if (root.querySelector('#contact-phone')) readStep2FromDom();
  if (root.querySelector('[name="hours-closed-0"]')) readStep3FromDom();
  if (root.querySelector('#primary-color')) readStep4FromDom();
}

function refreshLivePreviewPanel(): void {
  const root = getRoot();
  const frame = root.querySelector('#builder-live-preview-frame');
  if (!frame) return;

  const domainValue = root.querySelector('.builder-live-panel .builder-example-domain__value');
  if (domainValue) {
    domainValue.textContent = futureDomain(ctx.state);
  }

  frame.innerHTML = renderTenantPreview(ctx.state, ctx.files, 'home');
  attachPreviewFrame(frame);
}

function scheduleLivePreview(): void {
  readAllStepsFromDom();
  ctx.state.branding.textColor = readableTextColor(ctx.state.branding.primaryColor);
  persist();
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshLivePreviewPanel, 80);
}

function updateSlugPreview(): void {
  readStep1FromDom();
  const slugPreview = getRoot().querySelector('#slug-preview');
  if (slugPreview) {
    slugPreview.innerHTML = formatSlugPreviewHtml(getSlugPreview(ctx.state.business.name));
  }
  scheduleLivePreview();
}

function bindIndustryPicker(root: HTMLElement): void {
  const search = root.querySelector('#industry-search') as HTMLInputElement | null;
  const hidden = root.querySelector('#business-industry') as HTMLInputElement | null;
  const list = root.querySelector('#industry-options') as HTMLUListElement | null;
  if (!search || !hidden || !list) return;

  const renderOptions = (query: string) => {
    const options = filterIndustries(query).slice(0, 14);
    list.innerHTML = options
      .map(
        (option) =>
          `<li role="option" tabindex="0" data-industry="${option.replace(/"/g, '&quot;')}">${option}</li>`,
      )
      .join('');
    list.hidden = options.length === 0;
    search.setAttribute('aria-expanded', options.length > 0 ? 'true' : 'false');
  };

  const selectIndustry = (value: string) => {
    hidden.value = value;
    search.value = value;
    list.hidden = true;
    search.setAttribute('aria-expanded', 'false');
    scheduleLivePreview();
  };

  search.addEventListener('input', () => {
    renderOptions(search.value);
    const exact = BUILDER_INDUSTRIES.find(
      (industry) => industry.toLowerCase() === search.value.trim().toLowerCase(),
    );
    hidden.value = exact ?? hidden.value;
    scheduleLivePreview();
  });
  search.addEventListener('focus', () => renderOptions(search.value));
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const first = list.querySelector('[data-industry]') as HTMLElement | null;
      if (first) selectIndustry(first.dataset.industry ?? '');
    }
  });

  list.addEventListener('click', (event) => {
    const item = (event.target as HTMLElement).closest('[data-industry]') as HTMLElement | null;
    if (item?.dataset.industry) selectIndustry(item.dataset.industry);
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) list.hidden = true;
  });
}

function readCurrentStepFromDom(): void {
  switch (ctx.state.currentStep) {
    case 1:
      readStep1FromDom();
      break;
    case 2:
      readStep2FromDom();
      break;
    case 3:
      readStep3FromDom();
      break;
    case 4:
      readStep4FromDom();
      break;
    default:
      break;
  }
}

function validateCurrentStep(): boolean {
  readCurrentStepFromDom();
  let result;

  switch (ctx.state.currentStep) {
    case 1:
      result = validateStep1(ctx.state);
      break;
    case 2:
      result = validateStep2(ctx.state);
      break;
    case 3:
      result = validateStep3(ctx.state);
      break;
    case 4:
      result = validateStep4(ctx.state, Boolean(ctx.files.logoUrl), ctx.files.photoUrls.length);
      break;
    default:
      result = { valid: true, errors: {} };
  }

  ctx.errors = result.errors;
  return result.valid;
}

function renderBuilderShell(): string {
  const stepContent = (() => {
    switch (ctx.state.currentStep) {
      case 1:
        return renderStep1(ctx.state, ctx.errors);
      case 2:
        return renderStep2(ctx.state, ctx.errors);
      case 3:
        return renderStep3(ctx.state, ctx.errors);
      case 4:
        return renderStep4(ctx.state, ctx.files, ctx.errors, ctx.fileWarning);
      case 5:
        return renderStep5(ctx.state, ctx.files);
      default:
        return '';
    }
  })();

  const showNav = ctx.state.currentStep < 5;

  return `
    <div class="builder-workspace">
      <div class="builder-workspace__form">
        <div class="builder-shell">
          <header class="builder-header">
            <p class="eyebrow">Website Builder</p>
            <h1>Maak uw gratis website</h1>
            <p class="builder-subtitle">Vul uw bedrijfsgegevens in. Ons systeem bouwt automatisch uw website.</p>
            ${renderProgress(ctx.state.currentStep)}
          </header>

          <div class="builder-body">
            ${stepContent}
          </div>

          ${
            showNav
              ? `
            <footer class="builder-footer">
              <button type="button" class="btn btn-secondary" data-builder-back ${ctx.state.currentStep === 1 ? 'disabled' : ''}>Terug</button>
              <button type="button" class="btn btn-primary" data-builder-next>${ctx.state.currentStep === 4 ? 'Naar overzicht' : 'Verder'}</button>
            </footer>
          `
              : ''
          }

          <div class="builder-toolbar">
            <button type="button" class="builder-text-btn" data-reset-builder>Opnieuw beginnen</button>
          </div>
        </div>
      </div>

      <aside class="builder-live-panel" aria-label="Live website preview">
        ${renderExampleDomainBar(futureDomain(ctx.state))}
        <div class="builder-live-panel__head">
          <strong>Live preview</strong>
          <span>Wijzigingen verschijnen direct — automatisch gegenereerd</span>
        </div>
        <div id="builder-live-preview-frame" class="builder-live-preview__frame"></div>
      </aside>
    </div>

    ${renderPremiumBlock(ctx.state)}
  `;
}

function getPreviewHtml(page: PreviewPage): string {
  if (ctx.usePreparedSite && ctx.preparedWebsite) {
    return ctx.preparedWebsite.pages[page];
  }
  return renderTenantPreview(ctx.state, ctx.files, page);
}

function renderPreviewShell(): string {
  const tenantHtml = getPreviewHtml(ctx.state.previewPage);
  const domain = ctx.usePreparedSite && ctx.preparedWebsite
    ? ctx.preparedWebsite.config.slug.domain
    : futureDomain(ctx.state);

  return `
    <div class="builder-preview-shell">
      ${renderExampleDomainBar(domain)}
      <div class="builder-preview-bar" role="region" aria-label="Preview werkbalk">
        <p class="builder-preview-bar__label">${ctx.usePreparedSite ? 'Gepubliceerde website (lokaal)' : 'Voorbeeld van uw nieuwe website'}</p>
        <div class="builder-preview-bar__actions">
          <button type="button" class="btn btn-secondary" data-back-to-builder>← Terug naar builder</button>
          ${
            ctx.usePreparedSite
              ? ''
              : `<button type="button" class="btn btn-primary" data-open-publish>Website publiceren</button>`
          }
        </div>
      </div>
      <div class="builder-preview-frame">${tenantHtml}</div>
    </div>
  `;
}

function render(): void {
  const root = getRoot();
  const { view } = ctx.state;

  if (view === 'publish') {
    root.innerHTML = renderPublishForm(ctx.state, ctx.errors);
  } else if (view === 'publish-success') {
    const generation = ctx.preparedWebsite?.generation
      ? {
          pageCount: ctx.preparedWebsite.generation.pageCount,
          documentPaths: ctx.preparedWebsite.generation.documentPaths,
          sitemapPath: ctx.preparedWebsite.generation.sitemapPath,
          robotsPath: ctx.preparedWebsite.generation.robotsPath,
          manifestPath: ctx.preparedWebsite.generation.manifestPath,
          faviconPath: ctx.preparedWebsite.generation.faviconPath,
        }
      : undefined;

    const previewOptions =
      ctx.preparedWebsite && ctx.usePreparedSite
        ? {
            previewHtml: getPreviewHtml(ctx.state.previewPage),
            domain: ctx.preparedWebsite.config.slug.domain,
            publishEmail: ctx.state.publishEmailConfirmed || ctx.d1PublishResult?.publishEmail,
            magicLinkSent: ctx.magicLinkSent,
            generation,
          }
        : {
            domain: ctx.preparedWebsite?.config.slug.domain ?? '',
            publishEmail: ctx.state.publishEmailConfirmed || ctx.d1PublishResult?.publishEmail,
            magicLinkSent: ctx.magicLinkSent,
            generation,
          };
    root.innerHTML = ctx.d1PublishResult
      ? renderPublishSuccessD1(ctx.d1PublishResult, previewOptions)
      : renderBuilderShell();
    if (ctx.usePreparedSite && ctx.preparedWebsite) {
      applyPreparedPreviewSeo(ctx.preparedWebsite, ctx.state.previewPage);
    }
  } else if (view === 'preview') {
    root.innerHTML = renderPreviewShell();
    if (ctx.usePreparedSite && ctx.preparedWebsite) {
      applyPreparedPreviewSeo(ctx.preparedWebsite, ctx.state.previewPage);
    } else {
      applyPreviewSeo(ctx.state, ctx.files);
    }
  } else {
    root.innerHTML = renderBuilderShell();
    resetPreviewSeo();
    refreshLivePreviewPanel();
  }

  bindEvents();
}

function goToStep(step: BuilderStep): void {
  ctx.state.currentStep = step;
  ctx.errors = {};
  persist();
  render();
}

function bindEvents(): void {
  const root = getRoot();

  root.querySelector('[data-builder-back]')?.addEventListener('click', () => {
    readCurrentStepFromDom();
    if (ctx.state.currentStep > 1) {
      ctx.state.currentStep = (ctx.state.currentStep - 1) as BuilderStep;
      ctx.errors = {};
      persist();
      render();
    }
  });

  root.querySelector('[data-builder-next]')?.addEventListener('click', () => {
    if (!validateCurrentStep()) {
      render();
      root.querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    persist();
    if (ctx.state.currentStep < 5) {
      ctx.state.currentStep = (ctx.state.currentStep + 1) as BuilderStep;
      ctx.errors = {};
      render();
    }
  });

  root.querySelector('[data-add-service]')?.addEventListener('click', () => {
    readStep1FromDom();
    ctx.state.business.services.push({ id: createServiceId(), title: '', description: '' });
    persist();
    render();
  });

  root.querySelectorAll('[data-remove-service]').forEach((button) => {
    button.addEventListener('click', () => {
      readStep1FromDom();
      const index = Number((button as HTMLElement).dataset.removeService);
      ctx.state.business.services.splice(index, 1);
      persist();
      render();
    });
  });

  root.querySelector('#business-name')?.addEventListener('input', updateSlugPreview);

  bindIndustryPicker(root);

  root.querySelector('.builder-body')?.addEventListener('input', scheduleLivePreview);
  root.querySelector('.builder-body')?.addEventListener('change', scheduleLivePreview);

  root.querySelector('[data-copy-workday-hours]')?.addEventListener('click', () => {
    readStep3FromDom();
    const monday = ctx.state.hours.find((day) => day.dayKey === 'monday');
    if (!monday) return;
    ctx.state.hours = ctx.state.hours.map((day) =>
      WORKDAY_KEYS.includes(day.dayKey)
        ? {
            ...day,
            closed: monday.closed,
            open24: monday.open24,
            openTime: monday.openTime,
            closeTime: monday.closeTime,
          }
        : day,
    );
    persist();
    render();
  });

  root.querySelectorAll('.builder-hours-row').forEach((row, index) => {
    row.querySelector(`[name="hours-closed-${index}"]`)?.addEventListener('change', (event) => {
      const checked = (event.target as HTMLInputElement).checked;
      const open24 = row.querySelector(`[name="hours-open24-${index}"]`) as HTMLInputElement;
      if (checked && open24) open24.checked = false;
      render();
    });
    row.querySelector(`[name="hours-open24-${index}"]`)?.addEventListener('change', (event) => {
      const checked = (event.target as HTMLInputElement).checked;
      const closed = row.querySelector(`[name="hours-closed-${index}"]`) as HTMLInputElement;
      if (checked && closed) closed.checked = false;
      render();
    });
  });

  root.querySelector('#builder-logo')?.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const error = setLogoFile(ctx.files, file);
    ctx.errors.logo = error ?? '';
    if (!error) persist();
    render();
    scheduleLivePreview();
  });

  root.querySelector('#builder-photos')?.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const selected = [...(input.files ?? [])];
    let error: string | null = null;
    selected.forEach((file) => {
      if (!error) error = addPhotoFile(ctx.files, file);
    });
    input.value = '';
    ctx.errors.photos = error ?? '';
    if (!error) persist();
    render();
    scheduleLivePreview();
  });

  root.querySelectorAll('[data-remove-photo]').forEach((button) => {
    button.addEventListener('click', () => {
      removePhoto(ctx.files, Number((button as HTMLElement).dataset.removePhoto));
      persist();
      render();
    });
  });

  root.querySelectorAll('[data-move-photo-up]').forEach((button) => {
    button.addEventListener('click', () => {
      movePhoto(ctx.files, Number((button as HTMLElement).dataset.movePhotoUp), -1);
      persist();
      render();
    });
  });

  root.querySelectorAll('[data-move-photo-down]').forEach((button) => {
    button.addEventListener('click', () => {
      movePhoto(ctx.files, Number((button as HTMLElement).dataset.movePhotoDown), 1);
      persist();
      render();
    });
  });

  root.querySelectorAll('[data-color-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLElement).dataset.colorPreset;
      const preset = COLOR_PRESETS.find((item) => item.id === id);
      if (!preset) return;
      ctx.state.branding.primaryColor = preset.primaryColor;
      ctx.state.branding.accentColor = preset.accentColor;
      persist();
      render();
    });
  });

  root.querySelector('#primary-color')?.addEventListener('input', (event) => {
    ctx.state.branding.primaryColor = (event.target as HTMLInputElement).value;
    scheduleLivePreview();
  });

  root.querySelector('#accent-color')?.addEventListener('input', (event) => {
    ctx.state.branding.accentColor = (event.target as HTMLInputElement).value;
    scheduleLivePreview();
  });

  root.querySelectorAll('[data-go-step]').forEach((button) => {
    button.addEventListener('click', () => {
      goToStep(Number((button as HTMLElement).dataset.goStep) as BuilderStep);
    });
  });

  root.querySelector('[data-show-preview]')?.addEventListener('click', () => {
    readAllStepsFromDom();
    const result = validateAll(ctx.state, Boolean(ctx.files.logoUrl), ctx.files.photoUrls.length);
    if (!result.valid) {
      ctx.errors = result.errors;
      const firstErrorStep = result.errors.name || result.errors.industry || result.errors.description || result.errors.services
        ? 1
        : result.errors.email || result.errors.phone || result.errors.city
          ? 2
          : Object.keys(result.errors).some((key) => key.startsWith('hours-'))
            ? 3
            : 4;
      ctx.state.currentStep = firstErrorStep as BuilderStep;
      render();
      return;
    }
    ctx.state.view = 'preview';
    ctx.state.previewPage = 'home';
    persist();
    render();
  });

  root.querySelector('[data-edit-data]')?.addEventListener('click', () => {
    ctx.state.currentStep = 1;
    persist();
    render();
  });

  root.querySelector('[data-reset-builder]')?.addEventListener('click', () => {
    if (!window.confirm('Weet u zeker dat u opnieuw wilt beginnen? Alle ingevulde gegevens worden gewist.')) return;
    revokeAllFiles(ctx.files);
    clearState();
    clearPreparedWebsite();
    ctx.state = createDefaultState();
    ctx.files = createEmptyFiles();
    ctx.errors = {};
    ctx.fileWarning = null;
    ctx.preparedWebsite = null;
    ctx.d1PublishResult = null;
    ctx.magicLinkSent = false;
    ctx.usePreparedSite = false;
    render();
  });

  root.querySelector('[data-back-to-builder]')?.addEventListener('click', () => {
    ctx.state.view = 'builder';
    ctx.usePreparedSite = false;
    resetPreviewSeo();
    persist();
    render();
  });

  root.querySelector('[data-back-to-preview]')?.addEventListener('click', () => {
    ctx.state.view = 'preview';
    ctx.errors = {};
    persist();
    render();
  });

  root.querySelector('[data-open-publish]')?.addEventListener('click', () => {
    readAllStepsFromDom();
    const result = validateAll(ctx.state, Boolean(ctx.files.logoUrl), ctx.files.photoUrls.length);
    if (!result.valid) {
      ctx.state.view = 'builder';
      ctx.errors = result.errors;
      ctx.state.currentStep = 1;
      persist();
      render();
      return;
    }
    ctx.state.view = 'publish';
    ctx.errors = {};
    persist();
    render();
  });

  root.querySelector('[data-confirm-publish]')?.addEventListener('click', async () => {
    readAllStepsFromDom();
    const emailInput = root.querySelector('#publish-email-confirm') as HTMLInputElement | null;
    const packageInput = root.querySelector('[name="website-package"]:checked') as HTMLInputElement | null;
    const publishEmail = emailInput?.value ?? '';
    const selectedPackage = (packageInput?.value === 'premium' ? 'premium' : 'free') as 'free' | 'premium';

    const emailResult = validatePublishEmail(publishEmail, ctx.state.contact.email);
    const allResult = validateAll(ctx.state, Boolean(ctx.files.logoUrl), ctx.files.photoUrls.length);

    if (!emailResult.valid || !allResult.valid) {
      ctx.errors = { ...allResult.errors, ...emailResult.errors };
      render();
      root.querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const publishButton = root.querySelector('[data-confirm-publish]') as HTMLButtonElement | null;
    if (publishButton) {
      publishButton.disabled = true;
      publishButton.textContent = 'Publiceren…';
    }

    const localResult = executePublication(ctx.state, ctx.files, {
      package: selectedPackage,
      publishEmail: publishEmail.trim(),
    });
    ctx.preparedWebsite = localResult.prepared;

    let siteArtifacts;
    try {
      siteArtifacts = await prepareSiteArtifactsForPublish(localResult.prepared);
    } catch (error) {
      if (publishButton) {
        publishButton.disabled = false;
        publishButton.textContent = 'Website publiceren';
      }
      ctx.errors = {
        publish: error instanceof Error ? error.message : 'Websitebestanden konden niet worden voorbereid.',
      };
      render();
      root.querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const payload = buildPublishPayload(localResult.prepared, siteArtifacts, {
      package: selectedPackage,
      publishEmail: publishEmail.trim(),
      hasLogo: Boolean(ctx.files.logoUrl),
      photoCount: ctx.files.photoUrls.length,
    });
    const d1Response = await publishWebsiteToD1(payload);

    if (publishButton) {
      publishButton.disabled = false;
      publishButton.textContent = 'Website publiceren';
    }

    if (!d1Response.ok) {
      ctx.errors = d1Response.errors ?? { publish: d1Response.message };
      render();
      root.querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    ctx.d1PublishResult = d1Response.result;
    ctx.magicLinkSent = d1Response.ok ? Boolean(d1Response.magicLinkSent) : false;
    saveDashboardSession({
      tenantId: d1Response.result.tenantId,
      websiteId: d1Response.result.websiteId,
      slug: d1Response.result.slug,
      subdomain: d1Response.result.subdomain,
      publishEmail: publishEmail.trim(),
    });
    ctx.state.publicationStatus = 'published';
    ctx.state.selectedPackage = selectedPackage;
    ctx.state.publishEmailConfirmed = publishEmail.trim();
    ctx.state.publishedAt = d1Response.result.savedAt;
    ctx.state.view = 'publish-success';
    ctx.state.previewPage = 'home';
    ctx.usePreparedSite = true;
    ctx.errors = {};
    persist();
    render();
  });

  root.querySelector('[data-edit-published-data]')?.addEventListener('click', () => {
    ctx.state.view = 'builder';
    ctx.state.currentStep = 1;
    ctx.state.publicationStatus = 'concept';
    ctx.usePreparedSite = false;
    persist();
    render();
  });

  const previewFrame = root.querySelector('.builder-preview-frame');
  if (previewFrame) attachPreviewFrame(previewFrame);
}

function attachPreviewFrame(frame: Element): void {
  bindPreviewInteractions(frame, (page) => {
    ctx.state.previewPage = page;
    persist();
    frame.innerHTML = getPreviewHtml(page);
    if (ctx.usePreparedSite && ctx.preparedWebsite) {
      applyPreparedPreviewSeo(ctx.preparedWebsite, page);
    } else {
      applyPreviewSeo(ctx.state, ctx.files);
    }
    attachPreviewFrame(frame);
  });
}

export function initWebsiteBuilder(): void {
  ctx = {
    state: loadState(),
    files: createEmptyFiles(),
    errors: {},
    fileWarning: null,
    preparedWebsite: getActivePreparedWebsite(),
    d1PublishResult: null,
    magicLinkSent: false,
    usePreparedSite: false,
  };

  const storedUploads = hasStoredUploadMeta(ctx.state);
  if (storedUploads.logo || storedUploads.photos) {
    ctx.fileWarning =
      'Uw eerder gekozen logo of foto’s zijn na het verversen van de pagina niet meer beschikbaar. Upload ze opnieuw in stap 4.';
  }

  if (ctx.state.view === 'preview' || ctx.state.view === 'publish' || ctx.state.view === 'publish-success') {
    ctx.state.view = 'builder';
  }

  render();
}
