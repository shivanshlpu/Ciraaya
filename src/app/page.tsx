'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { BannerSlider } from '@/components/home/BannerSlider';
import { handleImageError } from '@/lib/image-compressor';
import { Droplets, ShieldCheck, Sparkles, Truck, ArrowRight, History } from 'lucide-react';
import { Product, Category } from '@/types/database';

export default function HomePage() {
  const { products, categories } = useStore();
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load recently viewed products (Flipkart / Amazon style)
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const savedIds: string[] = JSON.parse(
          localStorage.getItem('ciraaya_recently_viewed') || '[]'
        );

        if (savedIds.length > 0) {
          const matched = savedIds
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is Product => Boolean(p));
          setRecentlyViewed(matched);
        } else {
          // If none viewed yet, seed the first 2 popular pieces as initial browsing suggestions
          const initialSuggestions = products.slice(0, 2);
          setRecentlyViewed(initialSuggestions);
        }
      } catch {
        setRecentlyViewed([]);
      }
    };

    loadRecentlyViewed();

    window.addEventListener('ciraaya-recently-viewed-updated', loadRecentlyViewed);
    window.addEventListener('storage', loadRecentlyViewed);
    return () => {
      window.removeEventListener('ciraaya-recently-viewed-updated', loadRecentlyViewed);
      window.removeEventListener('storage', loadRecentlyViewed);
    };
  }, [products]);

  const handleClearHistory = () => {
    localStorage.removeItem('ciraaya_recently_viewed');
    setRecentlyViewed([]);
  };

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.tags?.includes('bestseller') || p.is_featured).slice(0, 4);

  // Top Flipkart-Style Circular Quick Categories (100% Dynamic from Admin Categories)
  const quickCategories = useMemo(() => {
    return categories.map((cat) => ({
      name: cat.name,
      href: `/category/${cat.slug}`,
      img: cat.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=250',
    }));
  }, [categories]);

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
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full p-0.5 border border-[#EBE6DF] group-hover:border-[#C5A059] group-hover:shadow-sm transition-all duration-300 overflow-hidden bg-[#FAFAF8]">
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

      {/* ═══ 2. Pure Visual Hero Banner Slider (Timer Carousel) ═══════════ */}
      <BannerSlider />

      {/* ═══ 3. Trust Badges Strip (100% Minimalist SVGs) ═════════════════ */}
      <section className="py-2 border-b border-[#EBE6DF] bg-white">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 text-center">
            <div className="flex items-center justify-center gap-2 p-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">100% Waterproof</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">Anti-Tarnish Finish</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">100% Skin-Safe</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#18181B]">Free Delivery &gt; ₹999</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. "Still looking for these?" (Flipkart / Amazon Feature) ════ */}
      {recentlyViewed.length > 0 && (
        <section className="py-8 bg-white border-b border-[#EBE6DF]">
          <div className="container-main">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EBE6DF]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#C5A059]" />
                <h2 className="text-sm sm:text-base font-bold text-[#18181B]">
                  Still looking for these?
                </h2>
                <span className="text-[11px] text-[#71717A] hidden sm:inline">
                  — Inspired by your browsing history
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[11px] font-semibold text-[#71717A] hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="ciraaya-product-grid">
              {recentlyViewed.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 5. Deals of the Day / Trending Drops Grid ═══════════════════ */}
      <section className="py-8 md:py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#EBE6DF]">
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">
                Deals of the Day
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#18181B]">
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

      {/* ═══ 6. Visual Category Tiles ═════════════════════════════════════ */}
      <section className="py-8 bg-white border-y border-[#EBE6DF]">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
              Explore By Category
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#18181B]">
              Curated <span className="italic font-serif-luxury text-[#C5A059]">Collections</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl bg-[#FAFAF8] border border-[#EBE6DF] hover:border-[#C5A059] transition-all flex flex-col justify-end p-3 sm:p-4 text-white shadow-2xs"
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
                  <span className="text-[9px] sm:text-[10px] text-[#A1A1AA] uppercase font-semibold flex items-center gap-1">
                    <span>Shop Now</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. Customer Favourites Grid ══════════════════════════════════ */}
      <section className="py-8 md:py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#EBE6DF]">
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">
                Customer Favourites
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#18181B]">
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

      {/* ═══ 8. Live Auto-Sync Instagram Feed ═════════════════════════════ */}
      <InstagramFeed />
    </div>
  );
}
