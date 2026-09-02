'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface AdminReviewItem {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export default function AdminReviewsPage() {
  const { addToast } = useToast();

  const [reviews, setReviews] = useState<AdminReviewItem[]>([
    {
      id: 'rev-1',
      productName: 'Celestial Aurora Kundan Choker Set',
      customerName: 'Ananya Deshmukh',
      rating: 5,
      comment: 'Wore this for my brother’s wedding and received non-stop compliments! The finish looks just like real gold polki.',
      date: 'Yesterday',
      isApproved: true,
    },
    {
      id: 'rev-2',
      productName: 'Zeenat Chandbali Royal Earrings',
      customerName: 'Dr. Rhea Kapoor',
      rating: 5,
      comment: 'Surprisingly lightweight and extremely comfortable for long festive evenings. 10/10 craftsmanship.',
      date: '3 days ago',
      isApproved: true,
    },
    {
      id: 'rev-3',
      productName: 'Miraia Solitaire Teardrop Studs',
      customerName: 'Sneha Roy',
      rating: 4,
      comment: 'Very delicate and sparkling for daily office wear. Premium packaging.',
      date: '5 days ago',
      isApproved: true,
    },
  ]);

  const toggleApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
    addToast('Review moderation status updated.', 'info');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast('Review removed.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Customer Feedback
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Patron Reflections &amp; Reviews ({reviews.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Moderate customer reviews, star ratings, and verified purchaser testimonials.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`ciraaya-card p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              rev.isApproved ? 'border-[#EBE6DF]' : 'border-[#EBE6DF]/50 opacity-60'
            }`}
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#18181B] text-xs">{rev.customerName}</span>
                <div className="text-[#C5A059] text-xs">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
                <span className="text-[11px] text-[#71717A]">• on <strong className="text-[#18181B]">{rev.productName}</strong></span>
              </div>
              <p className="text-xs text-[#71717A] italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              <span className="text-[10px] text-[#A1A1AA] block">{rev.date}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleApproval(rev.id)}
                className={`text-xs font-semibold px-3 py-1 rounded-md cursor-pointer border ${
                  rev.isApproved
                    ? 'bg-[#EFF8F2] text-[#2A7A4C] border-[#C4E3CE]'
                    : 'bg-[#FBF7EE] text-[#9E7B32] border-[#E8D5AA]'
                }`}
              >
                {rev.isApproved ? '✓ Published' : 'Hidden'}
              </button>
              <button
                onClick={() => deleteReview(rev.id)}
                className="text-xs text-[#C53030] hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
