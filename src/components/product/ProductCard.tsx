'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/database';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from '@/lib/image-compressor';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
}

export function ProductCard({ product, priorityImage = false }: ProductCardProps) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryImage =
    product.images?.[0]?.image_url || DEFAULT_FALLBACK_IMAGE;

  const secondaryImage = product.images?.[1]?.image_url;

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.variants?.[0] || null, 1);
    router.push('/checkout');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.variants?.[0] || null, 1);
  };

  return (
    <div className="ciraaya-card group relative flex flex-col h-full bg-white rounded-xl sm:rounded-2xl border border-[#EBE6DF] overflow-hidden hover:border-[#C5A059] hover:shadow-sm transition-all duration-300">
      {/* ─── 1. Image & Badges Container (Compact Aspect Ratio) ────────── */}
      <div className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden bg-[#FAFAF8]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {/* Skeleton Shimmer while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#F4EFEA] animate-pulse" />
          )}

          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              secondaryImage ? 'group-hover:opacity-0 transition-opacity duration-300' : ''
            }`}
            loading={priorityImage ? 'eager' : 'lazy'}
          />

          {/* Secondary Image on Hover */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              onError={handleImageError}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
          {discountPercent && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C5A059] text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.tags?.includes('bestseller') && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#18181B] text-white uppercase tracking-wider">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`
            absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full
            flex items-center justify-center
            transition-all duration-200 cursor-pointer z-10 shadow-xs
            border border-[#EBE6DF]
            ${
              isWishlisted
                ? 'bg-[#18181B] text-[#C5A059]'
                : 'bg-white/95 text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }
          `}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ─── 2. Compact Product Info Area ─────────────────────────────── */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 bg-white justify-between">
        <div>
          {/* Material & Rating Row */}
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[8px] uppercase font-bold tracking-wider text-[#9E7B32] bg-[#FBF7EE] border border-[#E8D5AA] px-1 py-0.2 rounded">
              {product.material}
            </span>
            <div className="flex items-center gap-0.5 text-[10px] text-[#71717A] font-medium">
              <Star className="w-2.5 h-2.5 fill-[#C5A059] text-[#C5A059]" />
              <span className="text-[#18181B] font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-[9px]">({product.review_count})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#C5A059] transition-colors mb-1.5">
            <h3 className="text-xs font-semibold text-[#18181B] truncate leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-[#EBE6DF] space-y-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#18181B] tracking-tight">
              ₹{(product.discount_price || product.price).toLocaleString('en-IN')}
            </span>
            {product.discount_price && (
              <span className="text-[10px] sm:text-xs text-[#A1A1AA] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Bag & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="py-1 px-1 bg-[#FAFAF8] hover:bg-[#EBE6DF] text-[#18181B] border border-[#EBE6DF] text-[10px] font-semibold rounded-md transition-colors cursor-pointer text-center"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="py-1 px-1 bg-[#18181B] hover:bg-[#C5A059] text-white text-[10px] font-bold rounded-md transition-colors cursor-pointer text-center"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
