'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { InvoiceModal } from '@/components/ui/InvoiceModal';

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { orders } = useStore();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const order = orders.find((o) => o.order_number === orderId || o.id === orderId) || orders[0];

  useEffect(() => {
    // Fire celebratory confetti blast on mount
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C5A059', '#E8D5AA', '#2A7A4C'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C5A059', '#E8D5AA', '#2A7A4C'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="container-main py-10 md:py-16 max-w-3xl mx-auto text-center bg-[#FAFAF8]">
      {/* Success Badge */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EFF8F2] text-[#2A7A4C] flex items-center justify-center text-3xl shadow-xs border border-[#C4E3CE]">
        ✓
      </div>

      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
        Thank you for choosing CIRAAYA
      </span>
      <h1 className="font-serif-luxury text-3xl md:text-4xl font-normal mb-2 text-[#18181B]">
        Order Confirmed!
      </h1>
      <p className="text-[#71717A] text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
        Your order has been received and is now being handcrafted, quality-inspected, and packaged in our signature royal velvet box.
      </p>

      {/* Order Details Card */}
      <div className="ciraaya-card p-6 md:p-8 bg-white text-left shadow-sm mb-8 space-y-6">
        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE6DF] pb-4">
          <div>
            <span className="text-[11px] text-[#71717A] block">Order Reference</span>
            <span className="text-base font-mono font-bold text-[#18181B]">{order?.order_number || orderId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase px-3 py-1 bg-[#FBF7EE] text-[#9E7B32] rounded-md border border-[#E8D5AA]">
              {order?.payment_status?.toUpperCase() || 'PAID'} ({order?.payment_method?.toUpperCase() || 'UPI'})
            </span>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="text-xs font-bold bg-[#18181B] text-white hover:bg-[#C5A059] px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>📄</span> View / Print Invoice
            </button>
          </div>
        </div>

        {/* Order Items */}
        {order?.items && order.items.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
              Purchased Jewellery ({order.items.length})
            </h4>
            <div className="divide-y divide-[#EBE6DF]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#18181B]">{item.product_name_snapshot}</p>
                    <p className="text-[11px] text-[#71717A]">
                      Qty: {item.quantity} {item.variant_snapshot ? `• ${item.variant_snapshot}` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-[#18181B]">
                    ₹{(item.price_snapshot * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Address & Pricing summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#EBE6DF] pt-4 text-xs text-[#71717A]">
          <div>
            <h4 className="font-bold text-[#18181B] text-xs uppercase tracking-wider mb-1.5">Delivery Destination</h4>
            <p className="font-semibold text-[#18181B]">{order?.shipping_address?.full_name}</p>
            <p>{order?.shipping_address?.line1}</p>
            {order?.shipping_address?.line2 && <p>{order?.shipping_address?.line2}</p>}
            <p>{order?.shipping_address?.city}, {order?.shipping_address?.state} - {order?.shipping_address?.pincode}</p>
            <p className="mt-1">📞 {order?.shipping_address?.phone}</p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <h4 className="font-bold text-[#18181B] text-xs uppercase tracking-wider mb-1.5">Payment Summary</h4>
            <div className="flex justify-between sm:justify-end gap-4">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#18181B]">₹{order?.subtotal?.toLocaleString('en-IN') || 0}</span>
            </div>
            {order?.discount ? (
              <div className="flex justify-between sm:justify-end gap-4 text-[#2A7A4C]">
                <span>Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            ) : null}
            <div className="flex justify-between sm:justify-end gap-4">
              <span>Shipping:</span>
              <span className="font-semibold text-[#18181B]">{order?.shipping_fee === 0 ? 'FREE' : `₹${order?.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-4 font-bold text-sm text-[#18181B] border-t border-[#EBE6DF] pt-1.5">
              <span>Total Paid:</span>
              <span className="text-[#C5A059] font-serif-luxury text-base">₹{order?.total?.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Notification confirmation */}
        <div className="bg-[#EFF8F2] rounded-xl p-4 flex items-center gap-3 text-xs text-[#18181B] border border-[#C4E3CE]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366] shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
          </svg>
          <div className="text-left">
            <p className="font-bold">WhatsApp &amp; SMS Dispatch Updates Queued</p>
            <p className="text-[#71717A] mt-0.5 text-[11px]">
              We have queued live courier tracking alerts to <strong>{order?.shipping_address?.phone || '+91 98765 43210'}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/account/orders/${order?.order_number || orderId}`}>
          <Button size="md" className="w-full sm:w-auto shadow-md">
            Track Order Live →
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="md" className="w-full sm:w-auto">
            Continue Exploring
          </Button>
        </Link>
      </div>

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
