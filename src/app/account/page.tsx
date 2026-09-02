'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/components/ui/Toast';
import { Crown, User } from 'lucide-react';

export default function AccountPage() {
  const { user, isAdmin, login, logout, updateProfile } = useAuth();
  const { orders } = useStore();
  const { itemCount: wishCount } = useWishlist();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Auth inputs if not logged in
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const userOrders = orders.filter((o) => !user?.id || o.user_id === user.id || o.customer_name === user?.full_name);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName, phone });
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    await login(authEmail, authPassword || 'password');
    addToast(`Signed in as ${authEmail}`, 'success');
  };

  return (
    <div className="container-main py-8 md:py-12 max-w-5xl mx-auto bg-[#FAFAF8]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Customer Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">My Account</h1>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin" className="ciraaya-btn ciraaya-btn-outline ciraaya-btn-sm flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Admin Panel</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="text-xs text-[#71717A] hover:text-[#C53030] transition-colors underline font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {!user ? (
        <div className="ciraaya-card p-8 md:p-10 max-w-md mx-auto text-center bg-white space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FBF7EE] text-[#9E7B32] flex items-center justify-center mx-auto border border-[#E8D5AA]">
            <Crown className="w-5 h-5 text-[#C5A059]" />
          </div>
          <h2 className="font-serif-luxury text-xl font-normal text-[#18181B]">Welcome to CIRAAYA</h2>
          <p className="text-[#71717A] text-xs leading-relaxed">
            Sign in to track orders, manage addresses, and access your luxury wishlist.
          </p>
          <form onSubmit={handleQuickLogin} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-semibold text-[#18181B] mb-1 block">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="customer@example.com or admin@ciraaya.com"
                className="ciraaya-input text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#18181B] mb-1 block">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="ciraaya-input text-xs"
              />
            </div>
            <button type="submit" className="ciraaya-btn ciraaya-btn-primary w-full mt-2 text-xs">
              Sign In / Continue
            </button>
          </form>

          {/* Quick Demo Switchers */}
          <div className="pt-4 border-t border-[#EBE6DF] text-xs text-[#71717A] space-y-2">
            <p className="font-semibold text-[#18181B]">Quick Demo Accounts:</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => login('customer@example.com', 'password')}
                className="text-[11px] bg-[#FAFAF8] border border-[#EBE6DF] hover:border-[#C5A059] px-3 py-1 rounded-md font-medium cursor-pointer flex items-center gap-1"
              >
                <User className="w-3 h-3 text-[#71717A]" />
                <span>Customer</span>
              </button>
              <button
                onClick={() => login('admin@ciraaya.com', 'password')}
                className="text-[11px] bg-[#FBF7EE] border border-[#E8D5AA] text-[#9E7B32] hover:bg-[#C5A059] hover:text-white px-3 py-1 rounded-md font-bold cursor-pointer flex items-center gap-1"
              >
                <Crown className="w-3 h-3 text-[#C5A059]" />
                <span>Store Admin</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="ciraaya-card p-6 bg-white space-y-5 h-fit">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FBF7EE] border border-[#E8D5AA] flex items-center justify-center font-serif-luxury text-lg font-bold text-[#9E7B32]">
                {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-[#18181B] truncate">{user.full_name || 'Valued Patron'}</h3>
                <p className="text-xs text-[#71717A] truncate">{user.email || 'customer@example.com'}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-[#EBE6DF]">
                <div>
                  <label className="text-[11px] font-semibold text-[#18181B] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="ciraaya-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#18181B] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ciraaya-input text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm flex-1">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="ciraaya-btn ciraaya-btn-ghost ciraaya-btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 pt-3 border-t border-[#EBE6DF] text-xs text-[#71717A]">
                <p>Phone: <strong className="text-[#18181B]">{user.phone || '+91 98765 43210'}</strong></p>
                <p>Role: <strong className="text-[#9E7B32]">{isAdmin ? 'Store Administrator' : 'Verified Patron'}</strong></p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-[#C5A059] hover:underline cursor-pointer pt-1"
                >
                  Edit Profile Details →
                </button>
              </div>
            )}
          </div>

          {/* Quick Links & Order History (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/account/orders"
                className="ciraaya-card p-5 bg-white flex items-center justify-between group"
              >
                <div>
                  <p className="text-2xl font-bold text-[#18181B]">{userOrders.length}</p>
                  <p className="text-xs text-[#71717A] mt-0.5">My Purchases</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FAFAF8] border border-[#EBE6DF] text-[#71717A] group-hover:text-[#C5A059] group-hover:border-[#C5A059] flex items-center justify-center transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/wishlist"
                className="ciraaya-card p-5 bg-white flex items-center justify-between group"
              >
                <div>
                  <p className="text-2xl font-bold text-[#18181B]">{wishCount}</p>
                  <p className="text-xs text-[#71717A] mt-0.5">Saved Pieces</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FAFAF8] border border-[#EBE6DF] text-[#71717A] group-hover:text-[#C5A059] group-hover:border-[#C5A059] flex items-center justify-center transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Recent Orders List */}
            <div className="ciraaya-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-3">
                <h3 className="font-bold text-sm text-[#18181B]">Recent Purchases</h3>
                <Link href="/account/orders" className="text-xs font-semibold text-[#C5A059] hover:underline">
                  View All Orders →
                </Link>
              </div>

              {userOrders.length === 0 ? (
                <p className="text-xs text-[#71717A] py-6 text-center">No purchases recorded yet.</p>
              ) : (
                <div className="divide-y divide-[#EBE6DF]">
                  {userOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <Link
                          href={`/account/orders/${order.order_number}`}
                          className="font-mono font-bold text-[#18181B] hover:text-[#C5A059]"
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="uppercase text-[10px] font-bold text-[#2A7A4C] bg-[#EFF8F2] border border-[#C4E3CE] px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                        <Link
                          href={`/account/orders/${order.order_number}`}
                          className="text-xs font-semibold text-[#C5A059] hover:underline ml-2"
                        >
                          Track →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
