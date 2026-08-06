import type { PreviewPage } from '../../types/builder';
import type { WizardV2State } from '../../types/wizard-v2';
import { BUILDER_INDUSTRIES, filterIndustries, WIZARD_V2_COLOR_PRESETS, WORKDAY_KEYS } from './constants';
import { resolveWizardMedia } from './media';
import { attachWizardPreview } from './preview';
import { renderWizardShell } from './render-shell';
import {
  clearWizardState,
  createDefaultWizardState,
  loadWizardState,
  saveWizardState,
} from './storage';
import { saveWizardAsConcept, submitWizardForReview } from './save-client';
import { validateWizardStep } from './validation';

interface WizardContext {
  state: WizardV2State;
  errors: Record<string, string>;
  previewViewport: 'desktop' | 'tablet' | 'mobile';
  previewPage: PreviewPage;
  isComplete: boolean;
  saveMessage: string | null;
  saveError: string | null;
}

let ctx: WizardContext;
let previewTimer: ReturnType<typeof setTimeout> | null = null;
let eventsAbort: AbortController | null = null;

function getRoot(): HTMLElement {
  const root = document.getElementById('website-wizard-v2-root');
  if (!root) throw new Error('Wizard root not found');
  return root;
}

function persist(): void {
  saveWizardState(ctx.state);
}

function schedulePreviewRefresh(): void {
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshPreview, 120);
}

function refreshPreview(): void {
  const frame = document.getElementById('wizard-v2-preview-frame');
  if (!frame) return;
  attachWizardPreview(frame, ctx.state, ctx.previewPage);
}

function render(): void {
  const root = getRoot();
  const media = resolveWizardMedia(ctx.state);
  root.innerHTML = renderWizardShell(
    ctx.state,
    media,
    ctx.errors,
    ctx.previewViewport,
    ctx.previewPage,
    ctx.isComplete,
    ctx.saveMessage,
    ctx.saveError,
  );
  bindEvents();
  refreshPreview();
}

function readStep1FromDom(): void {
  const root = getRoot();
  const get = (id: string) => (root.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';
  ctx.state.businessName = get('wizard-business-name');
  ctx.state.industry = (root.querySelector('#wizard-industry') as HTMLInputElement)?.value ?? '';
  ctx.state.description = get('wizard-description');
  ctx.state.phone = get('wizard-phone');
  ctx.state.whatsapp = get('wizard-whatsapp');
  ctx.state.email = get('wizard-email');
  ctx.state.website = get('wizard-website');
  ctx.state.street = get('wizard-street');
  ctx.state.postcode = get('wizard-postcode');
  ctx.state.city = get('wizard-city');
}

function readStep2FromDom(): void {
  const root = getRoot();
  ctx.state.hours.forEach((day, index) => {
    const closed = (root.querySelector(`[data-wizard-hours-closed="${index}"]`) as HTMLInputElement)?.checked ?? false;
    const open24 = (root.querySelector(`[data-wizard-hours-open24="${index}"]`) as HTMLInputElement)?.checked ?? false;
    const openTime = (root.querySelector(`[data-wizard-hours-open="${index}"]`) as HTMLInputElement)?.value ?? day.openTime;
    const closeTime = (root.querySelector(`[data-wizard-hours-close="${index}"]`) as HTMLInputElement)?.value ?? day.closeTime;
    ctx.state.hours[index] = { ...day, closed, open24, openTime, closeTime };
  });

  ctx.state.social.facebook = (root.querySelector('#wizard-facebook') as HTMLInputElement)?.value ?? '';
  ctx.state.social.instagram = (root.querySelector('#wizard-instagram') as HTMLInputElement)?.value ?? '';
  ctx.state.social.linkedin = (root.querySelector('#wizard-linkedin') as HTMLInputElement)?.value ?? '';
}

function readStep3FromDom(): void {
  const root = getRoot();
  const primary = (root.querySelector('#wizard-primary-color') as HTMLInputElement)?.value;
  const fontInput = root.querySelector('[name="wizard-font-family"]:checked') as HTMLInputElement | null;
  if (primary) ctx.state.primaryColor = primary;
  if (fontInput?.value) ctx.state.fontFamily = fontInput.value as WizardV2State['fontFamily'];
}

function readCurrentStepFromDom(): void {
  if (ctx.isComplete) return;
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
  }
}

function syncAllFromDom(): void {
  readStep1FromDom();
  readStep2FromDom();
  readStep3FromDom();
}

function validateCurrentStep(): boolean {
  if (ctx.isComplete) return true;
  const result = validateWizardStep(ctx.state.currentStep, ctx.state);
  ctx.errors = result.errors;
  return result.valid;
}

function setupIndustryPicker(signal: AbortSignal): void {
  const root = getRoot();
  const search = root.querySelector('#wizard-industry-search') as HTMLInputElement | null;
  const hidden = root.querySelector('#wizard-industry') as HTMLInputElement | null;
  const list = root.querySelector('#wizard-industry-options') as HTMLUListElement | null;
  if (!search || !hidden || !list) return;

  const renderOptions = (query: string) => {
    const matches = filterIndustries(BUILDER_INDUSTRIES, query).slice(0, 8);
    if (matches.length === 0) {
      list.hidden = true;
      search.setAttribute('aria-expanded', 'false');
      return;
    }
    list.innerHTML = matches
      .map(
        (item) =>
          `<li role="option"><button type="button" class="builder-industry-option" data-industry="${item.replace(/"/g, '&quot;')}">${item}</button></li>`,
      )
      .join('');
    list.hidden = false;
    search.setAttribute('aria-expanded', 'true');
  };

  search.addEventListener(
    'input',
    () => {
      readStep1FromDom();
      ctx.state.industry = search.value;
      renderOptions(search.value);
      persist();
      schedulePreviewRefresh();
    },
    { signal },
  );

  search.addEventListener(
    'focus',
    () => renderOptions(search.value),
    { signal },
  );

  list.addEventListener(
    'click',
    (event) => {
      const button = (event.target as HTMLElement).closest('[data-industry]') as HTMLElement | null;
      if (!button) return;
      const value = button.dataset.industry ?? '';
      hidden.value = value;
      search.value = value;
      ctx.state.industry = value;
      list.hidden = true;
      search.setAttribute('aria-expanded', 'false');
      persist();
      schedulePreviewRefresh();
    },
    { signal },
  );
}

async function handleWizardSave(submitForReview: boolean): Promise<void> {
  syncAllFromDom();
  ctx.saveError = null;
  ctx.saveMessage = null;
  render();

  try {
    const result = submitForReview
      ? await submitWizardForReview(ctx.state, window.location.origin)
      : await saveWizardAsConcept(ctx.state, window.location.origin);

    ctx.saveMessage = submitForReview
      ? `Ingediend voor review. Website-ID: ${result.websiteId}`
      : `Opgeslagen als concept. Website-ID: ${result.websiteId}`;
  } catch (error) {
    ctx.saveError = error instanceof Error ? error.message : 'Opslaan mislukt.';
  }

  render();
}

function bindEvents(): void {
  eventsAbort?.abort();
  eventsAbort = new AbortController();
  const { signal } = eventsAbort;
  const root = getRoot();

  root.querySelectorAll('input, textarea, select').forEach((element) => {
    element.addEventListener(
      'input',
      () => {
        readCurrentStepFromDom();
        persist();
        schedulePreviewRefresh();
      },
      { signal },
    );
    element.addEventListener(
      'change',
      () => {
        readCurrentStepFromDom();
        persist();
        schedulePreviewRefresh();
      },
      { signal },
    );
  });

  setupIndustryPicker(signal);

  root.querySelector('[data-wizard-copy-weekdays]')?.addEventListener(
    'click',
    () => {
      readStep2FromDom();
      const monday = ctx.state.hours.find((day) => day.dayKey === 'monday');
      if (!monday) return;
      ctx.state.hours = ctx.state.hours.map((day) =>
        WORKDAY_KEYS.includes(day.dayKey)
          ? { ...day, closed: monday.closed, open24: monday.open24, openTime: monday.openTime, closeTime: monday.closeTime }
          : day,
      );
      persist();
      render();
    },
    { signal },
  );

  root.querySelectorAll('[data-wizard-color-preset]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const id = (button as HTMLElement).dataset.wizardColorPreset;
        const preset = WIZARD_V2_COLOR_PRESETS.find((item) => item.id === id);
        if (!preset) return;
        ctx.state.primaryColor = preset.primaryColor;
        ctx.state.accentColor = preset.accentColor;
        persist();
        render();
      },
      { signal },
    );
  });

  root.querySelector('[data-wizard-back]')?.addEventListener(
    'click',
    () => {
      if (ctx.isComplete) {
        ctx.isComplete = false;
        ctx.state.currentStep = 3;
        persist();
        render();
        return;
      }
      readCurrentStepFromDom();
      persist();
      if (ctx.state.currentStep > 1) {
        ctx.state.currentStep = (ctx.state.currentStep - 1) as WizardV2State['currentStep'];
        ctx.errors = {};
        persist();
        render();
      }
    },
    { signal },
  );

  root.querySelector('[data-wizard-next]')?.addEventListener(
    'click',
    () => {
      readCurrentStepFromDom();
      if (!validateCurrentStep()) {
        render();
        return;
      }
      persist();
      if (ctx.state.currentStep < 3) {
        ctx.state.currentStep = (ctx.state.currentStep + 1) as WizardV2State['currentStep'];
        ctx.errors = {};
        persist();
        render();
        return;
      }
      ctx.isComplete = true;
      persist();
      render();
    },
    { signal },
  );

  root.querySelector('[data-wizard-save-concept]')?.addEventListener(
    'click',
    () => {
      void handleWizardSave(false);
    },
    { signal },
  );

  root.querySelector('[data-wizard-submit-review]')?.addEventListener(
    'click',
    () => {
      void handleWizardSave(true);
    },
    { signal },
  );

  root.querySelector('[data-wizard-reset]')?.addEventListener(
    'click',
    () => {
      if (!window.confirm('Alle ingevulde gegevens wissen en opnieuw beginnen?')) return;
      clearWizardState();
      ctx.state = createDefaultWizardState();
      ctx.errors = {};
      ctx.isComplete = false;
      persist();
      render();
    },
    { signal },
  );

  root.querySelectorAll('[data-wizard-viewport]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const viewport = (button as HTMLElement).dataset.wizardViewport as WizardContext['previewViewport'];
        if (!viewport) return;
        ctx.previewViewport = viewport;
        render();
      },
      { signal },
    );
  });

  root.querySelectorAll('[data-preview-tab]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const page = (button as HTMLElement).dataset.previewTab as PreviewPage;
        if (!page) return;
        ctx.previewPage = page;
        render();
      },
      { signal },
    );
  });

  root.querySelector('#wizard-v2-preview-frame')?.addEventListener(
    'wizard-preview-page',
    (event) => {
      const page = (event as CustomEvent<PreviewPage>).detail;
      if (!page) return;
      ctx.previewPage = page;
      render();
    },
    { signal },
  );
}

export function initWebsiteWizardV2(): void {
  ctx = {
    state: loadWizardState(),
    errors: {},
    previewViewport: 'desktop',
    previewPage: 'home',
    isComplete: false,
    saveMessage: null,
    saveError: null,
  };
  render();
}

export function __resetWizardV2ForTests(): void {
  clearWizardState();
  ctx = {
    state: createDefaultWizardState(),
    errors: {},
    previewViewport: 'desktop',
    previewPage: 'home',
    isComplete: false,
  };
}

export function __getWizardV2StateForTests(): WizardV2State {
  syncAllFromDom();
  return structuredClone(ctx.state);
}
