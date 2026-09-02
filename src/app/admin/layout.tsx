'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  DashboardIcon,
  ProductsIcon,
  CategoriesIcon,
  OrdersIcon,
  CouponsIcon,
  ReviewsIcon,
  WhatsAppIcon,
  HomepageIcon,
  LockIcon,
} from '@/components/ui/AdminIcons';

const adminNav = [
  { label: 'Overview', href: '/admin', Icon: DashboardIcon },
  { label: 'Products', href: '/admin/products', Icon: ProductsIcon },
  { label: 'Categories', href: '/admin/categories', Icon: CategoriesIcon },
  { label: 'Orders', href: '/admin/orders', Icon: OrdersIcon },
  { label: 'Coupons', href: '/admin/coupons', Icon: CouponsIcon },
  { label: 'Reviews', href: '/admin/reviews', Icon: ReviewsIcon },
  { label: 'WhatsApp Queue', href: '/admin/whatsapp', Icon: WhatsAppIcon },
  { label: 'Homepage CMS', href: '/admin/homepage', Icon: HomepageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-main py-20 text-center max-w-md mx-auto">
        <div className="ciraaya-card p-8 bg-white space-y-4 shadow-sm border border-[#EBE6DF]">
          <div className="w-12 h-12 rounded-full bg-[#FBF7EE] text-[#9E7B32] flex items-center justify-center mx-auto">
            <LockIcon size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#18181B]">Admin Access Required</h2>
          <p className="text-xs text-[#71717A] leading-relaxed">
            This area is restricted to store administrators. Please sign in with administrator credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/account" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm">
              Sign In as Admin
            </Link>
            <Link href="/" className="ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm">
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FAFAF8]">
      {/* ─── Desktop Collapsible Sidebar ─────────────────────────── */}
      <aside
        className={`
          hidden lg:flex bg-white border-r border-[#EBE6DF] flex-col shrink-0 sticky top-16 h-[calc(100vh-64px)] z-20 transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Sidebar Header with Toggle */}
        <div className="p-4 border-b border-[#EBE6DF] flex items-center justify-between gap-2">
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                Management
              </span>
              <p className="text-xs font-bold text-[#18181B] truncate mt-0.5">
                Pooja&apos;s Store Panel
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8] transition-colors cursor-pointer shrink-0 ml-auto"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              <path d="m14 9-3 3 3 3" />
            </svg>
          </button>
        </div>

        {/* Navigation items with High-Contrast Active States */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const ItemIcon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-md font-semibold'
                      : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAFAF8] font-medium'
                  }
                  ${sidebarCollapsed ? 'justify-center px-2' : ''}
                `}
              >
                <span
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-[#C5A059]' : 'text-[#71717A] group-hover:text-[#18181B]'
                  }`}
                >
                  <ItemIcon size={18} />
                </span>

                {!sidebarCollapsed && (
                  <span className={`truncate text-xs ${isActive ? 'text-white font-semibold' : 'text-[#52525B] group-hover:text-[#18181B]'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Back link */}
        <div className="p-3 border-t border-[#EBE6DF] bg-[#FAFAF8]">
          <Link
            href="/"
            className={`
              flex items-center gap-2 text-xs font-medium text-[#71717A] hover:text-[#C5A059] transition-colors p-2 rounded-lg
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
            title={sidebarCollapsed ? 'Back to Store' : undefined}
          >
            <span className="text-sm">←</span>
            {!sidebarCollapsed && <span className="truncate">Public Store</span>}
          </Link>
        </div>
      </aside>

      {/* ─── Mobile Admin Bottom Action Bar ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBE6DF] h-14 flex items-center justify-around px-2 shadow-md">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF7EE] text-[#9E7B32] text-xs font-semibold rounded-xl border border-[#E8D5AA] cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span>Menu</span>
        </button>
        <Link href="/admin/products" className="text-xs font-medium text-[#71717A] hover:text-[#18181B] flex items-center gap-1">
          <ProductsIcon size={14} /> Products
        </Link>
        <Link href="/admin/orders" className="text-xs font-medium text-[#71717A] hover:text-[#18181B] flex items-center gap-1">
          <OrdersIcon size={14} /> Orders
        </Link>
        <Link href="/" className="text-xs font-medium text-[#71717A] hover:text-[#C5A059]">
          ↗ Store
        </Link>
      </div>

      {/* ─── Mobile Drawer ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#18181B]/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full p-6 flex flex-col shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">CIRAAYA</span>
                <h3 className="text-sm font-bold text-[#18181B]">Admin Panel</h3>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1.5 flex-1 overflow-y-auto">
              {adminNav.map((item) => {
                const isActive = pathname === item.href;
                const ItemIcon = item.Icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors
                      ${
                        isActive
                          ? 'bg-[#18181B] text-white font-semibold'
                          : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAFAF8] font-medium'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-[#C5A059]' : 'text-[#71717A]'}>
                      <ItemIcon size={18} />
                    </span>
                    <span className={`text-xs ${isActive ? 'text-white font-semibold' : 'text-[#52525B]'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#EBE6DF]">
              <Link
                href="/"
                className="ciraaya-btn ciraaya-btn-outline w-full ciraaya-btn-sm"
              >
                ↗ Return to Live Store
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Admin Content Area ─── */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
