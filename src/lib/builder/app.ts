import type { BuilderButtonStyle, BuilderFontFamily, BuilderState, BuilderStep, PreviewPage } from '../../types/builder';
import type { PreparedWebsite } from '../../types/website-config';
import type { SaveWebsiteResult } from '../../types/save';
import type { PublishWebsiteResult } from '../../types/publish';
import {
  buildPublishPayload,
  clearPreparedWebsite,
  executePublication,
  loadPreparedWebsite,
  prepareSiteArtifactsForPublish,
  publishWebsiteToD1,
} from './publish';
import { readableTextColor } from './colors';
import {
  BUILDER_INDUSTRIES,
  COLOR_PRESETS,
  createServiceId,
  filterIndustries,
  WORKDAY_KEYS,
} from './constants';
import {
  addPhotoFile,
  createEmptyFiles,
  movePhoto,
  removeHeroFile,
  removePhoto,
  replacePhotoFile,
  revokeAllFiles,
  setHeroFile,
  setLogoFile,
  setSocialImageFile,
  syncFileMeta,
  type BuilderFiles,
} from './files';
import { renderPublishForm } from './render-publish';
import { renderPublishSuccessD1 } from './render-publish-d1';
import { renderSaveSuccess } from './render-save-success';
import { renderGenerateSuccess } from './render-generate-success';
import {
  autoGenerateWebsite,
  submitGeneratedToAdminQueue,
  type AutoGenerateSummary,
} from './generator/auto-generate.service';
import { buildSavePayload, saveWebsiteToD1 } from './publish/save-client';
import { renderTenantPreview, renderExampleDomainBar } from './render-preview';
import { bindPreviewInteractions, resetPreviewOverlayState } from './preview-interactions';
import {
  renderProgress,
  renderPreviewPageTabs,
  renderStep1,
  renderStep2,
  renderStep3,
  renderStep4,
  renderStep5,
  renderStep6,
  renderStep7,
  renderStep8,
} from './render-builder';
import {
  clearState,
  clearFilesStorage,
  createDefaultState,
  hasStoredUploadMeta,
  loadState,
  saveState,
} from './storage';
import { loadFilesFromStorage, saveFilesToStorage } from './media-storage';
import { IMAGE_STORAGE_QUOTA_ERROR, validateImageUpload } from './upload-validation';
import { applyPreviewSeo, applyPreparedPreviewSeo, futureDomain, generateCopy, renderPremiumBlock, resetPreviewSeo } from './templates';
import { saveDashboardSession, persistSaveResult, loadPersistedSaveResult, clearPersistedSaveResult } from '../dashboard/storage';
import { bindPremiumUpgradeButtons } from '../premium/upgrade';
import { syncSavedToWebsiteList } from '../dashboard/website-list.storage';
import { formatSlugPreviewHtml, getSlugPreview } from './slug';
import {
  firstInvalidStep,
  validateAll,
  validatePublishEmail,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
  validateStep7,
  validateStep8,
} from './validation';

interface AppContext {
  state: BuilderState;
  files: BuilderFiles;
  errors: Record<string, string>;
  fileWarning: string | null;
  preparedWebsite: PreparedWebsite | null;
  d1PublishResult: PublishWebsiteResult | null;
  saveResult: SaveWebsiteResult | null;
  saveMagicLinkSent: boolean;
  generateSummary: AutoGenerateSummary | null;
  magicLinkSent: boolean;
  usePreparedSite: boolean;
  previewViewport: 'desktop' | 'tablet' | 'mobile';
  isGenerating: boolean;
}

let ctx: AppContext;
let previewTimer: ReturnType<typeof setTimeout> | null = null;
let eventsAbort: AbortController | null = null;
let mediaPersistTimer: ReturnType<typeof setTimeout> | null = null;
let wizardRecoveryGuardsReady = false;
let wizardLeaveGuardReady = false;

function removeGeneratingOverlay(): void {
  document.querySelectorAll('.builder-generating-overlay').forEach((element) => element.remove());
}

function resetBodyBlockingStyles(): void {
  document.body.style.overflow = '';
  document.body.style.pointerEvents = '';
  document.documentElement.style.overflow = '';
  document.body.removeAttribute('aria-busy');
  document.documentElement.removeAttribute('aria-busy');
}

function forceMediaUploadCleanup(): void {
  if (typeof ctx !== 'undefined') {
    ctx.isGenerating = false;
  }
  removeGeneratingOverlay();
  resetPreviewOverlayState();
  resetBodyBlockingStyles();
}

function clearBlockingUi(options?: { resetGenerating?: boolean }): void {
  removeGeneratingOverlay();
  resetPreviewOverlayState();
  resetBodyBlockingStyles();
  if (options?.resetGenerating !== false && typeof ctx !== 'undefined') {
    ctx.isGenerating = false;
  }
}

function restoreWizardSession(): void {
  if (mediaPersistTimer) clearTimeout(mediaPersistTimer);
  if (previewTimer) clearTimeout(previewTimer);
  eventsAbort?.abort();

  clearBlockingUi();

  if (typeof ctx !== 'undefined') {
    revokeAllFiles(ctx.files);
  }

  clearState();
  clearFilesStorage();
  clearPreparedWebsite();
  clearPersistedSaveResult();

  ctx = {
    state: createDefaultState(),
    files: createEmptyFiles(),
    errors: {},
    fileWarning: null,
    preparedWebsite: null,
    d1PublishResult: null,
    saveResult: null,
    saveMagicLinkSent: false,
    generateSummary: null,
    magicLinkSent: false,
    usePreparedSite: false,
    previewViewport: 'desktop',
    isGenerating: false,
  };

  render();
}

function getRoot(): HTMLElement {
  const root = document.getElementById('website-builder-root');
  if (!root) throw new Error('Builder root not found');
  return root;
}

function syncCityFromContact(): void {
  if (ctx.state.contact.city.trim()) {
    ctx.state.location.gemeenteNaam = ctx.state.contact.city.trim();
  }
}

function scheduleFilesPersist(): void {
  if (mediaPersistTimer) clearTimeout(mediaPersistTimer);
  mediaPersistTimer = setTimeout(() => {
    void saveFilesToStorage(ctx.files).then((result) => {
      if (result !== 'quota' && result !== 'partial') return;
      ctx.fileWarning =
        result === 'quota'
          ? IMAGE_STORAGE_QUOTA_ERROR
          : 'Sommige afbeeldingen zijn verkleind voor lokale opslag. Tijdens deze sessie blijven uw uploads gewoon zichtbaar.';
      clearBlockingUi();
      if (ctx.state.view === 'builder' && ctx.state.currentStep === 2) {
        queueMicrotask(() => render());
      }
    });
  }, 400);
}

function deferUiRefresh(): void {
  queueMicrotask(() => {
    render();
  });
}

function focusUploadError(errorKey: string): void {
  queueMicrotask(() => {
    if (!ctx.errors[errorKey]) return;
    const errorEl = document.getElementById(`error-${errorKey}`);
    errorEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function handleSingleFileUpload(
  event: Event,
  options: {
    errorKey: string;
    apply: (file: File) => string | null;
  },
): void {
  event.stopPropagation();
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  try {
    if (!file) return;

    const validationError = validateImageUpload(file);
    if (validationError) {
      ctx.errors[options.errorKey] = validationError;
      return;
    }

    const error = options.apply(file);
    if (error) {
      ctx.errors[options.errorKey] = error;
    } else {
      ctx.errors[options.errorKey] = '';
      persist();
    }
  } catch {
    ctx.errors[options.errorKey] = 'Upload mislukt. Probeer het opnieuw.';
  } finally {
    input.value = '';
    forceMediaUploadCleanup();
    deferUiRefresh();
    focusUploadError(options.errorKey);
    queueMicrotask(() => forceMediaUploadCleanup());
  }
}

function handleGalleryUpload(event: Event): void {
  event.stopPropagation();
  const input = event.target as HTMLInputElement;
  const selected = [...(input.files ?? [])];

  try {
    if (selected.length === 0) return;

    let error: string | null = null;
    for (const file of selected) {
      const validationError = validateImageUpload(file);
      if (validationError) {
        error = validationError;
        break;
      }
      error = addPhotoFile(ctx.files, file);
      if (error) break;
    }

    if (error) {
      ctx.errors.photos = error;
    } else {
      ctx.errors.photos = '';
      persist();
    }
  } catch {
    ctx.errors.photos = 'Upload mislukt. Probeer het opnieuw.';
  } finally {
    input.value = '';
    forceMediaUploadCleanup();
    deferUiRefresh();
    focusUploadError('photos');
    queueMicrotask(() => forceMediaUploadCleanup());
  }
}

function persist(): void {
  syncCityFromContact();
  const meta = syncFileMeta(ctx.files);
  ctx.state.branding.logoName = meta.logoName;
  ctx.state.branding.heroImageName = meta.heroName;
  ctx.state.branding.photoNames = meta.photoNames;
  ctx.state.branding.socialImageName = meta.socialImageName;
  ctx.state.branding.textColor = readableTextColor(ctx.state.branding.primaryColor);
  saveState(ctx.state);
  scheduleFilesPersist();
}

function readStep1FromDom(): void {
  const root = getRoot();
  ctx.state.business.name = (root.querySelector('#business-name') as HTMLInputElement)?.value ?? '';
  ctx.state.business.industry = (root.querySelector('#business-industry') as HTMLInputElement)?.value ?? '';
  const get = (selector: string) => (root.querySelector(selector) as HTMLInputElement)?.value ?? '';
  ctx.state.contact.phone = get('#contact-phone');
  ctx.state.contact.email = get('#contact-email');
  ctx.state.contact.website = get('#contact-website');
  ctx.state.contact.street = get('#contact-street');
  ctx.state.contact.postcode = get('#contact-postcode');
  ctx.state.contact.city = get('#contact-city');
}

function readStep2FromDom(): void {
  const root = getRoot();
  const primary = (root.querySelector('#primary-color') as HTMLInputElement)?.value;
  const accent = (root.querySelector('#accent-color') as HTMLInputElement)?.value;
  const fontInput = root.querySelector('[name="font-family"]:checked') as HTMLInputElement | null;
  const buttonInput = root.querySelector('[name="button-style"]:checked') as HTMLInputElement | null;
  if (primary) ctx.state.branding.primaryColor = primary;
  if (accent) ctx.state.branding.accentColor = accent;
  if (fontInput?.value) {
    ctx.state.design.fontFamily = fontInput.value as BuilderFontFamily;
  }
  if (buttonInput?.value) {
    ctx.state.design.buttonStyle = buttonInput.value as BuilderButtonStyle;
  }
}

function readStep3FromDom(): void {
  const root = getRoot();
  const pages: PreviewPage[] = ['home', 'about', 'services', 'contact', 'privacy'];
  pages.forEach((page) => {
    const input = root.querySelector(`[data-page-toggle="${page}"]`) as HTMLInputElement | null;
    if (input && page !== 'home') {
      ctx.state.enabledPages[page] = input.checked;
    }
  });
  ctx.state.enabledPages.home = true;
}

function readStep4FromDom(): void {
  const root = getRoot();
  ctx.state.business.services = [...root.querySelectorAll('.builder-service')].map((element, index) => ({
    id: ctx.state.business.services[index]?.id ?? createServiceId(),
    title: (element.querySelector(`[name="service-title-${index}"]`) as HTMLInputElement)?.value ?? '',
    description:
      (element.querySelector(`[name="service-description-${index}"]`) as HTMLTextAreaElement)?.value ?? '',
  }));
}

function readStep5FromDom(): void {
  const root = getRoot();
  ctx.state.hours = ctx.state.hours.map((day, index) => {
    const closed = (root.querySelector(`[data-hours-closed="${index}"]`) as HTMLInputElement)?.checked ?? day.closed;
    const open24 = (root.querySelector(`[data-hours-open24="${index}"]`) as HTMLInputElement)?.checked ?? day.open24;
    const openTime = (root.querySelector(`[data-hours-open="${index}"]`) as HTMLInputElement)?.value ?? day.openTime;
    const closeTime = (root.querySelector(`[data-hours-close="${index}"]`) as HTMLInputElement)?.value ?? day.closeTime;
    return { ...day, closed, open24, openTime, closeTime };
  });
}

function readStep6FromDom(): void {
  const root = getRoot();
  ctx.state.heroTitle = (root.querySelector('#seo-title') as HTMLInputElement)?.value ?? '';
  ctx.state.seoMetaDescription = (root.querySelector('#seo-meta-description') as HTMLTextAreaElement)?.value ?? '';
  ctx.state.business.description = (root.querySelector('#business-description') as HTMLTextAreaElement)?.value ?? '';
}

function readAllStepsFromDom(): void {
  const root = getRoot();
  if (root.querySelector('#business-name')) readStep1FromDom();
  if (root.querySelector('#primary-color')) readStep2FromDom();
  if (root.querySelector('[data-page-toggle]')) readStep3FromDom();
  if (root.querySelector('.builder-service')) readStep4FromDom();
  if (root.querySelector('[data-hours-closed]')) readStep5FromDom();
  if (root.querySelector('#seo-title')) readStep6FromDom();
}

function refreshLivePreviewPanel(): void {
  forceMediaUploadCleanup();
  const root = getRoot();
  const frame = root.querySelector('#builder-live-preview-frame');
  if (!frame) return;

  const domainValue = root.querySelector('.builder-live-panel .builder-example-domain__value');
  if (domainValue) {
    const domain =
      ctx.usePreparedSite && ctx.preparedWebsite
        ? ctx.preparedWebsite.config.slug.domain
        : futureDomain(ctx.state);
    domainValue.textContent = domain;
  }

  frame.innerHTML = getPreviewHtml(ctx.state.previewPage);
  attachPreviewFrame(frame);
  if (ctx.usePreparedSite && ctx.preparedWebsite) {
    applyPreparedPreviewSeo(ctx.preparedWebsite, ctx.state.previewPage);
  } else {
    applyPreviewSeo(ctx.state, ctx.files);
  }
  forceMediaUploadCleanup();
}

function updateSeoCharCounts(): void {
  if (ctx.state.currentStep !== 6) return;
  const root = getRoot();
  const titleInput = root.querySelector('#seo-title') as HTMLInputElement | null;
  const metaInput = root.querySelector('#seo-meta-description') as HTMLTextAreaElement | null;
  const titleHint = root.querySelector('#seo-title-hint');
  const metaHint = root.querySelector('#seo-meta-hint');
  if (titleInput && titleHint) {
    const len = titleInput.value.length;
    titleHint.textContent = `${len}/70 tekens`;
    titleHint.classList.toggle('is-over', len > 70);
  }
  if (metaInput && metaHint) {
    const len = metaInput.value.length;
    metaHint.textContent = `${len}/160 tekens`;
    metaHint.classList.toggle('is-over', len > 160);
  }
}

function syncHoursRowUi(index: number): void {
  const root = getRoot();
  const row = root.querySelector(`[data-hours-index="${index}"]`);
  const day = ctx.state.hours[index];
  if (!row || !day) return;

  const closedInput = row.querySelector(`[data-hours-closed="${index}"]`) as HTMLInputElement | null;
  const open24Input = row.querySelector(`[data-hours-open24="${index}"]`) as HTMLInputElement | null;
  const openInput = row.querySelector(`[data-hours-open="${index}"]`) as HTMLInputElement | null;
  const closeInput = row.querySelector(`[data-hours-close="${index}"]`) as HTMLInputElement | null;
  const disabled = day.closed || day.open24;

  if (closedInput) closedInput.checked = day.closed;
  if (open24Input) {
    open24Input.disabled = day.closed;
    open24Input.checked = day.open24;
  }
  if (openInput) openInput.disabled = disabled;
  if (closeInput) closeInput.disabled = disabled;
}

function scheduleLivePreview(): void {
  readAllStepsFromDom();
  ctx.state.branding.textColor = readableTextColor(ctx.state.branding.primaryColor);
  persist();
  updateSeoCharCounts();
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

function bindSearchPicker(options: {
  root: HTMLElement;
  searchId: string;
  hiddenId: string;
  listId: string;
  getOptions: (query: string) => string[];
  onSelect: (value: string) => void;
  formatOption?: (value: string) => string;
  signal: AbortSignal;
}): void {
  const search = options.root.querySelector(`#${options.searchId}`) as HTMLInputElement | null;
  const hidden = options.root.querySelector(`#${options.hiddenId}`) as HTMLInputElement | null;
  const list = options.root.querySelector(`#${options.listId}`) as HTMLUListElement | null;
  if (!search || !hidden || !list) return;

  const renderOptions = (query: string) => {
    const values = options.getOptions(query).slice(0, 14);
    list.innerHTML = values
      .map(
        (value) =>
          `<li role="option" tabindex="0" data-value="${value.replace(/"/g, '&quot;')}">${options.formatOption?.(value) ?? value}</li>`,
      )
      .join('');
    list.hidden = values.length === 0;
    search.setAttribute('aria-expanded', values.length > 0 ? 'true' : 'false');
  };

  const selectValue = (value: string) => {
    options.onSelect(value);
    list.hidden = true;
    search.setAttribute('aria-expanded', 'false');
    scheduleLivePreview();
  };

  search.addEventListener('input', () => {
    renderOptions(search.value);
    scheduleLivePreview();
  });
  search.addEventListener('focus', () => renderOptions(search.value));
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = search.value.trim();
      const exact = options.getOptions('').find((value) => value.toLowerCase() === query.toLowerCase());
      if (exact) {
        selectValue(exact);
        return;
      }
      const visible = [...list.querySelectorAll('[data-value]')] as HTMLElement[];
      if (visible.length === 1 && visible[0]?.dataset.value) {
        selectValue(visible[0].dataset.value);
      }
    }
  }, { signal: options.signal });

  list.addEventListener('click', (event) => {
    const item = (event.target as HTMLElement).closest('[data-value]') as HTMLElement | null;
    if (item?.dataset.value) selectValue(item.dataset.value);
  });

  document.addEventListener('click', (event) => {
    if (!options.root.contains(event.target as Node)) list.hidden = true;
  }, { signal: options.signal });
}

function bindIndustryPicker(root: HTMLElement, signal: AbortSignal): void {
  bindSearchPicker({
    root,
    searchId: 'industry-search',
    hiddenId: 'business-industry',
    listId: 'industry-options',
    signal,
    getOptions: (query) => filterIndustries(query),
    onSelect: (value) => {
      const search = root.querySelector('#industry-search') as HTMLInputElement;
      const hidden = root.querySelector('#business-industry') as HTMLInputElement;
      hidden.value = value;
      search.value = value;
    },
  });

  const search = root.querySelector('#industry-search') as HTMLInputElement | null;
  search?.addEventListener('input', () => {
    const hidden = root.querySelector('#business-industry') as HTMLInputElement | null;
    const exact = BUILDER_INDUSTRIES.find(
      (industry) => industry.toLowerCase() === search.value.trim().toLowerCase(),
    );
    if (hidden) hidden.value = exact ?? '';
  }, { signal });
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
    case 5:
      readStep5FromDom();
      break;
    case 6:
      readStep6FromDom();
      break;
    default:
      break;
  }
}

function validateCurrentStep(): boolean {
  readCurrentStepFromDom();
  const hasLogo = Boolean(ctx.files.logoUrl);
  let result;

  switch (ctx.state.currentStep) {
    case 1:
      result = validateStep1(ctx.state);
      break;
    case 2:
      result = validateStep2(ctx.state, hasLogo);
      break;
    case 3:
      result = validateStep3(ctx.state);
      break;
    case 4:
      result = validateStep4(ctx.state);
      break;
    case 5:
      result = validateStep5(ctx.state);
      break;
    case 6:
      result = validateStep6(ctx.state);
      break;
    case 7:
      result = validateStep7(ctx.state);
      break;
    case 8:
      result = validateStep8(ctx.state);
      break;
    default:
      result = { valid: true, errors: {} };
  }

  ctx.errors = result.errors;
  return result.valid;
}

function renderBuilderShell(): string {
  const isPreviewStep = ctx.state.currentStep === 7;
  const stepContent = (() => {
    switch (ctx.state.currentStep) {
      case 1:
        return renderStep1(ctx.state, ctx.errors);
      case 2:
        return renderStep2(ctx.state, ctx.files, ctx.errors, ctx.fileWarning);
      case 3:
        return renderStep3(ctx.state, ctx.errors);
      case 4:
        return renderStep4(ctx.state, ctx.errors);
      case 5:
        return renderStep5(ctx.state);
      case 6:
        return renderStep6(ctx.state, ctx.files, ctx.errors);
      case 7:
        return renderStep7(ctx.state, ctx.errors, ctx.generateSummary);
      case 8:
        return renderStep8(ctx.state, ctx.files, ctx.errors);
      default:
        return '';
    }
  })();

  const showNav = ctx.state.currentStep < 8;
  const nextLabel =
    ctx.state.currentStep === 6 ? 'Naar voorbeeld' : ctx.state.currentStep === 7 ? 'Naar afronden' : 'Volgende';

  return `
    <div class="builder-workspace ${isPreviewStep ? 'builder-workspace--preview-step' : ''}">
      <div class="builder-workspace__form ${isPreviewStep ? 'builder-workspace__form--compact' : ''}">
        <div class="builder-shell">
          <header class="builder-header">
            <p class="eyebrow">Website Builder</p>
            <h1>Maak uw gratis website</h1>
            <p class="builder-subtitle">Doorloop de stappen en zie direct een live preview van uw website.</p>
            ${renderProgress(ctx.state.currentStep)}
          </header>

          <div class="builder-body">
            ${stepContent}
          </div>

          ${
            showNav
              ? `
            <footer class="builder-footer">
              <button type="button" class="btn btn-secondary" data-builder-back ${ctx.state.currentStep === 1 ? 'disabled' : ''}>Vorige</button>
              <button type="button" class="btn btn-primary" data-builder-next>${nextLabel}</button>
            </footer>
          `
              : ''
          }

          ${
            ctx.state.currentStep === 8
              ? `
            <footer class="builder-footer">
              <button type="button" class="btn btn-secondary" data-builder-back>Vorige</button>
            </footer>
          `
              : ''
          }

          <div class="builder-toolbar">
            <button type="button" class="builder-text-btn" data-restore-wizard>Wizard herstellen</button>
            <button type="button" class="builder-text-btn" data-reset-builder>Opnieuw beginnen</button>
          </div>
        </div>
      </div>

      <aside class="builder-live-panel" aria-label="Live website preview">
        ${renderExampleDomainBar(futureDomain(ctx.state))}
        <div class="builder-live-panel__head">
          <strong>Live preview</strong>
          <div class="builder-viewport-switch" role="group" aria-label="Apparaatweergave">
            <button type="button" class="builder-viewport-btn ${ctx.previewViewport === 'desktop' ? 'is-active' : ''}" data-builder-viewport="desktop">Desktop</button>
            <button type="button" class="builder-viewport-btn ${ctx.previewViewport === 'tablet' ? 'is-active' : ''}" data-builder-viewport="tablet">Tablet</button>
            <button type="button" class="builder-viewport-btn ${ctx.previewViewport === 'mobile' ? 'is-active' : ''}" data-builder-viewport="mobile">Mobiel</button>
          </div>
        </div>
        ${renderPreviewPageTabs(ctx.state.previewPage, ctx.state.enabledPages)}
        <div class="builder-live-preview__canvas builder-live-preview__canvas--${ctx.previewViewport}">
          <div id="builder-live-preview-frame" class="builder-live-preview__frame"></div>
        </div>
      </aside>
    </div>

    ${renderPremiumBlock(ctx.state)}
  `;
}

function getPreviewHtml(page: import('../../types/builder').PreviewPage): string {
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
  try {
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
    } else if (view === 'save-success' && ctx.saveResult) {
      root.innerHTML = renderSaveSuccess(ctx.saveResult, ctx.saveMagicLinkSent);
    } else if (view === 'generate-success' && ctx.generateSummary) {
      root.innerHTML = renderGenerateSuccess(ctx.generateSummary);
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
  } catch (error) {
    ctx.isGenerating = false;
    ctx.errors = {
      bootstrap:
        error instanceof Error
          ? error.message
          : 'De wizard kon niet worden geladen. Gebruik Wizard herstellen.',
    };

    try {
      const root = getRoot();
      root.innerHTML = `
        <div class="builder-bootstrap-error">
          <p class="builder-error" role="alert">
            <span class="builder-error__icon" aria-hidden="true">!</span>
            <span class="builder-error__text">${ctx.errors.bootstrap}</span>
          </p>
          <button type="button" class="btn btn-primary" data-restore-wizard>Wizard herstellen</button>
        </div>
      `;
      root.querySelector('[data-restore-wizard]')?.addEventListener('click', () => restoreWizardSession());
    } catch {
      clearBlockingUi();
    }
  } finally {
    if (ctx?.isGenerating) {
      syncGeneratingOverlay();
    } else {
      forceMediaUploadCleanup();
    }
  }
}

function renderGeneratingOverlayHtml(): string {
  return `
    <div class="builder-generating-overlay" role="dialog" aria-modal="true" aria-labelledby="builder-generating-title" aria-busy="true">
      <div class="builder-generating-overlay__card">
        <div class="builder-generating-spinner" aria-hidden="true"></div>
        <h2 id="builder-generating-title" class="builder-generating-overlay__title">Website genereren…</h2>
        <p class="builder-generating-overlay__text">Even geduld — uw pagina's worden samengesteld.</p>
        <button type="button" class="btn btn-secondary builder-generating-overlay__restore" data-restore-wizard>Wizard herstellen</button>
      </div>
    </div>
  `;
}

function syncGeneratingOverlay(): void {
  if (!ctx?.isGenerating) {
    forceMediaUploadCleanup();
    return;
  }

  resetPreviewOverlayState();
  removeGeneratingOverlay();
  resetBodyBlockingStyles();
  document.body.insertAdjacentHTML('beforeend', renderGeneratingOverlayHtml());
}

function hasUnsavedWizardProgress(): boolean {
  if (ctx.state.view === 'save-success' || ctx.state.view === 'generate-success') return false;
  if (ctx.saveResult || ctx.generateSummary) return false;
  if (ctx.state.view !== 'builder') return false;

  const { state, files } = ctx;
  if (state.currentStep > 1) return true;
  if (state.business.name.trim()) return true;
  if (state.business.industry.trim()) return true;
  if (state.contact.phone.replace(/\D/g, '').length >= 9) return true;
  if (state.contact.email.trim()) return true;
  if (state.contact.street.trim()) return true;
  if (state.contact.city.trim()) return true;
  if (files.logoUrl || files.heroUrl || files.photoUrls.length > 0) return true;

  return false;
}

function confirmLeaveWizard(): boolean {
  return window.confirm(
    'Uw gegevens zijn nog niet opgeslagen. Weet u zeker dat u de wizard wilt verlaten?',
  );
}

function setupWizardLeaveGuard(): void {
  if (wizardLeaveGuardReady) return;
  wizardLeaveGuardReady = true;

  window.addEventListener('beforeunload', (event) => {
    if (!hasUnsavedWizardProgress()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  document.querySelector('.builder-page-back')?.addEventListener('click', (event) => {
    if (!hasUnsavedWizardProgress()) return;
    if (!confirmLeaveWizard()) {
      event.preventDefault();
    }
  });

  document.querySelector('.builder-page-brand')?.addEventListener('click', (event) => {
    if (!hasUnsavedWizardProgress()) return;
    if (!confirmLeaveWizard()) {
      event.preventDefault();
    }
  });
}

function setupWizardRecoveryGuards(): void {
  if (wizardRecoveryGuardsReady) return;
  wizardRecoveryGuardsReady = true;

  window.addEventListener('pageshow', (event) => {
    if (typeof ctx !== 'undefined') {
      ctx.isGenerating = false;
    }
    clearBlockingUi();
    if (event.persisted && typeof ctx !== 'undefined') {
      render();
    }
  });

  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest('[data-restore-wizard]');
    if (!target) return;
    event.preventDefault();
    restoreWizardSession();
  });
}

function goToStep(step: BuilderStep): void {
  readAllStepsFromDom();
  ctx.state.currentStep = step;
  ctx.errors = {};
  persist();
  render();
}

async function handleGenerateWebsite(): Promise<void> {
  readAllStepsFromDom();
  ctx.isGenerating = true;
  ctx.errors = {};
  render();

  await new Promise((resolve) => setTimeout(resolve, 850));

  const root = getRoot();

  try {
    const result = autoGenerateWebsite(ctx.state, ctx.files);
    if (!result.ok) {
      ctx.isGenerating = false;
      ctx.errors = {
        ...result.errors,
        generate: 'Niet alle verplichte velden zijn ingevuld. Controleer de gemarkeerde velden en probeer opnieuw.',
      };
      if (result.errors.name || result.errors.industry) ctx.state.currentStep = 1;
      else if (result.errors.services) ctx.state.currentStep = 4;
      else if (result.errors.businessDescription) ctx.state.currentStep = 6;
      else if (result.errors.logo) ctx.state.currentStep = 2;
      else if (result.errors.phone || result.errors.email || result.errors.city) ctx.state.currentStep = 1;
      persist();
      render();
      root.querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    await submitGeneratedToAdminQueue(ctx.state, ctx.files, result.generated);

    ctx.preparedWebsite = result.generated;
    ctx.usePreparedSite = true;
    ctx.generateSummary = result.summary;
    ctx.state.publicationStatus = 'concept';
    ctx.state.previewPage = 'home';
    ctx.state.currentStep = 7;
    ctx.state.view = 'generate-success';
    ctx.errors = {};
    persist();
    ctx.isGenerating = false;
    render();
    refreshLivePreviewPanel();
    if (ctx.preparedWebsite) {
      applyPreparedPreviewSeo(ctx.preparedWebsite, ctx.state.previewPage);
    }
  } catch (error) {
    ctx.isGenerating = false;
    const message = error instanceof Error ? error.message : 'Er ging iets mis bij het genereren. Probeer het opnieuw.';
    ctx.errors = { generate: message };
    render();
    root.querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    ctx.isGenerating = false;
    syncGeneratingOverlay();
  }
}

function bindEvents(): void {
  eventsAbort?.abort();
  eventsAbort = new AbortController();
  const { signal } = eventsAbort;

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
    if (ctx.state.currentStep < 8) {
      const nextStep = (ctx.state.currentStep + 1) as BuilderStep;
      if (nextStep === 6 && !ctx.state.heroTitle.trim()) {
        const copy = generateCopy(ctx.state);
        ctx.state.heroTitle = copy.seoTitle;
        ctx.state.seoMetaDescription = copy.seoDescription;
      }
      ctx.state.currentStep = nextStep;
      ctx.errors = {};
      render();
    }
  });

  root.querySelector('[data-add-service]')?.addEventListener('click', () => {
    readStep4FromDom();
    ctx.state.business.services.push({ id: createServiceId(), title: '', description: '' });
    persist();
    render();
  });

  root.querySelectorAll('[data-remove-service]').forEach((button) => {
    button.addEventListener('click', () => {
      readStep4FromDom();
      const index = Number((button as HTMLElement).dataset.removeService);
      ctx.state.business.services.splice(index, 1);
      persist();
      render();
    });
  });

  root.querySelectorAll('[data-move-service-up]').forEach((button) => {
    button.addEventListener('click', () => {
      readStep4FromDom();
      const index = Number((button as HTMLElement).dataset.moveServiceUp);
      if (index <= 0) return;
      const services = ctx.state.business.services;
      [services[index - 1], services[index]] = [services[index], services[index - 1]];
      persist();
      render();
      scheduleLivePreview();
    });
  });

  root.querySelectorAll('[data-move-service-down]').forEach((button) => {
    button.addEventListener('click', () => {
      readStep4FromDom();
      const index = Number((button as HTMLElement).dataset.moveServiceDown);
      const services = ctx.state.business.services;
      if (index >= services.length - 1) return;
      [services[index], services[index + 1]] = [services[index + 1], services[index]];
      persist();
      render();
      scheduleLivePreview();
    });
  });

  root.querySelector('[data-copy-workday-hours]')?.addEventListener('click', () => {
    readStep5FromDom();
    const monday = ctx.state.hours.find((day) => day.dayKey === 'monday');
    if (!monday) return;
    ctx.state.hours = ctx.state.hours.map((day) => {
      if (!WORKDAY_KEYS.includes(day.dayKey)) return day;
      return {
        ...day,
        closed: monday.closed,
        open24: monday.open24,
        openTime: monday.openTime,
        closeTime: monday.closeTime,
      };
    });
    persist();
    render();
    scheduleLivePreview();
  });

  root.querySelectorAll('[data-hours-closed]').forEach((input) => {
    input.addEventListener('change', () => {
      readStep5FromDom();
      const index = Number((input as HTMLElement).dataset.hoursClosed);
      const day = ctx.state.hours[index];
      if (day?.closed) day.open24 = false;
      persist();
      syncHoursRowUi(index);
      scheduleLivePreview();
    }, { signal });
  });

  root.querySelectorAll('[data-hours-open24]').forEach((input) => {
    input.addEventListener('change', () => {
      readStep5FromDom();
      const index = Number((input as HTMLElement).dataset.hoursOpen24);
      const day = ctx.state.hours[index];
      if (day?.open24) day.closed = false;
      persist();
      syncHoursRowUi(index);
      scheduleLivePreview();
    }, { signal });
  });

  root.querySelectorAll('[data-hours-open], [data-hours-close]').forEach((input) => {
    input.addEventListener('change', scheduleLivePreview, { signal });
  });

  root.querySelectorAll('[data-page-toggle]').forEach((input) => {
    input.addEventListener('change', () => {
      readStep3FromDom();
      persist();
      render();
      scheduleLivePreview();
    });
  });

  root.querySelectorAll('[data-preview-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const page = (button as HTMLElement).dataset.previewTab as PreviewPage;
      ctx.state.previewPage = page;
      persist();
      refreshLivePreviewPanel();
      root.querySelectorAll('[data-preview-tab]').forEach((tab) => {
        const el = tab as HTMLElement;
        const isActive = el.dataset.previewTab === page;
        el.classList.toggle('is-active', isActive);
        el.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    });
  });

  root.querySelectorAll('[data-builder-viewport]').forEach((button) => {
    button.addEventListener('click', () => {
      const viewport = (button as HTMLElement).dataset.builderViewport as 'desktop' | 'tablet' | 'mobile';
      ctx.previewViewport = viewport;
      root.querySelectorAll('[data-builder-viewport]').forEach((btn) => {
        btn.classList.toggle('is-active', (btn as HTMLElement).dataset.builderViewport === viewport);
      });
      const canvas = root.querySelector('.builder-live-preview__canvas');
      canvas?.classList.remove('builder-live-preview__canvas--desktop', 'builder-live-preview__canvas--tablet', 'builder-live-preview__canvas--mobile');
      canvas?.classList.add(`builder-live-preview__canvas--${viewport}`);
    });
  });

  root.querySelector('#business-name')?.addEventListener('input', updateSlugPreview);

  bindIndustryPicker(root, signal);

  root.querySelector('.builder-body')?.addEventListener('input', scheduleLivePreview, { signal });
  root.querySelector('.builder-body')?.addEventListener('change', (event) => {
    if ((event.target as HTMLElement).matches('input[type="file"]')) return;
    scheduleLivePreview();
  }, { signal });

  root.querySelector('#builder-logo')?.addEventListener('change', (event) => {
    handleSingleFileUpload(event, {
      errorKey: 'logo',
      apply: (file) => setLogoFile(ctx.files, file),
    });
  }, { signal });

  root.querySelector('#builder-hero')?.addEventListener('change', (event) => {
    handleSingleFileUpload(event, {
      errorKey: 'hero',
      apply: (file) => setHeroFile(ctx.files, file),
    });
  }, { signal });

  root.querySelector('#builder-hero-replace')?.addEventListener('change', (event) => {
    handleSingleFileUpload(event, {
      errorKey: 'hero',
      apply: (file) => setHeroFile(ctx.files, file),
    });
  }, { signal });

  root.querySelector('[data-remove-hero]')?.addEventListener('click', () => {
    removeHeroFile(ctx.files);
    persist();
    forceMediaUploadCleanup();
    deferUiRefresh();
    queueMicrotask(() => forceMediaUploadCleanup());
  }, { signal });

  root.querySelector('#builder-photos-add')?.addEventListener('change', handleGalleryUpload, { signal });

  root.querySelectorAll('[data-remove-photo]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number((button as HTMLElement).dataset.removePhoto);
      removePhoto(ctx.files, index);
      persist();
      forceMediaUploadCleanup();
      deferUiRefresh();
      queueMicrotask(() => forceMediaUploadCleanup());
    }, { signal });
  });

  root.querySelectorAll('[data-replace-photo]').forEach((input) => {
    input.addEventListener('change', (event) => {
      handleSingleFileUpload(event, {
        errorKey: 'photos',
        apply: (file) => {
          const index = Number((event.target as HTMLElement).dataset.replacePhoto);
          return replacePhotoFile(ctx.files, index, file);
        },
      });
    }, { signal });
  });

  root.querySelector('#builder-social-image')?.addEventListener('change', (event) => {
    handleSingleFileUpload(event, {
      errorKey: 'socialImage',
      apply: (file) => setSocialImageFile(ctx.files, file),
    });
  }, { signal });

  root.querySelectorAll('[data-color-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = (button as HTMLElement).dataset.colorPreset;
      const preset = COLOR_PRESETS.find((item) => item.id === id);
      if (!preset) return;
      ctx.state.branding.primaryColor = preset.primaryColor;
      ctx.state.branding.accentColor = preset.accentColor;
      persist();
      render();
      scheduleLivePreview();
    });
  });

  root.querySelectorAll('[name="font-family"]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const value = (event.target as HTMLInputElement).value as BuilderFontFamily;
      if (value) {
        ctx.state.design.fontFamily = value;
        scheduleLivePreview();
      }
    });
  });

  root.querySelectorAll('[name="button-style"]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const value = (event.target as HTMLInputElement).value as BuilderButtonStyle;
      if (value) {
        ctx.state.design.buttonStyle = value;
        scheduleLivePreview();
      }
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

  root.querySelector('[data-edit-data]')?.addEventListener('click', () => {
    ctx.state.currentStep = 1;
    persist();
    render();
  });

  root.querySelector('[data-reset-builder]')?.addEventListener('click', () => {
    if (!window.confirm('Weet u zeker dat u opnieuw wilt beginnen? Alle ingevulde gegevens worden gewist.')) return;
    revokeAllFiles(ctx.files);
    clearState();
    clearFilesStorage();
    clearPreparedWebsite();
    ctx.state = createDefaultState();
    ctx.files = createEmptyFiles();
    ctx.errors = {};
    ctx.fileWarning = null;
    ctx.preparedWebsite = null;
    ctx.d1PublishResult = null;
    ctx.generateSummary = null;
    ctx.magicLinkSent = false;
    ctx.usePreparedSite = false;
    render();
  });

  root.querySelectorAll('[data-generate-website]').forEach((button) => {
    button.addEventListener('click', () => {
      handleGenerateWebsite();
    });
  });

  root.querySelector('[data-open-generated-preview]')?.addEventListener('click', () => {
    ctx.state.view = 'builder';
    ctx.state.currentStep = 7;
    ctx.errors = {};
    persist();
    render();
    refreshLivePreviewPanel();
    if (ctx.usePreparedSite && ctx.preparedWebsite) {
      applyPreparedPreviewSeo(ctx.preparedWebsite, ctx.state.previewPage);
    }
  });

  root.querySelector('[data-edit-generated-website]')?.addEventListener('click', () => {
    ctx.state.view = 'builder';
    ctx.state.currentStep = 1;
    ctx.errors = {};
    persist();
    render();
  });

  root.querySelector('[data-save-website]')?.addEventListener('click', async () => {
    readAllStepsFromDom();
    const allValid = validateAll(ctx.state, Boolean(ctx.files.logoUrl));
    if (!allValid.valid) {
      ctx.errors = allValid.errors;
      ctx.state.currentStep = firstInvalidStep(ctx.state, Boolean(ctx.files.logoUrl)) as BuilderStep;
      persist();
      render();
      getRoot().querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const saveButton = root.querySelector('[data-save-website]') as HTMLButtonElement | null;
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Opslaan…';
    }

    try {
      const { payload, errors: mediaErrors } = await buildSavePayload(ctx.state, ctx.files);
      if (Object.keys(mediaErrors).length > 0) {
        ctx.errors = { ...ctx.errors, ...mediaErrors };
        render();
        return;
      }

      const response = await saveWebsiteToD1(payload);
      if (!response.ok) {
        ctx.errors = response.fieldErrors ?? { save: response.message };
        if (response.fieldErrors?.name) {
          ctx.state.currentStep = 1;
        }
        render();
        getRoot().querySelector('.builder-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      ctx.saveResult = response.result;
      ctx.saveMagicLinkSent = Boolean(response.magicLinkSent);
      persistSaveResult({ result: response.result, magicLinkSent: ctx.saveMagicLinkSent });
      saveDashboardSession({
        tenantId: response.result.tenantId,
        websiteId: response.result.websiteId,
        slug: response.result.slug,
        subdomain: `${response.result.slug}.starlocal.nl`,
        publishEmail: ctx.state.contact.email.trim(),
      });
      syncSavedToWebsiteList(response.result, ctx.state);
      ctx.state.view = 'save-success';
      ctx.errors = {};
      persist();
      render();
    } finally {
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = 'Opslaan als concept';
      }
    }
  });

  root.querySelector('[data-back-to-builder]')?.addEventListener('click', () => {
    ctx.state.view = 'builder';
    ctx.usePreparedSite = Boolean(ctx.preparedWebsite);
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
    const result = validateAll(ctx.state, Boolean(ctx.files.logoUrl));
    if (!result.valid) {
      ctx.state.view = 'builder';
      ctx.errors = result.errors;
      ctx.state.currentStep = firstInvalidStep(ctx.state, Boolean(ctx.files.logoUrl)) as BuilderStep;
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
    const allResult = validateAll(ctx.state, Boolean(ctx.files.logoUrl));

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

  bindPremiumUpgradeButtons(root);
}

function attachPreviewFrame(frame: Element): void {
  bindPreviewInteractions(frame, (page) => {
    if (!ctx.state.enabledPages[page]) return;
    ctx.state.previewPage = page;
    persist();
    frame.innerHTML = getPreviewHtml(page);
    const root = getRoot();
    root.querySelectorAll('[data-preview-tab]').forEach((tab) => {
      const el = tab as HTMLElement;
      const isActive = el.dataset.previewTab === page;
      el.classList.toggle('is-active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (ctx.usePreparedSite && ctx.preparedWebsite) {
      applyPreparedPreviewSeo(ctx.preparedWebsite, page);
    } else {
      applyPreviewSeo(ctx.state, ctx.files);
    }
    attachPreviewFrame(frame);
  });
}

export function initWebsiteBuilder(): void {
  clearBlockingUi({ resetGenerating: false });

  try {
    const storedFiles = loadFilesFromStorage();

    ctx = {
      state: loadState(),
      files: storedFiles ?? createEmptyFiles(),
      errors: {},
      fileWarning: null,
      preparedWebsite: loadPreparedWebsite(storedFiles),
      d1PublishResult: null,
      saveResult: null,
      saveMagicLinkSent: false,
      generateSummary: null,
      magicLinkSent: false,
      usePreparedSite: Boolean(loadPreparedWebsite(storedFiles)),
      previewViewport: 'desktop',
      isGenerating: false,
    };

    const storedUploads = hasStoredUploadMeta(ctx.state);
    const hasRestoredMedia = Boolean(
      storedFiles?.logoUrl || storedFiles?.heroUrl || (storedFiles?.photoUrls.length ?? 0) > 0,
    );
    if (!hasRestoredMedia && (storedUploads.logo || storedUploads.hero || storedUploads.photos)) {
      ctx.fileWarning =
        'Eerder gekozen afbeeldingen zijn na het verversen van de pagina niet meer beschikbaar. Upload ze opnieuw in stap 2 (Huisstijl).';
    }

    if (ctx.state.currentStep > 8) {
      ctx.state.currentStep = 8;
    }

    if (ctx.state.view === 'preview' || ctx.state.view === 'publish' || ctx.state.view === 'publish-success') {
      ctx.state.view = 'builder';
    }

    if (ctx.state.view === 'generate-success') {
      if (ctx.preparedWebsite) {
        ctx.state.view = 'builder';
        ctx.state.currentStep = 7;
        ctx.usePreparedSite = true;
      } else {
        ctx.state.view = 'builder';
        ctx.state.currentStep = 1;
        ctx.usePreparedSite = false;
      }
      ctx.generateSummary = null;
    }

    if (ctx.state.view !== 'save-success') {
      ctx.saveResult = null;
      ctx.saveMagicLinkSent = false;
    } else if (!ctx.saveResult) {
      const persisted = loadPersistedSaveResult();
      if (persisted) {
        ctx.saveResult = persisted.result;
        ctx.saveMagicLinkSent = Boolean(persisted.magicLinkSent);
      }
    }

    ctx.isGenerating = false;
    syncCityFromContact();
    setupWizardRecoveryGuards();
    setupWizardLeaveGuard();
    render();
  } finally {
    clearBlockingUi();
    if (typeof ctx !== 'undefined') {
      ctx.isGenerating = false;
      syncGeneratingOverlay();
    }
  }
}
