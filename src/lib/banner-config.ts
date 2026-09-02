/**
 * CIRAAYA Hero Banner Configuration & Storage Helper
 */

export interface BannerConfig {
  imageUrl: string;
  linkUrl: string;
  showOverlay: boolean;
  tagline: string;
  headline: string;
  subtitle: string;
  buttonText: string;
}

export const DEFAULT_BANNER: BannerConfig = {
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600',
  linkUrl: '/shop',
  showOverlay: true,
  tagline: 'Curated Everyday Jewellery',
  headline: 'Waterproof. Anti-Tarnish. Skin-Safe.',
  subtitle: 'Jewellery you never have to take off. Shower-safe, gym-proof & hypoallergenic.',
  buttonText: 'Shop Collection',
};

export const BANNER_STORAGE_KEY = 'ciraaya_homepage_banner';

export function getStoredBanner(): BannerConfig {
  if (typeof window === 'undefined') return DEFAULT_BANNER;
  try {
    const saved = localStorage.getItem(BANNER_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_BANNER, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Failed to parse banner config:', err);
  }
  return DEFAULT_BANNER;
}

export function saveStoredBanner(config: BannerConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(config));
    // Dispatch storage event for instant cross-tab or same-window reactive updates
    window.dispatchEvent(new Event('ciraaya-banner-updated'));
  } catch (err) {
    console.error('Failed to save banner config:', err);
  }
}
