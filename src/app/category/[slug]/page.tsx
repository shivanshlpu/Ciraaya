'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { categories, products } = useStore();
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const category = categories.find((c) => c.slug === slug);
  const rawProducts = products.filter((p) => {
    if (!p.is_active) return false;
    if (category) return p.category_id === category.id;
    return p.tags?.includes(slug);
  });

  const sortedProducts = useMemo(() => {
    return [...rawProducts].sort((a, b) => {
      const priceA = a.discount_price || a.price;
      const priceB = b.discount_price || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.tags?.includes('new-arrival') ? 1 : 0) - (a.tags?.includes('new-arrival') ? 1 : 0);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [rawProducts, sortBy]);

  const categoryTitle = category ? category.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="py-6 md:py-10 bg-[#FAFAF8]">
      <div className="container-main">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[#71717A] mb-3 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#18181B] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#18181B] transition-colors">Catalogue</Link>
          <span>/</span>
          <span className="text-[#18181B] font-semibold">{categoryTitle}</span>
        </nav>

        {/* Minimal Unboxed Category Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 mb-6 border-b border-[#EBE6DF]">
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#18181B]">
              {categoryTitle}
            </h1>
            <p className="text-xs text-[#71717A] mt-1">
              {category?.description || `Explore our handcrafted collection of ${categoryTitle.toLowerCase()}.`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-[#18181B] whitespace-nowrap">
              Showing <strong className="text-[#C5A059]">{sortedProducts.length}</strong> creations
            </span>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort creations"
                className="bg-white border border-[#EBE6DF] py-1.5 px-3 rounded-lg text-xs font-semibold text-[#18181B] outline-none cursor-pointer focus:border-[#C5A059]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="ciraaya-card p-12 bg-white text-center max-w-md mx-auto my-8 space-y-4">
            <h3 className="text-base font-bold text-[#18181B]">New Creations in Preparation</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              We are currently curating exquisite new creations for this collection.
            </p>
            <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm">
              Explore All Jewellery
            </Link>
          </div>
        ) : (
          <div className="ciraaya-product-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
