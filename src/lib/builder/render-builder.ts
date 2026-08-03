import type { BuilderButtonStyle, BuilderFontFamily, BuilderState, PreviewPage } from '../../types/builder';
import {
  BUILDER_STEP_LABELS,
  BUTTON_STYLE_OPTIONS,
  COLOR_PRESETS,
  FONT_OPTIONS,
  PAGE_DEFINITIONS,
} from './constants';
import { formatSlugPreviewHtml, getSlugPreview } from './slug';
import { formatAddress, formatHoursLine, futureDomain, generateCopy } from './templates';
import type { BuilderFiles } from './files';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fieldError(errors: Record<string, string>, key: string): string {
  return errors[key] ? `<p class="builder-error" id="error-${key}" role="alert">${escapeHtml(errors[key])}</p>` : '';
}

function fontLabel(fontFamily: BuilderFontFamily): string {
  return FONT_OPTIONS.find((option) => option.id === fontFamily)?.label ?? fontFamily;
}

function buttonStyleLabel(style: BuilderButtonStyle): string {
  return BUTTON_STYLE_OPTIONS.find((option) => option.id === style)?.label ?? style;
}

export function renderProgress(currentStep: number): string {
  return `
    <ol class="builder-progress" aria-label="Voortgang">
      ${BUILDER_STEP_LABELS.map((label, index) => {
        const step = index + 1;
        const status = step < currentStep ? 'is-done' : step === currentStep ? 'is-current' : '';
        return `<li class="builder-progress__item ${status}"><span>${step}</span><small>${label}</small></li>`;
      }).join('')}
    </ol>
  `;
}

export function renderPreviewPageTabs(currentPage: PreviewPage, enabledPages: BuilderState['enabledPages']): string {
  const pages: { id: PreviewPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Over ons' },
    { id: 'services', label: 'Diensten' },
    { id: 'contact', label: 'Contact' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return `
    <div class="builder-preview-tabs" role="tablist" aria-label="Pagina's">
      ${pages
        .filter((page) => enabledPages[page.id])
        .map(
          (page) => `
        <button
          type="button"
          class="builder-preview-tabs__btn ${currentPage === page.id ? 'is-active' : ''}"
          data-preview-tab="${page.id}"
          role="tab"
          aria-selected="${currentPage === page.id ? 'true' : 'false'}"
        >${escapeHtml(page.label)}</button>
      `,
        )
        .join('')}
    </div>
  `;
}

/** Stap 1 — Bedrijfsgegevens */
export function renderStep1(state: BuilderState, errors: Record<string, string>): string {
  const slugHtml = formatSlugPreviewHtml(getSlugPreview(state.business.name));

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-1-title">
      <h2 id="step-1-title">Stap 1 — Bedrijfsgegevens</h2>
      <p class="builder-hint">Vul de basisgegevens van uw bedrijf in. Uw website-adres wordt automatisch gegenereerd.</p>
      <div class="builder-form">
        <label for="business-name">Bedrijfsnaam *
          <input id="business-name" name="business-name" type="text" value="${escapeHtml(state.business.name)}" placeholder="Uw bedrijfsnaam" autocomplete="organization" required aria-describedby="slug-preview ${errors.name ? 'error-name' : ''}" />
        </label>
        ${fieldError(errors, 'name')}
        <div id="slug-preview">${slugHtml}</div>

        <div class="builder-industry-picker">
          <label for="industry-search">Categorie (branche) *</label>
          <input type="hidden" id="business-industry" name="business-industry" value="${escapeHtml(state.business.industry)}" />
          <input
            id="industry-search"
            type="search"
            value="${escapeHtml(state.business.industry)}"
            placeholder="Zoek uw branche…"
            autocomplete="off"
            role="combobox"
            aria-expanded="false"
            aria-controls="industry-options"
            aria-describedby="${errors.industry ? 'error-industry' : ''}"
          />
          <ul id="industry-options" class="builder-industry-list" role="listbox" hidden></ul>
        </div>
        ${fieldError(errors, 'industry')}

        <div class="builder-form-grid">
          <label for="contact-phone">Telefoon *
            <input id="contact-phone" name="contact-phone" type="tel" value="${escapeHtml(state.contact.phone)}" autocomplete="tel" aria-describedby="${errors.phone ? 'error-phone' : ''}" />
          </label>
          ${fieldError(errors, 'phone')}

          <label for="contact-email">E-mail *
            <input id="contact-email" name="contact-email" type="email" value="${escapeHtml(state.contact.email)}" autocomplete="email" required aria-describedby="${errors.email ? 'error-email' : ''}" />
          </label>
          ${fieldError(errors, 'email')}
        </div>

        <label for="contact-website">Website (optioneel)
          <input id="contact-website" name="contact-website" type="url" value="${escapeHtml(state.contact.website)}" placeholder="www.uwbedrijf.nl" autocomplete="url" aria-describedby="${errors.website ? 'error-website' : ''}" />
        </label>
        ${fieldError(errors, 'website')}

        <label for="contact-street">Adres (straat en huisnummer) *
          <input id="contact-street" name="contact-street" type="text" value="${escapeHtml(state.contact.street)}" autocomplete="street-address" aria-describedby="${errors.street ? 'error-street' : ''}" />
        </label>
        ${fieldError(errors, 'street')}

        <div class="builder-form-grid">
          <label for="contact-postcode">Postcode
            <input id="contact-postcode" name="contact-postcode" type="text" value="${escapeHtml(state.contact.postcode)}" autocomplete="postal-code" />
          </label>
          <label for="contact-city">Plaats *
            <input id="contact-city" name="contact-city" type="text" value="${escapeHtml(state.contact.city)}" autocomplete="address-level2" aria-describedby="${errors.city ? 'error-city' : ''}" />
          </label>
          ${fieldError(errors, 'city')}
        </div>
      </div>
    </section>
  `;
}

/** Stap 2 — Huisstijl */
export function renderStep2(
  state: BuilderState,
  files: BuilderFiles,
  errors: Record<string, string>,
  fileWarning: string | null,
): string {
  const presets = COLOR_PRESETS.map(
    (preset) => `
      <button
        type="button"
        class="builder-color-preset"
        data-color-preset="${preset.id}"
        style="--preset-primary:${preset.primaryColor};--preset-accent:${preset.accentColor};"
        aria-label="${escapeHtml(preset.label)}"
      >
        <span></span>
        ${escapeHtml(preset.label)}
      </button>
    `,
  ).join('');

  const fontOptions = FONT_OPTIONS.map(
    (option) => `
      <label class="builder-font-option">
        <input type="radio" name="font-family" value="${option.id}" ${state.design.fontFamily === option.id ? 'checked' : ''} />
        <span>${escapeHtml(option.label)}</span>
      </label>
    `,
  ).join('');

  const buttonOptions = BUTTON_STYLE_OPTIONS.map(
    (option) => `
      <label class="builder-font-option builder-button-style-option">
        <input type="radio" name="button-style" value="${option.id}" ${state.design.buttonStyle === option.id ? 'checked' : ''} />
        <span>${escapeHtml(option.label)}</span>
      </label>
    `,
  ).join('');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-2-title">
      <h2 id="step-2-title">Stap 2 — Huisstijl</h2>
      <p class="builder-hint">Upload uw logo en kies kleuren, lettertype en knopstijl voor een professionele uitstraling.</p>
      ${fileWarning ? `<p class="builder-warning" role="status">${escapeHtml(fileWarning)}</p>` : ''}
      <div class="builder-form">
        <fieldset class="builder-fieldset">
          <legend>Logo *</legend>
          <label for="builder-logo">Logo uploaden (JPG, PNG of WebP — max. 5 MB)
            <input id="builder-logo" name="builder-logo" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>
          ${fieldError(errors, 'logo')}
          ${files.logoUrl ? `<div class="builder-logo-preview"><img src="${files.logoUrl}" alt="Logo preview" /></div>` : ''}
        </fieldset>

        <fieldset class="builder-fieldset">
          <legend>Afbeeldingen</legend>
          <p class="builder-hint">Upload een hero-afbeelding voor bovenaan uw homepage en tot vijf bedrijfsfoto’s voor de galerij.</p>

          <div class="builder-media-block">
            <h3 class="builder-media-block__title">Hero-afbeelding (optioneel)</h3>
            <label for="builder-hero">Hero uploaden
              <input id="builder-hero" name="builder-hero" type="file" accept="image/jpeg,image/png,image/webp" />
            </label>
            ${files.heroUrl ? `
              <div class="builder-photo-card">
                <img src="${files.heroUrl}" alt="Hero preview" />
                <div class="builder-photo-card__actions">
                  <label class="btn btn-secondary btn-sm">Vervangen<input type="file" accept="image/jpeg,image/png,image/webp" id="builder-hero-replace" hidden /></label>
                  <button type="button" class="builder-text-btn" data-remove-hero>Verwijderen</button>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="builder-media-block">
            <h3 class="builder-media-block__title">Bedrijfsfoto’s (max. 5)</h3>
            ${fieldError(errors, 'photos')}
            <div class="builder-photo-grid">
              ${files.photoUrls
                .map(
                  (url, index) => `
                <div class="builder-photo-card">
                  <img src="${url}" alt="Bedrijfsfoto ${index + 1}" />
                  <div class="builder-photo-card__actions">
                    <label class="btn btn-secondary btn-sm">Vervangen
                      <input type="file" accept="image/jpeg,image/png,image/webp" data-replace-photo="${index}" hidden />
                    </label>
                    <button type="button" class="builder-text-btn" data-remove-photo="${index}">Verwijderen</button>
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
            ${
              files.photoUrls.length < 5
                ? `<label class="btn btn-secondary btn-sm builder-photo-add">Foto toevoegen<input id="builder-photos-add" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden /></label>`
                : ''
            }
          </div>
        </fieldset>

        <fieldset class="builder-fieldset">
          <legend>Kleuren</legend>
          <div class="builder-color-presets">${presets}</div>
          <div class="builder-form-grid">
            <label for="primary-color">Hoofdkleur *
              <input id="primary-color" name="primary-color" type="color" value="${state.branding.primaryColor}" />
            </label>
            <label for="accent-color">Accentkleur *
              <input id="accent-color" name="accent-color" type="color" value="${state.branding.accentColor}" />
            </label>
          </div>
          ${fieldError(errors, 'primaryColor')}
          ${fieldError(errors, 'accentColor')}
        </fieldset>

        <fieldset class="builder-fieldset">
          <legend>Lettertype *</legend>
          <div class="builder-font-options">${fontOptions}</div>
          ${fieldError(errors, 'fontFamily')}
        </fieldset>

        <fieldset class="builder-fieldset">
          <legend>Knopstijl *</legend>
          <div class="builder-font-options">${buttonOptions}</div>
          ${fieldError(errors, 'buttonStyle')}
        </fieldset>
      </div>
    </section>
  `;
}

/** Stap 3 — Pagina's */
export function renderStep3(state: BuilderState, errors: Record<string, string>): string {
  const cards = PAGE_DEFINITIONS.map((page) => {
    const checked = state.enabledPages[page.id];
    const disabled = page.id === 'home';
    return `
      <label class="builder-page-card ${checked ? 'is-enabled' : ''} ${disabled ? 'is-required' : ''}">
        <input
          type="checkbox"
          name="page-enabled-${page.id}"
          data-page-toggle="${page.id}"
          ${checked ? 'checked' : ''}
          ${disabled ? 'checked disabled' : ''}
        />
        <span class="builder-page-card__body">
          <strong>${escapeHtml(page.label)}</strong>
          <small>${escapeHtml(page.description)}</small>
          ${disabled ? '<em class="builder-page-card__badge">Verplicht</em>' : ''}
        </span>
      </label>
    `;
  }).join('');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-3-title">
      <h2 id="step-3-title">Stap 3 — Pagina's</h2>
      <p class="builder-hint">Kies welke pagina's op uw website komen. Home is altijd aanwezig.</p>
      <div class="builder-form">
        ${fieldError(errors, 'pages')}
        <div class="builder-page-grid">${cards}</div>
      </div>
    </section>
  `;
}

/** Stap 4 — Diensten */
export function renderStep4(state: BuilderState, errors: Record<string, string>): string {
  const servicesHtml = state.business.services
    .map(
      (service, index) => `
        <div class="builder-service" data-service-index="${index}">
          <div class="builder-service__toolbar">
            <span class="builder-service__order">#${index + 1}</span>
            <div class="builder-service__sort">
              <button type="button" class="builder-icon-btn" data-move-service-up="${index}" aria-label="Omhoog" ${index === 0 ? 'disabled' : ''}>↑</button>
              <button type="button" class="builder-icon-btn" data-move-service-down="${index}" aria-label="Omlaag" ${index === state.business.services.length - 1 ? 'disabled' : ''}>↓</button>
            </div>
          </div>
          <label>Naam dienst *
            <input type="text" name="service-title-${index}" value="${escapeHtml(service.title)}" placeholder="Bijv. Consultancy" required />
          </label>
          <label>Korte omschrijving (optioneel)
            <textarea name="service-description-${index}" rows="2" placeholder="Korte toelichting">${escapeHtml(service.description)}</textarea>
          </label>
          ${
            state.business.services.length > 1
              ? `<button type="button" class="builder-text-btn" data-remove-service="${index}">Dienst verwijderen</button>`
              : ''
          }
        </div>
      `,
    )
    .join('');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-4-title">
      <h2 id="step-4-title">Stap 4 — Diensten</h2>
      <p class="builder-hint">Voeg diensten toe, verwijder ze of wijzig de volgorde met de pijltjes.</p>
      <div class="builder-form">
        <fieldset class="builder-fieldset">
          <legend>Diensten *</legend>
          ${fieldError(errors, 'services')}
          <div class="builder-services">${servicesHtml}</div>
          <button type="button" class="btn btn-secondary" data-add-service>Dienst toevoegen</button>
        </fieldset>
      </div>
    </section>
  `;
}

/** Stap 5 — Openingstijden */
export function renderStep5(state: BuilderState): string {
  const hoursHtml = state.hours
    .map((day, index) => {
      const disabled = day.closed || day.open24;
      return `
        <div class="builder-hours-row" data-hours-index="${index}">
          <strong>${escapeHtml(day.day)}</strong>
          <label class="builder-checkbox">
            <input type="checkbox" name="hours-closed-${index}" data-hours-closed="${index}" ${day.closed ? 'checked' : ''} />
            Gesloten
          </label>
          <label class="builder-checkbox">
            <input type="checkbox" name="hours-open24-${index}" data-hours-open24="${index}" ${day.open24 ? 'checked' : ''} ${day.closed ? 'disabled' : ''} />
            24 uur
          </label>
          <label>Open
            <input type="time" name="hours-open-${index}" data-hours-open="${index}" value="${day.openTime}" ${disabled ? 'disabled' : ''} />
          </label>
          <label>Sluit
            <input type="time" name="hours-close-${index}" data-hours-close="${index}" value="${day.closeTime}" ${disabled ? 'disabled' : ''} />
          </label>
        </div>
      `;
    })
    .join('');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-5-title">
      <h2 id="step-5-title">Stap 5 — Openingstijden</h2>
      <p class="builder-hint">Stel uw openingstijden per dag in. Kopieer werkdagen in één klik.</p>
      <div class="builder-form">
        <button type="button" class="btn btn-secondary btn-sm" data-copy-workday-hours>Werkdagen kopiëren (ma–vr)</button>
        <div class="builder-hours">${hoursHtml}</div>
      </div>
    </section>
  `;
}

/** Stap 6 — SEO */
export function renderStep6(
  state: BuilderState,
  files: BuilderFiles,
  errors: Record<string, string>,
): string {
  const copy = generateCopy(state);
  const seoTitleLen = state.heroTitle.length;
  const metaLen = state.seoMetaDescription.length;

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-6-title">
      <h2 id="step-6-title">Stap 6 — SEO</h2>
      <p class="builder-hint">Optimaliseer hoe uw website verschijnt in Google en op social media.</p>
      <div class="builder-form">
        <label for="seo-title">SEO-titel *
          <input id="seo-title" name="seo-title" type="text" value="${escapeHtml(state.heroTitle)}" placeholder="${escapeHtml(copy.seoTitle)}" maxlength="70" aria-describedby="seo-title-hint ${errors.seoTitle ? 'error-seoTitle' : ''}" />
        </label>
        <p id="seo-title-hint" class="builder-char-count ${seoTitleLen > 70 ? 'is-over' : ''}">${seoTitleLen}/70 tekens</p>
        ${fieldError(errors, 'seoTitle')}

        <label for="seo-meta-description">Meta description *
          <textarea id="seo-meta-description" name="seo-meta-description" rows="3" maxlength="160" placeholder="Korte beschrijving voor zoekmachines…" aria-describedby="seo-meta-hint ${errors.seoMetaDescription ? 'error-seoMetaDescription' : ''}">${escapeHtml(state.seoMetaDescription)}</textarea>
        </label>
        <p id="seo-meta-hint" class="builder-char-count ${metaLen > 160 ? 'is-over' : ''}">${metaLen}/160 tekens</p>
        ${fieldError(errors, 'seoMetaDescription')}

        <label for="business-description">Bedrijfsomschrijving *
          <textarea id="business-description" name="business-description" rows="4" placeholder="Beschrijf uw bedrijf in 2–3 zinnen…" aria-describedby="${errors.businessDescription ? 'error-businessDescription' : ''}">${escapeHtml(state.business.description)}</textarea>
        </label>
        ${fieldError(errors, 'businessDescription')}

        <fieldset class="builder-fieldset">
          <legend>Social image (optioneel)</legend>
          ${fieldError(errors, 'socialImage')}
          <p class="builder-hint">Afbeelding voor Facebook, LinkedIn en WhatsApp (1200×630 px aanbevolen).</p>
          <label for="builder-social-image">Afbeelding uploaden
            <input id="builder-social-image" name="builder-social-image" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>
          ${files.socialImageUrl ? `<div class="builder-logo-preview builder-social-preview"><img src="${files.socialImageUrl}" alt="Social preview" /></div>` : ''}
        </fieldset>

        <aside class="builder-seo-preview" aria-label="SEO-voorbeeld">
          <h3>Zoekresultaat-voorbeeld</h3>
          <p class="builder-seo-preview__title">${escapeHtml(state.heroTitle.trim() || copy.seoTitle)}</p>
          <p class="builder-seo-preview__url">${escapeHtml(copy.canonicalUrl)}</p>
          <p class="builder-seo-preview__desc">${escapeHtml(state.seoMetaDescription.trim() || copy.seoDescription)}</p>
        </aside>
      </div>
    </section>
  `;
}

/** Stap 7 — Voorbeeld */
export function renderStep7(
  state: BuilderState,
  errors: Record<string, string> = {},
  generateBanner?: { pageCount: number; domain: string } | null,
): string {
  const banner = generateBanner
    ? `
      <div class="builder-generate-banner" role="status">
        <strong>Website gegenereerd</strong>
        <p>${generateBanner.pageCount} pagina's op ${escapeHtml(generateBanner.domain)} — preview rechts is bijgewerkt.</p>
      </div>
    `
    : '';

  return `
    <section class="builder-step builder-step--animate builder-step--preview" aria-labelledby="step-7-title">
      <h2 id="step-7-title">Stap 7 — Voorbeeld</h2>
      ${banner}
      <p class="builder-hint">Bekijk uw website live rechts. Wissel tussen pagina's met de tabs. Alles wordt automatisch bijgewerkt.</p>
      <div class="builder-preview-hint">
        <p>Tip: klik op menu-items in de preview om te navigeren. Gebruik de pagina-tabs rechts om snel te wisselen.</p>
      </div>
      <div class="builder-generate-actions">
        ${fieldError(errors, 'generate')}
        <button type="button" class="btn btn-primary" data-generate-website>Website genereren</button>
        <p class="builder-hint">Genereer automatisch alle pagina's, menu, footer en SEO op basis van uw gegevens.</p>
      </div>
    </section>
  `;
}

/** Stap 8 — Afronden */
export function renderStep8(state: BuilderState, files: BuilderFiles, errors: Record<string, string> = {}): string {
  const copy = generateCopy(state);
  const services = state.business.services
    .filter((service) => service.title.trim())
    .map((service) => service.title)
    .join(', ');

  const enabledPageLabels = PAGE_DEFINITIONS.filter((page) => state.enabledPages[page.id])
    .map((page) => page.label)
    .join(', ');

  const hoursSummary = state.hours
    .map((day) => `${day.day}: ${formatHoursLine(day)}`)
    .join(' · ');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="step-8-title">
      <h2 id="step-8-title">Stap 8 — Afronden</h2>
      <p class="builder-hint">Controleer alle gegevens. Sla op als concept — live publicatie volgt later.</p>
      <div class="builder-review">
        ${reviewBlock('Bedrijfsnaam', state.business.name, 1)}
        ${reviewBlock('Website-adres', futureDomain(state), 1)}
        ${reviewBlock('Categorie', state.business.industry, 1)}
        ${reviewBlock('Telefoon', state.contact.phone || '—', 1)}
        ${reviewBlock('E-mail', state.contact.email, 1)}
        ${reviewBlock('Website', state.contact.website || '—', 1)}
        ${reviewBlock('Adres', formatAddress(state) || '—', 1)}
        ${reviewBlock('Logo', files.logoName || state.branding.logoName || '—', 2)}
        ${reviewBlock('Hero-afbeelding', files.heroName || state.branding.heroImageName || '—', 2)}
        ${reviewBlock('Bedrijfsfoto’s', files.photoNames.length ? `${files.photoNames.length} foto('s)` : state.branding.photoNames.length ? `${state.branding.photoNames.length} foto('s)` : '—', 2)}
        ${reviewBlock('Hoofdkleur', state.branding.primaryColor, 2)}
        ${reviewBlock('Accentkleur', state.branding.accentColor, 2)}
        ${reviewBlock('Lettertype', fontLabel(state.design.fontFamily), 2)}
        ${reviewBlock('Knopstijl', buttonStyleLabel(state.design.buttonStyle), 2)}
        ${reviewBlock("Pagina's", enabledPageLabels || '—', 3)}
        ${reviewBlock('Diensten', services || '—', 4)}
        ${reviewBlock('Openingstijden', hoursSummary, 5)}
        ${reviewBlock('SEO-titel', state.heroTitle || copy.seoTitle, 6)}
        ${reviewBlock('Meta description', state.seoMetaDescription || copy.seoDescription, 6)}
        ${reviewBlock('Bedrijfsomschrijving', state.business.description || '—', 6)}
        ${reviewBlock('Social image', files.socialImageName || state.branding.socialImageName || '—', 6)}
      </div>

      <div class="builder-summary-actions">
        ${fieldError(errors, 'save')}
        ${fieldError(errors, 'generate')}
        <button type="button" class="btn btn-primary" data-generate-website>Website genereren</button>
        <button type="button" class="btn btn-secondary" data-save-website>Opslaan als concept</button>
        <p class="builder-hint">Genereer eerst uw complete website, of sla op als concept om later verder te gaan in het dashboard.</p>
      </div>
    </section>
  `;
}

function reviewBlock(label: string, value: string, step: number): string {
  return `
    <article class="builder-review__item">
      <div>
        <h3>${escapeHtml(label)}</h3>
        <p>${escapeHtml(value)}</p>
      </div>
      <button type="button" class="builder-text-btn" data-go-step="${step}">Wijzigen</button>
    </article>
  `;
}
