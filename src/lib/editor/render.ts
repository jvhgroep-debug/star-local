import type { BuilderState, PreviewPage } from '../../types/builder';
import { buildPageSeo } from '../builder/generator/seo';
import { BUILDER_INDUSTRIES, COLOR_PRESETS, WORKDAY_KEYS } from '../builder/constants';
import type { BuilderFiles } from '../builder/files';
import { buildWebsiteConfig } from '../builder/website-config';
import { formatSlugPreviewHtml, getSlugPreview } from '../builder/slug';
import { formatTelLink, formatWhatsAppLink, mapsRouteUrl } from '../builder/templates';
import {
  EDITOR_BUTTON_STYLES,
  EDITOR_CORNER_RADIUS,
  EDITOR_FONTS,
  EDITOR_NAV,
  EDITOR_PREVIEW_PAGES,
  EDITOR_SHADOWS,
  EDITOR_VIEWPORTS,
  type EditorNavSection,
  type EditorViewport,
} from './constants';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatStatusTime(iso: string | null): string {
  if (!iso) return 'Nog niet opgeslagen';
  try {
    return new Intl.DateTimeFormat('nl-NL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function renderStatusBar(options: {
  dirty: boolean;
  lastSavedAt: string | null;
  businessName: string;
}): string {
  return `
    <header class="pro-editor-status" role="region" aria-label="Editor status">
      <div class="pro-editor-status__left">
        <span class="pro-editor-status__brand">Star Local Builder</span>
        <span class="pro-editor-status__badge pro-editor-status__badge--concept">✔ Concept</span>
        <span class="pro-editor-status__badge ${options.dirty ? 'pro-editor-status__badge--dirty' : 'pro-editor-status__badge--saved'}">
          ${options.dirty ? '● Niet opgeslagen wijzigingen' : '✔ Opgeslagen'}
        </span>
        <span class="pro-editor-status__meta">Laatste wijziging: ${escapeHtml(formatStatusTime(options.lastSavedAt))}</span>
      </div>
      <div class="pro-editor-status__actions">
        <span class="pro-editor-status__site">${escapeHtml(options.businessName || 'Uw website')}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-editor-save-now>Opslaan</button>
        <a class="btn btn-secondary btn-sm" href="/dashboard/">Dashboard</a>
      </div>
    </header>
  `;
}

export function renderSidebar(active: EditorNavSection): string {
  const items = EDITOR_NAV.map((item) => {
    const current = item.id === active ? ' is-active' : '';
    return `
      <button type="button" class="pro-editor-nav__item${current}" data-editor-section="${item.id}" title="${escapeHtml(item.label)}">
        <span class="pro-editor-nav__icon" aria-hidden="true">${item.icon}</span>
        <span class="pro-editor-nav__label">${escapeHtml(item.label)}</span>
      </button>
    `;
  }).join('');

  return `
    <aside class="pro-editor-nav" aria-label="Editor menu">
      <div class="pro-editor-nav__inner">${items}</div>
    </aside>
  `;
}

function field(label: string, id: string, value: string, type = 'text', extra = ''): string {
  if (type === 'textarea') {
    return `<label class="pro-field" for="${id}"><span>${escapeHtml(label)}</span><textarea id="${id}" rows="3">${escapeHtml(value)}</textarea></label>`;
  }
  return `<label class="pro-field" for="${id}"><span>${escapeHtml(label)}</span><input id="${id}" type="${type}" value="${escapeHtml(value)}" ${extra} /></label>`;
}

function renderWebsiteSettings(state: BuilderState): string {
  return `
    <div class="pro-settings-group">
      <h2>Homepage</h2>
      <p class="pro-settings-intro">Pas titels, teksten en call-to-actions aan. Klik ook direct in de preview om tekst te wijzigen.</p>
      ${field('Titel (hero)', 'editor-hero-title', state.heroTitle, 'text', 'placeholder="Automatisch uit bedrijfsnaam"')}
      ${field('Subtitel', 'editor-hero-subtitle', state.heroSubtitle, 'text', 'placeholder="Automatisch gegenereerd"')}
      ${field('CTA-knop tekst', 'editor-cta-quote', state.ctaQuoteLabel)}
      ${field('Bedrijfsnaam', 'editor-business-name', state.business.name)}
      ${field('Branche', 'editor-business-industry', state.business.industry, 'text', 'list="editor-industry-options"')}
      <datalist id="editor-industry-options">${BUILDER_INDUSTRIES.map((i) => `<option value="${escapeHtml(i)}"></option>`).join('')}</datalist>
      ${field('Omschrijving', 'editor-business-description', state.business.description, 'textarea')}
      <div id="editor-slug-preview">${formatSlugPreviewHtml(getSlugPreview(state.business.name))}</div>
    </div>
    <div class="pro-settings-group">
      <h3>Hero</h3>
      ${field('Hero placeholder label', 'editor-hero-placeholder', state.heroPlaceholder)}
      <p class="pro-settings-hint">Hero-afbeelding blijft een visuele placeholder tot echte upload in productie.</p>
    </div>
  `;
}

function renderPagesSettings(state: BuilderState, page: PreviewPage): string {
  const rows = EDITOR_PREVIEW_PAGES.map(
    (item) => `
      <button type="button" class="pro-page-row ${item.id === page ? 'is-active' : ''}" data-editor-preview-page="${item.id}">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.id === 'home' ? '/' : `/${item.id === 'about' ? 'over-ons' : item.id}/`)}</span>
      </button>
    `,
  ).join('');

  return `
    <div class="pro-settings-group">
      <h2>Pagina's</h2>
      <p class="pro-settings-intro">Kies een pagina om te bewerken. SEO en preview worden per pagina bijgewerkt.</p>
      <div class="pro-page-list">${rows}</div>
      <p class="pro-settings-hint">Tip: klik op tekst in de preview om direct te wijzigen (homepage).</p>
    </div>
  `;
}

function renderDesignSettings(state: BuilderState): string {
  const presets = COLOR_PRESETS.map(
    (p) =>
      `<button type="button" class="builder-color-preset" data-color-preset="${p.id}" style="--preset-primary:${p.primaryColor};--preset-accent:${p.accentColor};"><span></span>${escapeHtml(p.label)}</button>`,
  ).join('');

  const select = (label: string, id: string, options: readonly { id: string; label: string }[], current: string) =>
    `<label class="pro-field"><span>${escapeHtml(label)}</span><select id="${id}">${options.map((o) => `<option value="${o.id}" ${o.id === current ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`;

  return `
    <div class="pro-settings-group">
      <h2>Design</h2>
      <p class="pro-settings-intro">Premium uitstraling met lettertype, kleuren, knoppen, hoeken en schaduw.</p>
      ${select('Lettertype', 'editor-font-family', EDITOR_FONTS, state.design.fontFamily)}
      <div class="builder-form-grid">
        <label class="pro-field"><span>Primaire kleur</span><input id="editor-primary-color" type="color" value="${escapeHtml(state.branding.primaryColor)}" /></label>
        <label class="pro-field"><span>Accentkleur</span><input id="editor-accent-color" type="color" value="${escapeHtml(state.branding.accentColor)}" /></label>
      </div>
      ${select('Knopstijl', 'editor-button-style', EDITOR_BUTTON_STYLES, state.design.buttonStyle)}
      ${select('Hoeken', 'editor-corner-radius', EDITOR_CORNER_RADIUS, state.design.cornerRadius)}
      ${select('Schaduw', 'editor-shadow', EDITOR_SHADOWS, state.design.shadow)}
      <div class="pro-settings-sub"><h3>Kleur presets</h3><div class="builder-color-presets">${presets}</div></div>
    </div>
  `;
}

function renderMediaSettings(state: BuilderState, files: BuilderFiles): string {
  const logo = files.logoUrl
    ? `<img src="${files.logoUrl}" alt="" class="pro-media-card__img" />`
    : `<div class="pro-media-card__placeholder"><span>Logo</span><small>${files.logoName ? escapeHtml(files.logoName) : 'Nog geen logo'}</small></div>`;

  const hero = files.heroUrl || files.photoUrls[0]
    ? `<img src="${files.heroUrl || files.photoUrls[0]}" alt="" class="pro-media-card__img pro-media-card__img--hero" />`
    : `<div class="pro-media-card__placeholder"><span>Hero</span><small>${escapeHtml(state.branding.heroImageName || 'Nog geen hero')}</small></div>`;

  const gallery = files.photoUrls
    .map(
      (url, index) => `
        <div class="pro-media-card pro-media-card--gallery" data-gallery-index="${index}">
          <img src="${url}" alt="" class="pro-media-card__img" />
          <div class="pro-media-card__actions">
            <label class="pro-upload"><span class="btn btn-secondary btn-sm">Vervangen</span><input type="file" accept="image/jpeg,image/png,image/webp" data-replace-gallery="${index}" hidden /></label>
            <button type="button" class="builder-text-btn" data-remove-gallery-photo="${index}">Verwijderen</button>
          </div>
        </div>
      `,
    )
    .join('');

  const canAddGallery = files.photoUrls.length < 5;

  return `
    <div class="pro-settings-group">
      <h2>Mediabibliotheek</h2>
      <p class="pro-settings-intro">Upload logo, hero en galerijafbeeldingen. Maximaal 5 foto's, 5 MB per bestand.</p>
      <div class="pro-media-library-search">
        <input type="search" id="editor-media-search" placeholder="Zoeken op bestandsnaam…" aria-label="Zoek media" />
      </div>
      <h3>Logo <span class="pro-media-badge">1 max</span></h3>
      <div class="pro-media-card pro-media-card--logo">${logo}
        <label class="pro-upload"><span class="btn btn-secondary btn-sm">${files.logoUrl ? 'Vervangen' : 'Uploaden'}</span><input id="editor-logo-input" type="file" accept="image/jpeg,image/png,image/webp" hidden /></label>
        ${files.logoUrl ? `<button type="button" class="builder-text-btn" data-remove-logo>Verwijderen</button>` : ''}
      </div>
      <h3>Hero <span class="pro-media-badge">1 max</span></h3>
      <div class="pro-media-card pro-media-card--hero">${hero}
        <label class="pro-upload"><span class="btn btn-secondary btn-sm">${files.heroUrl ? 'Vervangen' : 'Uploaden'}</span><input id="editor-hero-input" type="file" accept="image/jpeg,image/png,image/webp" hidden /></label>
        ${files.heroUrl ? `<button type="button" class="builder-text-btn" data-remove-hero>Verwijderen</button>` : ''}
      </div>
      <h3>Galerij <span class="pro-media-badge">${files.photoUrls.length}/5</span></h3>
      <div class="pro-media-grid" data-media-gallery>${gallery || '<p class="pro-settings-hint">Nog geen galerijafbeeldingen.</p>'}</div>
      ${canAddGallery ? `<label class="pro-upload"><span class="btn btn-secondary btn-sm">+ Toevoegen</span><input id="editor-gallery-input" type="file" accept="image/jpeg,image/png,image/webp" hidden /></label>` : ''}
    </div>
  `;
}

function renderContactSettings(state: BuilderState): string {
  const hours = state.hours
    .map((day, index) => {
      const disabled = day.closed || day.open24;
      return `
        <div class="builder-hours-row">
          <strong>${escapeHtml(day.day)}</strong>
          <label class="builder-checkbox"><input type="checkbox" name="editor-hours-closed-${index}" ${day.closed ? 'checked' : ''} /> Gesloten</label>
          <label class="builder-checkbox"><input type="checkbox" name="editor-hours-open24-${index}" ${day.open24 ? 'checked' : ''} ${day.closed ? 'disabled' : ''} /> 24u</label>
          <label>Open <input type="time" name="editor-hours-open-${index}" value="${day.openTime}" ${disabled ? 'disabled' : ''} /></label>
          <label>Dicht <input type="time" name="editor-hours-close-${index}" value="${day.closeTime}" ${disabled ? 'disabled' : ''} /></label>
        </div>
      `;
    })
    .join('');

  return `
    <div class="pro-settings-group">
      <h2>Contact</h2>
      <div class="builder-form-grid">
        ${field('Telefoon', 'editor-contact-phone', state.contact.phone, 'tel')}
        ${field('WhatsApp', 'editor-contact-whatsapp', state.contact.whatsapp, 'tel')}
      </div>
      ${field('E-mail', 'editor-contact-email', state.contact.email, 'email')}
      ${field('Straat', 'editor-contact-street', state.contact.street)}
      <div class="builder-form-grid">
        ${field('Postcode', 'editor-contact-postcode', state.contact.postcode)}
        ${field('Plaats', 'editor-contact-city', state.contact.city)}
      </div>
    </div>
    <div class="pro-settings-group">
      <h3>Openingstijden</h3>
      <button type="button" class="btn btn-secondary btn-sm" data-copy-workday-hours>Werkdagen kopiëren</button>
      <div class="builder-hours">${hours}</div>
    </div>
  `;
}

function renderServicesSettings(state: BuilderState): string {
  const items = state.business.services
    .map(
      (s, i) => `
        <div class="builder-service">
          <label>Titel <input data-service-title="${i}" value="${escapeHtml(s.title)}" /></label>
          <label>Omschrijving <textarea rows="2" data-service-description="${i}">${escapeHtml(s.description)}</textarea></label>
          ${state.business.services.length > 1 ? `<button type="button" class="builder-text-btn" data-remove-service="${i}">Verwijderen</button>` : ''}
        </div>
      `,
    )
    .join('');

  return `
    <div class="pro-settings-group">
      <h2>Diensten</h2>
      <div class="builder-services">${items}</div>
      <button type="button" class="btn btn-secondary btn-sm" data-add-service>Dienst toevoegen</button>
    </div>
  `;
}

function renderSeoSettings(state: BuilderState, files: BuilderFiles, page: PreviewPage): string {
  const config = buildWebsiteConfig(state, files);
  const seo = buildPageSeo(config, page);
  const pageLabel = EDITOR_PREVIEW_PAGES.find((p) => p.id === page)?.label ?? page;
  const row = (label: string, value: string) =>
    `<div class="editor-readonly-field"><span class="editor-readonly-field__label">${escapeHtml(label)}</span><output class="editor-readonly-field__value">${escapeHtml(value || '—')}</output></div>`;

  return `
    <div class="pro-settings-group">
      <h2>SEO — ${escapeHtml(pageLabel)}</h2>
      <p class="pro-settings-intro">Live berekend per pagina. Wijzig bedrijfsgegevens of omschrijving om SEO aan te passen.</p>
      <div class="editor-seo-live">
        ${row('SEO titel', seo.title)}
        ${row('Meta description', seo.description)}
        ${row('Canonical', seo.canonicalUrl)}
        ${row('Open Graph titel', seo.ogTitle)}
        ${row('Open Graph description', seo.ogDescription)}
        ${row('Robots', 'index, follow')}
        ${row('H1', seo.h1)}
      </div>
    </div>
  `;
}

function renderSettingsPanelSection(state: BuilderState): string {
  const phone = Boolean(formatTelLink(state.contact.phone));
  const wa = Boolean(formatWhatsAppLink(state.contact.whatsapp));
  const route = mapsRouteUrl(state) !== '#';
  return `
    <div class="pro-settings-group">
      <h2>Instellingen</h2>
      ${field('Publicatie-e-mail', 'editor-settings-email', state.publishEmailConfirmed || state.contact.email, 'email')}
      <p class="pro-settings-hint">Automatisch opslaan in localStorage. Geen D1-publicatie in deze fase.</p>
      <h3>CTA status</h3>
      <div class="editor-cta-status">
        <span class="editor-cta-pill ${phone ? 'is-active' : 'is-inactive'}">Bel direct</span>
        <span class="editor-cta-pill ${wa ? 'is-active' : 'is-inactive'}">WhatsApp</span>
        <span class="editor-cta-pill is-active">Offerte</span>
        <span class="editor-cta-pill ${route ? 'is-active' : 'is-inactive'}">Route</span>
      </div>
    </div>
  `;
}

export function renderSettingsPanel(
  section: EditorNavSection,
  state: BuilderState,
  files: BuilderFiles,
  page: PreviewPage,
): string {
  const title = EDITOR_NAV.find((n) => n.id === section)?.label ?? 'Instellingen';
  let body = '';

  switch (section) {
    case 'pages':
      body = renderPagesSettings(state, page);
      break;
    case 'design':
      body = renderDesignSettings(state);
      break;
    case 'media':
      body = renderMediaSettings(state, files);
      break;
    case 'contact':
      body = renderContactSettings(state);
      break;
    case 'services':
      body = renderServicesSettings(state);
      break;
    case 'seo':
      body = renderSeoSettings(state, files, page);
      break;
    case 'settings':
      body = renderSettingsPanelSection(state);
      break;
    default:
      body = renderWebsiteSettings(state);
  }

  return `
    <section class="pro-editor-settings" data-editor-settings aria-label="${escapeHtml(title)}">
      <header class="pro-editor-settings__head">
        <p class="eyebrow">Instellingen</p>
        <h1>${escapeHtml(title)}</h1>
      </header>
      <div class="pro-editor-settings__body">${body}</div>
    </section>
  `;
}

export function renderPreviewPanel(
  state: BuilderState,
  page: PreviewPage,
  viewport: EditorViewport,
  previewHtml: string,
): string {
  const tabs = EDITOR_PREVIEW_PAGES.map(
    (p) =>
      `<button type="button" class="editor-preview-tab ${p.id === page ? 'is-active' : ''}" data-editor-preview-page="${p.id}">${escapeHtml(p.label)}</button>`,
  ).join('');

  const viewports = EDITOR_VIEWPORTS.map(
    (v) =>
      `<button type="button" class="pro-viewport-btn ${v.id === viewport ? 'is-active' : ''}" data-editor-viewport="${v.id}">${escapeHtml(v.label)}</button>`,
  ).join('');

  const domain = getSlugPreview(state.business.name).domain;

  return `
    <section class="pro-editor-preview" aria-label="Live preview">
      <header class="pro-editor-preview__toolbar">
        <div class="pro-editor-preview__toolbar-left">
          <span class="pro-editor-preview__label">Live preview</span>
          <div class="pro-viewport-switch">${viewports}</div>
        </div>
        <div class="builder-example-domain pro-editor-domain">
          <span class="builder-example-domain__label">Preview</span>
          <strong class="builder-example-domain__value editor-domain-value">${escapeHtml(domain)}</strong>
        </div>
      </header>
      <div class="editor-preview-tabs" role="tablist">${tabs}</div>
      <div class="pro-editor-preview__canvas pro-editor-preview__canvas--${viewport}">
        <div class="pro-editor-preview__device">
          <div class="editor-preview-frame builder-preview-frame">${previewHtml}</div>
        </div>
      </div>
      <p class="pro-editor-preview__hint">Tip: klik op titels, tekst of knoppen in de preview om direct te bewerken.</p>
    </section>
  `;
}

export function renderProEditorShell(options: {
  section: EditorNavSection;
  state: BuilderState;
  files: BuilderFiles;
  page: PreviewPage;
  viewport: EditorViewport;
  previewHtml: string;
  dirty: boolean;
  lastSavedAt: string | null;
}): string {
  return `
    <div class="pro-editor">
      ${renderStatusBar({ dirty: options.dirty, lastSavedAt: options.lastSavedAt, businessName: options.state.business.name })}
      <div class="pro-editor__workspace">
        ${renderSidebar(options.section)}
        ${renderSettingsPanel(options.section, options.state, options.files, options.page)}
        ${renderPreviewPanel(options.state, options.page, options.viewport, options.previewHtml)}
      </div>
    </div>
  `;
}

export { WORKDAY_KEYS };
