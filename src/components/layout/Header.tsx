'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { MobileDrawer } from './MobileDrawer';

/* ─── Ultra-Clean Minimal SVG Icons ──────────────── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MicIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const navLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Necklaces', href: '/category/necklaces' },
  { label: 'Earrings', href: '/category/earrings' },
  { label: 'Rings', href: '/category/rings' },
  { label: 'Bangles & Bracelets', href: '/category/bangles' },
  { label: 'Bridal & Party', href: '/category/bridal' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname?.startsWith('/admin');

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { itemCount: cartCount } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const { user } = useAuth();
  const { products, categories } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        // preserve open state
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live predictive search results: only active when user types at least 2 characters
  const predictiveResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return { products: [], categories: [], total: 0 };

    const matchingCategories = categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );

    const matchingProducts = products.filter((p) => {
      if (!p.is_active) return false;
      const matchName = p.name.toLowerCase().includes(q);
      const matchMat = p.material.toLowerCase().includes(q);
      const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchDesc = p.description.toLowerCase().includes(q);
      return matchName || matchMat || matchTag || matchDesc;
    });

    return {
      products: matchingProducts.slice(0, 4),
      categories: matchingCategories.slice(0, 3),
      total: matchingProducts.length,
    };
  }, [searchQuery, products, categories]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSelectSuggestion = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        router.push(`/shop?search=${encodeURIComponent(transcript)}`);
      };
      recognition.start();
    } else {
      searchInputRef.current?.focus();
    }
  };

  // 1. Dedicated Admin Top Header
  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EBE6DF] shadow-xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-serif-luxury text-lg md:text-xl font-bold tracking-wider text-[#18181B]">
                CIRAAYA
              </span>
              <span className="text-[10px] uppercase tracking-widest bg-[#C5A059] text-white px-2 py-0.5 rounded-md font-bold">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm"
            >
              <span>↗</span> View Live Store
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-2 text-xs font-semibold text-[#18181B] bg-[#FAFAF8] border border-[#EBE6DF] px-3 py-1.5 rounded-xl hover:border-[#C5A059] transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-[#C5A059] text-white text-xs font-bold flex items-center justify-center">
                {user?.full_name?.charAt(0) || 'P'}
              </span>
              <span className="hidden sm:inline">{user?.full_name?.split(' ')[0] || 'Admin'}</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // 2. Minimal Checkout Header
  if (pathname === '/checkout') {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EBE6DF] shadow-xs">
        <div className="container-main h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
          >
            <span>←</span> Return to Bag
          </Link>

          <Link href="/" className="text-center group py-1">
            <span className="font-serif-luxury text-xl sm:text-2xl tracking-[0.25em] font-bold text-[#18181B] group-hover:text-[#C5A059] transition-colors block">
              CIRAAYA
            </span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#2A7A4C] font-semibold bg-[#EFF8F2] px-3 py-1.5 rounded-xl border border-[#C4E3CE]">
            <span className="text-[11px] font-bold">SSL 256-BIT</span>
          </div>
        </div>
      </header>
    );
  }

  // 3. Public Storefront Header
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#EBE6DF]">
        {/* Top Announcement Ribbon */}
        {showAnnouncement && (
          <div className="bg-[#18181B] text-[#FAFAF8] px-4 py-2 text-center text-xs font-medium tracking-[0.12em] uppercase flex items-center justify-center relative">
            <p className="flex items-center gap-2 text-[11px]">
              <span className="font-semibold text-[#E8D5AA]">WATERPROOF • ANTI-TARNISH • SKIN-SAFE</span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="hidden md:inline">Complimentary Express Delivery Above ₹999</span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="hidden md:inline font-bold text-[#C5A059] tracking-[0.2em] text-[10px]">
                CODE: ROYAL10
              </span>
            </p>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Dismiss announcement banner"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        )}

        {/* Top Bar: Left (Menu/Contact) | Center (CIRAAYA Logo) | Right (Actions) */}
        <div className="container-main flex items-center justify-between h-16 md:h-18">
          {/* Left: Mobile Hamburger / Desktop Links */}
          <div className="flex items-center gap-4 w-1/3 justify-start">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-[#18181B] hover:text-[#C5A059] transition-colors cursor-pointer p-1.5 -ml-1.5 flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </button>

            <Link
              href="/about"
              className="hidden lg:inline text-[11px] font-semibold tracking-widest uppercase text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hidden lg:inline text-[11px] font-semibold tracking-widest uppercase text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Center: CIRAAYA Brand Logo */}
          <div className="flex justify-center text-center w-1/3">
            <Link href="/" className="group py-1 inline-block">
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] font-bold text-[#18181B] group-hover:text-[#C5A059] transition-colors duration-300 block">
                CIRAAYA
              </span>
              <span className="block text-[8px] tracking-[0.35em] uppercase text-[#C5A059] -mt-1 font-bold">
                CURATED JEWELLERY
              </span>
            </Link>
          </div>

          {/* Right: Symmetrical Action Icons */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 w-1/3">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) {
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                searchOpen ? 'bg-[#18181B] text-[#C5A059]' : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8]'
              }`}
              aria-label="Search catalogue"
            >
              <SearchIcon />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2 text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8] rounded-xl transition-colors"
              aria-label="View Wishlist"
            >
              <HeartIcon />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A059] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8] rounded-xl transition-colors"
              aria-label="View Shopping Bag"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#18181B] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1.5 p-2 text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8] rounded-xl transition-colors text-xs font-semibold"
              aria-label="My Account"
            >
              <UserIcon />
              {user && (
                <span className="hidden xl:inline text-xs text-[#18181B] truncate max-w-[80px]">
                  {user.full_name?.split(' ')[0]}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Bottom Category Bar */}
        <div className="hidden lg:block border-t border-[#EBE6DF] bg-[#FAFAF8]">
          <div className="container-main flex items-center justify-center gap-8 xl:gap-10 h-11">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-xs font-medium tracking-[0.18em] transition-colors duration-200 uppercase relative py-1
                    ${isActive ? 'text-[#18181B] font-bold' : 'text-[#71717A] hover:text-[#18181B]'}
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── Exact Pill Search Bar (From User Reference Mockup) ─── */}
        {searchOpen && (
          <div
            ref={searchContainerRef}
            className="border-t border-[#EBE6DF] bg-white/95 backdrop-blur-md py-4 shadow-sm relative z-50 animate-in fade-in duration-200"
          >
            <div className="container-main max-w-4xl mx-auto relative px-4">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full bg-white border border-[#E6DFD5] hover:border-[#C5A059] focus-within:border-[#C5A059] rounded-full shadow-xs focus-within:shadow-md h-12 md:h-13 px-4 sm:px-6 flex items-center gap-3 transition-all"
              >
                {/* 1. Magnifying Glass Icon (Stays inside the field, clickable to search) */}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="text-[#18181B] hover:text-[#C5A059] transition-colors cursor-pointer shrink-0 p-1 -ml-1 flex items-center justify-center"
                  title="Click to search"
                  aria-label="Submit search"
                >
                  <SearchIcon />
                </button>

                {/* 2. Text Input */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search curated pieces (e.g. waterproof necklace, hoops, rings)..."
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:outline-none focus:ring-0 px-1"
                />

                {/* Clear button if typed */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#A1A1AA] hover:text-[#18181B] text-xs transition-colors cursor-pointer px-1"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}

                {/* 3. Vertical Separator */}
                <div className="h-5 w-px bg-[#EBE6DF] shrink-0" />

                {/* 4. Gold Microphone (Voice Search) */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                    isListening
                      ? 'bg-[#C5A059] text-white animate-pulse'
                      : 'text-[#C5A059] hover:text-[#9E7B32] hover:bg-[#FBF7EE]'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice Search'}
                  aria-label="Voice search"
                >
                  <MicIcon />
                </button>

                {/* 5. Bag Shortcut / Close Search */}
                <Link
                  href="/cart"
                  className="text-[#18181B] hover:text-[#C5A059] transition-colors shrink-0 p-1.5 hover:bg-[#FAFAF8] rounded-full hidden sm:flex items-center justify-center"
                  title="View Shopping Bag"
                  aria-label="Shopping bag"
                >
                  <CartIcon />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-[#71717A] hover:text-[#18181B] transition-colors shrink-0 p-1.5 hover:bg-[#FAFAF8] rounded-full text-xs cursor-pointer"
                  title="Close search"
                  aria-label="Close search bar"
                >
                  ✕
                </button>
              </form>

              {/* Word-by-word Floating Dropdown: Only appears when typed 2+ characters */}
              {searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-4 z-50 animate-in fade-in duration-150 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-3">
                    {/* 1. Main Search Action */}
                    <div
                      onClick={() => handleSearchSubmit()}
                      className="py-2 px-3 rounded-xl bg-[#FAFAF8] hover:bg-[#F4EFEA] border border-[#EBE6DF] transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                        <span className="text-[#C5A059]">🔍</span>
                        <span>Search for &quot;<strong className="text-[#18181B]">{searchQuery}</strong>&quot; in All Products</span>
                      </div>
                      <span className="text-xs text-[#C5A059] font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>

                    {/* 2. Matching Categories */}
                    {predictiveResults.categories.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                          Categories:
                        </span>
                        {predictiveResults.categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(`/category/${cat.slug}`)}
                            className="text-xs bg-[#FBF7EE] text-[#9E7B32] border border-[#E8D5AA] px-2.5 py-1 rounded-lg font-semibold hover:bg-[#C5A059] hover:text-white transition-colors cursor-pointer"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 3. Matching Products Preview */}
                    {predictiveResults.products.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block">
                          Top Products ({predictiveResults.total})
                        </span>
                        <div className="divide-y divide-[#EBE6DF]/70 border border-[#EBE6DF] rounded-xl overflow-hidden">
                          {predictiveResults.products.map((item) => {
                            const img =
                              item.images?.[0]?.image_url ||
                              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200';
                            const price = item.discount_price || item.price;

                            return (
                              <div
                                key={item.id}
                                onClick={() => handleSelectSuggestion(`/product/${item.slug}`)}
                                className="py-2.5 px-3 hover:bg-[#FAFAF8] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={img}
                                    alt={item.name}
                                    className="w-11 h-11 rounded-lg object-cover bg-[#FAFAF8] border border-[#EBE6DF] shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-[#18181B] group-hover:text-[#C5A059] transition-colors truncate">
                                      {item.name}
                                    </p>
                                    <span className="text-[10px] uppercase font-bold text-[#9E7B32]">
                                      {item.material}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs font-bold text-[#18181B] block">
                                    ₹{price.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* View all results footer */}
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleSearchSubmit()}
                            className="w-full py-2 bg-[#18181B] hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            View all {predictiveResults.total} results on search page →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 text-center text-xs text-[#71717A]">
                        No matching pieces found for &quot;<strong>{searchQuery}</strong>&quot;.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
