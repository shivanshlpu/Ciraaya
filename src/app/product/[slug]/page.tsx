'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/components/ui/Toast';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductVariant } from '@/types/database';
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from '@/lib/image-compressor';
import { Droplets, ShieldCheck, Zap, Star, CheckCircle2 } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const product = products.find((p) => p.slug === resolvedParams.slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Review System State
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      name: 'Ananya Deshmukh',
      rating: 5,
      date: '2 days ago',
      comment: 'Wore this in the shower and gym all week — zero fading, no green skin, genuinely 100% waterproof!',
      verified: true,
    },
    {
      id: 'rev-2',
      name: 'Dr. Rhea Kapoor',
      rating: 5,
      date: '1 week ago',
      comment: 'Super lightweight and high aesthetic finish. Exactly what I was looking for in everyday jewellery.',
      verified: true,
    },
    {
      id: 'rev-3',
      name: 'Meera Nambiar',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Beautiful presentation box, fast delivery, and premium finish. Definitely ordering more sets.',
      verified: true,
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
  });

  // Record to recently viewed history (Flipkart / Amazon style)
  useEffect(() => {
    if (product) {
      try {
        const saved = JSON.parse(localStorage.getItem('ciraaya_recently_viewed') || '[]');
        const filtered = saved.filter((id: string) => id !== product.id);
        const updated = [product.id, ...filtered].slice(0, 8);
        localStorage.setItem('ciraaya_recently_viewed', JSON.stringify(updated));
        window.dispatchEvent(new Event('ciraaya-recently-viewed-updated'));
      } catch {}
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-[#18181B] mb-2">Jewellery Piece Not Found</h1>
        <p className="text-xs text-[#71717A] mb-6">The requested piece may have been updated or archived.</p>
        <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary">
          Explore Catalogue
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = (product.discount_price || product.price) + (selectedVariant?.price_delta || 0);
  const images = product.images && product.images.length > 0 ? product.images : [{ id: '1', product_id: product.id, image_url: DEFAULT_FALLBACK_IMAGE, sort_order: 0 }];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.material === product.material))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      addToast('Please provide your name and review feedback.', 'error');
      return;
    }

    const reviewObj: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: newReview.name.trim(),
      rating: newReview.rating,
      date: 'Just now',
      comment: newReview.comment.trim(),
      verified: true,
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setShowReviewModal(false);
    setNewReview({ name: '', rating: 5, comment: '' });
    addToast('Thank you! Your verified review has been published.', 'success');
  };

  return (
    <div className="py-6 md:py-10 bg-[#FAFAF8]">
      {/* ─── 1. Breadcrumb ─────────────────────────────────── */}
      <div className="container-main mb-6">
        <nav className="text-xs text-[#71717A] flex items-center gap-2">
          <Link href="/" className="hover:text-[#18181B] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#18181B] transition-colors">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-[#18181B] transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#18181B] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ─── 2. Product Details Grid ───────────────────────── */}
      <div className="container-main mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Multi-Image Viewer */}
          <div className="lg:col-span-6 space-y-4">
            {/* Active Big Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#EBE6DF] shadow-sm">
              <img
                src={images[activeImageIndex]?.image_url || DEFAULT_FALLBACK_IMAGE}
                alt={product.name}
                onError={handleImageError}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                {product.discount_price && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#C5A059] text-white shadow-xs">
                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#18181B] text-white uppercase tracking-wider">
                  100% Waterproof
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`
                      relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-white
                      ${activeImageIndex === idx ? 'border-[#C5A059] shadow-sm' : 'border-[#EBE6DF] opacity-70 hover:opacity-100'}
                    `}
                  >
                    <img
                      src={img.image_url}
                      alt={`View ${idx + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Buying Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-[#9E7B32] bg-[#FBF7EE] border border-[#E8D5AA] px-2 py-0.5 rounded">
                  {product.material}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#2A7A4C] bg-[#EFF8F2] border border-[#C4E3CE] px-2 py-0.5 rounded">
                  In Stock
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#C5A059] font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  <span>{product.rating.toFixed(1)}</span>
                </span>
                <span className="text-[#71717A]">({product.review_count} verified ratings)</span>
                <a href="#reviews" className="text-[#C5A059] hover:underline font-semibold ml-2">
                  Read Reviews
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white rounded-2xl border border-[#EBE6DF] flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#18181B]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {product.discount_price && (
                <span className="text-base text-[#A1A1AA] line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#2A7A4C] font-semibold ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
              {product.description}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 bg-white rounded-xl border border-[#EBE6DF] text-xs space-y-1">
                <span className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-[#C5A059]" />
                  <span>100% Waterproof</span>
                </span>
                <p className="text-[11px] text-[#71717A]">Wear in shower, gym &amp; pool</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EBE6DF] text-xs space-y-1">
                <span className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Anti-Tarnish Coating</span>
                </span>
                <p className="text-[11px] text-[#71717A]">Guaranteed zero green skin</p>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#EBE6DF] rounded-xl bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#71717A] hover:text-[#18181B] font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#18181B]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#71717A] hover:text-[#18181B] font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-[#18181B] hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Add to Shopping Bag
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`
                    w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0
                    ${isWishlisted ? 'bg-[#18181B] text-[#C5A059] border-[#18181B]' : 'bg-white text-[#71717A] border-[#EBE6DF] hover:text-[#18181B]'}
                  `}
                  aria-label="Wishlist"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Buy Now Button (Instant Checkout) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 px-4 bg-[#C5A059] hover:bg-[#9E7B32] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now — Instant Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Customer Reviews Section ───────────────────── */}
      <section id="reviews" className="border-t border-[#EBE6DF] pt-12 mb-16 bg-white py-12">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EBE6DF]">
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
                Verified Feedback
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
                Customer Reviews ({reviewsList.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="ciraaya-btn ciraaya-btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl border border-[#EBE6DF] bg-[#FAFAF8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#A1A1AA]">{rev.date}</span>
                </div>
                <p className="text-xs text-[#18181B] leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#EBE6DF]">
                  <span className="text-[11px] font-bold text-[#18181B]">{rev.name}</span>
                  {rev.verified && (
                    <span className="text-[9px] font-bold text-[#2A7A4C] bg-[#EFF8F2] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Related Products Grid ──────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="container-main mb-12">
          <div className="mb-6">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
              You Might Also Adore
            </span>
            <h2 className="text-xl font-bold text-[#18181B]">Complete The Look</h2>
          </div>
          <div className="ciraaya-product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Write a Review Modal ──────────────────────────── */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#18181B]">Write a Review for {product.name}</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="ciraaya-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Overall Rating *</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="ciraaya-input text-xs cursor-pointer"
                >
                  <option value={5}>★★★★★ (5 Stars - Perfect)</option>
                  <option value={4}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Poor)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Terrible)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Your Feedback *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the shine, waterproof durability, and feel..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="ciraaya-input text-xs resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#18181B] hover:bg-[#C5A059] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 bg-[#FAFAF8] text-[#71717A] rounded-xl font-semibold text-xs hover:bg-[#EBE6DF] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
