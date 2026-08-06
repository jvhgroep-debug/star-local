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

  root.querySelectorAll('.tenant-form').forEach((formElement) => {
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      void submitTenantContactForm(formElement as HTMLFormElement);
    });
  });

  bindLightbox(root);
}

async function submitTenantContactForm(form: HTMLFormElement): Promise<void> {
  const status = form.querySelector('.tenant-form__status') as HTMLElement | null;
  const submitButton = form.querySelector('.tenant-form__submit') as HTMLButtonElement | null;

  const setStatus = (message: string, isError: boolean) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.classList.toggle('tenant-form__status--error', isError);
    status.classList.toggle('tenant-form__status--success', !isError);
  };

  const formData = new FormData(form);
  const payload = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    message: String(formData.get('message') ?? ''),
    website: String(formData.get('website') ?? ''),
    recipientEmail: form.dataset.tenantEmail ?? '',
    businessName: form.dataset.businessName ?? '',
    tenantId: form.dataset.tenantId ?? '',
  };

  if (!payload.name.trim() || !payload.email.trim() || !payload.message.trim()) {
    setStatus('Vul naam, e-mail en bericht in.', true);
    return;
  }

  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch('/api/website/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };

    if (result.ok) {
      form.reset();
      setStatus(result.message ?? 'Bedankt! Uw bericht is verzonden.', false);
    } else {
      setStatus(result.message ?? 'Verzenden mislukt. Probeer het later opnieuw.', true);
    }
  } catch {
    setStatus('Verzenden mislukt. Controleer uw internetverbinding.', true);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

function closeMobileMenu(root: ParentNode): void {
  const nav = root.querySelector('.tenant-nav');
  const toggle = root.querySelector('.tenant-menu-toggle') as HTMLButtonElement | null;
  nav?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Menu openen');
}

/** Reset preview lightbox state without touching global generate/save overlays. */
export function resetPreviewOverlayState(scope: ParentNode = document): void {
  scope.querySelectorAll('.tenant-lightbox').forEach((element) => {
    element.hidden = true;
    element.setAttribute('aria-hidden', 'true');
    const image = element.querySelector('.tenant-lightbox__image') as HTMLImageElement | null;
    if (image) image.src = '';
  });

  scope.querySelectorAll('.builder-live-preview__frame.is-lightbox-open').forEach((frame) => {
    frame.classList.remove('is-lightbox-open');
  });

  document.body.style.overflow = '';
  document.body.style.pointerEvents = '';
  document.documentElement.style.overflow = '';
  document.body.removeAttribute('aria-busy');
  document.documentElement.removeAttribute('aria-busy');
}

function bindLightbox(root: ParentNode): void {
  const lightbox = root.querySelector('.tenant-lightbox') as HTMLElement | null;
  const image = root.querySelector('.tenant-lightbox__image') as HTMLImageElement | null;
  const closeBtn = root.querySelector('.tenant-lightbox__close') as HTMLButtonElement | null;
  if (!lightbox || !image) return;

  const previewFrame = root.closest('.builder-live-preview__frame') as HTMLElement | null;
  const isBuilderPreview = Boolean(previewFrame);

  const sources = [...root.querySelectorAll('[data-lightbox-src]')].map(
    (node) => (node as HTMLElement).dataset.lightboxSrc ?? '',
  );

  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    image.src = '';
    if (isBuilderPreview && previewFrame) {
      previewFrame.classList.remove('is-lightbox-open');
    } else {
      document.body.style.overflow = '';
    }
    document.removeEventListener('keydown', onEscape);
  };

  const onEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  const openAt = (index: number) => {
    const src = sources[index];
    if (!src) return;
    try {
      image.src = src;
      image.alt = `Vergrote foto ${index + 2}`;
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      if (isBuilderPreview && previewFrame) {
        previewFrame.classList.add('is-lightbox-open');
      } else {
        document.body.style.overflow = 'hidden';
      }
      closeBtn?.focus();
      document.addEventListener('keydown', onEscape);
    } catch {
      close();
    }
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
}

export function refreshPreviewFrame(
  frame: Element,
  state: Parameters<typeof renderTenantPreview>[0],
  files: Parameters<typeof renderTenantPreview>[1],
  page: PreviewPage,
): void {
  frame.innerHTML = renderTenantPreview(state, files, page);
}

