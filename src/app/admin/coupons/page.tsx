'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Coupon } from '@/types/database';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(999);
  const [maxDiscount, setMaxDiscount] = useState(500);

  const handleOpenAdd = () => {
    setEditingCouponId(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderValue(999);
    setMaxDiscount(500);
    setShowModal(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCouponId(c.id);
    setCode(c.code);
    setDiscountType(c.discount_type);
    setDiscountValue(c.discount_value);
    setMinOrderValue(c.min_order_value);
    setMaxDiscount(c.max_discount || 500);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCouponId) {
      updateCoupon(editingCouponId, {
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_value: Number(minOrderValue),
        max_discount: discountType === 'percentage' ? Number(maxDiscount) : null,
      });
      addToast(`Coupon "${code.toUpperCase()}" updated successfully!`, 'success');
    } else {
      addCoupon({
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_value: Number(minOrderValue),
        max_discount: discountType === 'percentage' ? Number(maxDiscount) : null,
        is_active: true,
      });
      addToast(`Coupon "${code.toUpperCase()}" created!`, 'success');
    }

    setShowModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Promotions &amp; Discounts
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Coupons &amp; Offers ({coupons.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Create and edit discount codes, percentage vouchers, and cart thresholds.
          </p>
        </div>

        <Button onClick={handleOpenAdd} size="sm">
          + Create Promo Code
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`
              ciraaya-card p-5 bg-white flex flex-col justify-between space-y-4 transition-all
              ${coupon.is_active ? 'border-[#EBE6DF]' : 'border-[#EBE6DF]/50 opacity-60'}
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-base text-[#9E7B32] bg-[#FBF7EE] border border-[#E8D5AA] px-2.5 py-1 rounded-md tracking-wider inline-flex items-center gap-1.5">
                  <span className="text-xs">PROMO:</span> {coupon.code}
                </span>
                <p className="text-xs text-[#18181B] font-semibold mt-2">
                  {coupon.discount_type === 'percentage'
                    ? `${coupon.discount_value}% OFF (Max ₹${coupon.max_discount || 'Unlimited'})`
                    : `Flat ₹${coupon.discount_value} OFF`}
                </p>
              </div>
              <button
                onClick={() => updateCoupon(coupon.id, { is_active: !coupon.is_active })}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md cursor-pointer border ${
                  coupon.is_active
                    ? 'bg-[#EFF8F2] text-[#2A7A4C] border-[#C4E3CE]'
                    : 'bg-[#FAFAF8] text-[#71717A] border-[#EBE6DF]'
                }`}
              >
                {coupon.is_active ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="text-xs text-[#71717A] space-y-1 border-t border-[#EBE6DF] pt-3">
              <p>Min. Order Value: <strong>₹{coupon.min_order_value}</strong></p>
              <p>Redeemed: <strong>{coupon.used_count || 0} times</strong></p>
            </div>

            <div className="pt-2 border-t border-[#EBE6DF] flex justify-between items-center text-xs">
              <button
                onClick={() => updateCoupon(coupon.id, { is_active: !coupon.is_active })}
                className="text-[#71717A] hover:text-[#18181B] font-medium cursor-pointer"
              >
                {coupon.is_active ? 'Pause Code' : 'Activate Code'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenEdit(coupon)}
                  className="text-[#C5A059] font-semibold hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete coupon "${coupon.code}"?`)) {
                      deleteCoupon(coupon.id);
                      addToast(`Coupon "${coupon.code}" deleted.`, 'info');
                    }
                  }}
                  className="text-[#C53030] font-medium hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#18181B]">
                {editingCouponId ? 'Edit Promo Code' : 'Create Promo Code'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROYAL20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="ciraaya-input font-mono font-bold uppercase text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="ciraaya-input text-xs cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="ciraaya-input text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="ciraaya-input text-xs"
                  />
                </div>
                {discountType === 'percentage' && (
                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(Number(e.target.value))}
                      className="ciraaya-input text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="submit" fullWidth size="sm">
                  {editingCouponId ? 'Save Changes' : 'Create & Activate'}
                </Button>
                <Button type="button" variant="ghost" fullWidth size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
