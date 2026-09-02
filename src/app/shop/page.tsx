'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { SkeletonProductGrid } from '@/components/ui/Skeleton';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialTag = searchParams.get('tag') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const { products, categories } = useStore();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    categorySlug: initialCategory,
    material: 'all',
    priceRange: 'all',
    tag: initialTag,
    inStockOnly: false,
    minRating: 0,
    search: initialSearch,
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.is_active) return false;

        if (filters.categorySlug !== 'all') {
          const cat = categories.find((c) => c.slug === filters.categorySlug);
          if (cat && p.category_id !== cat.id) return false;
        }

        if (filters.material !== 'all' && p.material !== filters.material) {
          return false;
        }

        const price = p.discount_price || p.price;
        if (filters.priceRange === 'under-1500' && price >= 1500) return false;
        if (filters.priceRange === '1500-3000' && (price < 1500 || price > 3000)) return false;
        if (filters.priceRange === '3000-5000' && (price < 3000 || price > 5000)) return false;
        if (filters.priceRange === 'above-5000' && price <= 5000) return false;

        if (filters.tag !== 'all' && (!p.tags || !p.tags.includes(filters.tag))) {
          return false;
        }

        if (filters.inStockOnly && p.stock_qty <= 0) return false;

        if (filters.minRating > 0 && p.rating < filters.minRating) return false;

        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesMat = p.material.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesMat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.tags?.includes('new-arrival') ? 1 : 0) - (a.tags?.includes('new-arrival') ? 1 : 0);
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [products, categories, filters, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      categorySlug: 'all',
      material: 'all',
      priceRange: 'all',
      tag: 'all',
      inStockOnly: false,
      minRating: 0,
      search: '',
    });
  };

  const activeFilterCount =
    (filters.categorySlug !== 'all' ? 1 : 0) +
    (filters.material !== 'all' ? 1 : 0) +
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.tag !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="py-6 md:py-10 bg-[#FAFAF8]">
      {/* ─── Minimal Header ─────────────────────────────── */}
      <div className="container-main mb-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#71717A] mb-3 flex items-center gap-2">
          <Link href="/" className="hover:text-[#18181B] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#18181B] font-semibold">Fine Jewellery</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-normal text-[#18181B]">
              Curated Jewellery <span className="italic text-[#C5A059]">Collection</span>
            </h1>
            <p className="text-xs text-[#71717A] mt-1">
              Waterproof • Anti-Tarnish • 100% Skin-Safe pieces engineered for everyday wear
            </p>
          </div>
        </div>
      </div>

      {/* ─── Controls Bar ─────────────────────────────── */}
      <div className="container-main mb-6">
        <div className="p-4 bg-white rounded-xl border border-[#EBE6DF] flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {/* Left: Result count & Active filter tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#18181B]">
              Showing <strong className="text-[#C5A059]">{filteredProducts.length}</strong> pieces
            </span>

            {activeFilterCount > 0 && (
              <>
                <span className="text-[#EBE6DF]">|</span>
                {filters.material !== 'all' && (
                  <span className="text-xs bg-[#FBF7EE] text-[#9E7B32] border border-[#E8D5AA] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    {filters.material}
                    <button onClick={() => setFilters({ ...filters, material: 'all' })} className="hover:text-black cursor-pointer">✕</button>
                  </span>
                )}
                {filters.priceRange !== 'all' && (
                  <span className="text-xs bg-[#FBF7EE] text-[#9E7B32] border border-[#E8D5AA] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    Price: {filters.priceRange}
                    <button onClick={() => setFilters({ ...filters, priceRange: 'all' })} className="hover:text-black cursor-pointer">✕</button>
                  </span>
                )}
                {filters.categorySlug !== 'all' && (
                  <span className="text-xs bg-[#FBF7EE] text-[#9E7B32] border border-[#E8D5AA] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    Category: {categories.find((c) => c.slug === filters.categorySlug)?.name || filters.categorySlug}
                    <button onClick={() => setFilters({ ...filters, categorySlug: 'all' })} className="hover:text-black cursor-pointer">✕</button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#C53030] hover:underline font-semibold ml-2 cursor-pointer"
                >
                  Reset all
                </button>
              </>
            )}
          </div>

          {/* Right: Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm"
            >
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#71717A] hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products"
                className="bg-[#FAFAF8] border border-[#EBE6DF] py-1.5 px-3 rounded-lg text-xs font-semibold text-[#18181B] outline-none cursor-pointer focus:border-[#C5A059]"
              >
                <option value="featured">Featured &amp; Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Shop Grid & Sidebar ─────────── */}
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar pb-6">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
              totalResults={filteredProducts.length}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="ciraaya-card p-12 bg-white text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FAFAF8] border border-[#EBE6DF] text-[#71717A] flex items-center justify-center mx-auto">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#18181B]">No Pieces Found</h3>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  We couldn&apos;t find any pieces matching your selected filters. Try clearing some filters to explore our full collection.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="ciraaya-product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Filter Drawer ─────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#18181B]/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full p-6 flex flex-col shadow-2xl z-10 ml-auto overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A059]">Catalogue</span>
                <h3 className="text-sm font-bold text-[#18181B]">Refine Selection</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-[#71717A] hover:text-[#18181B]"
              >
                ✕
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
              totalResults={filteredProducts.length}
              isDrawer={true}
            />

            <div className="border-t border-[#EBE6DF] pt-4 mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="ciraaya-btn ciraaya-btn-primary w-full text-xs"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-main py-20"><SkeletonProductGrid count={6} /></div>}>
      <ShopContent />
    </Suspense>
  );
}
