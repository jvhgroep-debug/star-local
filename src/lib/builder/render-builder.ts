import type { BuilderState } from '../../types/builder';
import { COLOR_PRESETS, DAY_DEFINITIONS, WORKDAY_KEYS } from './constants';
import { formatSlugPreviewHtml, getSlugPreview } from './slug';
import { formatAddress, formatHoursLine, futureDomain, generateCopy } from './templates';
import type { BuilderFiles } from './files';
import { renderPremiumUpsellNotice } from './packages';

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

export function renderProgress(currentStep: number): string {
  const labels = ['Bedrijf', 'Contact', 'Openingstijden', 'Logo & kleuren', 'Controleren'];
  return `
    <ol class="builder-progress" aria-label="Voortgang">
      ${labels
        .map(
          (label, index) => {
            const step = index + 1;
            const status =
              step < currentStep ? 'is-done' : step === currentStep ? 'is-current' : '';
            return `<li class="builder-progress__item ${status}"><span>${step}</span><small>${label}</small></li>`;
          },
        )
        .join('')}
    </ol>
  `;
}

export function renderStep1(state: BuilderState, errors: Record<string, string>): string {
  const slug = getSlugPreview(state.business.name);
  const slugHtml = formatSlugPreviewHtml(slug);

  const servicesHtml = state.business.services
    .map(
      (service, index) => `
        <div class="builder-service" data-service-index="${index}">
          <label>Titel dienst *
            <input type="text" name="service-title-${index}" value="${escapeHtml(service.title)}" required />
          </label>
          <label>Korte omschrijving (optioneel)
            <textarea name="service-description-${index}" rows="2">${escapeHtml(service.description)}</textarea>
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
    <section class="builder-step" aria-labelledby="step-1-title">
      <h2 id="step-1-title">Stap 1 — Bedrijf</h2>
      <div class="builder-form">
        <label for="business-name">Bedrijfsnaam *
          <input id="business-name" name="business-name" type="text" value="${escapeHtml(state.business.name)}" placeholder="Uw bedrijfsnaam" autocomplete="organization" required aria-describedby="slug-preview ${errors.name ? 'error-name' : ''}" />
        </label>
        ${fieldError(errors, 'name')}

        <div id="slug-preview">${slugHtml}</div>

        <div class="builder-industry-picker">
          <label for="industry-search">Branche *</label>
          <input type="hidden" id="business-industry" name="business-industry" value="${escapeHtml(state.business.industry)}" />
          <input
            id="industry-search"
            type="search"
            value="${escapeHtml(state.business.industry)}"
            placeholder="Uw branche"
            autocomplete="off"
            role="combobox"
            aria-expanded="false"
            aria-controls="industry-options"
            aria-describedby="${errors.industry ? 'error-industry' : ''}"
          />
          <ul id="industry-options" class="builder-industry-list" role="listbox" hidden></ul>
        </div>
        ${fieldError(errors, 'industry')}

        <label for="business-description">Korte omschrijving *
          <textarea id="business-description" name="business-description" rows="4" placeholder="Beschrijf kort uw bedrijf" required aria-describedby="${errors.description ? 'error-description' : ''}">${escapeHtml(state.business.description)}</textarea>
        </label>
        ${fieldError(errors, 'description')}

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

export function renderStep2(state: BuilderState, errors: Record<string, string>): string {
  return `
    <section class="builder-step" aria-labelledby="step-2-title">
      <h2 id="step-2-title">Stap 2 — Contact en locatie</h2>
      <div class="builder-form">
        <div class="builder-form-grid">
          <label for="contact-phone">Telefoonnummer
            <input id="contact-phone" name="contact-phone" type="tel" value="${escapeHtml(state.contact.phone)}" autocomplete="tel" aria-describedby="${errors.phone ? 'error-phone' : ''}" />
          </label>
          ${fieldError(errors, 'phone')}

          <label for="contact-whatsapp">WhatsAppnummer
            <input id="contact-whatsapp" name="contact-whatsapp" type="tel" value="${escapeHtml(state.contact.whatsapp)}" aria-describedby="${errors.whatsapp ? 'error-whatsapp' : ''}" />
          </label>
          ${fieldError(errors, 'whatsapp')}
        </div>
        <p class="builder-hint">Telefoon of WhatsApp is verplicht.</p>

        <label for="contact-email">E-mailadres *
          <input id="contact-email" name="contact-email" type="email" value="${escapeHtml(state.contact.email)}" autocomplete="email" required aria-describedby="${errors.email ? 'error-email' : ''}" />
        </label>
        ${fieldError(errors, 'email')}

        <label for="contact-street">Straat en huisnummer
          <input id="contact-street" name="contact-street" type="text" value="${escapeHtml(state.contact.street)}" autocomplete="street-address" />
        </label>

        <div class="builder-form-grid">
          <label for="contact-postcode">Postcode
            <input id="contact-postcode" name="contact-postcode" type="text" value="${escapeHtml(state.contact.postcode)}" autocomplete="postal-code" />
          </label>
          <label for="contact-city">Plaats *
            <input id="contact-city" name="contact-city" type="text" value="${escapeHtml(state.contact.city)}" autocomplete="address-level2" required aria-describedby="${errors.city ? 'error-city' : ''}" />
          </label>
        </div>
        ${fieldError(errors, 'city')}

        <label for="contact-country">Land
          <input id="contact-country" name="contact-country" type="text" value="${escapeHtml(state.contact.country)}" autocomplete="country-name" />
        </label>
      </div>
    </section>
  `;
}

export function renderStep3(state: BuilderState, errors: Record<string, string>): string {
  const rows = state.hours
    .map((day, index) => {
      const disabled = day.closed || day.open24;
      return `
        <div class="builder-hours-row" data-hours-index="${index}">
          <strong>${escapeHtml(day.day)}</strong>
          <label class="builder-checkbox">
            <input type="checkbox" name="hours-closed-${index}" ${day.closed ? 'checked' : ''} />
            Gesloten
          </label>
          <label class="builder-checkbox">
            <input type="checkbox" name="hours-open24-${index}" ${day.open24 ? 'checked' : ''} ${day.closed ? 'disabled' : ''} />
            24 uur geopend
          </label>
          <label>Opening
            <input type="time" name="hours-open-${index}" value="${day.openTime}" ${disabled ? 'disabled' : ''} />
          </label>
          <label>Sluiting
            <input type="time" name="hours-close-${index}" value="${day.closeTime}" ${disabled ? 'disabled' : ''} />
          </label>
          ${errors[`hours-${index}`] ? `<p class="builder-error" role="alert">${escapeHtml(errors[`hours-${index}`])}</p>` : ''}
        </div>
      `;
    })
    .join('');

  return `
    <section class="builder-step" aria-labelledby="step-3-title">
      <h2 id="step-3-title">Stap 3 — Openingstijden</h2>
      <button type="button" class="btn btn-secondary" data-copy-workday-hours>Gebruik dezelfde tijden voor alle werkdagen</button>
      <div class="builder-hours">${rows}</div>
    </section>
  `;
}

export function renderStep4(
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

  const photos = files.photoUrls
    .map(
      (url, index) => `
        <li class="builder-photo" data-photo-index="${index}">
          <img src="${url}" alt="Foto ${index + 1}" />
          <div class="builder-photo__actions">
            ${index === 0 ? '<span class="builder-photo__badge">Hero</span>' : ''}
            <button type="button" data-move-photo-up="${index}" ${index === 0 ? 'disabled' : ''}>Omhoog</button>
            <button type="button" data-move-photo-down="${index}" ${index === files.photoUrls.length - 1 ? 'disabled' : ''}>Omlaag</button>
            <button type="button" data-remove-photo="${index}">Verwijderen</button>
          </div>
        </li>
      `,
    )
    .join('');

  return `
    <section class="builder-step" aria-labelledby="step-4-title">
      <h2 id="step-4-title">Stap 4 — Logo, foto’s en kleuren</h2>
      ${fileWarning ? `<p class="builder-warning" role="status">${escapeHtml(fileWarning)}</p>` : ''}

      <div class="builder-form">
        <label for="builder-logo">Logo * (max. 1 bestand, JPG/PNG/WebP, max. 5 MB)
          <input id="builder-logo" name="builder-logo" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
        ${fieldError(errors, 'logo')}
        ${files.logoUrl ? `<div class="builder-logo-preview"><img src="${files.logoUrl}" alt="Logo preview" /></div>` : ''}

        <label for="builder-photos">Foto’s * (max. 5, JPG/PNG/WebP, max. 5 MB per bestand)
          <input id="builder-photos" name="builder-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple />
        </label>
        ${fieldError(errors, 'photos')}
        <p class="builder-hint">De eerste foto wordt gebruikt als hero-afbeelding.</p>
        ${photos ? `<ul class="builder-photos">${photos}</ul>` : ''}

        <fieldset class="builder-fieldset">
          <legend>Kleuren</legend>
          <div class="builder-color-presets">${presets}</div>
          <div class="builder-form-grid">
            <label for="primary-color">Primaire kleur
              <input id="primary-color" name="primary-color" type="color" value="${state.branding.primaryColor}" />
            </label>
            <label for="accent-color">Accentkleur
              <input id="accent-color" name="accent-color" type="color" value="${state.branding.accentColor}" />
            </label>
          </div>
          ${fieldError(errors, 'primaryColor')}
          ${fieldError(errors, 'accentColor')}
          <p class="builder-hint">Tekstkleur wordt automatisch leesbaar gehouden.</p>
        </fieldset>

        ${renderPremiumUpsellNotice()}
      </div>
    </section>
  `;
}

export function renderStep5(state: BuilderState, files: BuilderFiles): string {
  const copy = generateCopy(state);
  const services = state.business.services
    .filter((service) => service.title.trim())
    .map((service) => service.title)
    .join(', ');
  const statusBadge =
    state.publicationStatus === 'ready_for_publication'
      ? `<p class="builder-review-status"><span class="builder-status-badge builder-status-badge--ready">Klaar voor publicatie</span></p>`
      : '';

  return `
    <section class="builder-step" aria-labelledby="step-5-title">
      <h2 id="step-5-title">Stap 5 — Controleren</h2>
      ${statusBadge}
      <div class="builder-review">
        ${reviewBlock('Bedrijfsnaam', state.business.name, 1)}
        ${reviewBlock('Website-adres', futureDomain(state), 1)}
        ${reviewBlock('Branche', state.business.industry, 1)}
        ${reviewBlock('Omschrijving', state.business.description, 1)}
        ${reviewBlock('Diensten', services, 1)}
        ${reviewBlock('Telefoon', state.contact.phone || '—', 2)}
        ${reviewBlock('WhatsApp', state.contact.whatsapp || '—', 2)}
        ${reviewBlock('E-mail', state.contact.email, 2)}
        ${reviewBlock('Adres', formatAddress(state) || '—', 2)}
        ${reviewBlock('Openingstijden', state.hours.map((day) => `${day.day}: ${formatHoursLine(day)}`).join(' · '), 3)}
        ${reviewBlock('Logo', files.logoName || state.branding.logoName || '—', 4)}
        ${reviewBlock('Foto’s', `${files.photoUrls.length || state.branding.photoNames.length} foto(’s)`, 4)}
        ${reviewBlock('Kleuren', `${state.branding.primaryColor} / ${state.branding.accentColor}`, 4)}
      </div>

      <aside class="builder-seo-preview" aria-label="SEO-voorbeeld">
        <h3>SEO-voorbeeld</h3>
        <p class="builder-seo-preview__title">${escapeHtml(copy.seoTitle)}</p>
        <p class="builder-seo-preview__url">${escapeHtml(copy.canonicalUrl)}</p>
        <p class="builder-seo-preview__desc">${escapeHtml(copy.seoDescription)}</p>
        <p><strong>H1:</strong> ${escapeHtml(copy.h1)}</p>
        <p><strong>Open Graph titel:</strong> ${escapeHtml(copy.ogTitle)}</p>
        <p><strong>Canonical:</strong> ${escapeHtml(copy.canonicalUrl)}</p>
        <p><strong>Lokaal:</strong> ${escapeHtml(copy.localTitle)}</p>
      </aside>

      <div class="builder-final-actions">
        <button type="button" class="btn btn-primary" data-show-preview>Bekijk mijn website</button>
        <button type="button" class="btn btn-secondary" data-edit-data>Gegevens aanpassen</button>
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

export { WORKDAY_KEYS, DAY_DEFINITIONS };
