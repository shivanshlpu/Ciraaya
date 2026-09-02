'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { handleImageError } from '@/lib/image-compressor';
import { getStoredBanner, BannerConfig, DEFAULT_BANNER } from '@/lib/banner-config';
import { Droplets, ShieldCheck, Sparkles, Truck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { products, categories } = useStore();
  const [banner, setBanner] = useState<BannerConfig>(DEFAULT_BANNER);

  // Sync banner dynamically from Admin CMS (with cross-tab reactive updates)
  useEffect(() => {
    setBanner(getStoredBanner());

    const handleBannerUpdate = () => {
      setBanner(getStoredBanner());
    };

    window.addEventListener('ciraaya-banner-updated', handleBannerUpdate);
    window.addEventListener('storage', handleBannerUpdate);
    return () => {
      window.removeEventListener('ciraaya-banner-updated', handleBannerUpdate);
      window.removeEventListener('storage', handleBannerUpdate);
    };
  }, []);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.tags?.includes('bestseller') || p.is_featured).slice(0, 4);

  // Top Flipkart-Style Circular Quick Categories
  const quickCategories = [
    {
      name: 'Necklaces',
      href: '/category/necklaces',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Earrings',
      href: '/category/earrings',
      img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Rings',
      href: '/category/rings',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Bangles',
      href: '/category/bangles',
      img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Bridal',
      href: '/category/bridal',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Waterproof',
      href: '/shop?material=Waterproof',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=250',
    },
    {
      name: 'Bestsellers',
      href: '/shop?tag=bestseller',
      img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=250',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ═══ 1. Flipkart-Style Top Circular Category Navigation Bar ════════ */}
      <div className="bg-white border-b border-[#EBE6DF] py-3.5 shadow-2xs">
        <div className="container-main">
          <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-1">
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center gap-1.5 group shrink-0"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border border-[#EBE6DF] group-hover:border-[#C5A059] group-hover:shadow-sm transition-all duration-300 overflow-hidden bg-[#FAFAF8]">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                    loading="eager"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#18181B] group-hover:text-[#C5A059] transition-colors whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 2. Clean E-Commerce Hero Banner (Auto-Fitting Container) ═══════ */}
      <section className="py-4 sm:py-6">
        <div className="container-main">
          <Link
            href={banner.linkUrl || '/shop'}
            className="group relative block w-full h-[230px] sm:h-[320px] md:h-[400px] lg:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden border border-[#EBE6DF] shadow-xs bg-[#18181B]"
          >
            {/* Auto-fits any resolution/aspect ratio without stretching */}
            <img
              src={banner.imageUrl || DEFAULT_BANNER.imageUrl}
              alt={banner.headline || 'CIRAAYA Jewellery'}
              onError={handleImageError}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
              loading="eager"
            />

            {/* Clean Typography Overlay (if enabled by admin) */}
            {banner.showOverlay && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex items-center p-6 sm:p-10 md:p-14">
                <div className="max-w-md sm:max-w-lg space-y-3 sm:space-y-4 text-left">
                  {banner.tagline && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#E8D5AA] text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>{banner.tagline}</span>
                    </div>
                  )}

                  <h1 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-normal leading-[1.1] text-white">
                    {banner.headline}
                  </h1>

                  {banner.subtitle && (
                    <p className="text-[#D4D4D8] text-xs sm:text-sm leading-relaxed max-w-sm sm:max-w-md line-clamp-2 sm:line-clamp-none">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="pt-1 sm:pt-2">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] group-hover:bg-[#9E7B32] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm">
                      <span>{banner.buttonText || 'Shop Collection'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Link>
        </div>
      </section>

      {/* ═══ 3. Trust Strip (100% SVG Icons - No AI Emojis) ═══════════════ */}
      <section className="py-2 border-b border-[#EBE6DF] bg-white">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-center">
            <div className="flex items-center justify-center gap-2.5 p-2">
              <Droplets className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">100% Waterproof</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">Anti-Tarnish Finish</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">100% Skin-Safe</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-2">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">Free Delivery &gt; ₹999</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. Deals of the Day / Trending Drops Grid ═══════════════════ */}
      <section className="py-10 md:py-14">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EBE6DF]">
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">
                Deals of the Day
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
                Trending <span className="italic font-serif-luxury text-[#C5A059]">Now</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#18181B] hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="ciraaya-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. Visual Category Tiles ═════════════════════════════════════ */}
      <section className="py-10 bg-white border-y border-[#EBE6DF]">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
              Explore By Category
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
              Curated <span className="italic font-serif-luxury text-[#C5A059]">Collections</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#FAFAF8] border border-[#EBE6DF] hover:border-[#C5A059] transition-all flex flex-col justify-end p-4 text-white shadow-xs"
              >
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 space-y-0.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#C5A059] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#A1A1AA] uppercase font-semibold flex items-center gap-1">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. Customer Favourites Grid ══════════════════════════════════ */}
      <section className="py-10 md:py-14">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EBE6DF]">
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">
                Customer Favourites
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
                Bestselling <span className="italic font-serif-luxury text-[#C5A059]">Pieces</span>
              </h2>
            </div>
            <Link
              href="/shop?tag=bestseller"
              className="text-xs font-bold text-[#18181B] hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="ciraaya-product-grid">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. Live Auto-Sync Instagram Feed ═════════════════════════════ */}
      <InstagramFeed />
    </div>
  );
}
