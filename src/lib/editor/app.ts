import type { BuilderState, PreviewPage } from '../../types/builder';
import { COLOR_PRESETS, WORKDAY_KEYS, createServiceId } from '../builder/constants';
import { readableTextColor } from '../builder/colors';
import {
  createEmptyFiles,
  revokeObjectUrl,
  setLogoFile,
  syncFileMeta,
  type BuilderFiles,
} from '../builder/files';
import { bindPreviewInteractions } from '../builder/preview-interactions';
import { renderTenantPreview } from '../builder/render-preview';
import { saveState } from '../builder/storage';
import { formatSlugPreviewHtml, getSlugPreview } from '../builder/slug';
import { buildWebsiteConfig } from '../builder/website-config';
import { loadEditorBootstrap } from './bootstrap';
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

function persistSession(): void {
  const meta = syncFileMeta(ctx.files);
  ctx.state.branding.logoName = meta.logoName;
  ctx.state.branding.photoNames = meta.photoNames;
  ctx.state.branding.textColor = readableTextColor(ctx.state.branding.primaryColor);
  saveState(ctx.state);
  ctx.lastSavedAt = new Date().toISOString();
  ctx.dirty = false;
  updateStatusBar();
}

function scheduleAutoSave(): void {
  markDirty();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(persistSession, 800);
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
  const row = (label: string, value: string) =>
    `<div class="editor-readonly-field"><span class="editor-readonly-field__label">${label}</span><output class="editor-readonly-field__value">${value || '—'}</output></div>`;
  seo.innerHTML = [
    row('Titel', config.seo.title),
    row('Meta description', config.seo.description),
    row('Slug', config.slug.slug),
    row('Canonical', config.seo.canonicalUrl),
    row('OpenGraph titel', config.seo.ogTitle),
    row('OpenGraph description', config.seo.description),
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

  root.querySelector('[data-replace-hero-placeholder]')?.addEventListener('click', () => {
    readPanelFromDom();
    ctx.state.heroPlaceholder = `Hero ${new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
    scheduleAutoSave();
    render();
  });

  root.querySelector('[data-add-gallery-placeholder]')?.addEventListener('click', () => {
    readPanelFromDom();
    ctx.state.galleryPlaceholders.push(`Galerij ${ctx.state.galleryPlaceholders.length + 1}`);
    scheduleAutoSave();
    render();
  });

  root.querySelectorAll('[data-remove-gallery]').forEach((btn) => {
    btn.addEventListener('click', () => {
      readPanelFromDom();
      const index = Number((btn as HTMLElement).dataset.removeGallery);
      if (ctx.state.galleryPlaceholders.length <= 1) return;
      ctx.state.galleryPlaceholders.splice(index, 1);
      scheduleAutoSave();
      render();
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

export function initWebsiteEditor(): void {
  const bootstrap = loadEditorBootstrap();
  ctx = {
    state: bootstrap.state,
    files: bootstrap.files.logoUrl ? bootstrap.files : createEmptyFiles(),
    section: 'website',
    previewPage: 'home',
    viewport: 'desktop',
    dirty: false,
    lastSavedAt: null,
  };
  if (bootstrap.files.logoUrl) ctx.files = bootstrap.files;
  persistSession();
  render();
}
