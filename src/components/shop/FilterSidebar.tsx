'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export interface FilterState {
  categorySlug: string;
  material: string;
  priceRange: string;
  tag: string;
  inStockOnly: boolean;
  minRating: number;
  search: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  totalResults: number;
  isDrawer?: boolean;
}

const MATERIALS = ['All Materials', 'Waterproof', 'Anti-Tarnish', 'Gold Plated', 'Pearl', 'Kundan'];
const PRICE_PRESETS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹1,000', value: 'under-1500' },
  { label: '₹1,000 – ₹2,500', value: '1500-3000' },
  { label: '₹2,500 – ₹4,000', value: '3000-5000' },
  { label: 'Above ₹4,000', value: 'above-5000' },
];
const OCCASIONS = [
  { label: 'All Occasions', value: 'all' },
  { label: 'Daily Aesthetic', value: 'daily-wear' },
  { label: 'Party & Festive', value: 'festive' },
  { label: 'Bridal Edit', value: 'bridal' },
  { label: 'New Drops', value: 'new-arrival' },
  { label: 'Bestsellers', value: 'bestseller' },
];

export function FilterSidebar({ filters, onChange, onClear, totalResults, isDrawer = false }: FilterSidebarProps) {
  const { categories, products } = useStore();

  // Accordion dropdown states: default open for primary filters
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    material: true,
    price: true,
    occasion: false,
    stock: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const update = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return products.length;
    const cat = categories.find((c) => c.slug === slug);
    return cat ? products.filter((p) => p.category_id === cat.id).length : 0;
  };

  const getMaterialCount = (mat: string) => {
    if (mat === 'All Materials') return products.length;
    return products.filter((p) => p.material === mat).length;
  };

  const hasActiveFilters =
    filters.categorySlug !== 'all' ||
    filters.material !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.tag !== 'all' ||
    filters.inStockOnly;

  return (
    <div className={`space-y-4 ${isDrawer ? 'bg-white p-2' : 'ciraaya-card p-5 bg-white'}`}>
      {/* Header with Results count and Clear Action */}
      <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-3">
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-[#18181B]">
            Filters
          </h2>
          <p className="text-[11px] text-[#71717A] mt-0.5">{totalResults} pieces</p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[#C5A059] hover:text-[#9E7B32] font-semibold tracking-wider uppercase underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── 1. Category Accordion ── */}
      <div className="border-b border-[#EBE6DF] pb-3">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
          aria-expanded={openSections.category}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider group-hover:text-[#C5A059] transition-colors">
              Category
            </span>
            {filters.categorySlug !== 'all' && (
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" title="Filter active" />
            )}
          </div>
          <span className={`text-xs text-[#71717A] transition-transform duration-200 ${openSections.category ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-2.5 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => update('categorySlug', 'all')}
              className={`filter-row-btn ${filters.categorySlug === 'all' ? 'filter-row-btn-active' : ''}`}
            >
              <span>All Categories</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${filters.categorySlug === 'all' ? 'bg-[#C5A059] text-white' : 'bg-[#FAFAF8] text-[#71717A] border border-[#EBE6DF]'}`}>
                {getCategoryCount('all')}
              </span>
            </button>
            {categories.map((cat) => {
              const isSelected = filters.categorySlug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => update('categorySlug', cat.slug)}
                  className={`filter-row-btn ${isSelected ? 'filter-row-btn-active' : ''}`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${isSelected ? 'bg-[#C5A059] text-white' : 'bg-[#FAFAF8] text-[#71717A] border border-[#EBE6DF]'}`}>
                    {getCategoryCount(cat.slug)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 2. Material & Finish Accordion ── */}
      <div className="border-b border-[#EBE6DF] pb-3">
        <button
          type="button"
          onClick={() => toggleSection('material')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
          aria-expanded={openSections.material}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider group-hover:text-[#C5A059] transition-colors">
              Material &amp; Finish
            </span>
            {filters.material !== 'all' && (
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" title="Filter active" />
            )}
          </div>
          <span className={`text-xs text-[#71717A] transition-transform duration-200 ${openSections.material ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {openSections.material && (
          <div className="space-y-1 pt-2.5 animate-in fade-in duration-200">
            {MATERIALS.map((mat) => {
              const isSelected = (mat === 'All Materials' && filters.material === 'all') || filters.material === mat;
              return (
                <button
                  key={mat}
                  type="button"
                  onClick={() => update('material', mat === 'All Materials' ? 'all' : mat)}
                  className={`filter-row-btn ${isSelected ? 'filter-row-btn-active' : ''}`}
                >
                  <span>{mat}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${isSelected ? 'bg-[#C5A059] text-white' : 'bg-[#FAFAF8] text-[#71717A] border border-[#EBE6DF]'}`}>
                    {getMaterialCount(mat)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 3. Price Range Accordion ── */}
      <div className="border-b border-[#EBE6DF] pb-3">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
          aria-expanded={openSections.price}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider group-hover:text-[#C5A059] transition-colors">
              Price Range
            </span>
            {filters.priceRange !== 'all' && (
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" title="Filter active" />
            )}
          </div>
          <span className={`text-xs text-[#71717A] transition-transform duration-200 ${openSections.price ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {openSections.price && (
          <div className="space-y-1 pt-2.5 animate-in fade-in duration-200">
            {PRICE_PRESETS.map((preset) => {
              const isSelected = filters.priceRange === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => update('priceRange', preset.value)}
                  className={`filter-row-btn ${isSelected ? 'filter-row-btn-active' : ''}`}
                >
                  <span>{preset.label}</span>
                  {isSelected && <span className="text-[#9E7B32] font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 4. Occasion & Style Accordion ── */}
      <div className="border-b border-[#EBE6DF] pb-3">
        <button
          type="button"
          onClick={() => toggleSection('occasion')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
          aria-expanded={openSections.occasion}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider group-hover:text-[#C5A059] transition-colors">
              Occasion &amp; Style
            </span>
            {filters.tag !== 'all' && (
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" title="Filter active" />
            )}
          </div>
          <span className={`text-xs text-[#71717A] transition-transform duration-200 ${openSections.occasion ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {openSections.occasion && (
          <div className="space-y-1 pt-2.5 animate-in fade-in duration-200">
            {OCCASIONS.map((occ) => {
              const isSelected = filters.tag === occ.value;
              return (
                <button
                  key={occ.value}
                  type="button"
                  onClick={() => update('tag', occ.value)}
                  className={`filter-row-btn ${isSelected ? 'filter-row-btn-active' : ''}`}
                >
                  <span>{occ.label}</span>
                  {isSelected && <span className="text-[#9E7B32] font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. In Stock Availability ── */}
      <div className="pt-1">
        <button
          type="button"
          role="switch"
          aria-checked={filters.inStockOnly}
          onClick={() => update('inStockOnly', !filters.inStockOnly)}
          className={`
            w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left
            ${filters.inStockOnly ? 'bg-[#FBF7EE] border-[#E8D5AA]' : 'bg-[#FAFAF8] border-[#EBE6DF]'}
          `}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] block">In Stock Only</span>
            <span className="text-[11px] text-[#71717A]">Hide out-of-stock pieces</span>
          </div>

          <div
            className={`w-8 h-4.5 p-0.5 rounded-full transition-colors duration-200 shrink-0 ${
              filters.inStockOnly ? 'bg-[#C5A059]' : 'bg-[#D8D2C7]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${
                filters.inStockOnly ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
