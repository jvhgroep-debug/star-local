export type DonationCampaignStatus = 'active' | 'inactive';

export interface DonationCampaign {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  goalAmount: number;
  raisedAmount: number;
  /** Stripe Buy Button ID (bijv. buy_btn_...) — geen secret keys in frontend. */
  stripeBuyButtonId: string;
  status: DonationCampaignStatus;
  currency: 'EUR';
}

export interface RecentDonation {
  campaignId: string;
  name: string;
  amount: number;
  /** ISO-datum (YYYY-MM-DD) */
  date: string;
}

/** Stripe publishable key — uitsluitend pk_live_ / pk_test_, nooit sk_live_. */
export const STRIPE_PUBLISHABLE_KEY =
  'pk_live_51IkUtQCs3IMvZLmEPNgbBiV4JIaVExTV16biODaBV9cuQAgc6NlKbJYGAQleSurHUArx8wNFihtdOoXeiFNFinao00uv0FbJVG';

/**
 * Donatiecampagnes — voeg hier nieuwe acties toe.
 *
 * Stripe Buy Button ID invullen per campagne in `stripeBuyButtonId`.
 * Opgehaald bedrag handmatig bijwerken via `raisedAmount`.
 */
export const donationCampaigns: DonationCampaign[] = [
  {
    id: 'johan-op-reis-camper',
    slug: 'johan-op-reis-camper',
    title: 'Johan op reis – Camperreis Nederland',
    shortDescription:
      'Steun onze camperreis door Nederland. Met jouw donatie help je ons onderweg te blijven en avonturen te delen vanuit onze camper.',
    image: '/images/johan-op-reis-vierkant.png',
    imageAlt: 'Johan op reis – Camperreis Nederland',
    goalAmount: 1000,
    raisedAmount: 376.5,
    stripeBuyButtonId: 'buy_btn_1U4xopCs3IMvZLmEhpKVubUT',
    status: 'active',
    currency: 'EUR',
  },
];

/**
 * Recente donaties — voeg hier nieuwe entries toe (nieuwste bovenaan).
 * `raisedAmount` in de campagne handmatig synchroon houden.
 */
export const recentDonations: RecentDonation[] = [
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Elly',
    amount: 25,
    date: '2026-08-19',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'G. Rotterdam',
    amount: 0.5,
    date: '2026-08-16',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Remon',
    amount: 1,
    date: '2026-08-16',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Bianca',
    amount: 25,
    date: '2026-08-16',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Fam. Van der Belt',
    amount: 25,
    date: '2026-08-16',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Dennis',
    amount: 100,
    date: '2026-08-16',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Anoniem',
    amount: 150,
    date: '2026-08-15',
  },
  {
    campaignId: 'johan-op-reis-camper',
    name: 'Moustafa',
    amount: 50,
    date: '2026-08-15',
  },
];

export function getRecentDonationsForCampaign(campaignId: string): RecentDonation[] {
  return recentDonations
    .filter((donation) => donation.campaignId === campaignId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDonationDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

export function getActiveDonationCampaigns(): DonationCampaign[] {
  return donationCampaigns.filter((campaign) => campaign.status === 'active');
}

export function formatEuro(amount: number, currency: DonationCampaign['currency'] = 'EUR'): string {
  const fractionDigits = amount % 1 !== 0 || amount < 10 ? 2 : 0;
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function getDonationProgress(campaign: DonationCampaign): {
  percent: number;
  percentFormatted: string;
  raisedFormatted: string;
  goalFormatted: string;
} {
  const percent =
    campaign.goalAmount > 0
      ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 10000) / 100)
      : 0;

  const percentFormatted = new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: percent % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(percent);

  return {
    percent,
    percentFormatted,
    raisedFormatted: formatEuro(campaign.raisedAmount, campaign.currency),
    goalFormatted: formatEuro(campaign.goalAmount, campaign.currency),
  };
}
