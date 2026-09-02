'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductVariant } from '@/types/database';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { getProductBySlug, products, addReview } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const product = getProductBySlug(slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div className="container-main py-28 text-center bg-[#FAFAF8]">
        <h1 className="text-2xl font-serif-luxury font-normal mb-3 text-[#18181B]">Piece Not Found</h1>
        <p className="text-[#71717A] text-xs mb-6">The jewellery piece you are looking for is no longer available in the catalogue.</p>
        <Link href="/shop" className="ciraaya-btn ciraaya-btn-primary ciraaya-btn-sm">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: '1', product_id: product.id, image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000' }];

  const currentPrice = (product.discount_price || product.price) + (selectedVariant?.price_delta || 0);
  const isWishlisted = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      product_id: product.id,
      user_id: `user-${Date.now()}`,
      user_name: reviewerName.trim(),
      rating: ratingInput,
      comment: reviewComment.trim(),
      is_verified_purchase: true,
      is_approved: true,
    });

    addToast('Thank you! Your reflection has been shared.', 'success');
    setReviewerName('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.material === product.material))
    .slice(0, 3);

  const whatsappMessage = encodeURIComponent(
    `Hello CIRAAYA! I am interested in "${product.name}" (SKU: ${product.sku}). Could you please share more details?`
  );

  return (
    <div className="py-8 md:py-14 bg-[#FAFAF8]">
      <div className="container-main">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#71717A] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#18181B] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#18181B] transition-colors">Catalogue</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-[#18181B] transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#18181B] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white border border-[#EBE6DF] shadow-md group">
              <img
                src={images[selectedImageIndex]?.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {product.discount_price && (
                <span className="ciraaya-badge-gold absolute top-4 left-4 shadow-sm">
                  {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`
                      w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer
                      ${selectedImageIndex === idx ? 'border-[#C5A059] shadow-sm' : 'border-[#EBE6DF] opacity-60 hover:opacity-100'}
                    `}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Buying Flow */}
          <div className="lg:col-span-6 space-y-6 lg:pl-2">
            {/* Material & Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7B32] bg-[#FBF7EE] border border-[#E8D5AA] px-2.5 py-1 rounded-md">
                {product.material}
              </span>
              {product.tags?.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-wider text-[#71717A] bg-white border border-[#EBE6DF] px-2 py-0.5 rounded-md font-medium">
                  {t}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-normal text-[#18181B] leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-3">
              <div className="flex text-[#C5A059] text-sm">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-xs font-bold text-[#18181B]">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[#71717A]">({product.review_count} patron reflections)</span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 py-4 border-y border-[#EBE6DF]">
              <span className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {product.discount_price && (
                <span className="text-sm sm:text-base text-[#A1A1AA] line-through font-normal">
                  ₹{(product.price + (selectedVariant?.price_delta || 0)).toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-[#2A7A4C] font-semibold bg-[#EFF8F2] border border-[#C4E3CE] px-2 py-0.5 rounded ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#18181B] block">
                  Select Finish / Plating Option:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(isSelected ? null : v)}
                        className={`
                          px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                          ${
                            isSelected
                              ? 'bg-[#18181B] text-white border-[#18181B] shadow-xs'
                              : 'bg-white text-[#18181B] border-[#EBE6DF] hover:border-[#C5A059]'
                          }
                        `}
                      >
                        <span>{v.variant_value}</span>
                        {v.price_delta > 0 && (
                          <span className="ml-1 text-[10px] text-[#C5A059]">(+₹{v.price_delta})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
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

                <button
                  type="button"
                  onClick={() => addToCart(product, selectedVariant, quantity)}
                  className="flex-1 ciraaya-btn ciraaya-btn-primary"
                >
                  Add to Shopping Bag
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`
                    w-11 h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0
                    ${isWishlisted ? 'bg-[#18181B] text-[#C5A059] border-[#18181B]' : 'bg-white text-[#71717A] border-[#EBE6DF] hover:text-[#18181B]'}
                  `}
                  aria-label="Wishlist"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full ciraaya-btn ciraaya-btn-gold"
              >
                Buy Now — Express Checkout
              </button>

              <a
                href={`https://wa.me/919999999999?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full ciraaya-btn ciraaya-btn-outline flex items-center justify-center gap-2 text-xs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Enquire with Jewellery Stylist on WhatsApp
              </a>
            </div>

            {/* Trust Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EBE6DF] text-xs text-[#71717A]">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#EBE6DF]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C5A059] shrink-0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>100% Certified Hallmarked</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#EBE6DF]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C5A059] shrink-0">
                  <rect width="16" height="13" x="1" y="6" rx="2" />
                  <polygon points="17 9 23 13 23 19 17 19 17 9" />
                  <circle cx="6" cy="19" r="2" />
                  <circle cx="18" cy="19" r="2" />
                </svg>
                <span>Insured Doorstep Transit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Care */}
        <div className="ciraaya-card p-6 md:p-8 bg-white mb-16 space-y-6">
          <div className="flex gap-4 border-b border-[#EBE6DF] pb-3 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'details' ? 'border-[#C5A059] text-[#18181B]' : 'border-transparent text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Artisanal Details &amp; Specs
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'care' ? 'border-[#C5A059] text-[#18181B]' : 'border-transparent text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Jewellery Care Guide
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'shipping' ? 'border-[#C5A059] text-[#18181B]' : 'border-transparent text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Delivery &amp; Exchanges
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.details?.map((det, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[#EBE6DF]">
                    <span className="text-[#71717A]">{det.label}</span>
                    <span className="font-semibold text-[#18181B]">{det.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-b border-[#EBE6DF]">
                  <span className="text-[#71717A]">Base Material</span>
                  <span className="font-semibold text-[#18181B]">{product.material}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EBE6DF]">
                  <span className="text-[#71717A]">SKU Code</span>
                  <span className="font-mono font-semibold text-[#18181B]">{product.sku}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="text-xs text-[#71717A] space-y-2 leading-relaxed">
              <p>{product.care_instructions || 'Store individually in the provided velvet pouch. Keep away from water, perfumes, and chemical sprays to preserve natural shine.'}</p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="text-xs text-[#71717A] space-y-2 leading-relaxed">
              <p>• All orders are dispatched via express insured air transit (Delhivery / Bluedart).</p>
              <p>• Estimated Delivery: 3–5 business days across India.</p>
              <p>• 7-Day Doorstep Exchange policy for sizing and styling adjustments.</p>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="ciraaya-card p-6 md:p-8 bg-white mb-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE6DF] pb-4">
            <div>
              <h3 className="font-serif-luxury text-xl font-normal text-[#18181B]">Patron Reflections</h3>
              <p className="text-xs text-[#71717A] mt-0.5">Verified purchaser reviews &amp; ratings</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="ciraaya-btn ciraaya-btn-outline ciraaya-btn-sm"
            >
              {showReviewForm ? 'Cancel' : '✍ Write a Reflection'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="p-5 bg-[#FAFAF8] rounded-xl border border-[#EBE6DF] space-y-4 text-xs animate-in fade-in">
              <h4 className="font-bold text-xs text-[#18181B] uppercase tracking-wider">Share Your Reflection</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Deshmukh"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="ciraaya-input text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Rating *</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="ciraaya-input text-xs cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5/5 — Royal Perfection)</option>
                    <option value={4}>★★★★☆ (4/5 — Very Good)</option>
                    <option value={3}>★★★☆☆ (3/5 — Average)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Your Review *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details regarding craftsmanship, weight, and styling..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="ciraaya-input text-xs resize-none"
                />
              </div>
              <Button type="submit" size="sm">
                Submit Reflection
              </Button>
            </form>
          )}

          {/* Sample Reviews */}
          <div className="divide-y divide-[#EBE6DF]">
            {[
              {
                name: 'Ananya Deshmukh',
                date: '2 weeks ago',
                rating: 5,
                comment: 'The finish and uncut stones look indistinguishable from real heirloom gold. Beautiful velvet case presentation!',
              },
              {
                name: 'Dr. Rhea Kapoor',
                date: '1 month ago',
                rating: 5,
                comment: 'Comfortable to wear all evening without heavy strain. Extremely pleased with CIRAAYA quality.',
              },
            ].map((rev, i) => (
              <div key={i} className="py-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#18181B]">{rev.name}</span>
                  <span className="text-[#A1A1AA] text-[10px]">{rev.date}</span>
                </div>
                <div className="text-[#C5A059] text-xs">{'★'.repeat(rev.rating)}</div>
                <p className="text-[#71717A] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif-luxury text-2xl font-normal text-[#18181B] mb-6">
              Complementary <span className="italic text-[#C5A059]">Creations</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
