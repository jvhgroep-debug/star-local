import type { PublishWebsiteResult } from '../../types/publish';
import { AUTH_ROUTES } from '../auth/constants';
import { EDITOR_PATH } from '../editor/constants';
import { WEBSITE_PACKAGE_LABELS } from './publish/status';
import { WEBSITE_STATUS_LABELS } from '../../lib/publish';
import { renderExampleDomainBar } from './generator/template';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface PublishSuccessPreviewOptions {
  previewHtml?: string;
  domain?: string;
  publishEmail?: string;
  magicLinkSent?: boolean;
  generation?: {
    pageCount: number;
    documentPaths: Record<string, string>;
    sitemapPath: string;
    robotsPath: string;
    manifestPath?: string;
    faviconPath?: string;
  };
}

function renderGenerationSummary(generation: PublishSuccessPreviewOptions['generation']): string {
  if (!generation) return '';

  const pageItems = Object.entries(generation.documentPaths)
    .map(([page, path]) => `<li><strong>${escapeHtml(page)}</strong> → <code>${escapeHtml(path)}</code></li>`)
    .join('');

  return `
    <aside class="builder-publish-generated" aria-labelledby="publish-generated-title">
      <h3 id="publish-generated-title">Automatisch gegenereerd en gepubliceerd</h3>
      <ul class="builder-publish-generated__list">
        <li>✓ ${generation.pageCount} HTML-pagina's (Home, Over ons, Diensten, Contact, Privacy)</li>
        <li>✓ Navigatie, footer, SEO, canonical URL's en Open Graph</li>
        <li>✓ <code>${escapeHtml(generation.sitemapPath)}</code></li>
        <li>✓ <code>${escapeHtml(generation.robotsPath)}</code></li>
        ${generation.manifestPath ? `<li>✓ <code>${escapeHtml(generation.manifestPath)}</code></li>` : ''}
        ${generation.faviconPath ? `<li>✓ <code>${escapeHtml(generation.faviconPath)}</code></li>` : ''}
      </ul>
      <details class="builder-publish-generated__details">
        <summary>Bekijk gepubliceerde bestanden</summary>
        <ul>${pageItems}</ul>
      </details>
    </aside>
  `;
}

export function renderPublishSuccessD1(
  result: PublishWebsiteResult,
  preview?: PublishSuccessPreviewOptions,
): string {
  const packageLabel = WEBSITE_PACKAGE_LABELS[result.package];
  const statusLabel = WEBSITE_STATUS_LABELS[result.status];
  const isPublished = result.status === 'published' && result.published;
  const dashboardUrl = `${AUTH_ROUTES.dashboard}?tenantId=${encodeURIComponent(result.tenantId)}`;
  const email = preview?.publishEmail?.trim() || result.publishEmail.trim();
  const checkEmailUrl = `${AUTH_ROUTES.checkEmail}?email=${encodeURIComponent(email.toLowerCase())}`;

  const previewSection = preview?.previewHtml
    ? `
      ${renderExampleDomainBar(preview?.domain ?? result.subdomain)}
      <div class="builder-preview-bar" role="region" aria-label="Gegenereerde website preview">
        <p class="builder-preview-bar__label">Live preview — uw website is gepubliceerd op ${escapeHtml(result.subdomain)}</p>
      </div>
      <div class="builder-preview-frame">${preview.previewHtml}</div>
    `
    : '';

  return `
    <div class="builder-preview-shell">
      <div class="builder-preview-bar" role="region" aria-label="Website gepubliceerd">
        <p class="builder-preview-bar__label">${isPublished ? 'Website live op Star Local' : 'Website opgeslagen'}</p>
      </div>

      <section class="builder-publish-success" aria-labelledby="publish-success-title">
        <div class="builder-publish-success__icon" aria-hidden="true">✓</div>
        <h2 id="publish-success-title">${isPublished ? 'Website succesvol gepubliceerd' : 'Uw website is opgeslagen.'}</h2>
        <p class="builder-publish-success__intro">
          ${
            isPublished
              ? 'Uw website staat live op Star Local. Bezoekers kunnen uw site openen via het subdomein hieronder.'
              : 'Uw gegevens zijn opgeslagen. Live publicatie kon niet worden voltooid.'
          }
        </p>

        <div class="builder-publish-live-url" role="region" aria-label="Live website URL">
          <p class="builder-publish-live-url__label">URL</p>
          <p class="builder-publish-live-url__value">
            <a href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(result.url)}</a>
          </p>
        </div>

        <dl class="builder-publish-success__summary">
          <div>
            <dt>Website-ID</dt>
            <dd><code class="builder-publish-id">${escapeHtml(result.websiteId)}</code></dd>
          </div>
          <div>
            <dt>Subdomein</dt>
            <dd><span class="builder-publish-success__domain">${escapeHtml(result.subdomain)}</span></dd>
          </div>
          <div>
            <dt>Gekozen pakket</dt>
            <dd>${escapeHtml(packageLabel)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd><span class="builder-status-badge ${isPublished ? 'builder-status-badge--published' : 'builder-status-badge--draft'}">${escapeHtml(statusLabel)}</span></dd>
          </div>
          ${
            result.siteObjectCount
              ? `<div><dt>Gepubliceerde bestanden</dt><dd>${result.siteObjectCount}</dd></div>`
              : ''
          }
        </dl>

        ${renderGenerationSummary(preview?.generation)}

        <aside class="builder-publish-next-step">
          <h3>Account activeren</h3>
          <p>
            ${
              preview?.magicLinkSent !== false
                ? `We hebben een beveiligde inloglink gestuurd naar <strong>${escapeHtml(email)}</strong> om uw dashboard te openen.`
                : `Open uw dashboard via de knop hieronder of vraag later opnieuw een inloglink aan voor <strong>${escapeHtml(email)}</strong>.`
            }
          </p>
        </aside>

        <div class="builder-publish-actions builder-publish-actions--center">
          <a class="btn btn-primary" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">Website bekijken</a>
          <a class="btn btn-secondary" href="${dashboardUrl}">Dashboard openen</a>
          <a class="btn btn-secondary" href="${EDITOR_PATH}">Website bewerken</a>
        </div>
        <div class="builder-publish-actions builder-publish-actions--center">
          <a class="btn btn-secondary" href="${checkEmailUrl}">Controleer uw e-mail</a>
          <button type="button" class="btn btn-secondary" data-edit-published-data>Gegevens wijzigen</button>
        </div>
      </section>

      ${previewSection}
    </div>
  `;
}
