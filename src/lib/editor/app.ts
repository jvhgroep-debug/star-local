import type { BuilderState, PreviewPage } from '../../types/builder';
import { COLOR_PRESETS, WORKDAY_KEYS, createServiceId } from '../builder/constants';
import { readableTextColor } from '../builder/colors';
import {
  createEmptyFiles,
  revokeObjectUrl,
  setLogoFile,
  setHeroFile,
  addPhotoFile,
  removePhoto,
  replacePhotoFile,
  removeHeroFile,
  syncFileMeta,
  type BuilderFiles,
} from '../builder/files';
import { buildPageSeo } from '../builder/generator/seo';
import { bindPreviewInteractions } from '../builder/preview-interactions';
import { renderTenantPreview } from '../builder/render-preview';
import { saveState } from '../builder/storage';
import { saveFilesToStorage } from '../builder/media-storage';
import { buildSavePayload, saveWebsiteToD1 } from '../builder/publish/save-client';
import { loadDashboardSession } from '../dashboard/storage';
import { formatSlugPreviewHtml, getSlugPreview } from '../builder/slug';
import { buildWebsiteConfig } from '../builder/website-config';
import { loadEditorBootstrapAsync } from './bootstrap';
import type { EditorNavSection, EditorViewport } from './constants';
import { applyInlineField, bindInlineEditing, syncInlineFields } from './inline-edit';
import { renderProEditorShell } from './render';

interface EditorContext {
  state: BuilderState;
  files: BuilderFiles;
  section: EditorNavSection;
  previewPage: PreviewPage;
  viewport: EditorViewport;
  dirty: boolean;
  lastSavedAt: string | null;
  tenantId: string | null;
  saveError: string | null;
}

let ctx: EditorContext;
let previewTimer: ReturnType<typeof setTimeout> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function getRoot(): HTMLElement {
  const root = document.getElementById('website-editor-root');
  if (!root) throw new Error('Editor root not found');
  return root;
}

function markDirty(): void {
  ctx.dirty = true;
  updateStatusBar();
}

function updateStatusBar(): void {
  const root = getRoot();
  const dirtyBadge = root.querySelector('.pro-editor-status__badge--dirty, .pro-editor-status__badge--saved');
  if (dirtyBadge) {
    dirtyBadge.className = `pro-editor-status__badge ${ctx.dirty ? 'pro-editor-status__badge--dirty' : 'pro-editor-status__badge--saved'}`;
    dirtyBadge.textContent = ctx.dirty ? '● Niet opgeslagen wijzigingen' : '✔ Opgeslagen';
  }
  const meta = root.querySelector('.pro-editor-status__meta');
  if (meta && ctx.lastSavedAt) {
    meta.textContent = `Laatste wijziging: ${new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ctx.lastSavedAt))}`;
  }
}

function getEditorTenantId(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    new URL(window.location.href).searchParams.get('tenantId') ??
    loadDashboardSession()?.tenantId ??
    null
  );
}

function persistSession(): void {
  const meta = syncFileMeta(ctx.files);
  ctx.state.branding.logoName = meta.logoName;
  ctx.state.branding.heroImageName = meta.heroName;
  ctx.state.branding.photoNames = meta.photoNames;
  ctx.state.branding.textColor = readableTextColor(ctx.state.branding.primaryColor);
  saveState(ctx.state);
  void saveFilesToStorage(ctx.files);
  ctx.lastSavedAt = new Date().toISOString();
  ctx.dirty = false;
  updateStatusBar();
}

async function persistSessionToD1(): Promise<void> {
  if (!ctx.tenantId) return;

  try {
    const { payload, errors: mediaErrors } = await buildSavePayload(ctx.state, ctx.files);
    if (Object.keys(mediaErrors).length > 0) {
      ctx.saveError = Object.values(mediaErrors)[0] ?? 'Media kon niet worden opgeslagen.';
      updateStatusBar();
      return;
    }

    payload.tenantId = ctx.tenantId;
    const response = await saveWebsiteToD1(payload);
    if (!response.ok) {
      ctx.saveError = response.message;
    } else {
      ctx.saveError = null;
    }
    updateStatusBar();
  } catch {
    ctx.saveError = 'Opslaan naar dashboard mislukt. Probeer het opnieuw.';
    updateStatusBar();
  }
}

function scheduleAutoSave(): void {
  markDirty();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistSession();
    void persistSessionToD1();
  }, 800);
}

function readPanelFromDom(): void {
  const root = getRoot();
  const val = (id: string) => (root.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';

  ctx.state.heroTitle = val('editor-hero-title');
  ctx.state.heroSubtitle = val('editor-hero-subtitle');
  ctx.state.ctaQuoteLabel = val('editor-cta-quote') || 'Offerte aanvragen';
  ctx.state.business.name = val('editor-business-name');
  ctx.state.business.industry = val('editor-business-industry');
  ctx.state.business.description = val('editor-business-description');
  ctx.state.heroPlaceholder = val('editor-hero-placeholder') || ctx.state.heroPlaceholder;

  ctx.state.contact.phone = val('editor-contact-phone');
  ctx.state.contact.whatsapp = val('editor-contact-whatsapp');
  ctx.state.contact.email = val('editor-contact-email');
  ctx.state.contact.street = val('editor-contact-street');
  ctx.state.contact.postcode = val('editor-contact-postcode');
  ctx.state.contact.city = val('editor-contact-city');

  const font = root.querySelector('#editor-font-family') as HTMLSelectElement | null;
  const btnStyle = root.querySelector('#editor-button-style') as HTMLSelectElement | null;
  const radius = root.querySelector('#editor-corner-radius') as HTMLSelectElement | null;
  const shadow = root.querySelector('#editor-shadow') as HTMLSelectElement | null;
  if (font) ctx.state.design.fontFamily = font.value as BuilderState['design']['fontFamily'];
  if (btnStyle) ctx.state.design.buttonStyle = btnStyle.value as BuilderState['design']['buttonStyle'];
  if (radius) ctx.state.design.cornerRadius = radius.value as BuilderState['design']['cornerRadius'];
  if (shadow) ctx.state.design.shadow = shadow.value as BuilderState['design']['shadow'];

  const primary = (root.querySelector('#editor-primary-color') as HTMLInputElement | null)?.value;
  const accent = (root.querySelector('#editor-accent-color') as HTMLInputElement | null)?.value;
  if (primary) ctx.state.branding.primaryColor = primary;
  if (accent) ctx.state.branding.accentColor = accent;

  ctx.state.business.services = ctx.state.business.services.map((service, index) => ({
    ...service,
    title: (root.querySelector(`[data-service-title="${index}"]`) as HTMLInputElement)?.value ?? service.title,
    description:
      (root.querySelector(`[data-service-description="${index}"]`) as HTMLTextAreaElement)?.value ?? service.description,
  }));

  ctx.state.hours = ctx.state.hours.map((day, index) => {
    const closed = (root.querySelector(`[name="editor-hours-closed-${index}"]`) as HTMLInputElement)?.checked ?? false;
    const open24 = (root.querySelector(`[name="editor-hours-open24-${index}"]`) as HTMLInputElement)?.checked ?? false;
    const openTime = (root.querySelector(`[name="editor-hours-open-${index}"]`) as HTMLInputElement)?.value ?? '09:00';
    const closeTime = (root.querySelector(`[name="editor-hours-close-${index}"]`) as HTMLInputElement)?.value ?? '17:00';
    return { ...day, closed, open24, openTime, closeTime };
  });
}

function updateSeoPanelIfVisible(): void {
  if (ctx.section !== 'seo') return;
  const root = getRoot();
  const seo = root.querySelector('.editor-seo-live');
  if (!seo) return;
  const config = buildWebsiteConfig(ctx.state, ctx.files);
  const pageSeo = buildPageSeo(config, ctx.previewPage);
  const row = (label: string, value: string) =>
    `<div class="editor-readonly-field"><span class="editor-readonly-field__label">${label}</span><output class="editor-readonly-field__value">${value || '—'}</output></div>`;
  seo.innerHTML = [
    row('SEO titel', pageSeo.title),
    row('Meta description', pageSeo.description),
    row('Canonical', pageSeo.canonicalUrl),
    row('Open Graph titel', pageSeo.ogTitle),
    row('Open Graph description', pageSeo.ogDescription),
    row('Robots', 'index, follow'),
    row('H1', pageSeo.h1),
  ].join('');
}

function refreshPreviewOnly(): void {
  const root = getRoot();
  const frame = root.querySelector('.editor-preview-frame');
  if (!frame) return;

  const domainValue = root.querySelector('.editor-domain-value');
  if (domainValue) domainValue.textContent = getSlugPreview(ctx.state.business.name).domain;

  const slugPreview = root.querySelector('#editor-slug-preview');
  if (slugPreview) slugPreview.innerHTML = formatSlugPreviewHtml(getSlugPreview(ctx.state.business.name));

  frame.innerHTML = renderTenantPreview(ctx.state, ctx.files, ctx.previewPage, true);
  attachPreviewFrame(frame);
  syncInlineFields(frame, ctx.state);
  updateSeoPanelIfVisible();
}

function scheduleLiveUpdate(): void {
  readPanelFromDom();
  scheduleAutoSave();
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshPreviewOnly, 50);
}

function attachPreviewFrame(frame: Element): void {
  bindPreviewInteractions(frame, (page) => {
    ctx.previewPage = page;
    getRoot().querySelectorAll('[data-editor-preview-page], .pro-page-row').forEach((tab) => {
      const id = (tab as HTMLElement).dataset.editorPreviewPage;
      tab.classList.toggle('is-active', id === page);
    });
    refreshPreviewOnly();
  });

  bindInlineEditing(frame, (field, value) => {
    ctx.state = applyInlineField(ctx.state, field, value);
    syncSettingsFieldsFromState();
    scheduleAutoSave();
    if (previewTimer) clearTimeout(previewTimer);
    previewTimer = setTimeout(refreshPreviewOnly, 30);
  });
}

function syncSettingsFieldsFromState(): void {
  const root = getRoot();
  const set = (id: string, value: string) => {
    const el = root.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement | null;
    if (el && document.activeElement !== el) el.value = value;
  };
  set('editor-hero-title', ctx.state.heroTitle);
  set('editor-hero-subtitle', ctx.state.heroSubtitle);
  set('editor-cta-quote', ctx.state.ctaQuoteLabel);
  set('editor-business-name', ctx.state.business.name);
  set('editor-business-industry', ctx.state.business.industry);
  set('editor-business-description', ctx.state.business.description);
}

function bindEvents(): void {
  const root = getRoot();

  root.querySelectorAll('[data-editor-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ctx.section = (btn as HTMLElement).dataset.editorSection as EditorNavSection;
      render();
    });
  });

  root.querySelectorAll('[data-editor-viewport]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ctx.viewport = (btn as HTMLElement).dataset.editorViewport as EditorViewport;
      root.querySelectorAll('[data-editor-viewport]').forEach((item) => {
        item.classList.toggle('is-active', (item as HTMLElement).dataset.editorViewport === ctx.viewport);
      });
      const canvas = root.querySelector('.pro-editor-preview__canvas');
      canvas?.classList.remove('pro-editor-preview__canvas--desktop', 'pro-editor-preview__canvas--tablet', 'pro-editor-preview__canvas--mobile');
      canvas?.classList.add(`pro-editor-preview__canvas--${ctx.viewport}`);
    });
  });

  root.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', scheduleLiveUpdate);
    el.addEventListener('change', scheduleLiveUpdate);
  });

  root.querySelector('#editor-logo-input')?.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setLogoFile(ctx.files, file);
    scheduleAutoSave();
    render();
  });

  root.querySelector('[data-remove-logo]')?.addEventListener('click', () => {
    revokeObjectUrl(ctx.files.logoUrl);
    ctx.files.logoUrl = null;
    ctx.files.logoName = '';
    scheduleAutoSave();
    render();
  });

  root.querySelector('#editor-hero-input')?.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const error = setHeroFile(ctx.files, file);
    if (!error) {
      ctx.state.branding.heroImageName = file.name;
      scheduleAutoSave();
      render();
    }
  });

  root.querySelector('[data-remove-hero]')?.addEventListener('click', () => {
    removeHeroFile(ctx.files);
    ctx.state.branding.heroImageName = '';
    scheduleAutoSave();
    render();
  });

  root.querySelector('#editor-gallery-input')?.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const error = addPhotoFile(ctx.files, file);
    if (!error) {
      scheduleAutoSave();
      render();
    }
  });

  root.querySelectorAll('[data-replace-gallery]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const index = Number((input as HTMLElement).dataset.replaceGallery);
      replacePhotoFile(ctx.files, index, file);
      scheduleAutoSave();
      render();
    });
  });

  root.querySelectorAll('[data-remove-gallery-photo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number((btn as HTMLElement).dataset.removeGalleryPhoto);
      removePhoto(ctx.files, index);
      scheduleAutoSave();
      render();
    });
  });

  root.querySelector('[data-editor-save-now]')?.addEventListener('click', () => {
    readPanelFromDom();
    persistSession();
    void persistSessionToD1().then(() => render());
    render();
  });

  root.querySelector('#editor-media-search')?.addEventListener('input', (event) => {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    root.querySelectorAll('[data-media-gallery] .pro-media-card--gallery').forEach((card) => {
      const name = card.querySelector('img')?.getAttribute('alt') ?? '';
      (card as HTMLElement).style.display = !query || name.toLowerCase().includes(query) ? '' : 'none';
    });
  });

  root.querySelector('[data-add-service]')?.addEventListener('click', () => {
    readPanelFromDom();
    ctx.state.business.services.push({ id: createServiceId(), title: '', description: '' });
    scheduleAutoSave();
    render();
  });

  root.querySelectorAll('[data-remove-service]').forEach((button) => {
    button.addEventListener('click', () => {
      readPanelFromDom();
      const index = Number((button as HTMLElement).dataset.removeService);
      if (ctx.state.business.services.length <= 1) return;
      ctx.state.business.services.splice(index, 1);
      scheduleAutoSave();
      render();
    });
  });

  root.querySelector('[data-copy-workday-hours]')?.addEventListener('click', () => {
    readPanelFromDom();
    const monday = ctx.state.hours[0];
    ctx.state.hours = ctx.state.hours.map((day) =>
      WORKDAY_KEYS.includes(day.dayKey) ? { ...day, ...monday, day: day.day, dayKey: day.dayKey } : day,
    );
    scheduleAutoSave();
    render();
  });

  root.querySelectorAll('[data-color-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = COLOR_PRESETS.find((item) => item.id === (button as HTMLElement).dataset.colorPreset);
      if (!preset) return;
      ctx.state.branding.primaryColor = preset.primaryColor;
      ctx.state.branding.accentColor = preset.accentColor;
      scheduleAutoSave();
      render();
    });
  });

  root.querySelectorAll('[data-editor-preview-page], .pro-page-row').forEach((tab) => {
    tab.addEventListener('click', () => {
      ctx.previewPage = (tab as HTMLElement).dataset.editorPreviewPage as PreviewPage;
      if (ctx.section === 'pages') {
        root.querySelectorAll('.pro-page-row').forEach((item) => {
          item.classList.toggle('is-active', (item as HTMLElement).dataset.editorPreviewPage === ctx.previewPage);
        });
      }
      root.querySelectorAll('[data-editor-preview-page]').forEach((item) => {
        item.classList.toggle('is-active', (item as HTMLElement).dataset.editorPreviewPage === ctx.previewPage);
      });
      refreshPreviewOnly();
    });
  });

  const frame = root.querySelector('.editor-preview-frame');
  if (frame) attachPreviewFrame(frame);
}

function render(): void {
  const root = getRoot();
  root.innerHTML = renderProEditorShell({
    section: ctx.section,
    state: ctx.state,
    files: ctx.files,
    page: ctx.previewPage,
    viewport: ctx.viewport,
    previewHtml: renderTenantPreview(ctx.state, ctx.files, ctx.previewPage, true),
    dirty: ctx.dirty,
    lastSavedAt: ctx.lastSavedAt,
  });
  bindEvents();
}

export async function initWebsiteEditor(): Promise<void> {
  const bootstrap = await loadEditorBootstrapAsync();
  const urlPage = typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('page') : null;
  const allowedPages: PreviewPage[] = ['home', 'about', 'services', 'contact', 'privacy'];
  const initialPage = allowedPages.includes(urlPage as PreviewPage) ? (urlPage as PreviewPage) : 'home';

  ctx = {
    state: bootstrap.state,
    files: bootstrap.files.logoUrl ? bootstrap.files : createEmptyFiles(),
    section: 'website',
    previewPage: initialPage,
    viewport: 'desktop',
    dirty: false,
    lastSavedAt: bootstrap.state.publishedAt,
    tenantId: bootstrap.tenantId ?? getEditorTenantId(),
    saveError: null,
  };
  if (bootstrap.files.logoUrl || bootstrap.files.heroUrl || bootstrap.files.photoUrls.length > 0) {
    ctx.files = bootstrap.files;
  }
  persistSession();
  void saveFilesToStorage(ctx.files);
  render();
}
