'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { Order } from '@/types/database';
import { InvoiceModal } from '@/components/ui/InvoiceModal';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const { addToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [invoiceMode, setInvoiceMode] = useState<'customer' | 'package'>('customer');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const filtered = orders.filter((o) => statusFilter === 'all' || o.status === statusFilter);

  const handleStatusChange = (orderId: string, newStatus: Order['status'], trackingId?: string) => {
    updateOrderStatus(orderId, newStatus, trackingId);
    addToast(`Order status updated to "${newStatus.toUpperCase()}".`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Fulfillment Management
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Orders &amp; Invoices ({orders.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Track customer orders, update delivery status, and generate official GST tax invoices.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white border border-[#EBE6DF] p-1.5 rounded-xl shadow-xs">
          {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="ciraaya-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#71717A] border-b border-[#EBE6DF]">
              <tr>
                <th className="p-4 font-semibold">Order No.</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer &amp; Phone</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#71717A]">
                    No orders found for the selected status.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF8]/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#18181B]">
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="hover:text-[#C5A059] hover:underline cursor-pointer text-left flex items-center gap-1.5"
                        title="Click to view full invoice"
                      >
                        <span>{order.order_number}</span>
                        <span className="text-[10px] text-[#C5A059]">📄</span>
                      </button>
                    </td>
                    <td className="p-4 text-[#71717A]">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-[#18181B]">{order.customer_name}</p>
                      <p className="text-[11px] text-[#71717A]">📞 {order.customer_phone}</p>
                    </td>
                    <td className="p-4 font-semibold text-[#18181B] text-sm">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="uppercase text-[10px] font-bold text-[#2A7A4C] bg-[#EFF8F2] border border-[#C4E3CE] px-2 py-0.5 rounded-md">
                        {order.payment_method} • {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="bg-[#FAFAF8] border border-[#EBE6DF] rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#C5A059] cursor-pointer"
                      >
                        <option value="placed">PLACED</option>
                        <option value="confirmed">CONFIRMED</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setTrackingInput(order.tracking_id || '');
                        }}
                        className="text-xs text-[#71717A] hover:text-[#18181B] font-medium border border-[#EBE6DF] px-2.5 py-1 rounded-md hover:bg-[#FAFAF8] cursor-pointer"
                      >
                        Tracking
                      </button>
                      <button
                        onClick={() => {
                          setInvoiceMode('customer');
                          setSelectedOrderForInvoice(order);
                        }}
                        className="text-xs font-semibold text-[#9E7B32] hover:text-[#7A5E24] bg-[#FBF7EE] border border-[#E8D5AA] px-2.5 py-1 rounded-md hover:bg-[#F4EFEA] cursor-pointer"
                      >
                        Tax Invoice
                      </button>
                      <button
                        onClick={() => {
                          setInvoiceMode('package');
                          setSelectedOrderForInvoice(order);
                        }}
                        className="text-xs font-semibold text-[#18181B] hover:text-black bg-white border border-black px-2.5 py-1 rounded-md hover:bg-gray-100 cursor-pointer shadow-2xs"
                      >
                        📦 Parcel Bill
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking ID Quick Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3">
              <h3 className="font-semibold text-sm text-[#18181B]">
                Courier Tracking for {editingOrder.order_number}
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#71717A] hover:text-[#18181B]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#18181B] block">
                Airway Bill / Tracking Number (Delhivery / Bluedart):
              </label>
              <input
                type="text"
                placeholder="e.g. DLHV-884912903"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="ciraaya-input text-xs"
              />
              <p className="text-[11px] text-[#71717A]">
                Saving will automatically set order status to &quot;Shipped&quot; and notify the customer.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingOrder(null)}
                className="ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(editingOrder.id, 'shipped', trackingInput);
                  addToast('Tracking ID updated and order marked as Shipped!', 'success');
                  setEditingOrder(null);
                }}
                className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm"
              >
                Save Tracking ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luxury PDF & Print Invoice Modal */}
      <InvoiceModal
        order={selectedOrderForInvoice}
        isOpen={!!selectedOrderForInvoice}
        initialMode={invoiceMode}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
}
