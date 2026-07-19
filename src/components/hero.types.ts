/** Star Local Hero v1 — shared props for {@link ../components/Hero.astro} and BaseLayout. */
export type HeroCtaVariant = 'primary' | 'secondary' | 'whatsapp';

export interface HeroCta {
  label: string;
  href: string;
  variant?: HeroCtaVariant;
  external?: boolean;
}

export interface HeroProps {
  /** Main heading (h1). */
  title: string;
  /** Optional eyebrow above the title. */
  subtitle?: string;
  /** Lead paragraph below the title. */
  intro?: string;
  /** Optional call-to-action buttons. */
  ctas?: HeroCta[];
  /** Optional USP bullet list (homepage). */
  usps?: string[];
  /** Background image URL. Defaults to hero-home-reference.png. */
  backgroundImage?: string;
  /** Accessible label for the hero section. */
  ariaLabel?: string;
}

export const HERO_V1_BACKGROUND = '/images/hero-home-reference.png';
