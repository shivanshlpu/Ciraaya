'use client';

import React, { useRef } from 'react';
import { Order } from '@/types/database';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#18181B]/60 backdrop-blur-xs no-print"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#EBE6DF] my-auto z-10 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Actions Bar (hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-[#EBE6DF] bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-bold text-base">✦</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#18181B]">
              Tax Invoice Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Download PDF / Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#EBE6DF]/50 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div ref={printRef} className="ciraaya-invoice-sheet p-6 sm:p-10 overflow-y-auto bg-white text-[#18181B] space-y-8">
          {/* Header & Brand */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#EBE6DF] pb-6">
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#18181B]">
                CIRAAYA
              </h1>
              <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#C5A059] mt-0.5">
                Modern &amp; Royal Fine Jewellery
              </p>
              <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                Maison Ciraaya Private Limited<br />
                Haute Joaillerie Atelier, Sector 29, Gurugram, India<br />
                GSTIN: 07AAACC4112G1Z8 | CIN: U36911DL2024PTC998812<br />
                Email: care@ciraaya.com | Helpline: +91 98765 43210
              </p>
            </div>

            <div className="sm:text-right bg-[#FBF7EE] p-4 rounded-xl border border-[#E8D5AA] sm:min-w-[220px]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#9E7B32] block">
                Original Tax Invoice
              </span>
              <p className="text-base font-mono font-bold text-[#18181B] mt-1">
                {order.order_number}
              </p>
              <p className="text-xs text-[#71717A] mt-1">
                Date: {invoiceDate}
              </p>
              <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2A7A4C]/10 text-[#2A7A4C] border border-[#2A7A4C]/20">
                Payment: {order.payment_status?.toUpperCase()} ({order.payment_method?.toUpperCase()})
              </div>
            </div>
          </div>

          {/* Customer / Destination Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAFAF8] p-5 rounded-xl border border-[#EBE6DF] text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                Billed &amp; Shipped To:
              </span>
              <p className="font-bold text-[#18181B] text-sm">{order.customer_name}</p>
              <p className="text-[#71717A] mt-0.5">Phone: {order.customer_phone}</p>
              <p className="text-[#71717A]">Email: {order.customer_email}</p>
              <p className="text-[#71717A] mt-1">
                {order.shipping_address?.line1}
                {order.shipping_address?.line2 ? `, ${order.shipping_address.line2}` : ''}
              </p>
              <p className="text-[#71717A]">
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
              </p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-[#EBE6DF] sm:pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                Shipment &amp; Logistics:
              </span>
              <p className="text-[#18181B] font-medium">
                Courier Partner: <span className="text-[#71717A]">Delhivery Express Air</span>
              </p>
              <p className="text-[#18181B] font-medium">
                Tracking ID: <span className="font-mono text-[#C5A059] font-bold">{order.tracking_id || 'Generating on Dispatch'}</span>
              </p>
              <p className="text-[#18181B] font-medium">
                Transit Insurance: <span className="text-[#2A7A4C] font-semibold">100% Comprehensive Coverage</span>
              </p>
              <p className="text-[#18181B] font-medium">
                Order Status: <span className="capitalize font-bold text-[#9E7B32]">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#EBE6DF] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-[#71717A] border-b border-[#EBE6DF]">
                <tr>
                  <th className="p-3.5 font-semibold">#</th>
                  <th className="p-3.5 font-semibold">Jewellery Item</th>
                  <th className="p-3.5 font-semibold text-center">Qty</th>
                  <th className="p-3.5 font-semibold text-right">Unit Price</th>
                  <th className="p-3.5 font-semibold text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE6DF]">
                {order.items?.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#FAFAF8]/50">
                    <td className="p-3.5 text-[#71717A] font-mono">{idx + 1}</td>
                    <td className="p-3.5">
                      <p className="font-semibold text-[#18181B]">{item.product_name_snapshot}</p>
                      {item.variant_snapshot && (
                        <p className="text-[11px] text-[#71717A] mt-0.5">Option: {item.variant_snapshot}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-medium">{item.quantity}</td>
                    <td className="p-3.5 text-right font-medium">
                      ₹{item.price_snapshot.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#18181B]">
                      ₹{(item.price_snapshot * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation & Signoff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-2">
            <div className="text-xs text-[#71717A] space-y-2">
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#EBE6DF]">
                <p className="font-semibold text-[#18181B] mb-1">Authenticity &amp; Warranty Note:</p>
                <p className="text-[11px] leading-relaxed">
                  All CIRAAYA creations are crafted with premium 18K &amp; 24K micro gold plating over skin-safe hypoallergenic alloys with anti-tarnish protective coating. Includes 1-year finish warranty.
                </p>
              </div>
              <p className="text-[10px] text-[#A1A1AA] pt-2">
                This is a computer-generated tax invoice and requires no physical signature.
              </p>
            </div>

            <div className="space-y-2 bg-[#FAFAF8] p-4 rounded-xl border border-[#EBE6DF] text-xs">
              <div className="flex justify-between text-[#71717A]">
                <span>Item Subtotal:</span>
                <span className="font-medium text-[#18181B]">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-[#2A7A4C]">
                  <span>Discount ({order.coupon_code || 'PROMO'}):</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-[#71717A]">
                <span>Insured Express Shipping:</span>
                <span>{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between text-[#71717A]">
                <span>Estimated GST (3% Inc.):</span>
                <span>₹{Math.round(order.total * 0.03).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#EBE6DF] pt-2 text-sm font-bold">
                <span className="text-[#18181B]">Grand Total:</span>
                <span className="text-lg text-[#C5A059] font-serif-luxury font-bold">
                  ₹{order.total?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
