'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const INSTAGRAM_URL = 'https://www.instagram.com/ciraaya.in';

const footerSections = [
  {
    title: 'Curated Collections',
    links: [
      { label: 'Shop All Pieces', href: '/shop' },
      { label: 'Waterproof Necklaces', href: '/category/necklaces' },
      { label: 'Everyday Earrings & Hoops', href: '/category/earrings' },
      { label: 'Stacking & Statement Rings', href: '/category/rings' },
      { label: 'Bangles & Cuffs', href: '/category/bangles' },
      { label: 'Bridal & Party Edit', href: '/category/bridal' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'WhatsApp Concierge', href: 'https://wa.me/919999999999' },
      { label: 'Jewellery Care Guide', href: '/faq' },
      { label: 'Express Shipping & Delivery', href: '/shipping-delivery' },
      { label: '7-Day Easy Exchange', href: '/returns-exchange' },
      { label: 'Track Order', href: '/account/orders' },
    ],
  },
  {
    title: 'About Ciraaya',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Waterproof & Quality Guarantee', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-conditions' },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin') || pathname === '/checkout') {
    return null;
  }

  return (
    <footer className="bg-[#18181B] text-[#FAFAF8] border-t border-[#27272A] mt-auto">
      {/* 4 Trust Badges: Waterproof | Anti-Tarnish | Skin-Safe | 7-Day Exchange */}
      <div className="border-b border-[#27272A] py-10 bg-[#121215]">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* 1. Waterproof */}
            <div className="p-4 rounded-xl border border-[#27272A] bg-[#18181B] flex flex-col items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#C5A059] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">100% Waterproof</h3>
              <p className="text-xs text-[#A1A1AA]">Shower, gym &amp; sweat proof</p>
            </div>

            {/* 2. Anti-Tarnish */}
            <div className="p-4 rounded-xl border border-[#27272A] bg-[#18181B] flex flex-col items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#C5A059] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Anti-Tarnish Finish</h3>
              <p className="text-xs text-[#A1A1AA]">Long-lasting color retention</p>
            </div>

            {/* 3. Skin-Safe */}
            <div className="p-4 rounded-xl border border-[#27272A] bg-[#18181B] flex flex-col items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#C5A059] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">100% Skin-Safe</h3>
              <p className="text-xs text-[#A1A1AA]">Hypoallergenic &amp; nickel free</p>
            </div>

            {/* 4. 7-Day Exchange */}
            <div className="p-4 rounded-xl border border-[#27272A] bg-[#18181B] flex flex-col items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#C5A059] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">7-Day Easy Exchange</h3>
              <p className="text-xs text-[#A1A1AA]">Hassle-free doorstep pickup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#A1A1AA] hover:text-[#C5A059] transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand & Social Links */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              CIRAAYA
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Curated everyday jewellery collection. Waterproof, anti-tarnish, and skin-safe pieces for modern daily wear.
            </p>
            <div className="pt-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#C5A059] text-white hover:text-white transition-all text-xs font-semibold"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>@ciraaya.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[#27272A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} CIRAAYA (ciraaya.in). Curated Everyday Jewellery. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono border border-[#3F3F46] px-2 py-0.5 rounded text-[#A1A1AA]">
              WATERPROOF • ANTI-TARNISH • SKIN-SAFE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
