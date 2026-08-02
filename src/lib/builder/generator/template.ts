import type { BuilderState, PreviewPage } from '../../types/builder';
import type { WebsiteConfig } from '../../types/website-config';
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
import { buildWebsiteConfig, configAsBuilderState } from '../website-config';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderExampleDomainBar(domain: string): string {
  return `
    <div class="builder-example-domain" aria-label="Voorbeeld website-adres">
      <span class="builder-example-domain__label">Voorbeeld:</span>
      <strong class="builder-example-domain__value">${escapeHtml(domain || 'uw-bedrijf.starlocal.nl')}</strong>
    </div>
  `;
}

function renderCtas(state: BuilderState): string {
  const phoneLink = formatTelLink(state.contact.phone);
  const whatsappLink = formatWhatsAppLink(state.contact.whatsapp);
  const routeLink = mapsRouteUrl(state);

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
      <button type="button" class="tenant-btn tenant-btn--accent" data-preview-page="contact">Offerte aanvragen</button>
      ${
        routeLink !== '#'
          ? `<a class="tenant-btn tenant-btn--outline" href="${routeLink}" target="_blank" rel="noopener noreferrer">Route</a>`
          : `<span class="tenant-btn tenant-btn--ghost">Route</span>`
      }
    </div>
  `;
}

function renderHeader(config: WebsiteConfig, activePage: PreviewPage): string {
  const state = configAsBuilderState(config);
  const logo = config.media.logoUrl;
  const name = escapeHtml(config.business.name || 'Uw bedrijf');

  const navItem = (page: PreviewPage, label: string) => {
    const active = activePage === page ? ' is-active' : '';
    return `<button type="button" class="tenant-nav__link${active}" data-preview-page="${page}">${escapeHtml(label)}</button>`;
  };

  return `
    <header class="tenant-header">
      <div class="tenant-header__inner">
        <button type="button" class="tenant-brand" data-preview-page="home" aria-label="${name} home">
          ${logo ? `<img src="${logo}" alt="" class="tenant-logo" />` : '<span class="tenant-logo-fallback" aria-hidden="true"></span>'}
          <span class="tenant-brand__text">
            <span class="tenant-brand__name">${name}</span>
            ${state.contact.city.trim() ? `<span class="tenant-brand__city">${escapeHtml(state.contact.city.trim())}</span>` : ''}
          </span>
        </button>
        <button type="button" class="tenant-menu-toggle" aria-expanded="false" aria-controls="tenant-main-nav" aria-label="Menu openen">
          <span></span><span></span><span></span>
        </button>
        <nav id="tenant-main-nav" class="tenant-nav" aria-label="Hoofdnavigatie">
          ${navItem('home', 'Home')}
          ${navItem('about', 'Over ons')}
          ${navItem('services', 'Diensten')}
          ${navItem('contact', 'Contact')}
        </nav>
      </div>
    </header>
  `;
}

function renderSeoMeta(config: WebsiteConfig): string {
  return `
    <div class="tenant-seo-sr" aria-hidden="true">
      <span data-seo-h1>${escapeHtml(config.seo.h1)}</span>
      <span data-seo-title>${escapeHtml(config.seo.title)}</span>
      <span data-seo-description>${escapeHtml(config.seo.description)}</span>
      <span data-seo-og>${escapeHtml(config.seo.ogTitle)}</span>
      <span data-seo-canonical>${escapeHtml(config.seo.canonicalUrl)}</span>
    </div>
    <script type="application/ld+json">${JSON.stringify(config.localBusinessSchema)}</script>
  `;
}

function renderFooter(config: WebsiteConfig): string {
  const state = configAsBuilderState(config);
  const name = escapeHtml(config.business.name || 'Uw bedrijf');
  const phone = config.contact.phone.trim();
  const email = config.contact.email.trim();
  const cityLine = escapeHtml(formatCityLine(state));

  return `
    <footer class="tenant-footer">
      <div class="tenant-footer__inner">
        <div class="tenant-footer__col">
          <strong>${escapeHtml(config.copy.localTitle)}</strong>
          <p>${escapeHtml(config.business.industry || 'Lokale dienstverlener')}</p>
        </div>
        <div class="tenant-footer__col">
          <strong>Contact</strong>
          ${phone ? `<p>${escapeHtml(phone)}</p>` : ''}
          ${email ? `<p>${escapeHtml(email)}</p>` : ''}
          ${cityLine ? `<p>${cityLine}</p>` : ''}
        </div>
        <div class="tenant-footer__col">
          <button type="button" class="tenant-footer__link" data-preview-page="privacy">Privacybeleid</button>
        </div>
      </div>
      <div class="tenant-footer__bottom">
        <p>&copy; ${new Date().getFullYear()} ${name}. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  `;
}

function renderContactForm(): string {
  return `
    <form class="tenant-form" aria-label="Contactformulier">
      <div class="tenant-form-grid">
        <label>Naam<input type="text" name="name" autocomplete="name" placeholder="Uw naam" /></label>
        <label>E-mail<input type="email" name="email" autocomplete="email" placeholder="Uw e-mailadres" /></label>
      </div>
      <label>Telefoon<input type="tel" name="phone" autocomplete="tel" placeholder="Uw telefoonnummer" /></label>
      <label>Bericht<textarea name="message" rows="5" placeholder="Waar kunnen wij u mee helpen?"></textarea></label>
      <button type="button" class="tenant-btn tenant-btn--accent tenant-form__submit">Versturen</button>
      <p class="tenant-form__note">Dit is een voorbeeldformulier. Verzending wordt in een volgende stap geactiveerd.</p>
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

function renderMobileBar(config: WebsiteConfig): string {
  const state = configAsBuilderState(config);
  const phoneLink = formatTelLink(state.contact.phone);
  const whatsappLink = formatWhatsAppLink(state.contact.whatsapp);

  if (!phoneLink && !whatsappLink) return '';

  return `
    <div class="tenant-mobile-bar" aria-label="Snelle contactknoppen">
      ${phoneLink ? `<a class="tenant-mobile-bar__btn" href="${phoneLink}">Bel direct</a>` : ''}
      ${whatsappLink ? `<a class="tenant-mobile-bar__btn tenant-mobile-bar__btn--wa" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ''}
      <button type="button" class="tenant-mobile-bar__btn tenant-mobile-bar__btn--quote" data-preview-page="contact">Offerte</button>
    </div>
  `;
}

function renderPageHome(config: WebsiteConfig): string {
  const state = configAsBuilderState(config);
  const { copy } = config;
  const hero = config.media.heroImageUrl;

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
          ${config.services.length > 3 ? `<p class="tenant-link-wrap"><button type="button" class="tenant-link" data-preview-page="services">Bekijk alle diensten</button></p>` : ''}`
      : '<p class="tenant-muted">Voeg diensten toe in de builder om ze hier te tonen.</p>';

  return `
    <section class="tenant-hero" ${hero ? `style="--tenant-hero-image:url('${hero}')"` : ''}>
      <div class="tenant-hero__overlay">
        <div class="tenant-hero__content">
          <p class="tenant-hero__eyebrow">${escapeHtml(config.business.industry || 'Lokale dienstverlener')}</p>
          <h1>${escapeHtml(copy.h1)}</h1>
          <p class="tenant-hero__text">${escapeHtml(copy.heroDescription)}</p>
          ${renderCtas(state)}
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
          <h2>Waarom ${escapeHtml(config.business.name || 'ons')}?</h2>
          <ul class="tenant-checklist">
            ${config.whyChooseUs.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="tenant-about-card">
          <h3>${escapeHtml(copy.localTitle)}</h3>
          <p>${escapeHtml(copy.aboutExtended.slice(0, 220))}${copy.aboutExtended.length > 220 ? '…' : ''}</p>
          <button type="button" class="tenant-link" data-preview-page="about">Meer over ons</button>
        </div>
      </div>
    </section>

    ${renderGallery(config)}

    <section class="tenant-section tenant-cta-banner">
      <div class="tenant-section__inner tenant-section__inner--narrow tenant-cta-banner__inner">
        <h2>Klaar om contact op te nemen?</h2>
        <p class="tenant-lead">${escapeHtml(copy.contactIntro)}</p>
        ${renderCtas(state)}
      </div>
    </section>
  `;
}

function renderPageAbout(config: WebsiteConfig): string {
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
            <p>Wij zijn actief als ${escapeHtml(config.business.industry || 'lokale dienstverlener')} in ${escapeHtml(config.contact.city || 'uw regio')}. ${escapeHtml(config.business.description.trim() || copy.heroDescription)}</p>
            <ul class="tenant-checklist">
              ${config.whyChooseUs.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>
        </div>
        ${renderCtas(state)}
      </div>
    </section>
  `;
}

function renderPageServices(config: WebsiteConfig): string {
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
                <button type="button" class="tenant-btn tenant-btn--accent" data-preview-page="contact">Offerte aanvragen</button>
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

function renderPageContact(config: WebsiteConfig): string {
  const state = configAsBuilderState(config);
  const { copy } = config;
  const street = escapeHtml(formatStreetLine(state));
  const cityLine = escapeHtml(formatCityLine(state));

  return `
    <section class="tenant-section tenant-section--page">
      <div class="tenant-section__inner">
        <p class="tenant-section__eyebrow">Contact</p>
        <h1>${escapeHtml(copy.localTitle)}</h1>
        <p class="tenant-lead">${escapeHtml(copy.contactIntro)}</p>
        <div class="tenant-contact-layout">
          <div class="tenant-contact-details">
            <dl>
              ${config.contact.phone ? `<div><dt>Telefoon</dt><dd>${escapeHtml(config.contact.phone)}</dd></div>` : ''}
              ${config.contact.whatsapp ? `<div><dt>WhatsApp</dt><dd>${escapeHtml(config.contact.whatsapp)}</dd></div>` : ''}
              ${config.contact.email ? `<div><dt>E-mail</dt><dd>${escapeHtml(config.contact.email)}</dd></div>` : ''}
              ${street ? `<div><dt>Adres</dt><dd>${street}</dd></div>` : ''}
              ${cityLine ? `<div><dt>Postcode &amp; plaats</dt><dd>${cityLine}</dd></div>` : ''}
            </dl>
            ${renderCtas(state)}
          </div>
          <div>
            <h2>Openingstijden</h2>
            ${renderHoursTable(config)}
          </div>
        </div>
      </div>
    </section>

    <section class="tenant-section tenant-section--alt">
      <div class="tenant-section__inner tenant-form-section">
        <h2>Contactformulier</h2>
        ${renderContactForm()}
      </div>
    </section>
  `;
}

function renderPagePrivacy(config: WebsiteConfig): string {
  const { copy, privacySections } = config;
  const name = escapeHtml(config.business.name || 'Uw bedrijf');

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
        <button type="button" class="tenant-btn tenant-btn--outline" data-preview-page="home">Terug naar home</button>
      </div>
    </section>
  `;
}

/** Central template — renders one page from WebsiteConfig (preview + publication). */
export function renderGeneratedWebsiteFromConfig(config: WebsiteConfig, page: PreviewPage): string {
  const textColor = readableTextColor(config.branding.primaryColor);

  const pageContent = (() => {
    switch (page) {
      case 'about':
        return renderPageAbout(config);
      case 'services':
        return renderPageServices(config);
      case 'contact':
        return renderPageContact(config);
      case 'privacy':
        return renderPagePrivacy(config);
      default:
        return renderPageHome(config);
    }
  })();

  return `
    <div
      class="tenant-site"
      style="--tenant-primary:${config.branding.primaryColor};--tenant-accent:${config.branding.accentColor};--tenant-text:${textColor};"
      data-preview-root
      data-generated-domain="${escapeHtml(config.slug.domain)}"
    >
      ${renderHeader(config, page)}
      ${renderSeoMeta(config)}
      <main class="tenant-main">${pageContent}</main>
      ${renderFooter(config)}
      ${renderLightbox(config)}
      ${renderMobileBar(config)}
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
