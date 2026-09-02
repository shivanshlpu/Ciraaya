'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { RevenueIcon, OrdersIcon, GemIcon, CategoriesIcon } from '@/components/ui/AdminIcons';

export default function AdminDashboardOverview() {
  const { products, orders, categories, coupons } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total : 0), 0);
  const lowStockProducts = products.filter((p) => p.stock_qty < 10);
  const pendingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'confirmed');

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      Icon: RevenueIcon,
      change: '+18.4% this week',
      badge: 'Live',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      Icon: OrdersIcon,
      change: `${pendingOrders.length} pending dispatch`,
      badge: 'Orders',
    },
    {
      label: 'Active Catalogue',
      value: products.filter((p) => p.is_active).length.toString(),
      Icon: GemIcon,
      change: `${lowStockProducts.length} low stock items`,
      badge: 'Pieces',
    },
    {
      label: 'Active Categories',
      value: categories.length.toString(),
      Icon: CategoriesIcon,
      change: `${coupons.filter((c) => c.is_active).length} active coupons`,
      badge: 'Taxonomy',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Store Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Welcome back, Pooja!
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Here is your live jewellery sales, inventory, and order fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button size="sm">
              + Add Product
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              View Store ↗
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards with Clean Vector Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((st) => {
          const IconComponent = st.Icon;
          return (
            <div
              key={st.label}
              className="ciraaya-card p-5 bg-white flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAFAF8] border border-[#EBE6DF] text-[#C5A059] flex items-center justify-center">
                  <IconComponent size={18} />
                </div>
                <span className="text-[10px] font-semibold text-[#9E7B32] bg-[#FBF7EE] border border-[#E8D5AA] px-2 py-0.5 rounded-md">
                  {st.badge}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#18181B] tracking-tight">{st.value}</p>
                <p className="text-xs font-medium text-[#71717A] mt-0.5">{st.label}</p>
              </div>
              <p className="text-[11px] text-[#71717A] mt-3 pt-2 border-t border-[#EBE6DF]">
                {st.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 ciraaya-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-3">
            <div>
              <h3 className="font-semibold text-sm text-[#18181B]">Recent Orders</h3>
              <p className="text-[11px] text-[#71717A]">Latest customer purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#C5A059] hover:underline"
            >
              Manage All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#71717A] py-8 text-center">No orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EBE6DF] text-[#71717A] font-semibold">
                    <th className="py-2.5 px-3">Order</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DF]">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#18181B]">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-3 text-[#18181B]">
                        {order.shipping_address?.full_name || 'Customer'}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#18181B]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EFF8F2] text-[#2A7A4C] border border-[#C4E3CE]">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="ciraaya-badge-gold text-[10px]">
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inventory Watch & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ciraaya-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-3">
              <div>
                <h3 className="font-semibold text-sm text-[#18181B]">Inventory Watch</h3>
                <p className="text-[11px] text-[#71717A]">Low stock threshold &lt; 10</p>
              </div>
              <span className="text-[10px] font-bold text-[#C53030] bg-[#FDF2F2] border border-[#F8D7DA] px-2 py-0.5 rounded">
                {lowStockProducts.length} Alert{lowStockProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#2A7A4C] py-4 text-center font-medium">
                ✓ All inventory items well stocked.
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#FAFAF8] border border-[#EBE6DF]"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-[#18181B] truncate">{p.name}</p>
                      <p className="text-[10px] text-[#71717A] font-mono">{p.sku}</p>
                    </div>
                    <span className="font-bold text-[#C53030] text-xs px-2 py-0.5 bg-red-50 rounded shrink-0">
                      {p.stock_qty} left
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link href="/admin/products" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Manage Inventory →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
