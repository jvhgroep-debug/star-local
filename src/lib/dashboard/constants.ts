import type { DashboardSection } from '../../types/dashboard';
import { BUILDER_START_PATH } from '../builder/constants';
import { EDITOR_PATH } from '../editor/constants';

export const DASHBOARD_PATH = '/dashboard/';

export const DASHBOARD_SECTIONS: { id: DashboardSection; label: string }[] = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'website', label: 'Mijn website' },
  { id: 'pages', label: "Pagina's" },
  { id: 'services', label: 'Diensten' },
  { id: 'contact', label: 'Contact' },
  { id: 'hours', label: 'Openingstijden' },
  { id: 'seo', label: 'SEO' },
  { id: 'images', label: 'Afbeeldingen' },
  { id: 'publish', label: 'Publiceren' },
  { id: 'settings', label: 'Instellingen' },
];

export const DASHBOARD_PAGES = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'Over ons', path: '/over-ons/' },
  { id: 'services', label: 'Diensten', path: '/diensten/' },
  { id: 'contact', label: 'Contact', path: '/contact/' },
  { id: 'privacy', label: 'Privacy', path: '/privacy/' },
] as const;

export { BUILDER_START_PATH, EDITOR_PATH };
