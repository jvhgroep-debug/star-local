/** Compact tenant layout styles embedded in standalone generated HTML documents. */
export const TENANT_DOCUMENT_CSS = `
.tenant-site{--tenant-primary:#1a2332;--tenant-accent:#cdb880;--tenant-text:#fff;color:#1f2937;background:#f8fafc;font-family:var(--tenant-font,system-ui,sans-serif);overflow-x:hidden}
.tenant-header{position:sticky;top:0;z-index:30;background:var(--tenant-primary);color:var(--tenant-text);box-shadow:0 4px 20px rgba(0,0,0,.12)}
.tenant-header__inner{max-width:1140px;margin:0 auto;padding:.85rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.tenant-brand{display:inline-flex;align-items:center;gap:.75rem;color:var(--tenant-text);text-decoration:none}
.tenant-brand__name{font-size:1.05rem;font-weight:800}
.tenant-brand__city{font-size:.78rem;opacity:.82;font-weight:600}
.tenant-nav{display:flex;flex-wrap:wrap;gap:.35rem}
.tenant-nav__link{display:inline-flex;align-items:center;padding:.45rem .75rem;border-radius:999px;color:var(--tenant-text);text-decoration:none;font-weight:600;font-size:.92rem;background:transparent;border:none;cursor:pointer}
.tenant-nav__link.is-active,.tenant-nav__link:hover{background:rgba(255,255,255,.12)}
.tenant-menu-toggle{display:none;border:0;background:transparent;color:var(--tenant-text);cursor:pointer}
.tenant-main{min-height:50vh}
.tenant-section{padding:0}
.tenant-section__inner{max-width:1140px;margin:0 auto;padding:3rem 1.25rem}
.tenant-section__inner--narrow{max-width:820px}
.tenant-section--alt{background:#eef2f7}
.tenant-section--page .tenant-section__inner{padding-top:2.5rem}
.tenant-section__eyebrow{margin:0 0 .45rem;color:var(--tenant-accent);font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.tenant-hero{position:relative;background:var(--tenant-primary);color:var(--tenant-text);min-height:420px;background-image:var(--tenant-hero-image);background-size:cover;background-position:center}
.tenant-hero__overlay{background:linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,.65));min-height:420px;display:flex;align-items:center}
.tenant-hero__content{max-width:1140px;margin:0 auto;padding:3rem 1.25rem;width:100%}
.tenant-hero h1{margin:.35rem 0;font-size:clamp(2rem,4vw,3rem)}
.tenant-lead{font-size:1.05rem;line-height:1.7;color:#475569}
.tenant-cards,.tenant-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
.tenant-card,.tenant-about-card,.tenant-service-detail{padding:1.25rem;border-radius:16px;background:#fff;border:1px solid #e2e8f0;box-shadow:0 8px 24px rgba(15,23,42,.04)}
.tenant-split{display:grid;grid-template-columns:1.1fr .9fr;gap:1.5rem}
.tenant-footer{background:var(--tenant-primary);color:var(--tenant-text);margin-top:2rem}
.tenant-footer__inner{max-width:1140px;margin:0 auto;padding:2rem 1.25rem;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
.tenant-footer__bottom{border-top:1px solid rgba(255,255,255,.12);padding:1rem 1.25rem;text-align:center;font-size:.88rem;opacity:.85}
.tenant-footer__link{color:var(--tenant-text);background:none;border:none;padding:0;cursor:pointer;text-decoration:underline}
a.tenant-footer__link{text-decoration:none}
.tenant-btn{display:inline-flex;align-items:center;justify-content:center;padding:.7rem 1rem;border-radius:var(--tenant-btn-radius,10px);font-weight:700;text-decoration:none;border:1px solid transparent;cursor:pointer}
.tenant-btn--primary{background:var(--tenant-primary);color:var(--tenant-text)}
.tenant-btn--accent{background:var(--tenant-accent);color:#111827}
.tenant-btn--outline{background:transparent;border-color:rgba(255,255,255,.35);color:var(--tenant-text)}
.tenant-btn--whatsapp{background:#25d366;color:#fff}
.tenant-btn--ghost{opacity:.55;cursor:default}
.tenant-cta-bar{display:flex;flex-wrap:wrap;gap:.65rem}
.tenant-link,.tenant-footer__link{color:var(--tenant-accent);background:none;border:none;padding:0;cursor:pointer;text-decoration:underline;font:inherit}
a.tenant-link{text-decoration:none;font-weight:700}
.tenant-contact-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:1.5rem}
.tenant-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.tenant-form input,.tenant-form textarea{width:100%;padding:.75rem;border:1px solid #cbd5e1;border-radius:10px;font:inherit}
.tenant-hours table{width:100%;border-collapse:collapse}
.tenant-hours td,.tenant-hours th{padding:.45rem .25rem;border-bottom:1px solid #e2e8f0;text-align:left}
.tenant-mobile-bar{display:none;position:fixed;left:0;right:0;bottom:0;z-index:40;padding:.65rem;background:#fff;border-top:1px solid #e2e8f0;gap:.5rem}
.tenant-mobile-bar__btn{flex:1;text-align:center;padding:.75rem;border-radius:10px;text-decoration:none;font-weight:700;color:#fff;background:var(--tenant-primary)}
.tenant-mobile-bar__btn--wa{background:#25d366}
.tenant-mobile-bar__btn--quote{background:var(--tenant-accent);color:#111827;border:none;font:inherit;cursor:pointer}
.tenant-lightbox[hidden]{display:none!important}
.tenant-lightbox{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:1rem}
.tenant-lightbox__image{max-width:min(960px,100%);max-height:85vh;border-radius:12px}
.tenant-lightbox__close{position:absolute;top:1rem;right:1rem;border:0;background:#fff;border-radius:999px;width:40px;height:40px;font-size:1.5rem;cursor:pointer}
@media (max-width:900px){.tenant-nav{display:none;position:absolute;top:100%;left:1rem;right:1rem;flex-direction:column;background:var(--tenant-primary);border-radius:14px;padding:.75rem}.tenant-nav.is-open{display:flex}.tenant-menu-toggle{display:inline-flex;flex-direction:column;gap:4px}.tenant-menu-toggle span{display:block;width:22px;height:2px;background:currentColor}.tenant-split,.tenant-footer__inner,.tenant-contact-layout,.tenant-cards,.tenant-gallery,.tenant-form-grid{grid-template-columns:1fr}.tenant-mobile-bar{display:flex}}
`.trim();

export const TENANT_DOCUMENT_SCRIPT = `
(() => {
  const root = document.querySelector('[data-tenant-root]');
  if (!root) return;
  const toggle = root.querySelector('.tenant-menu-toggle');
  const nav = root.querySelector('.tenant-nav');
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  const lightbox = root.querySelector('.tenant-lightbox');
  const image = root.querySelector('.tenant-lightbox__image');
  const closeBtn = root.querySelector('.tenant-lightbox__close');
  const sources = [...root.querySelectorAll('[data-lightbox-src]')].map((node) => node.getAttribute('data-lightbox-src') || '');
  const openLightbox = (index) => {
    if (!lightbox || !image || !sources[index]) return;
    image.src = sources[index];
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
  };
  const closeLightbox = () => {
    if (!lightbox || !image) return;
    image.src = '';
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
  };
  root.querySelectorAll('[data-lightbox-index]').forEach((button) => {
    button.addEventListener('click', () => openLightbox(Number(button.getAttribute('data-lightbox-index')) - 1));
  });
  closeBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
})();
`.trim();
