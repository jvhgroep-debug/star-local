import type { PreviewPage } from '../../types/builder';
import { renderTenantPreview } from './render-preview';

export function bindPreviewInteractions(
  container: ParentNode,
  onPageChange: (page: PreviewPage) => void,
): void {
  const root = container.querySelector('[data-preview-root]') ?? container;

  root.querySelectorAll('[data-preview-page]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      const page = (element as HTMLElement).dataset.previewPage as PreviewPage;
      onPageChange(page);
      closeMobileMenu(root);
    });
  });

  const toggle = root.querySelector('.tenant-menu-toggle') as HTMLButtonElement | null;
  const nav = root.querySelector('.tenant-nav') as HTMLElement | null;
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });

  root.querySelectorAll('.tenant-form__submit').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
    });
  });

  bindLightbox(root);
}

function closeMobileMenu(root: ParentNode): void {
  const nav = root.querySelector('.tenant-nav');
  const toggle = root.querySelector('.tenant-menu-toggle') as HTMLButtonElement | null;
  nav?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Menu openen');
}

function bindLightbox(root: ParentNode): void {
  const lightbox = root.querySelector('.tenant-lightbox') as HTMLElement | null;
  const image = root.querySelector('.tenant-lightbox__image') as HTMLImageElement | null;
  const closeBtn = root.querySelector('.tenant-lightbox__close') as HTMLButtonElement | null;
  if (!lightbox || !image) return;

  const sources = [...root.querySelectorAll('[data-lightbox-src]')].map(
    (node) => (node as HTMLElement).dataset.lightboxSrc ?? '',
  );

  const openAt = (index: number) => {
    const src = sources[index];
    if (!src) return;
    image.src = src;
    image.alt = `Vergrote foto ${index + 2}`;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    image.src = '';
    document.body.style.overflow = '';
  };

  root.querySelectorAll('[data-lightbox-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number((button as HTMLElement).dataset.lightboxIndex) - 1;
      openAt(index);
    });
  });

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) close();
  });
}

export function refreshPreviewFrame(
  frame: Element,
  state: Parameters<typeof renderTenantPreview>[0],
  files: Parameters<typeof renderTenantPreview>[1],
  page: PreviewPage,
): void {
  frame.innerHTML = renderTenantPreview(state, files, page);
}
