'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function OrdersHistoryPage() {
  const { orders } = useStore();
  const { user } = useAuth();

  const userOrders = orders.filter((o) => !user?.id || o.user_id === user.id || o.customer_name === user?.full_name);

  return (
    <div className="container-main py-8 md:py-12 max-w-4xl mx-auto bg-[#FAFAF8]">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#71717A] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#18181B] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/account" className="hover:text-[#18181B] transition-colors">Account</Link>
        <span>/</span>
        <span className="text-[#18181B] font-semibold">Orders</span>
      </nav>

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#EBE6DF]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
          Purchases
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
          Order History ({userOrders.length})
        </h1>
      </div>

      {userOrders.length === 0 ? (
        <div className="ciraaya-card p-12 text-center max-w-md mx-auto bg-white space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAFAF8] border border-[#EBE6DF] text-[#71717A] flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#18181B]">No Orders Placed Yet</h3>
          <p className="text-xs text-[#71717A]">
            When you purchase jewellery, your order updates and live delivery tracking will appear here.
          </p>
          <Link href="/shop">
            <Button size="sm">Shop Jewellery</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="ciraaya-card p-6 bg-white space-y-4"
            >
              {/* Top Row: Number, Date, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE6DF] pb-3">
                <div>
                  <span className="font-mono font-bold text-sm text-[#18181B] block">
                    {order.order_number}
                  </span>
                  <span className="text-xs text-[#71717A]">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#EFF8F2] text-[#2A7A4C] border border-[#C4E3CE]">
                    {order.status}
                  </span>
                  <Link href={`/account/orders/${order.order_number}`}>
                    <Button variant="outline" size="sm">
                      Track &amp; Invoice →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items */}
              {order.items && (
                <div className="divide-y divide-[#EBE6DF]/70">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
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
              )}

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#EBE6DF] pt-3 text-xs text-[#71717A]">
                <span>Payment: <strong className="text-[#18181B]">{order.payment_method.toUpperCase()} ({order.payment_status})</strong></span>
                <span>Total Paid: <strong className="text-sm text-[#C5A059] font-bold">₹{order.total.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
