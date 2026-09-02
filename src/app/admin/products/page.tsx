'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { compressImageFile, handleImageError, DEFAULT_FALLBACK_IMAGE } from '@/lib/image-compressor';

export default function AdminProductsPage() {
  const { products, categories, addProduct, deleteProduct, updateProduct } = useStore();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

  // Add Product Form State with Multi-Image Support
  const [form, setForm] = useState({
    name: '',
    material: 'Gold Plated',
    category_id: categories[0]?.id || '',
    price: 1999,
    discount_price: 1499,
    stock_qty: 20,
    tags: 'waterproof, daily-wear',
    description: '',
    imageUrls: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    ],
    newUrlInput: '',
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setCompressionStatus('Compressing images to lightweight WebP...');

    try {
      const newCompressedUrls: string[] = [];
      let totalOriginal = 0;
      let totalCompressed = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalOriginal += file.size;

        const result = await compressImageFile(file, 1200, 1200, 0.82);
        totalCompressed += result.compressedSizeBytes;
        newCompressedUrls.push(result.dataUrl);
      }

      const savedPercent = Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100);
      const originalMb = (totalOriginal / (1024 * 1024)).toFixed(1);
      const compressedKb = Math.round(totalCompressed / 1024);

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...newCompressedUrls],
      }));

      setCompressionStatus(`✓ Compressed: ${originalMb}MB ➔ ${compressedKb}KB (${savedPercent}% saved!)`);
      addToast(`Added ${files.length} compressed image(s) successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to compress images. Try a different format.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAddUrl = () => {
    if (form.newUrlInput.trim()) {
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, prev.newUrlInput.trim()],
        newUrlInput: '',
      }));
      addToast('Image URL added to gallery.', 'info');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      addToast('Please enter a product title.', 'error');
      return;
    }

    if (form.imageUrls.length === 0) {
      addToast('Please add at least 1 product image.', 'error');
      return;
    }

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tagList = form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);

    const newProduct = {
      name: form.name.trim(),
      slug,
      description: form.description || 'Waterproof, anti-tarnish, and skin-safe everyday jewellery handcrafted for effortless luxury.',
      category_id: form.category_id,
      category: categories.find((c) => c.id === form.category_id) || null,
      material: form.material,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock_qty: Number(form.stock_qty),
      sku: `CIR-${Math.floor(1000 + Math.random() * 9000)}`,
      is_featured: true,
      is_active: true,
      tags: tagList,
      rating: 5.0,
      review_count: 1,
      images: form.imageUrls.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        product_id: '',
        image_url: url,
        sort_order: idx,
      })),
      details: [
        { label: 'Feature', value: '100% Waterproof & Anti-Tarnish' },
        { label: 'Skin-Safe', value: '100% Hypoallergenic (Nickel Free)' },
      ],
    };

    await addProduct(newProduct);
    addToast(`"${form.name}" has been created & published!`, 'success');
    setShowAddModal(false);
    setForm({
      name: '',
      material: 'Gold Plated',
      category_id: categories[0]?.id || '',
      price: 1999,
      discount_price: 1499,
      stock_qty: 20,
      tags: 'waterproof, daily-wear',
      description: '',
      imageUrls: [DEFAULT_FALLBACK_IMAGE],
      newUrlInput: '',
    });
    setCompressionStatus(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Store Management
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Products &amp; Inventory ({products.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Manage catalogue, upload optimized photos, and adjust pricing.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} size="sm">
          + Add New Piece
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="ciraaya-card p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Search by title or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ciraaya-input text-xs w-full sm:w-72"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="ciraaya-input text-xs w-full sm:w-56 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="ciraaya-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EBE6DF] bg-[#FAFAF8] text-[#71717A] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Piece</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]">
              {filteredProducts.map((p) => {
                const img = p.images?.[0]?.image_url || DEFAULT_FALLBACK_IMAGE;
                return (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={p.name}
                          onError={handleImageError}
                          className="w-10 h-10 rounded-lg object-cover border border-[#EBE6DF] bg-[#FAFAF8]"
                        />
                        <div>
                          <p className="font-semibold text-[#18181B] line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-[#71717A] font-mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#71717A]">
                      {p.category?.name || 'Jewellery'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#18181B]">
                      ₹{(p.discount_price || p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {p.stock_qty} in stock
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(p.id, { is_active: !p.is_active })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          p.is_active ? 'bg-[#EFF8F2] text-[#2A7A4C]' : 'bg-[#FAFAF8] text-[#71717A]'
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-xs text-[#C53030] hover:underline font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal with Multi-Image & Compressor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#18181B]">Add New Jewellery Piece</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterproof Snake Layer Chain"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="ciraaya-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Material *</label>
                  <select
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="ciraaya-input text-xs cursor-pointer"
                  >
                    <option value="Waterproof">Waterproof</option>
                    <option value="Gold Plated">Gold Plated</option>
                    <option value="1-Gram Gold">1-Gram Gold</option>
                    <option value="Pearl">Pearl</option>
                    <option value="Kundan">Kundan</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="ciraaya-input text-xs cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="ciraaya-input text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={form.discount_price}
                    onChange={(e) => setForm({ ...form, discount_price: Number(e.target.value) })}
                    className="ciraaya-input text-xs font-bold text-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={form.stock_qty}
                    onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
                    className="ciraaya-input text-xs"
                  />
                </div>
              </div>

              {/* ─── Multi-Image Uploader & Compressor ───────── */}
              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#EBE6DF] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#18181B] text-xs">
                    Product Images ({form.imageUrls.length})
                  </label>
                  <span className="text-[10px] text-[#2A7A4C] font-semibold bg-[#EFF8F2] px-2 py-0.5 rounded">
                    ⚡ Auto WebP Compressed
                  </span>
                </div>

                {/* Direct File Upload with Canvas Compression */}
                <div>
                  <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-[#C5A059] bg-white rounded-xl text-xs font-semibold text-[#9E7B32] hover:bg-[#FBF7EE] transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <span>{isCompressing ? 'Compressing...' : 'Upload Photos from Phone / PC'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isCompressing}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Image URL Entry */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.newUrlInput}
                    onChange={(e) => setForm({ ...form, newUrlInput: e.target.value })}
                    placeholder="Or paste external image URL (Unsplash/CDN)..."
                    className="ciraaya-input text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-3 py-1.5 bg-[#18181B] text-white rounded-lg text-xs font-semibold hover:bg-[#C5A059] transition-colors cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>

                {compressionStatus && (
                  <p className="text-[11px] text-[#2A7A4C] font-semibold">{compressionStatus}</p>
                )}

                {/* Image Thumbnails Rail */}
                {form.imageUrls.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                    {form.imageUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#EBE6DF] group bg-white">
                        <img
                          src={url}
                          alt={`Product thumbnail ${idx + 1}`}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#18181B] text-white text-[8px] font-bold px-1 rounded">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="waterproof, daily-wear, bestseller"
                  className="ciraaya-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Briefly describe the product style..."
                  className="ciraaya-input text-xs resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="submit" fullWidth size="sm">
                  Save &amp; Publish Piece
                </Button>
                <Button type="button" variant="ghost" fullWidth size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
