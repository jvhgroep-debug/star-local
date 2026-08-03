import type { BuilderState, PreviewPage, BuilderDesignSettings } from '../../../types/builder';
import type { WebsiteConfig } from '../../../types/website-config';
import type { BuilderFiles } from '../files';
import { readableTextColor } from '../colors';
import {
  formatCityLine,
  formatHoursLine,
  formatStreetLine,
  formatTelLink,
  formatWhatsAppLink,
  mapsRouteUrl,
} from '../templates';
import type { PageSeoBundle } from './seo';
import { buildPageSeo, tenantPagePath } from './seo';
import { buildWebsiteConfig, configAsBuilderState } from '../website-config';
import {
  BUILDER_PLACEHOLDERS,
  placeholderBusinessName,
  placeholderDescription,
  placeholderIndustry,
  placeholderRegion,
} from '../placeholders';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface RenderWebsiteOptions {
  editorMode?: boolean;
  /** Standalone HTML output with real href links (for production documents). */
  standalone?: boolean;
}

function renderInternalPageControl(
  page: PreviewPage,
  label: string,
  className: string,
  standalone: boolean,
  activePage?: PreviewPage,
): string {
  if (standalone) {
    const active = activePage === page ? ' is-active' : '';
    return `<a class="${className}${active}" href="${tenantPagePath(page)}">${escapeHtml(label)}</a>`;
  }
  const active = activePage === page ? ' is-active' : '';
  return `<button type="button" class="${className}${active}" data-preview-page="${page}">${escapeHtml(label)}</button>`;
}

function editorFieldAttr(field: string, editorMode: boolean): string {
  return editorMode ? ` data-editor-field="${field}" contenteditable="plaintext-only" spellcheck="true"` : '';
}

function designFontStack(font: BuilderDesignSettings['fontFamily']): string {
  switch (font) {
    case 'serif':
      return 'Georgia, Times New Roman, serif';
    case 'modern':
      return 'Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    case 'display':
      return 'Trebuchet MS, Gill Sans, sans-serif';
    default:
      return 'system-ui, -apple-system, Segoe UI, sans-serif';
  }
}

function designRadius(radius: BuilderDesignSettings['cornerRadius']): string {
  switch (radius) {
    case 'sharp':
      return '4px';
    case 'pill':
      return '999px';
    default:
      return '10px';
  }
}

export function renderExampleDomainBar(domain: string): string {
  return `
    <div class="builder-example-domain" aria-label="Voorbeeld website-adres">
      <span class="builder-example-domain__label">Voorbeeld:</span>
      <strong class="builder-example-domain__value">${escapeHtml(domain || BUILDER_PLACEHOLDERS.domain)}</strong>
    </div>
  `;
}

function renderCtas(state: BuilderState, editorMode = false, standalone = false): string {
  const phoneLink = formatTelLink(state.contact.phone);
  const whatsappLink = formatWhatsAppLink(state.contact.whatsapp);
  const routeLink = mapsRouteUrl(state);
  const quoteLabel = escapeHtml(state.ctaQuoteLabel?.trim() || 'Offerte aanvragen');
  const quoteBtn = editorMode
    ? `<span class="tenant-btn tenant-btn--accent tenant-btn--editable" data-preview-page="contact" data-editor-field="cta.quote" contenteditable="plaintext-only" spellcheck="true">${quoteLabel}</span>`
    : standalone
      ? `<a class="tenant-btn tenant-btn--accent" href="${tenantPagePath('contact')}">${quoteLabel}</a>`
      : `<button type="button" class="tenant-btn tenant-btn--accent" data-preview-page="contact">${quoteLabel}</button>`;

  return `
    <div class="tenant-cta-bar">
      ${
        phoneLink
          ? `<a class="tenant-btn tenant-btn--primary" href="${phoneLink}">Bel direct</a>`
          : `<span class="tenant-btn tenant-btn--ghost">Bel direct</span>`
      }
      ${
        whatsappLink
          ? `<a class="tenant-btn tenant-btn--whatsapp" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`
          : `<span class="tenant-btn tenant-btn--ghost">WhatsApp</span>`
      }
      ${quoteBtn}
      ${
        routeLink !== '#'
          ? `<a class="tenant-btn tenant-btn--outline" href="${routeLink}" target="_blank" rel="noopener noreferrer">Route</a>`
          : `<span class="tenant-btn tenant-btn--ghost">Route</span>`
      }
    </div>
  `;
}

function renderHeader(config: WebsiteConfig, activePage: PreviewPage, editorMode = false, standalone = false): string {
  const state = configAsBuilderState(config);
  const logo = config.media.logoUrl;
  const name = escapeHtml(placeholderBusinessName(config.business.name));

  const brandInner = `
          ${logo ? `<img src="${logo}" alt="" class="tenant-logo" />` : '<span class="tenant-logo-fallback" aria-hidden="true"></span>'}
          <span class="tenant-brand__text">
            <span class="tenant-brand__name"${editorFieldAttr('business.name', editorMode)}>${name}</span>
            ${state.contact.city.trim() ? `<span class="tenant-brand__city">${escapeHtml(state.contact.city.trim())}</span>` : ''}
          </span>`;

  const brand = standalone
    ? `<a class="tenant-brand" href="${tenantPagePath('home')}" aria-label="${name} home">${brandInner}</a>`
    : `<button type="button" class="tenant-brand" data-preview-page="home" aria-label="${name} home">${brandInner}</button>`;

  return `
    <header class="tenant-header">
      <div class="tenant-header__inner">
        ${brand}
        <button type="button" class="tenant-menu-toggle" aria-expanded="false" aria-controls="tenant-main-nav" aria-label="Menu openen">
          <span></span><span></span><span></span>
        </button>
        <nav id="tenant-main-nav" class="tenant-nav" aria-label="Hoofdnavigatie">
          ${(['home', 'about', 'services', 'contact', 'privacy'] as PreviewPage[])
            .filter((pageId) => config.enabledPages?.[pageId] !== false)
            .map((pageId) => {
              const labels: Record<PreviewPage, string> = {
                home: 'Home',
                about: 'Over ons',
                services: 'Diensten',
                contact: 'Contact',
                privacy: 'Privacy',
              };
              return renderInternalPageControl(pageId, labels[pageId], 'tenant-nav__link', standalone, activePage);
            })
            .join('')}
        </nav>
      </div>
    </header>
  `;
}

function renderSeoMeta(_config: WebsiteConfig, _page: PreviewPage, _pageSeo: PageSeoBundle, standalone = false): string {
  if (standalone) return '';
  return `
    <div class="tenant-seo-sr" aria-hidden="true">
      <span data-seo-h1>${escapeHtml(_pageSeo.h1)}</span>
      <span data-seo-title>${escapeHtml(_pageSeo.title)}</span>
      <span data-seo-description>${escapeHtml(_pageSeo.description)}</span>
      <span data-seo-og>${escapeHtml(_pageSeo.ogTitle)}</span>
      <span data-seo-og-description>${escapeHtml(_pageSeo.ogDescription)}</span>
      <span data-seo-canonical>${escapeHtml(_pageSeo.canonicalUrl)}</span>
    </div>
    <script type="application/ld+json">${JSON.stringify(_config.localBusinessSchema)}</script>
  `;
}

function renderFooter(config: WebsiteConfig, standalone = false): string {
  const state = configAsBuilderState(config);
  const name = escapeHtml(placeholderBusinessName(config.business.name));
  const phone = config.contact.phone.trim();
  const email = config.contact.email.trim();
  const street = escapeHtml(formatStreetLine(state));
  const cityLine = escapeHtml(formatCityLine(state));
  const telHref = phone ? formatTelLink(state.contact.phone) : '';
  const mailHref = email ? `mailto:${encodeURIComponent(email)}` : '';

  return `
    <footer class="tenant-footer">
      <div class="tenant-footer__inner">
        <div class="tenant-footer__col">
          <strong>${name}</strong>
          <p>${escapeHtml(placeholderIndustry(config.business.industry))}</p>
          ${street ? `<p>${street}</p>` : ''}
          ${cityLine ? `<p>${cityLine}</p>` : ''}
        </div>
        <div class="tenant-footer__col">
          <strong>Contact</strong>
          ${phone ? `<p><a class="tenant-footer__link" href="${telHref}">${escapeHtml(phone)}</a></p>` : ''}
          ${email ? `<p><a class="tenant-footer__link" href="${mailHref}">${escapeHtml(email)}</a></p>` : ''}
        </div>
        <div class="tenant-footer__col">
          ${
            config.enabledPages?.privacy !== false
              ? standalone
                ? `<a class="tenant-footer__link" href="${tenantPagePath('privacy')}">Privacybeleid</a>`
                : `<button type="button" class="tenant-footer__link" data-preview-page="privacy">Privacybeleid</button>`
              : ''
          }
          <p class="tenant-footer__copyright">&copy; ${new Date().getFullYear()} ${name}</p>
        </div>
      </div>
    </footer>
  `;
}

function renderContactForm(config: WebsiteConfig): string {
  const recipientEmail = config.contact.email.trim();
  const businessName = placeholderBusinessName(config.business.name);

  return `
    <form class="tenant-form" aria-label="Contactformulier" novalidate
      data-tenant-email="${escapeHtml(recipientEmail)}"
      data-business-name="${escapeHtml(businessName)}">
      <div class="tenant-form-grid">
        <label>Naam<input type="text" name="name" autocomplete="name" placeholder="Uw naam" required /></label>
        <label>E-mail<input type="email" name="email" autocomplete="email" placeholder="Uw e-mailadres" required /></label>
      </div>
      <label>Telefoon<input type="tel" name="phone" autocomplete="tel" placeholder="Uw telefoonnummer" /></label>
      <label>Bericht<textarea name="message" rows="5" placeholder="Waar kunnen wij u mee helpen?" required></textarea></label>
      <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="tenant-form__honeypot" />
      <button type="submit" class="tenant-btn tenant-btn--accent tenant-form__submit">Versturen</button>
      <p class="tenant-form__status" role="status" hidden></p>
    </form>
  `;
}

function renderHoursTable(config: WebsiteConfig): string {
  return `<div class="tenant-hours-table">${config.hours
    .map((day) => {
      const rowClass = day.closed ? ' is-closed' : day.open24 ? ' is-open24' : '';
      return `
        <div class="tenant-hours-row${rowClass}">
          <span class="tenant-hours-row__day">${escapeHtml(day.day)}</span>
          <span class="tenant-hours-row__time">${escapeHtml(formatHoursLine(day))}</span>
        </div>
      `;
    })
    .join('')}</div>`;
}

function renderGallery(config: WebsiteConfig): string {
  if (config.media.galleryImageUrls.length === 0) return '';

  return `
    <section class="tenant-section tenant-section--alt">
      <div class="tenant-section__inner">
        <p class="tenant-section__eyebrow">Impressie</p>
        <h2>Foto-overzicht</h2>
        <p class="tenant-lead">Een indruk van ons werk en onze uitstraling.</p>
        <div class="tenant-gallery">
          ${config.media.galleryImageUrls
            .map(
              (url, index) => `
                <button type="button" class="tenant-gallery__item" data-lightbox-index="${index + 1}" aria-label="Foto ${index + 2} vergroten">
                  <img src="${url}" alt="Foto ${index + 2}" loading="lazy" decoding="async" />
                </button>
              `,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderLightbox(config: WebsiteConfig): string {
  if (config.media.galleryImageUrls.length === 0) return '';

  return `
    <div class="tenant-lightbox" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-label="Vergrote foto">
      <button type="button" class="tenant-lightbox__close" aria-label="Sluiten">&times;</button>
      <img src="" alt="" class="tenant-lightbox__image" />
      <div class="tenant-lightbox__sources" hidden>
        ${config.media.galleryImageUrls.map((url) => `<span data-lightbox-src="${url}"></span>`).join('')}
      </div>
    </div>
  `;
}

function renderMobileBar(config: WebsiteConfig, standalone = false): string {
  const state = configAsBuilderState(config);
  const phoneLink = formatTelLink(state.contact.phone);
  const whatsappLink = formatWhatsAppLink(state.contact.whatsapp);
  const quoteLabel = escapeHtml(state.ctaQuoteLabel?.trim() || config.copy.ctaLabel || 'Offerte aanvragen');

  if (!phoneLink && !whatsappLink) return '';

  const quoteControl = standalone
    ? `<a class="tenant-mobile-bar__btn tenant-mobile-bar__btn--quote" href="${tenantPagePath('contact')}">${quoteLabel}</a>`
    : `<button type="button" class="tenant-mobile-bar__btn tenant-mobile-bar__btn--quote" data-preview-page="contact">${quoteLabel}</button>`;

  return `
    <div class="tenant-mobile-bar" aria-label="Snelle contactknoppen">
      ${phoneLink ? `<a class="tenant-mobile-bar__btn" href="${phoneLink}">Bel direct</a>` : ''}
      ${whatsappLink ? `<a class="tenant-mobile-bar__btn tenant-mobile-bar__btn--wa" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ''}
      ${quoteControl}
    </div>
  `;
}

function renderPageHome(config: WebsiteConfig, editorMode = false, standalone = false): string {
  const state = configAsBuilderState(config);
  const { copy } = config;
  const hero = config.media.heroImageUrl;
  const heroTitle = config.heroTitle?.trim() || copy.h1;
  const heroSubtitle = config.heroSubtitle?.trim() || copy.slogan;

  const serviceCards =
    config.services.length > 0
      ? `<div class="tenant-cards tenant-cards--compact">${config.services
          .slice(0, 3)
          .map(
            (service, index) => `
              <article class="tenant-card">
                <span class="tenant-card__index">${String(index + 1).padStart(2, '0')}</span>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.summary)}</p>
              </article>
            `,
          )
          .join('')}</div>
          ${config.services.length > 3 ? `<p class="tenant-link-wrap">${renderInternalPageControl('services', 'Bekijk alle diensten', 'tenant-link', standalone)}</p>` : ''}`
      : '<p class="tenant-muted">Voeg diensten toe in de builder om ze hier te tonen.</p>';

  return `
    <section class="tenant-hero" ${hero ? `style="--tenant-hero-image:url('${hero}')"` : ''}>
      <div class="tenant-hero__overlay">
        <div class="tenant-hero__content">
          <p class="tenant-hero__eyebrow"${editorFieldAttr('business.industry', editorMode)}>${escapeHtml(placeholderIndustry(config.business.industry))}</p>
          <h1${editorFieldAttr('hero.title', editorMode)}>${escapeHtml(heroTitle)}</h1>
          ${heroSubtitle ? `<p class="tenant-hero__slogan"${editorFieldAttr('hero.subtitle', editorMode)}>${escapeHtml(heroSubtitle)}</p>` : ''}
          <p class="tenant-hero__text"${editorFieldAttr('hero.description', editorMode)}>${escapeHtml(copy.heroDescription)}</p>
          ${renderCtas(state, editorMode, standalone)}
        </div>
      </div>
    </section>

    <section class="tenant-section">
      <div class="tenant-section__inner tenant-section__inner--narrow">
        <p class="tenant-section__eyebrow">Introductie</p>
        <h2>${escapeHtml(copy.homeIntro)}</h2>
        <p class="tenant-lead">${escapeHtml(copy.aboutBody)}</p>
      </div>
    </section>

    <section class="tenant-section tenant-section--alt">
      <div class="tenant-section__inner">
        <p class="tenant-section__eyebrow">Diensten</p>
        <h2>Ons aanbod</h2>
        <p class="tenant-lead">${escapeHtml(copy.servicesIntro)}</p>
        ${serviceCards}
      </div>
    </section>

    <section class="tenant-section">
      <div class="tenant-section__inner tenant-split">
        <div>
          <p class="tenant-section__eyebrow">Waarom kiezen voor ons</p>
          <h2>Waarom ${escapeHtml(placeholderBusinessName(config.business.name))}?</h2>
          <ul class="tenant-checklist">
            ${config.whyChooseUs.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="tenant-about-card">
          <h3>${escapeHtml(copy.localTitle)}</h3>
          <p>${escapeHtml(copy.aboutExtended.slice(0, 220))}${copy.aboutExtended.length > 220 ? '…' : ''}</p>
          ${renderInternalPageControl('about', 'Meer over ons', 'tenant-link', standalone)}
        </div>
      </div>
    </section>

    ${renderGallery(config)}

    <section class="tenant-section tenant-cta-banner">
      <div class="tenant-section__inner tenant-section__inner--narrow tenant-cta-banner__inner">
        <h2>Klaar om contact op te nemen?</h2>
        <p class="tenant-lead">${escapeHtml(copy.contactIntro)}</p>
        ${renderCtas(state, false, standalone)}
      </div>
    </section>
  `;
}

function renderPageAbout(config: WebsiteConfig, standalone = false): string {
  const state = configAsBuilderState(config);
  const { copy } = config;

  return `
    <section class="tenant-section tenant-section--page">
      <div class="tenant-section__inner">
        <p class="tenant-section__eyebrow">Over ons</p>
        <h1>${escapeHtml(copy.aboutIntro)}</h1>
        <p class="tenant-lead">${escapeHtml(copy.aboutExtended)}</p>
        <div class="tenant-split">
          <div class="tenant-about-card">
            <h2>Onze missie</h2>
            <p>${escapeHtml(copy.aboutBody)}</p>
          </div>
          <div class="tenant-about-card">
            <h2>Onze expertise</h2>
            <p>Wij zijn actief als ${escapeHtml(placeholderIndustry(config.business.industry).toLowerCase())} in ${escapeHtml(placeholderRegion(config.contact.city))}. ${escapeHtml(placeholderDescription(config.business.description))}</p>
            <ul class="tenant-checklist">
              ${config.whyChooseUs.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>
        </div>
        ${renderCtas(state, false, standalone)}
      </div>
    </section>
  `;
}

function renderPageServices(config: WebsiteConfig, standalone = false): string {
  const { copy } = config;

  const blocks =
    config.services.length > 0
      ? config.services
          .map(
            (service, index) => `
              <article class="tenant-service-detail">
                <span class="tenant-card__index">${String(index + 1).padStart(2, '0')}</span>
                <h2>${escapeHtml(service.title)}</h2>
                <p>${escapeHtml(service.detail)}</p>
                ${
                  standalone
                    ? `<a class="tenant-btn tenant-btn--accent" href="${tenantPagePath('contact')}">Offerte aanvragen</a>`
                    : `<button type="button" class="tenant-btn tenant-btn--accent" data-preview-page="contact">Offerte aanvragen</button>`
                }
              </article>
            `,
          )
          .join('')
      : '<p class="tenant-muted">Voeg diensten toe in de builder om ze hier te tonen.</p>';

  return `
    <section class="tenant-section tenant-section--page">
      <div class="tenant-section__inner">
        <p class="tenant-section__eyebrow">Diensten</p>
        <h1>Onze diensten</h1>
        <p class="tenant-lead">${escapeHtml(copy.servicesIntro)}</p>
        <div class="tenant-cards">${config.services
          .map(
            (service, index) => `
              <article class="tenant-card">
                <span class="tenant-card__index">${String(index + 1).padStart(2, '0')}</span>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.summary)}</p>
              </article>
            `,
          )
          .join('')}</div>
        <div class="tenant-service-details">${blocks}</div>
      </div>
    </section>
  `;
}

function renderPageContact(config: WebsiteConfig, standalone = false): string {
  const state = configAsBuilderState(config);
  const { copy } = config;
  const street = escapeHtml(formatStreetLine(state));
  const cityLine = escapeHtml(formatCityLine(state));
  const telHref = config.contact.phone ? formatTelLink(state.contact.phone) : '';
  const whatsappHref = config.contact.whatsapp ? formatWhatsAppLink(state.contact.whatsapp) : '';
  const mailHref = config.contact.email ? `mailto:${encodeURIComponent(config.contact.email.trim())}` : '';
  const mapsUrl = mapsRouteUrl(state);

  return `
    <section class="tenant-section tenant-section--page">
      <div class="tenant-section__inner">
        <p class="tenant-section__eyebrow">Contact</p>
        <h1>${escapeHtml(copy.localTitle)}</h1>
        <p class="tenant-lead">${escapeHtml(copy.contactIntro)}</p>
        <div class="tenant-contact-layout">
          <div class="tenant-contact-details">
            <dl>
              ${config.contact.phone ? `<div><dt>Telefoon</dt><dd><a href="${telHref}">${escapeHtml(config.contact.phone)}</a></dd></div>` : ''}
              ${config.contact.whatsapp ? `<div><dt>WhatsApp</dt><dd><a href="${whatsappHref}" target="_blank" rel="noopener">${escapeHtml(config.contact.whatsapp)}</a></dd></div>` : ''}
              ${config.contact.email ? `<div><dt>E-mail</dt><dd><a href="${mailHref}">${escapeHtml(config.contact.email)}</a></dd></div>` : ''}
              ${street ? `<div><dt>Adres</dt><dd>${street}</dd></div>` : ''}
              ${cityLine ? `<div><dt>Postcode &amp; plaats</dt><dd>${cityLine}</dd></div>` : ''}
            </dl>
            ${renderCtas(state, false, standalone)}
          </div>
          <div>
            <h2>Openingstijden</h2>
            ${renderHoursTable(config)}
          </div>
        </div>
      </div>
    </section>

    <section class="tenant-section tenant-section--alt">
      <div class="tenant-section__inner">
        <h2>Route</h2>
        <p><a href="${escapeHtml(mapsUrl)}" target="_blank" rel="noopener noreferrer">Bekijk op Google Maps</a></p>
        <div class="tenant-map-placeholder" role="img" aria-label="Kaartplaceholder">
          <p>Google Maps — volgt bij live publicatie</p>
        </div>
      </div>
    </section>

    <section class="tenant-section tenant-section--alt">
      <div class="tenant-section__inner tenant-form-section">
        <h2>Contactformulier</h2>
        ${renderContactForm(config)}
      </div>
    </section>
  `;
}

function renderPagePrivacy(config: WebsiteConfig, standalone = false): string {
  const { copy, privacySections } = config;
  const name = escapeHtml(placeholderBusinessName(config.business.name));

  return `
    <section class="tenant-section tenant-section--page">
      <div class="tenant-section__inner tenant-section__inner--narrow">
        <h1>Privacybeleid</h1>
        <p class="tenant-lead">${escapeHtml(copy.privacyIntro)}</p>
        <h2>Wie zijn wij?</h2>
        <p>${escapeHtml(privacySections.intro)}</p>
        <h2>Welke gegevens verwerken wij?</h2>
        <p>${escapeHtml(privacySections.dataProcessing)}</p>
        <h2>Hoe lang bewaren wij gegevens?</h2>
        <p>${escapeHtml(privacySections.retention)}</p>
        <h2>Contact over privacy</h2>
        <p>${escapeHtml(privacySections.contact)}</p>
        <p><strong>${name}</strong> — ${escapeHtml(config.slug.url)}</p>
        ${renderInternalPageControl('home', 'Terug naar home', 'tenant-btn tenant-btn--outline', standalone)}
      </div>
    </section>
  `;
}

/** Central template — renders one page from WebsiteConfig (preview + publication). */
export function renderGeneratedWebsiteFromConfig(
  config: WebsiteConfig,
  page: PreviewPage,
  pageSeo?: PageSeoBundle,
  options: RenderWebsiteOptions = {},
): string {
  const editorMode = options.editorMode ?? false;
  const standalone = options.standalone ?? false;
  const design = config.design;
  const textColor = readableTextColor(config.branding.primaryColor);
  const seo = pageSeo ?? buildPageSeo(config, page);

  const pageContent = (() => {
    switch (page) {
      case 'about':
        return renderPageAbout(config, standalone);
      case 'services':
        return renderPageServices(config, standalone);
      case 'contact':
        return renderPageContact(config, standalone);
      case 'privacy':
        return renderPagePrivacy(config, standalone);
      default:
        return renderPageHome(config, editorMode, standalone);
    }
  })();

  const siteClasses = [
    'tenant-site',
    `tenant-site--btn-${design?.buttonStyle ?? 'solid'}`,
    `tenant-site--radius-${design?.cornerRadius ?? 'rounded'}`,
    `tenant-site--shadow-${design?.shadow ?? 'soft'}`,
    editorMode ? 'tenant-site--editor' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <div
      class="${siteClasses}"
      style="--tenant-primary:${config.branding.primaryColor};--tenant-accent:${config.branding.accentColor};--tenant-text:${textColor};--tenant-font:${designFontStack(design?.fontFamily ?? 'system')};--tenant-btn-radius:${designRadius(design?.cornerRadius ?? 'rounded')};"
      ${standalone ? 'data-tenant-root' : 'data-preview-root'}
      data-generated-domain="${escapeHtml(config.slug.domain)}"
    >
      ${renderHeader(config, page, editorMode, standalone)}
      ${renderSeoMeta(config, page, seo, standalone)}
      <main class="tenant-main">${pageContent}</main>
      ${renderFooter(config, standalone)}
      ${renderLightbox(config)}
      ${renderMobileBar(config, standalone)}
    </div>
  `;
}

export function renderGeneratedWebsite(
  state: BuilderState,
  files: BuilderFiles,
  page: PreviewPage,
): string {
  return renderGeneratedWebsiteFromConfig(buildWebsiteConfig(state, files), page);
}

export { buildWebsiteConfig };
