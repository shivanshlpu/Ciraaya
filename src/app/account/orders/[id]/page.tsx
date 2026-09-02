'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { InvoiceModal } from '@/components/ui/InvoiceModal';

export default function OrderTrackingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { orders } = useStore();
  const [showInvoice, setShowInvoice] = useState(false);

  const order = orders.find((o) => o.order_number === id || o.id === id) || orders[0];

  const statusOrder = ['placed', 'confirmed', 'shipped', 'delivered'];
  const currentStepIndex = order ? statusOrder.indexOf(order.status) : 1;

  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Received & Verified' },
    { key: 'confirmed', label: 'Handcrafted', desc: 'Packed with Love' },
    { key: 'shipped', label: 'In Express Transit', desc: 'Air Cargo Dispatched' },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your Jewellery!' },
  ];

  return (
    <div className="container-main py-8 md:py-12 max-w-4xl mx-auto bg-[#FAFAF8]">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#71717A] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#18181B] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/account" className="hover:text-[#18181B] transition-colors">Account</Link>
        <span>/</span>
        <Link href="/account/orders" className="hover:text-[#18181B] transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-[#18181B] font-semibold">{order?.order_number || id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Live Shipment Tracking
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Order #{order?.order_number || id}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInvoice(true)}
            className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm"
          >
            📄 View / Print Invoice
          </button>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Pooja! I have a question about my order #${order?.order_number || id}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm"
          >
            <span className="text-[#25D366]">💬</span>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Status Timeline Card */}
      <div className="ciraaya-card p-6 md:p-8 bg-white mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#EBE6DF] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#18181B]">Shipment Status</h3>
            <p className="text-xs text-[#71717A]">
              Estimated Delivery: <strong>3–5 Business Days</strong>
            </p>
          </div>
          {order?.tracking_id && (
            <div className="text-xs bg-[#FBF7EE] text-[#9E7B32] border border-[#E8D5AA] px-3 py-1 rounded-lg font-mono font-bold">
              Airway Bill: {order.tracking_id}
            </div>
          )}
        </div>

        {/* Visual Timeline */}
        <div className="py-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex md:flex-col items-center md:text-center gap-3 relative">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                      ${
                        isCompleted
                          ? 'bg-[#C5A059] text-white shadow-sm'
                          : 'bg-[#FAFAF8] text-[#A1A1AA] border border-[#EBE6DF]'
                      }
                      ${isCurrent ? 'ring-4 ring-[#C5A059]/20' : ''}
                    `}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${isCompleted ? 'text-[#18181B]' : 'text-[#71717A]'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-[#71717A] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-[#FAFAF8] rounded-xl flex items-center gap-2.5 text-xs text-[#71717A] border border-[#EBE6DF]">
          <span className="text-base">🚚</span>
          <span>
            Dispatched via Delhivery Express Air Cargo. Fully insured against transit loss or damage.
          </span>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Destination */}
        <div className="ciraaya-card p-6 bg-white space-y-3">
          <h3 className="font-bold text-[#18181B] text-xs uppercase tracking-wider border-b border-[#EBE6DF] pb-2">
            Delivery Destination
          </h3>
          <div className="text-xs text-[#71717A] space-y-1">
            <p className="font-bold text-[#18181B]">{order?.shipping_address?.full_name}</p>
            <p>{order?.shipping_address?.line1}</p>
            {order?.shipping_address?.line2 && <p>{order?.shipping_address?.line2}</p>}
            <p>{order?.shipping_address?.city}, {order?.shipping_address?.state} - {order?.shipping_address?.pincode}</p>
            <p className="mt-1">📞 {order?.shipping_address?.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="ciraaya-card p-6 bg-white space-y-3">
          <h3 className="font-bold text-[#18181B] text-xs uppercase tracking-wider border-b border-[#EBE6DF] pb-2">
            Payment &amp; Invoice
          </h3>
          <div className="space-y-1.5 text-xs text-[#71717A]">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-[#18181B]">{order?.payment_method?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold text-[#2A7A4C]">{order?.payment_status?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order?.subtotal?.toLocaleString('en-IN') || 0}</span>
            </div>
            {order?.discount ? (
              <div className="flex justify-between text-[#2A7A4C]">
                <span>Discount ({order?.coupon_code}):</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            ) : null}
            <div className="flex justify-between font-bold text-sm text-[#18181B] border-t border-[#EBE6DF] pt-2">
              <span>Total Paid:</span>
              <span className="text-[#C5A059] font-serif-luxury text-base font-bold">₹{order?.total?.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
}
