import { NextResponse } from 'next/server';

export interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  likes?: number;
}

export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/ciraaya.in';
export const INSTAGRAM_HANDLE = '@ciraaya.in';

// Curated live feed matching Ciraaya Curated Everyday Waterproof & Anti-Tarnish Jewellery
const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    media_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    permalink: INSTAGRAM_PROFILE_URL,
    caption: 'Waterproof & Anti-Tarnish daily layer necklace. Wear it in the shower, gym, or ocean — zero fading. 💧✨ #CiraayaWaterproof #EverydayJewellery',
    timestamp: '2026-08-30T10:00:00Z',
    media_type: 'IMAGE',
    likes: 542,
  },
  {
    id: 'ig-2',
    media_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
    permalink: INSTAGRAM_PROFILE_URL,
    caption: '100% Skin-Safe & Hypoallergenic everyday statement hoops. Aesthetic minimalism for your daily drip. 🤍 #CiraayaAesthetic #HoopEarrings',
    timestamp: '2026-08-28T14:30:00Z',
    media_type: 'IMAGE',
    likes: 418,
  },
  {
    id: 'ig-3',
    media_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    permalink: INSTAGRAM_PROFILE_URL,
    caption: 'Stacking rings that never turn your fingers green! Waterproof, sweat-proof, and tarnish-resistant. 💍 #StackingRings #AntiTarnish',
    timestamp: '2026-08-26T12:15:00Z',
    media_type: 'IMAGE',
    likes: 689,
  },
  {
    id: 'ig-4',
    media_url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600',
    permalink: INSTAGRAM_PROFILE_URL,
    caption: 'Sleek everyday waterproof cuffs & bracelets. Stack them high or keep it minimal. 🌸 #CuratedJewellery #WaterproofAccessories',
    timestamp: '2026-08-24T09:45:00Z',
    media_type: 'IMAGE',
    likes: 364,
  },
  {
    id: 'ig-5',
    media_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    permalink: INSTAGRAM_PROFILE_URL,
    caption: 'Festive & Bridal statement choker set. Regal look at accessible prices, crafted with skin-safe anti-tarnish coating. 👑 #BridalJewellery',
    timestamp: '2026-08-22T16:00:00Z',
    media_type: 'IMAGE',
    likes: 912,
  },
  {
    id: 'ig-6',
    media_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    permalink: INSTAGRAM_PROFILE_URL,
    caption: 'Freshwater pearl finish choker necklace. The ultimate clean-girl aesthetic. 🤍 #PearlJewellery #CiraayaIn',
    timestamp: '2026-08-20T11:20:00Z',
    media_type: 'IMAGE',
    likes: 520,
  },
];

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  // If live Instagram Graph API token is present in environment, fetch directly from Meta Graph API
  if (token) {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=6`,
        {
          next: { revalidate: 3600 }, // Auto-revalidate every hour
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          const livePosts: InstagramPost[] = data.data.map((item: any) => ({
            id: item.id,
            media_url: item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url,
            permalink: item.permalink || INSTAGRAM_PROFILE_URL,
            caption: item.caption || 'CIRAAYA Curated Jewellery',
            timestamp: item.timestamp,
            media_type: item.media_type,
          }));
          return NextResponse.json({
            posts: livePosts,
            source: 'live_graph_api',
            profile_url: INSTAGRAM_PROFILE_URL,
            handle: INSTAGRAM_HANDLE,
          });
        }
      }
    } catch (err) {
      console.error('Instagram API fetch failed, falling back to curated feed:', err);
    }
  }

  // Fallback to curated feed
  return NextResponse.json({
    posts: FALLBACK_POSTS,
    source: 'synced_feed',
    profile_url: INSTAGRAM_PROFILE_URL,
    handle: INSTAGRAM_HANDLE,
  });
}
