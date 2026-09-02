'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { InstagramFeed } from '@/components/home/InstagramFeed';

export default function HomePage() {
  const { products, categories } = useStore();

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ═══ 1. Hero Section: Curated Everyday Jewellery ══════════ */}
      <section className="relative overflow-hidden border-b border-[#EBE6DF] py-14 md:py-20 bg-[#FAFAF8]">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EBE6DF] text-[#C5A059] text-[11px] font-bold uppercase tracking-widest shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                <span>Curated Jewellery Collection</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-normal text-[#18181B] leading-[1.08] tracking-tight">
                Waterproof. <br />
                <span className="italic text-[#C5A059]">Anti-Tarnish.</span> <br />
                Skin-Safe.
              </h1>

              <p className="text-[#71717A] text-sm md:text-base max-w-xl leading-relaxed">
                Elevate your everyday aesthetic with jewellery you never have to take off.
                Engineered for daily life — sweat-proof in the gym, safe in the shower, and hypoallergenic for sensitive skin.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-lg w-full sm:w-auto">
                  Shop Curated Pieces
                </Link>
                <Link href="/category/necklaces" className="ciraaya-btn ciraaya-btn-outline ciraaya-btn-lg w-full sm:w-auto">
                  Explore Necklaces
                </Link>
              </div>

              {/* Core Feature Pillars */}
              <div className="pt-6 border-t border-[#EBE6DF] grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <span className="text-lg font-bold text-[#18181B] block">100%</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A]">Waterproof</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#18181B] block">Zero Fade</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A]">Anti-Tarnish</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#18181B] block">Hypoallergenic</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A]">100% Skin-Safe</span>
                </div>
              </div>
            </div>

            {/* Right Column: Aesthetic Lifestyle Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200"
                  alt="CIRAAYA Waterproof Curated Jewellery"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/90 via-[#18181B]/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] mb-1">
                    Daily Wear Essential
                  </span>
                  <h3 className="text-2xl font-serif-luxury font-normal text-white">
                    Waterproof Layer Necklace
                  </h3>
                  <Link href="/shop" className="text-xs text-[#EBE6DF] uppercase tracking-wider mt-2 font-semibold hover:text-[#C5A059] transition-colors">
                    Explore Drop →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. Key Pillars: Why Ciraaya ══════════════════════ */}
      <section className="border-b border-[#EBE6DF] bg-white py-10">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">01 / Waterproof</span>
              <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Shower &amp; Gym Proof</h4>
              <p className="text-xs text-[#71717A]">Wear it 24/7 without worrying about water damage</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">02 / Anti-Tarnish</span>
              <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Never Turns Green</h4>
              <p className="text-xs text-[#71717A]">Advanced coating engineered for long-lasting shine</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">03 / Skin-Safe</span>
              <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Hypoallergenic</h4>
              <p className="text-xs text-[#71717A]">100% nickel and lead free for sensitive skin</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block">04 / Delivery</span>
              <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Express Dispatch</h4>
              <p className="text-xs text-[#71717A]">Free insured doorstep delivery above ₹999</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. Curated Categories ═════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
              Curated Collections
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#18181B]">
              Shop by <span className="italic text-[#C5A059]">Category</span>
            </h2>
            <p className="text-[#71717A] text-xs sm:text-sm leading-relaxed">
              Find your signature everyday pieces — minimalist, trendy, and made for nonstop wear.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-[#EBE6DF] shadow-xs hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-end p-5 text-white"
              >
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/85 via-[#18181B]/20 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#C5A059] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] uppercase font-semibold text-[#A1A1AA] tracking-wider block">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. Trending Pieces ════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white border-y border-[#EBE6DF]">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EBE6DF] gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block mb-1">
                Everyday Bestsellers
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#18181B]">
                Trending <span className="italic text-[#C5A059]">Now</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest font-bold text-[#18181B] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Explore All Pieces</span>
              <span>→</span>
            </Link>
          </div>

          <div className="ciraaya-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. Anti-Tarnish & Waterproof Showcase ═════════════ */}
      <section className="py-20 md:py-28 bg-[#18181B] text-[#FAFAF8] relative overflow-hidden">
        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C5A059]"></span>
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#C5A059]">
                  Engineered For Everyday Life
                </span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-normal text-[#FAFAF8] leading-[1.1]">
                Jewellery You Never <br />
                <span className="italic text-[#C5A059]">Have To Take Off.</span>
              </h2>

              <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed">
                Whether you’re heading to the gym, jumping in the shower, or stepping out for dinner, our waterproof and anti-tarnish curated pieces are crafted to stay pristine and sparkling every single day.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="ciraaya-btn ciraaya-btn-gold w-full sm:w-auto"
                >
                  Shop Waterproof Collection
                </Link>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ciraaya-btn ciraaya-btn-outline-white w-full sm:w-auto"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
                  alt="Ciraaya Anti Tarnish Waterproof Jewellery"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. Customer Love (Testimonials) ═══════════════════ */}
      <section className="py-16 md:py-24 bg-[#FAFAF8] border-b border-[#EBE6DF]">
        <div className="container-main text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block mb-1">
            Real Reviews
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#18181B] mb-12">
            Loved by <span className="italic text-[#C5A059]">Everyday Queens</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                name: 'Ananya S.',
                city: 'Mumbai',
                review: 'I wear this chain in the shower and gym every single day — no color fading, no green marks on my skin. Genuinely 100% waterproof!',
                rating: 5,
              },
              {
                name: 'Rhea K.',
                city: 'Delhi',
                review: 'Super sensitive skin usually reacts to imitation jewellery, but Ciraaya is completely hypoallergenic and skin-safe. Love the aesthetic!',
                rating: 5,
              },
              {
                name: 'Meera N.',
                city: 'Bangalore',
                review: 'Fast delivery, beautiful packaging, and the rings fit perfectly. Stacking them daily for work and parties!',
                rating: 5,
              },
            ].map((t) => (
              <div key={t.name} className="ciraaya-card p-6 bg-white flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[#C5A059] text-xs">{'★'.repeat(t.rating)}</div>
                  <p className="text-xs text-[#71717A] italic leading-relaxed font-serif-luxury">&ldquo;{t.review}&rdquo;</p>
                </div>
                <div className="pt-3 border-t border-[#EBE6DF]">
                  <p className="font-bold text-[#18181B] text-xs uppercase tracking-wider">{t.name}</p>
                  <p className="text-[10px] text-[#A1A1AA] mt-0.5">{t.city} • Verified Buyer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. Live Instagram Auto-Updating Feed ══════════════ */}
      <InstagramFeed />
    </div>
  );
}
