'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { items, itemCount, moveToCart, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container-main py-20 md:py-28 text-center max-w-md mx-auto bg-[#FAFAF8]">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white border border-[#EBE6DF] flex items-center justify-center text-3xl shadow-xs">
          ♡
        </div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal mb-2 text-[#18181B]">
          Your Wishlist is Empty
        </h1>
        <p className="text-[#71717A] text-xs mb-6 leading-relaxed">
          Save your favourite pieces here to view them anytime, keep track of price updates, and move them to your bag when you are ready.
        </p>
        <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-md">
          Explore Handcrafted Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8 md:py-12 bg-[#FAFAF8]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Saved Favourites
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            My Wishlist ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})
          </h1>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-[#C5A059] hover:underline">
          Explore More Pieces →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => {
          const product = item.product;
          const image = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';

          return (
            <div
              key={item.id}
              className="ciraaya-card group relative flex flex-col bg-white overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] w-full bg-[#FAFAF8] overflow-hidden">
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Remove from wishlist button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-[#71717A] hover:text-[#C53030] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7B32] block mb-1">
                    {product.material}
                  </span>
                  <Link href={`/product/${product.slug}`} className="block mb-2 group-hover:text-[#C5A059] transition-colors">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#18181B] line-clamp-1">{product.name}</h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-sm sm:text-base font-bold text-[#18181B]">
                      ₹{(product.discount_price || product.price).toLocaleString('en-IN')}
                    </span>
                    {product.discount_price && (
                      <span className="text-xs text-[#A1A1AA] line-through">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => moveToCart(product)}
                  className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm w-full text-[11px]"
                >
                  Move to Shopping Bag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
