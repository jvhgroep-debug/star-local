function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const FREE_PACKAGE_FEATURES = [
  'Gratis subdomein (*.starlocal.nl)',
  'Star Local kleuren',
  'Standaard template',
  'Basis SEO',
  'Contactformulier',
  'Mobiel vriendelijk',
] as const;

export const PREMIUM_PACKAGE_FEATURES = [
  'Eigen domeinnaam',
  'Eigen e-mailadres',
  'Eigen logo',
  'Eigen kleuren / huisstijl',
  'Meer SEO',
  'Prioriteit support',
  'Geen Star Local branding',
  'Extra uitbreidingen',
] as const;

export function getFreePackageFeatures(subdomain?: string): string[] {
  return FREE_PACKAGE_FEATURES.map((feature) =>
    feature.includes('subdomein') && subdomain
      ? `Gratis subdomein (${subdomain})`
      : feature,
  );
}

export function renderPackageFeatureList(features: readonly string[]): string {
  return `
    <ul class="builder-package-features">
      ${features.map((feature) => `<li>✓ ${escapeHtml(feature)}</li>`).join('')}
    </ul>
  `;
}

export function renderPremiumUpsellNotice(): string {
  return `
    <aside class="builder-premium-upsell" aria-label="Premium huisstijl">
      <p>Eigen kleuren en volledige huisstijl zijn beschikbaar met Premium.</p>
      <button type="button" class="btn btn-secondary" data-premium-upgrade>Upgrade naar Premium</button>
    </aside>
  `;
}
