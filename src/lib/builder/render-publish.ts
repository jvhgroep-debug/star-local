import type { BuilderState } from '../../types/builder';
import type { PreparedWebsite } from '../../types/website-config';
import { getSlugPreview } from './slug';
import {
  PUBLICATION_STATUS_LABELS,
  WEBSITE_PACKAGE_LABELS,
  publicationStatusBadgeClass,
} from './publish/status';

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

export function renderPublishForm(state: BuilderState, errors: Record<string, string>): string {
  const email = state.contact.email.trim();
  const slug = getSlugPreview(state.business.name);
  const siteUrl = `https://${slug.domain}`;

  return `
    <div class="builder-preview-shell">
      <div class="builder-preview-bar" role="region" aria-label="Publicatie">
        <p class="builder-preview-bar__label">Website publiceren</p>
        <div class="builder-preview-bar__actions">
          <button type="button" class="btn btn-secondary" data-back-to-preview>← Terug naar preview</button>
        </div>
      </div>

      <section class="builder-publish-form" aria-labelledby="publish-form-title">
        <h2 id="publish-form-title">Uw website klaarzetten voor publicatie</h2>
        <p class="builder-lead">Controleer uw gegevens. Na bevestiging bereiden wij uw website technisch voor op <strong>${escapeHtml(state.business.name || 'uw bedrijf')}</strong>.</p>

        <div class="builder-publish-summary">
          <dl>
            <div><dt>Bedrijfsnaam</dt><dd>${escapeHtml(state.business.name)}</dd></div>
            <div><dt>Website-adres</dt><dd>${escapeHtml(siteUrl)}</dd></div>
          </dl>
        </div>

        <fieldset class="builder-package-picker">
          <legend>Kies uw pakket</legend>
          <label class="builder-package-option">
            <input type="radio" name="website-package" value="free" ${state.selectedPackage === 'free' ? 'checked' : ''} />
            <span>
              <strong>Gratis</strong>
              <small>Subdomein op starlocal.nl — ${escapeHtml(slug.domain)}</small>
            </span>
          </label>
          <label class="builder-package-option builder-package-option--muted">
            <input type="radio" name="website-package" value="premium" disabled />
            <span>
              <strong>Premium</strong>
              <small>Eigen domein — beschikbaar in een volgende stap</small>
            </span>
          </label>
        </fieldset>

        <label for="publish-email-confirm">Bevestig uw e-mailadres *
          <input
            id="publish-email-confirm"
            name="publish-email-confirm"
            type="email"
            value="${escapeHtml(state.publishEmailConfirmed || email)}"
            autocomplete="email"
            placeholder="${escapeHtml(email)}"
            aria-describedby="${errors.publishEmail ? 'error-publishEmail' : ''}"
          />
        </label>
        ${fieldError(errors, 'publishEmail')}

        <p class="builder-publish-form__note">Nog geen echte DNS-koppeling of hosting. Uw website wordt lokaal voorbereid alsof deze gepubliceerd wordt.</p>

        <div class="builder-publish-actions">
          <button type="button" class="btn btn-primary" data-confirm-publish>Website publiceren</button>
          <button type="button" class="btn btn-secondary" data-back-to-preview>Annuleren</button>
        </div>
      </section>
    </div>
  `;
}

export function renderPublishSuccess(state: BuilderState, prepared: PreparedWebsite): string {
  const config = prepared.config;
  const status = config.status;
  const statusLabel = PUBLICATION_STATUS_LABELS[status];
  const packageLabel = WEBSITE_PACKAGE_LABELS[config.package];

  return `
    <div class="builder-preview-shell">
      <div class="builder-preview-bar" role="region" aria-label="Publicatie voltooid">
        <p class="builder-preview-bar__label">Publicatie voorbereid</p>
      </div>

      <section class="builder-publish-success" aria-labelledby="publish-success-title">
        <div class="builder-publish-success__icon" aria-hidden="true">✓</div>
        <h2 id="publish-success-title">Uw website is klaar voor publicatie</h2>
        <p class="builder-publish-success__intro">Wij hebben uw website technisch samengesteld. Het webadres wordt geactiveerd zodra de productie-koppeling live gaat.</p>

        <dl class="builder-publish-success__summary">
          <div>
            <dt>Bedrijfsnaam</dt>
            <dd>${escapeHtml(config.business.name)}</dd>
          </div>
          <div>
            <dt>Toekomstig webadres</dt>
            <dd><a class="builder-publish-success__domain" href="${escapeHtml(config.slug.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(config.slug.url)}</a></dd>
          </div>
          <div>
            <dt>Gekozen pakket</dt>
            <dd>${escapeHtml(packageLabel)}</dd>
          </div>
          <div>
            <dt>E-mailadres</dt>
            <dd>${escapeHtml(config.publishEmail)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd><span class="builder-status-badge ${publicationStatusBadgeClass(status)}">${escapeHtml(statusLabel)}</span></dd>
          </div>
        </dl>

        <p class="builder-publish-success__note">Nog geen productie-publicatie. DNS en hosting worden in een volgende stap gekoppeld.</p>

        <div class="builder-publish-actions builder-publish-actions--center">
          <button type="button" class="btn btn-primary" data-view-published-site>Website bekijken</button>
          <button type="button" class="btn btn-secondary" data-edit-published-data>Gegevens wijzigen</button>
        </div>
      </section>
    </div>
  `;
}
