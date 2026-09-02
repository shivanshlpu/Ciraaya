'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { createOrder } = useStore();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Address form fields
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || 'customer@example.com',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  useEffect(() => {
    if (user?.full_name && !formData.fullName) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.full_name || '',
        phone: user.phone || '',
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center max-w-md mx-auto bg-[#FAFAF8]">
        <h1 className="font-serif-luxury text-2xl font-normal mb-3 text-[#18181B]">Your Bag is Empty</h1>
        <p className="text-[#71717A] text-xs mb-6">Please add items to your shopping bag before proceeding to checkout.</p>
        <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm">
          Explore Jewellery
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.line1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      addToast('Please fill in all mandatory delivery fields.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Razorpay / Payment Gateway processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const order = createOrder({
        user_id: user?.id || null,
        status: 'confirmed',
        payment_method: paymentMethod === 'cod' ? 'cod' : 'upi',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        payment_gateway_order_id: paymentMethod === 'cod' ? null : `rzp_order_${Date.now()}`,
        payment_gateway_payment_id: paymentMethod === 'cod' ? null : `rzp_pay_${Date.now()}`,
        subtotal,
        discount,
        shipping_fee: shippingFee,
        total,
        coupon_code: appliedCoupon?.code || null,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          full_name: formData.fullName,
          phone: formData.phone,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state || 'Maharashtra',
          pincode: formData.pincode,
        },
        notes: formData.notes,
        items: items.map((item) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          order_id: '',
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name_snapshot: item.product.name,
          product_image_snapshot: item.product.images?.[0]?.image_url,
          variant_snapshot: item.variant?.variant_value || null,
          price_snapshot: (item.product.discount_price || item.product.price) + (item.variant?.price_delta || 0),
          quantity: item.quantity,
        })),
      });

      clearCart();
      addToast('Order placed successfully!', 'success');
      router.push(`/order-confirmation/${order.order_number}`);
    } catch (err) {
      addToast('Payment processing failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-main py-8 md:py-12 max-w-5xl mx-auto bg-[#FAFAF8]">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#EBE6DF]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
          Secure Checkout
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
          Delivery Destination &amp; Payment
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="ciraaya-card p-6 bg-white space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#EBE6DF] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-[#18181B]">Shipping &amp; Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#18181B] mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Pooja Sharma"
                    className="ciraaya-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18181B] mb-1 block">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="ciraaya-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#18181B] mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pooja@example.com"
                    className="ciraaya-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18181B] mb-1 block">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400050"
                    className="ciraaya-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18181B] mb-1 block">Flat, House No., Building Name *</label>
                <input
                  type="text"
                  name="line1"
                  required
                  value={formData.line1}
                  onChange={handleChange}
                  placeholder="e.g. Villa 402, Royal Palms, Bandra West"
                  className="ciraaya-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#18181B] mb-1 block">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="ciraaya-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18181B] mb-1 block">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    aria-label="Delivery State"
                    className="ciraaya-input bg-white cursor-pointer text-xs"
                  >
                    <option value="">Select State</option>
                    {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Punjab', 'Telangana'].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="ciraaya-card p-6 bg-white space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#EBE6DF] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-[#18181B]">Select Payment Option</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'upi' ? 'border-[#C5A059] bg-[#FBF7EE]' : 'border-[#EBE6DF] bg-white hover:border-[#E8D5AA]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#18181B]">Instant UPI / QR / Net Banking</p>
                      <p className="text-[11px] text-[#71717A]">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#2A7A4C] bg-[#EFF8F2] border border-[#C4E3CE] px-2 py-0.5 rounded">Fastest</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'card' ? 'border-[#C5A059] bg-[#FBF7EE]' : 'border-[#EBE6DF] bg-white hover:border-[#E8D5AA]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#18181B]">Credit / Debit Cards</p>
                      <p className="text-[11px] text-[#71717A]">Visa, Mastercard, RuPay, Diners Club</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#71717A]">256-Bit SSL</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'cod' ? 'border-[#C5A059] bg-[#FBF7EE]' : 'border-[#EBE6DF] bg-white hover:border-[#E8D5AA]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#18181B]">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-[#71717A]">Pay with cash or UPI at your doorstep</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#71717A]">Verified</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Snapshot */}
          <div className="lg:col-span-5 space-y-6">
            <div className="ciraaya-card p-6 bg-white sticky top-24 space-y-5">
              <h3 className="font-serif-luxury text-base font-normal text-[#18181B] border-b border-[#EBE6DF] pb-3">
                Order Review ({items.length} items)
              </h3>

              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => {
                  const itemPrice = (item.product.discount_price || item.product.price) + (item.variant?.price_delta || 0);
                  const img = item.product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200';
                  return (
                    <div key={item.id} className="flex gap-3 items-center text-xs">
                      <img src={img} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#EBE6DF] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#18181B] truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#71717A]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#18181B]">₹{(itemPrice * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-3 border-t border-[#EBE6DF] text-xs text-[#71717A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#18181B]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2A7A4C] font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-[#2A7A4C] font-bold text-[10px] bg-[#EFF8F2] px-2 py-0.5 rounded">FREE</span>
                  ) : (
                    <span className="font-semibold text-[#18181B]">₹{shippingFee}</span>
                  )}
                </div>
                <div className="flex justify-between items-baseline text-sm font-bold text-[#18181B] pt-3 border-t border-[#EBE6DF]">
                  <span>Total Payable</span>
                  <span className="text-xl text-[#C5A059] font-serif-luxury">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="ciraaya-btn ciraaya-btn-primary w-full shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Processing Secure Payment...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')} →`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
