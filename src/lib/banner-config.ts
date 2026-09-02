/**
 * CIRAAYA Hero Banner Carousel & Multi-Slide Storage Helper
 */

export interface BannerSlide {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title?: string;
  badge?: string;
}

export const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/shop',
    title: 'Everyday Waterproof Jewellery',
    badge: '100% WATERPROOF & ANTI-TARNISH',
  },
  {
    id: 'slide-2',
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/category/earrings',
    title: 'Aesthetic Everyday Hoops & Studs',
    badge: '100% SKIN-SAFE & HYPOALLERGENIC',
  },
  {
    id: 'slide-3',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/category/rings',
    title: 'Never-Turn-Green Stacking Rings',
    badge: 'SWEAT & SHOWER PROOF',
  },
  {
    id: 'slide-4',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/category/bridal',
    title: 'Regal Bridal & Festive Choker Sets',
    badge: 'FESTIVE STATEMENT EDIT',
  },
];

export const SLIDES_STORAGE_KEY = 'ciraaya_banner_slides';

export function getStoredSlides(): BannerSlide[] {
  if (typeof window === 'undefined') return DEFAULT_SLIDES;
  try {
    const saved = localStorage.getItem(SLIDES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse banner slides:', err);
  }
  return DEFAULT_SLIDES;
}

export function saveStoredSlides(slides: BannerSlide[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event('ciraaya-slides-updated'));
  } catch (err) {
    console.error('Failed to save banner slides:', err);
  }
}
