'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Truck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) setCouponInput('');
  };

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="container-main py-20 md:py-28 text-center max-w-md mx-auto bg-[#FAFAF8]">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white border border-[#EBE6DF] flex items-center justify-center shadow-xs">
          <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
        </div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal mb-2 text-[#18181B]">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-[#71717A] text-xs mb-6 leading-relaxed">
          Looks like you haven&apos;t added any jewellery pieces yet. Explore our handcrafted collections to find your perfect match.
        </p>
        <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-md">
          Explore Handcrafted Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8 md:py-12 bg-[#FAFAF8]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Your Selection
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Shopping Bag ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})
          </h1>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-[#C5A059] hover:underline">
          ← Continue Shopping
        </Link>
      </div>

      {/* Free Shipping Progress Indicator */}
      {remainingForFreeShipping > 0 ? (
        <div className="ciraaya-card p-4 mb-6 bg-white flex items-center gap-3 text-xs text-[#18181B]">
          <Truck className="w-5 h-5 text-[#C5A059] shrink-0" />
          <div className="flex-1">
            <span>Add <strong className="text-[#C5A059]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Insured Express Shipping</strong>!</span>
            <div className="w-full bg-[#FAFAF8] border border-[#EBE6DF] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#C5A059] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="ciraaya-card p-4 mb-6 bg-[#EFF8F2] border-[#C4E3CE] flex items-center gap-3 text-xs text-[#2A7A4C] font-semibold">
          <span className="text-base">✓</span>
          <span>Congratulations! Your order qualifies for <strong>FREE Insured Express Shipping</strong>.</span>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const itemPrice = (item.product.discount_price || item.product.price) + (item.variant?.price_delta || 0);
            const image = item.product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400';

            return (
              <div
                key={item.id}
                className="ciraaya-card p-4 sm:p-5 flex gap-4 sm:gap-5 items-center bg-white"
              >
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAFAF8] shrink-0 border border-[#EBE6DF]"
                >
                  <img src={image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7B32] block mb-0.5">
                    {item.product.material}
                  </span>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="text-xs sm:text-sm font-semibold text-[#18181B] hover:text-[#C5A059] transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <span className="text-[11px] text-[#71717A] mt-0.5 block">
                      Option: {item.variant.variant_value}
                    </span>
                  )}
                  <div className="text-sm font-bold text-[#18181B] mt-1">
                    ₹{itemPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="flex items-center border border-[#EBE6DF] rounded-xl bg-white px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#71717A] hover:text-[#18181B] font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-[#18181B]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#71717A] hover:text-[#18181B] font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-[#C53030] hover:underline cursor-pointer"
                    title="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 ciraaya-card p-6 bg-white space-y-5">
          <h2 className="font-serif-luxury text-lg font-normal text-[#18181B] border-b border-[#EBE6DF] pb-3">
            Order Summary
          </h2>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2 text-xs">
            <label className="font-semibold text-[#18181B] block">Have a Promo Voucher?</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ROYAL10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="ciraaya-input font-mono font-bold uppercase text-xs"
              />
              <button
                type="submit"
                className="ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm shrink-0"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-[#2A7A4C] bg-[#EFF8F2] p-2.5 rounded-lg border border-[#C4E3CE]">
                <span>Coupon &quot;{appliedCoupon.code}&quot; applied!</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-bold text-[#C53030] hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            )}
          </form>

          {/* Totals Breakdown */}
          <div className="space-y-2.5 text-xs text-[#71717A] border-t border-[#EBE6DF] pt-4">
            <div className="flex justify-between">
              <span>Bag Subtotal:</span>
              <span className="font-semibold text-[#18181B]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#2A7A4C]">
                <span>Promo Discount:</span>
                <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Express Shipping:</span>
              <span className="font-semibold text-[#18181B]">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-[#18181B] border-t border-[#EBE6DF] pt-3">
              <span>Grand Total:</span>
              <span className="text-xl text-[#C5A059] font-serif-luxury">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link href="/checkout" className="block w-full">
            <button className="ciraaya-btn ciraaya-btn-primary w-full shadow-md">
              Proceed to Secure Checkout →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
