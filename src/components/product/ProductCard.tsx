'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
}

export function ProductCard({ product, priorityImage = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const primaryImage =
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';

  const secondaryImage = product.images?.[1]?.image_url;

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;

  return (
    <div className="ciraaya-card group relative flex flex-col h-full bg-white overflow-hidden">
      {/* Image & Badges Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAFAF8]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* Main Vivid Color Image */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              secondaryImage ? 'group-hover:opacity-0 transition-opacity duration-300' : ''
            }`}
            loading={priorityImage ? 'eager' : 'lazy'}
          />

          {/* Secondary Image on Hover */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} detail view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges: Discount / Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {discountPercent && (
            <span className="ciraaya-badge-gold shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.tags?.includes('bestseller') && (
            <span className="ciraaya-badge-dark shadow-xs">
              Bestseller
            </span>
          )}
          {product.tags?.includes('new-arrival') && (
            <span className="ciraaya-badge-success shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-full
            flex items-center justify-center
            transition-all duration-200 cursor-pointer z-10 shadow-xs
            border border-[#EBE6DF]
            ${
              isWishlisted
                ? 'bg-[#18181B] text-[#C5A059]'
                : 'bg-white/90 text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }
          `}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, product.variants?.[0] || null);
            }}
            className="w-full py-2.5 px-4 bg-[#18181B] hover:bg-[#C5A059] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>+ Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          {/* Material & Rating */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E7B32] bg-[#FBF7EE] border border-[#E8D5AA] px-2 py-0.5 rounded">
              {product.material}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#71717A] font-medium">
              <span className="text-[#C5A059]">★</span>
              <span className="text-[#18181B] font-bold">{product.rating.toFixed(1)}</span>
              <span>({product.review_count})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#C5A059] transition-colors mb-2">
            <h3 className="text-xs sm:text-sm font-semibold text-[#18181B] product-card-title leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Row & Mobile Add Action */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-[#EBE6DF]">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-[#18181B] tracking-tight">
              ₹{(product.discount_price || product.price).toLocaleString('en-IN')}
            </span>
            {product.discount_price && (
              <span className="text-xs text-[#A1A1AA] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Quick Add */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, product.variants?.[0] || null);
            }}
            aria-label={`Quick add ${product.name} to bag`}
            className="sm:hidden px-3 py-1 bg-[#18181B] hover:bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
