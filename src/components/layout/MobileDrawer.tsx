"use client";

import React, { useEffect } from "react";
import Link from "next/link";

const menuSections = [
  {
    title: "Shop by Category",
    links: [
      { label: "All Jewellery", href: "/shop" },
      { label: "Necklaces & Chokers", href: "/category/necklaces" },
      { label: "Earrings & Chandbalis", href: "/category/earrings" },
      { label: "Rings & Solitaires", href: "/category/rings" },
      { label: "Bangles & Kadas", href: "/category/bangles" },
      { label: "Bridal Heritage", href: "/category/bridal" },
    ],
  },
  {
    title: "Curated Collections",
    links: [
      { label: "New Arrivals", href: "/shop?tag=new-arrival" },
      { label: "Bestsellers", href: "/shop?tag=bestseller" },
      { label: "Festive Glamour", href: "/shop?tag=festive" },
      { label: "Daily Elegance", href: "/shop?tag=daily-wear" },
    ],
  },
  {
    title: "Information & Concierge",
    links: [
      { label: "About CIRAAYA", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Jewellery Care & FAQ", href: "/faq" },
      { label: "Shipping & Delivery", href: "/shipping-delivery" },
      { label: "Returns & Exchange", href: "/returns-exchange" },
    ],
  },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#18181B]/50 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px]
                   bg-white shadow-2xl z-10
                   flex flex-col justify-between
                   overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBE6DF]">
          <div>
            <Link
              href="/"
              onClick={onClose}
              className="font-serif-luxury text-xl font-bold tracking-widest text-[#18181B] block"
            >
              CIRAAYA
            </Link>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-medium">Fine Jewellery</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8]"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Menu sections */}
        <div className="px-6 py-6 space-y-6 flex-1 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-2.5">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block py-2 text-xs font-medium text-[#18181B] hover:text-[#C5A059] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="p-6 border-t border-[#EBE6DF] bg-[#FAFAF8] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/account"
              onClick={onClose}
              className="text-center py-2 rounded-xl border border-[#EBE6DF] bg-white text-xs font-semibold text-[#18181B] hover:border-[#C5A059]"
            >
              My Account
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="text-center py-2 rounded-xl border border-[#EBE6DF] bg-white text-xs font-semibold text-[#18181B] hover:border-[#C5A059]"
            >
              Wishlist
            </Link>
          </div>
          <p className="text-[10px] text-center text-[#71717A] pt-2">
            WhatsApp Support: +91 99999 99999
          </p>
        </div>
      </div>
    </div>
  );
}
