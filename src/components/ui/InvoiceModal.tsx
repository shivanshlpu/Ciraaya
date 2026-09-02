'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Order } from '@/types/database';
import {
  Printer,
  FileText,
  Package,
  ShieldCheck,
  User,
  Truck,
  Droplets,
  Sparkles,
  Heart,
  ExternalLink,
} from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'customer' | 'package';
}

// ─── Royal Monogram Crest SVG ──────────────────────────────────────────
function RoyalCrestIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="text-[#C5A059]">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1.5" />
      {/* Ornate Royal Crown */}
      <path
        d="M34 38 L42 44 L50 32 L58 44 L66 38 L63 50 L37 50 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Monogram 'C' */}
      <path
        d="M58 56 C55 53 45 53 45 61 C45 69 55 69 58 66"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="27" r="2.5" fill="currentColor" />
      <circle cx="34" cy="35" r="2" fill="currentColor" />
      <circle cx="66" cy="35" r="2" fill="currentColor" />
    </svg>
  );
}

// ─── 1-Year Warranty Seal SVG ──────────────────────────────────────────
function WarrantySealBadge() {
  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <svg width="68" height="68" viewBox="0 0 100 100" className="text-[#C5A059]">
        {/* Scalloped Gold Starburst Seal */}
        <circle cx="50" cy="50" r="45" fill="#FBF7EE" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        <text x="50" y="42" textAnchor="middle" fill="#9E7B32" fontSize="18" fontWeight="bold" fontFamily="serif">
          1
        </text>
        <text x="50" y="55" textAnchor="middle" fill="#9E7B32" fontSize="9" fontWeight="bold" letterSpacing="1">
          YEAR
        </text>
        <text x="50" y="68" textAnchor="middle" fill="#C5A059" fontSize="7" fontWeight="bold" letterSpacing="1.5">
          WARRANTY
        </text>
      </svg>
    </div>
  );
}

// ─── Crisp Barcode Vector SVG ──────────────────────────────────────────
function BarcodeGraphic({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-end">
      <svg width="180" height="42" viewBox="0 0 180 42" className="text-black">
        <rect x="0" y="0" width="180" height="42" fill="white" />
        {/* Guard bars */}
        <rect x="5" y="2" width="3" height="36" fill="black" />
        <rect x="10" y="2" width="2" height="36" fill="black" />
        {/* Pattern bars */}
        <rect x="15" y="2" width="4" height="32" fill="black" />
        <rect x="22" y="2" width="2" height="32" fill="black" />
        <rect x="27" y="2" width="5" height="32" fill="black" />
        <rect x="35" y="2" width="2" height="32" fill="black" />
        <rect x="40" y="2" width="3" height="32" fill="black" />
        <rect x="46" y="2" width="5" height="32" fill="black" />
        <rect x="54" y="2" width="2" height="32" fill="black" />
        <rect x="59" y="2" width="4" height="32" fill="black" />
        <rect x="66" y="2" width="2" height="32" fill="black" />
        <rect x="71" y="2" width="6" height="32" fill="black" />
        <rect x="80" y="2" width="2" height="32" fill="black" />
        {/* Center guard */}
        <rect x="85" y="2" width="2" height="36" fill="black" />
        <rect x="90" y="2" width="2" height="36" fill="black" />
        {/* Right pattern */}
        <rect x="95" y="2" width="5" height="32" fill="black" />
        <rect x="103" y="2" width="2" height="32" fill="black" />
        <rect x="108" y="2" width="3" height="32" fill="black" />
        <rect x="114" y="2" width="6" height="32" fill="black" />
        <rect x="123" y="2" width="2" height="32" fill="black" />
        <rect x="128" y="2" width="4" height="32" fill="black" />
        <rect x="135" y="2" width="3" height="32" fill="black" />
        <rect x="141" y="2" width="5" height="32" fill="black" />
        <rect x="149" y="2" width="2" height="32" fill="black" />
        <rect x="154" y="2" width="4" height="32" fill="black" />
        <rect x="161" y="2" width="5" height="32" fill="black" />
        {/* Guard bars */}
        <rect x="169" y="2" width="2" height="36" fill="black" />
        <rect x="174" y="2" width="3" height="36" fill="black" />
      </svg>
      <span className="font-mono text-[9px] tracking-widest text-black mt-0.5">
        *{code}*
      </span>
    </div>
  );
}

// ─── Scan-Ready QR Code Vector SVG ─────────────────────────────────────
function QRCodeGraphic({ value }: { value: string }) {
  return (
    <div className="p-1 bg-white border border-black rounded flex flex-col items-center">
      <svg width="68" height="68" viewBox="0 0 100 100" className="text-black">
        <rect width="100" height="100" fill="white" />
        {/* Top-Left Position Marker */}
        <rect x="10" y="10" width="30" height="30" fill="black" />
        <rect x="15" y="15" width="20" height="20" fill="white" />
        <rect x="20" y="20" width="10" height="10" fill="black" />
        {/* Top-Right Position Marker */}
        <rect x="60" y="10" width="30" height="30" fill="black" />
        <rect x="65" y="15" width="20" height="20" fill="white" />
        <rect x="70" y="20" width="10" height="10" fill="black" />
        {/* Bottom-Left Position Marker */}
        <rect x="10" y="60" width="30" height="30" fill="black" />
        <rect x="15" y="65" width="20" height="20" fill="white" />
        <rect x="20" y="70" width="10" height="10" fill="black" />
        {/* Random / Structured Data Pixels */}
        <rect x="45" y="10" width="5" height="10" fill="black" />
        <rect x="52" y="15" width="5" height="5" fill="black" />
        <rect x="45" y="25" width="10" height="5" fill="black" />
        <rect x="15" y="45" width="10" height="5" fill="black" />
        <rect x="30" y="45" width="5" height="10" fill="black" />
        <rect x="40" y="40" width="15" height="15" fill="black" />
        <rect x="60" y="45" width="10" height="10" fill="black" />
        <rect x="75" y="45" width="15" height="5" fill="black" />
        <rect x="45" y="60" width="10" height="5" fill="black" />
        <rect x="60" y="65" width="15" height="10" fill="black" />
        <rect x="80" y="65" width="10" height="5" fill="black" />
        <rect x="45" y="75" width="5" height="15" fill="black" />
        <rect x="55" y="80" width="15" height="5" fill="black" />
        <rect x="75" y="80" width="15" height="10" fill="black" />
      </svg>
    </div>
  );
}

export function InvoiceModal({
  order,
  isOpen,
  onClose,
  initialMode = 'customer',
}: InvoiceModalProps) {
  const [billMode, setBillMode] = useState<'customer' | 'package'>(initialMode);
  const printContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMode) setBillMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shortDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const gstAmount = Math.round(order.total * 0.03);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#18181B]/60 backdrop-blur-xs no-print"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#EBE6DF] my-auto z-10 overflow-hidden flex flex-col max-h-[96vh]">
        {/* ─── Actions Bar (Hidden on Print) ───────────────────────────── */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[#EBE6DF] bg-[#FAFAF8]">
          {/* Bill Type Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EBE6DF]/70 rounded-xl">
            <button
              type="button"
              onClick={() => setBillMode('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billMode === 'customer'
                  ? 'bg-white text-[#18181B] shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Customer Tax Invoice (Digital)</span>
            </button>

            <button
              type="button"
              onClick={() => setBillMode('package')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billMode === 'package'
                  ? 'bg-white text-[#18181B] shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#18181B]" />
              <span>Parcel Bill (Package Slip)</span>
            </button>
          </div>

          {/* Action Buttons: Print / Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#EBE6DF]/50 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ─── Scrollable Printable Invoice Content ────────────────────── */}
        <div ref={printContainerRef} className="overflow-y-auto p-4 sm:p-8 bg-[#F4EFEA]/30">
          {/* ═══════════════════════════════════════════════════════════════
              BILL 1: CUSTOMER TAX INVOICE (Exact User Specification)
             ═══════════════════════════════════════════════════════════════ */}
          {billMode === 'customer' && (
            <div className="ciraaya-invoice-sheet bg-white p-6 sm:p-9 rounded-2xl border border-[#EBE6DF] shadow-md text-[#18181B] space-y-6 max-w-3xl mx-auto">
              {/* 1. Header: Brand, Royal Monogram Crest & Invoice Meta */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Left: Brand & Legal Entity */}
                <div className="space-y-0.5">
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#18181B]">
                    CIRAAYA
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C5A059]">
                    Modern &amp; Royal Fine Jewellery
                  </p>
                  <div className="text-[11px] text-[#71717A] pt-2 leading-relaxed">
                    <p className="font-medium text-[#18181B]">Maison Ciraaya Private Limited</p>
                    <p>Haute Joaillerie Atelier, Sector 29, Gurugram, India</p>
                    <p>GSTIN: 07AAACC4112G1Z8 | CIN: U36911DL2024PTC098812</p>
                    <p>Email: care@ciraaya.com | Helpline: +91 98765 43210</p>
                  </div>
                </div>

                {/* Center: Royal Circular Crest Logo */}
                <div className="hidden sm:flex flex-col items-center">
                  <RoyalCrestIcon />
                </div>

                {/* Right: Tax Invoice Details */}
                <div className="sm:text-right space-y-1">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#C5A059] block">
                    TAX INVOICE
                  </span>
                  <p className="text-base font-mono font-bold text-[#18181B]">
                    # {order.order_number}
                  </p>
                  <p className="text-xs text-[#71717A]">
                    Date: {invoiceDate}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EFF8F2] text-[#2A7A4C] border border-[#C4E3CE]">
                      PAYMENT: PAID ({order.payment_method?.toUpperCase() || 'UPI'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Gold Divider Line */}
              <div className="w-full h-px bg-[#E8D5AA]" />

              {/* 2. Customer & Shipping Logistics (Two Bordered Boxes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Billed To Box */}
                <div className="border border-[#E8D5AA] rounded-xl p-4 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9E7B32] mb-1.5">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>BILLED TO</span>
                  </div>
                  <p className="font-bold text-sm text-[#18181B]">{order.customer_name}</p>
                  <p className="text-[#71717A]">Phone: {order.customer_phone}</p>
                  <p className="text-[#71717A]">Email: {order.customer_email}</p>
                  <p className="text-[#71717A] pt-1 leading-relaxed">
                    {order.shipping_address?.line1}
                    {order.shipping_address?.line2 ? `, ${order.shipping_address.line2}` : ''}
                    <br />
                    {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
                  </p>
                </div>

                {/* Shipping & Logistics Box */}
                <div className="border border-[#E8D5AA] rounded-xl p-4 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9E7B32] mb-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>SHIPPING &amp; LOGISTICS</span>
                  </div>
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

              {/* 3. Items Table (Gold Header) */}
              <div className="border border-[#EBE6DF] rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#B68D40] text-white">
                    <tr className="uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-2.5 px-3.5 w-10">#</th>
                      <th className="py-2.5 px-3.5">JEWELLERY ITEM</th>
                      <th className="py-2.5 px-3.5 text-center w-14">QTY</th>
                      <th className="py-2.5 px-3.5 text-right w-24">UNIT PRICE</th>
                      <th className="py-2.5 px-3.5 text-right w-28">TOTAL AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE6DF] bg-white">
                    {order.items?.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-3 px-3.5 text-[#71717A] font-mono">{idx + 1}</td>
                        <td className="py-3 px-3.5">
                          <p className="font-semibold text-[#18181B]">{item.product_name_snapshot}</p>
                          {item.variant_snapshot && (
                            <p className="text-[11px] text-[#71717A] mt-0.5">Option: {item.variant_snapshot}</p>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-center font-medium">{item.quantity}</td>
                        <td className="py-3 px-3.5 text-right font-medium">
                          ₹{item.price_snapshot.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold text-[#18181B]">
                          ₹{(item.price_snapshot * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4. Authenticity & Summary Calculation Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch text-xs">
                {/* Authenticity & Warranty Card */}
                <div className="border border-[#EBE6DF] rounded-xl p-4 bg-[#FAFAF8] flex items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#18181B]">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>AUTHENTICITY &amp; WARRANTY</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] leading-relaxed">
                      All CIRAAYA creations are crafted with premium 18K &amp; 24K micro gold plating over skin-safe hypoallergenic alloys with anti-tarnish protective coating. Includes 1-year finish warranty.
                    </p>
                  </div>
                  <WarrantySealBadge />
                </div>

                {/* Financial Summary Card */}
                <div className="border border-[#EBE6DF] rounded-xl p-4 bg-[#FAFAF8] space-y-2">
                  <div className="flex justify-between text-[#71717A]">
                    <span>Item Subtotal:</span>
                    <span className="font-medium text-[#18181B]">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount ? (
                    <div className="flex justify-between text-[#2A7A4C]">
                      <span>Discount ({order.coupon_code || 'WELCOME10'}):</span>
                      <span className="font-medium">-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-[#71717A]">
                    <span>Insured Express Shipping:</span>
                    <span className="font-medium text-[#18181B]">{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
                  </div>
                  <div className="flex justify-between text-[#71717A]">
                    <span>Estimated GST (3% Inc.):</span>
                    <span className="font-medium text-[#18181B]">₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-[#EBE6DF] pt-2 flex justify-between items-center text-sm font-bold">
                    <span className="uppercase tracking-wider text-xs text-[#18181B]">Grand Total</span>
                    <span className="text-xl font-serif-luxury font-bold text-[#C5A059]">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Signoff & Trust Strip */}
              <div className="text-center pt-2 space-y-3">
                <p className="text-xs text-[#71717A] italic">
                  Thank you for choosing CIRAAYA. We appreciate your trust in our craftsmanship.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#71717A] font-semibold pt-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Anti-tarnish Protection</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Skin Friendly</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Secure Packaging</span>
                  </div>
                </div>

                {/* Solid Gold Bottom Ribbon */}
                <div className="bg-[#B68D40] text-white py-2 px-4 rounded-lg text-[10px] sm:text-[11px] font-medium flex flex-wrap items-center justify-between gap-2 tracking-wide">
                  <span>care@ciraaya.com</span>
                  <span>|</span>
                  <span>+91 98765 43210</span>
                  <span>|</span>
                  <span>www.ciraaya.com</span>
                  <span>|</span>
                  <span>@ciraaya.jewellery</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              BILL 2: PARCEL PACKAGE INVOICE (Print & Paste on Box / Parcel)
             ═══════════════════════════════════════════════════════════════ */}
          {billMode === 'package' && (
            <div className="ciraaya-invoice-sheet bg-white p-6 sm:p-7 rounded-2xl border-2 border-black shadow-lg text-black space-y-4 max-w-2xl mx-auto font-sans">
              {/* 1. Header: Brand, Title & Barcode */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold tracking-wider text-black">
                    CIRAAYA
                  </h2>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-black">
                    MODERN &amp; ROYAL FINE JEWELLERY
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-black">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold text-black mb-1">
                    # {order.order_number}
                  </p>
                  <BarcodeGraphic code={order.order_number} />
                </div>
              </div>

              {/* 2. Ship To & Delivery Details Grid */}
              <div className="grid grid-cols-2 border border-black rounded-lg overflow-hidden divide-x divide-black text-xs">
                {/* Left: Ship To */}
                <div className="p-3 space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider block text-black">
                    SHIP TO:
                  </span>
                  <p className="font-bold text-sm text-black">{order.customer_name}</p>
                  <p className="text-black font-medium">{order.customer_phone}</p>
                  <p className="text-gray-800 text-[11px] pt-1 leading-snug">
                    {order.shipping_address?.line1}
                    {order.shipping_address?.line2 ? `, ${order.shipping_address.line2}` : ''}
                    <br />
                    {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
                  </p>
                </div>

                {/* Right: Delivery Details */}
                <div className="p-3 space-y-1 text-black">
                  <span className="font-bold text-[10px] uppercase tracking-wider block text-black">
                    DELIVERY DETAILS:
                  </span>
                  <p className="text-[11px]">
                    <strong>Courier:</strong> Delhivery Express Air
                  </p>
                  <p className="text-[11px]">
                    <strong>Tracking ID:</strong> {order.tracking_id || 'Generating on Dispatch'}
                  </p>
                  <p className="text-[11px]">
                    <strong>Insurance:</strong> 100% Comprehensive
                  </p>
                  <p className="text-[11px]">
                    <strong>Order Status:</strong> <span className="capitalize font-bold">{order.status}</span>
                  </p>
                </div>
              </div>

              {/* 3. Package Items Table */}
              <div className="border border-black rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase text-black">
                    <tr>
                      <th className="py-2 px-3 w-8">#</th>
                      <th className="py-2 px-3">ITEM</th>
                      <th className="py-2 px-3 text-center w-12">QTY</th>
                      <th className="py-2 px-3 text-right w-20">PRICE</th>
                      <th className="py-2 px-3 text-right w-24">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 bg-white">
                    {order.items?.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-2 px-3 font-mono">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <p className="font-bold text-black">{item.product_name_snapshot}</p>
                          {item.variant_snapshot && (
                            <p className="text-[10px] text-gray-600">({item.variant_snapshot})</p>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                        <td className="py-2 px-3 text-right font-medium">
                          ₹{item.price_snapshot.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 text-right font-bold">
                          ₹{(item.price_snapshot * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4. Invoice Summary & Payment Section (With QR Code) */}
              <div className="grid grid-cols-2 border border-black rounded-lg overflow-hidden divide-x divide-black text-xs">
                {/* Left: Invoice Summary */}
                <div className="p-3 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-[10px] uppercase tracking-wider block mb-1">
                      INVOICE SUMMARY
                    </span>
                    <div className="space-y-1 text-gray-800 text-[11px]">
                      <div className="flex justify-between">
                        <span>Item Subtotal:</span>
                        <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
                      </div>
                      {order.discount ? (
                        <div className="flex justify-between text-green-800">
                          <span>Discount ({order.coupon_code || 'WELCOME10'}):</span>
                          <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                        </div>
                      ) : null}
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (3%):</span>
                        <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-black pt-2 flex justify-between items-baseline font-bold">
                    <span className="text-xs uppercase tracking-wider">GRAND TOTAL:</span>
                    <span className="text-base">₹{order.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Right: Payment & QR Code */}
                <div className="p-3 space-y-2 flex flex-col items-center justify-center text-center">
                  <div className="w-full text-left space-y-0.5 text-[11px]">
                    <span className="font-bold text-[10px] uppercase tracking-wider block">
                      PAYMENT
                    </span>
                    <p>Method: <strong>{order.payment_method?.toUpperCase() || 'UPI'}</strong></p>
                    <p>
                      Status: <strong className="text-green-700 font-bold capitalize">{order.payment_status || 'Paid'}</strong>
                    </p>
                    <p className="text-gray-600">Date: {shortDate}</p>
                  </div>

                  <div className="pt-1 flex flex-col items-center">
                    <QRCodeGraphic value={`CIR-${order.order_number}-${order.total}`} />
                    <p className="text-[10px] font-bold text-black uppercase mt-1 flex items-center gap-1">
                      <span>THANK YOU</span>
                      <Heart className="w-2.5 h-2.5 fill-red-600 text-red-600 inline" />
                    </p>
                    <p className="text-[8px] text-gray-500">Handcrafted with love, just for you.</p>
                  </div>
                </div>
              </div>

              {/* 5. Trust Badges Strip */}
              <div className="border border-black rounded-lg p-2 grid grid-cols-4 text-center text-[9px] font-bold uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-black" />
                  <span>PREMIUM QUALITY</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-black" />
                  <span>ANTI-TARNISH</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-black" />
                  <span>SKIN FRIENDLY</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Package className="w-3 h-3 text-black" />
                  <span>SECURE PACKAGING</span>
                </div>
              </div>

              {/* 6. Company Legal Footer */}
              <div className="border-t border-black pt-2 text-center text-[9px] text-gray-800 space-y-0.5 leading-tight">
                <p className="font-bold text-black">Maison Ciraaya Private Limited</p>
                <p>GSTIN: 07AAACC4112G1Z8 | CIN: U36911DL2024PTC098812</p>
                <p>care@ciraaya.com | +91 98765 43210 | www.ciraaya.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
