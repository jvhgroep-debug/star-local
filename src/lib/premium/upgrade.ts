/** Premium upgrade — contactaanvraag (geen betaalintegratie in V1). */
export const PREMIUM_REQUEST_SUBJECT = 'Premium website (€9,95/maand)';

export const PREMIUM_BUTTON_LABEL = 'Premium aanvragen';

export const PREMIUM_REQUEST_MESSAGE =
  'Ik wil graag Premium aanvragen voor mijn Star Local website. Premium kost €9,95 per maand. Neem contact met mij op over de upgrade.';

export function getPremiumRequestUrl(): string {
  const params = new URLSearchParams({
    onderwerp: PREMIUM_REQUEST_SUBJECT,
    bericht: PREMIUM_REQUEST_MESSAGE,
  });
  return `/contact/?${params.toString()}`;
}

export function openPremiumUpgradeRequest(): void {
  window.location.assign(getPremiumRequestUrl());
}

export function renderPremiumUpgradeAnchor(className: string, extraAttrs = ''): string {
  const href = getPremiumRequestUrl()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
  const attrs = extraAttrs ? ` ${extraAttrs}` : '';
  return `<a href="${href}" class="${className}" data-premium-upgrade${attrs}>${PREMIUM_BUTTON_LABEL}</a>`;
}

/** Koppel Premium-knoppen aan de contactaanvraagroute (fallback naast href). */
export function bindPremiumUpgradeButtons(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('[data-premium-upgrade]').forEach((element) => {
    element.addEventListener('click', (event) => {
      if (element instanceof HTMLAnchorElement && event.metaKey) return;
      event.preventDefault();
      openPremiumUpgradeRequest();
    });
  });
}
