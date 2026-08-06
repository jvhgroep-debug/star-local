import type { WizardV2State } from '../../types/wizard-v2';
import { FONT_OPTIONS, WIZARD_V2_COLOR_PRESETS, WIZARD_V2_STEP_LABELS } from './constants';
import type { WizardResolvedMedia } from './media';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fieldError(errors: Record<string, string>, key: string): string {
  if (!errors[key]) return '';
  return `<p class="builder-error" id="error-${key}" role="alert">${escapeHtml(errors[key])}</p>`;
}

function inputErrorState(errors: Record<string, string>, key: string): string {
  return errors[key] ? ' aria-invalid="true" class="has-error"' : '';
}

export function renderWizardProgress(currentStep: number): string {
  return `
    <ol class="builder-progress" aria-label="Voortgang">
      ${WIZARD_V2_STEP_LABELS.map((label, index) => {
        const step = index + 1;
        const status = step < currentStep ? 'is-done' : step === currentStep ? 'is-current' : '';
        return `<li class="builder-progress__item ${status}"><span>${step}</span><small>${label}</small></li>`;
      }).join('')}
    </ol>
  `;
}

export function renderWizardStep1(state: WizardV2State, errors: Record<string, string>): string {
  return `
    <section class="builder-step builder-step--animate" aria-labelledby="wizard-step-1">
      <h2 id="wizard-step-1">Stap 1 — Bedrijfsgegevens</h2>
      <p class="builder-hint">Vul uw bedrijfsgegevens in. Rechts ziet u direct een live preview.</p>
      <div class="builder-form">
        <label for="wizard-business-name">Bedrijfsnaam *
          <input id="wizard-business-name" type="text" value="${escapeHtml(state.businessName)}" autocomplete="organization"${inputErrorState(errors, 'businessName')} />
        </label>
        ${fieldError(errors, 'businessName')}

        <div class="builder-industry-picker">
          <label for="wizard-industry-search">Branche *</label>
          <input type="hidden" id="wizard-industry" value="${escapeHtml(state.industry)}" />
          <input
            id="wizard-industry-search"
            type="search"
            value="${escapeHtml(state.industry)}"
            placeholder="Zoek uw branche…"
            autocomplete="off"
            role="combobox"
            aria-expanded="false"
            aria-controls="wizard-industry-options"${inputErrorState(errors, 'industry')}
          />
          <ul id="wizard-industry-options" class="builder-industry-list" role="listbox" hidden></ul>
        </div>
        ${fieldError(errors, 'industry')}

        <label for="wizard-description">Korte omschrijving *
          <textarea id="wizard-description" rows="3" placeholder="Beschrijf uw bedrijf in 2–3 zinnen…"${inputErrorState(errors, 'description')}>${escapeHtml(state.description)}</textarea>
        </label>
        ${fieldError(errors, 'description')}

        <div class="builder-form-grid">
          <label for="wizard-phone">Telefoon
            <input id="wizard-phone" type="tel" value="${escapeHtml(state.phone)}" autocomplete="tel"${inputErrorState(errors, 'phone')} />
          </label>
          <label for="wizard-whatsapp">WhatsApp
            <input id="wizard-whatsapp" type="tel" value="${escapeHtml(state.whatsapp)}" autocomplete="tel" />
          </label>
        </div>
        ${fieldError(errors, 'phone')}

        <div class="builder-form-grid">
          <label for="wizard-email">E-mail *
            <input id="wizard-email" type="email" value="${escapeHtml(state.email)}" autocomplete="email"${inputErrorState(errors, 'email')} />
          </label>
          <label for="wizard-website">Website (optioneel)
            <input id="wizard-website" type="url" value="${escapeHtml(state.website)}" placeholder="www.uwbedrijf.nl"${inputErrorState(errors, 'website')} />
          </label>
        </div>
        ${fieldError(errors, 'email')}
        ${fieldError(errors, 'website')}

        <label for="wizard-street">Adres *
          <input id="wizard-street" type="text" value="${escapeHtml(state.street)}" autocomplete="street-address"${inputErrorState(errors, 'street')} />
        </label>
        ${fieldError(errors, 'street')}

        <div class="builder-form-grid">
          <label for="wizard-postcode">Postcode
            <input id="wizard-postcode" type="text" value="${escapeHtml(state.postcode)}" autocomplete="postal-code" />
          </label>
          <label for="wizard-city">Plaats *
            <input id="wizard-city" type="text" value="${escapeHtml(state.city)}" autocomplete="address-level2"${inputErrorState(errors, 'city')} />
          </label>
        </div>
        ${fieldError(errors, 'city')}
      </div>
    </section>
  `;
}

export function renderWizardStep2(state: WizardV2State, errors: Record<string, string>): string {
  const hoursHtml = state.hours
    .map((day, index) => {
      const disabled = day.closed || day.open24;
      return `
        <div class="builder-hours-row" data-wizard-hours-index="${index}">
          <strong>${escapeHtml(day.day)}</strong>
          <label class="builder-checkbox">
            <input type="checkbox" data-wizard-hours-closed="${index}" ${day.closed ? 'checked' : ''} />
            Gesloten
          </label>
          <label class="builder-checkbox">
            <input type="checkbox" data-wizard-hours-open24="${index}" ${day.open24 ? 'checked' : ''} ${day.closed ? 'disabled' : ''} />
            24 uur
          </label>
          <label>Open
            <input type="time" data-wizard-hours-open="${index}" value="${day.openTime}" ${disabled ? 'disabled' : ''} />
          </label>
          <label>Sluit
            <input type="time" data-wizard-hours-close="${index}" value="${day.closeTime}" ${disabled ? 'disabled' : ''} />
          </label>
        </div>
      `;
    })
    .join('');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="wizard-step-2">
      <h2 id="wizard-step-2">Stap 2 — Openingstijden & social media</h2>
      <p class="builder-hint">Stel uw openingstijden en social media-links in (optioneel).</p>
      <div class="builder-form">
        <fieldset class="builder-fieldset">
          <legend>Openingstijden</legend>
          <div class="builder-hours">${hoursHtml}</div>
          <button type="button" class="btn btn-secondary btn-sm" data-wizard-copy-weekdays>Ma–vr kopiëren</button>
        </fieldset>

        <fieldset class="builder-fieldset">
          <legend>Social media (optioneel)</legend>
          <label for="wizard-facebook">Facebook
            <input id="wizard-facebook" type="url" value="${escapeHtml(state.social.facebook)}" placeholder="https://facebook.com/uwbedrijf"${inputErrorState(errors, 'facebook')} />
          </label>
          ${fieldError(errors, 'facebook')}
          <label for="wizard-instagram">Instagram
            <input id="wizard-instagram" type="url" value="${escapeHtml(state.social.instagram)}" placeholder="https://instagram.com/uwbedrijf"${inputErrorState(errors, 'instagram')} />
          </label>
          ${fieldError(errors, 'instagram')}
          <label for="wizard-linkedin">LinkedIn
            <input id="wizard-linkedin" type="url" value="${escapeHtml(state.social.linkedin)}" placeholder="https://linkedin.com/company/uwbedrijf"${inputErrorState(errors, 'linkedin')} />
          </label>
          ${fieldError(errors, 'linkedin')}
        </fieldset>
      </div>
    </section>
  `;
}

export function renderWizardStep3(
  state: WizardV2State,
  media: WizardResolvedMedia,
  errors: Record<string, string>,
): string {
  const presets = WIZARD_V2_COLOR_PRESETS.map(
    (preset) => `
      <button
        type="button"
        class="builder-color-preset"
        data-wizard-color-preset="${preset.id}"
        style="--preset-primary:${preset.primaryColor};--preset-accent:${preset.accentColor};"
      >
        <span></span>${escapeHtml(preset.label)}
      </button>
    `,
  ).join('');

  const fontOptions = FONT_OPTIONS.map(
    (option) => `
      <label class="builder-font-option">
        <input type="radio" name="wizard-font-family" value="${option.id}" ${state.fontFamily === option.id ? 'checked' : ''} />
        <span>${escapeHtml(option.label)}</span>
      </label>
    `,
  ).join('');

  const galleryHtml = media.gallery
    .map(
      (item) => `
        <figure class="wizard-v2-placeholder-card">
          <img src="${item.url}" alt="${escapeHtml(item.label)}" loading="lazy" />
          <figcaption>${escapeHtml(item.label)}</figcaption>
        </figure>
      `,
    )
    .join('');

  return `
    <section class="builder-step builder-step--animate" aria-labelledby="wizard-step-3">
      <h2 id="wizard-step-3">Stap 3 — Huisstijl</h2>
      <p class="builder-hint">Kies kleuren en lettertype. Afbeeldingen zijn tijdelijk placeholders — upload komt later.</p>
      <div class="builder-form">
        <fieldset class="builder-fieldset">
          <legend>Primaire kleur *</legend>
          <div class="builder-color-presets">${presets}</div>
          <label for="wizard-primary-color">Hoofdkleur
            <input id="wizard-primary-color" type="color" value="${state.primaryColor}"${inputErrorState(errors, 'primaryColor')} />
          </label>
          ${fieldError(errors, 'primaryColor')}
        </fieldset>

        <fieldset class="builder-fieldset">
          <legend>Lettertype *</legend>
          <div class="builder-font-options">${fontOptions}</div>
          ${fieldError(errors, 'fontFamily')}
        </fieldset>

        <fieldset class="builder-fieldset wizard-v2-media-placeholders">
          <legend>Afbeeldingen (placeholders)</legend>
          <p class="builder-hint">Logo, hero en galerij gebruiken tijdelijke voorbeeldafbeeldingen. Later kunt u eigen foto's uploaden via R2.</p>
          <div class="wizard-v2-media-grid">
            <figure class="wizard-v2-placeholder-card">
              <img src="${media.logo.url}" alt="${escapeHtml(media.logo.label)}" loading="lazy" />
              <figcaption>Logo placeholder</figcaption>
            </figure>
            <figure class="wizard-v2-placeholder-card wizard-v2-placeholder-card--wide">
              <img src="${media.hero.url}" alt="${escapeHtml(media.hero.label)}" loading="lazy" />
              <figcaption>Hero-afbeelding placeholder</figcaption>
            </figure>
          </div>
          <div class="wizard-v2-gallery-grid">${galleryHtml}</div>
        </fieldset>
      </div>
    </section>
  `;
}

export function renderWizardComplete(state: WizardV2State, saveMessage: string | null, saveError: string | null): string {
  return `
    <section class="builder-step builder-step--animate" aria-labelledby="wizard-complete">
      <h2 id="wizard-complete">Wizard voltooid</h2>
      <p class="builder-hint">Sla uw website op als concept of dien direct in voor admin-goedkeuring.</p>
      ${saveError ? `<p class="builder-error" role="alert">${escapeHtml(saveError)}</p>` : ''}
      ${saveMessage ? `<p class="builder-success" role="status">${escapeHtml(saveMessage)}</p>` : ''}
      <div class="builder-review-grid">
        <div><strong>Bedrijf</strong><p>${escapeHtml(state.businessName || '—')}</p></div>
        <div><strong>Branche</strong><p>${escapeHtml(state.industry || '—')}</p></div>
        <div><strong>Plaats</strong><p>${escapeHtml(state.city || '—')}</p></div>
        <div><strong>E-mail</strong><p>${escapeHtml(state.email || '—')}</p></div>
      </div>
      <div class="builder-footer builder-footer--stack">
        <button type="button" class="btn btn-secondary" data-wizard-save-concept>Opslaan als concept</button>
        <button type="button" class="btn btn-primary" data-wizard-submit-review>Indienen voor review</button>
      </div>
    </section>
  `;
}
