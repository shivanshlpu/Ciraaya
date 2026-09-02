'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/types/database';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const { addToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '',
    category_id: categories[0]?.id || '',
    material: 'Gold Plated',
    price: 1999,
    discount_price: 1499,
    stock_qty: 15,
    sku: `CIR-${Date.now().toString().slice(-4)}`,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    tags: 'new-arrival, daily-wear',
    is_featured: true,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addProduct({
      name: form.name.trim(),
      slug,
      description: form.description || 'Exquisite handcrafted fine jewellery designed with passion.',
      category_id: form.category_id,
      material: form.material,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock_qty: Number(form.stock_qty),
      sku: form.sku.trim(),
      is_featured: form.is_featured,
      is_active: true,
      tags: form.tags.split(',').map((t) => t.trim().toLowerCase()),
      rating: 5.0,
      review_count: 1,
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: '',
          image_url: form.imageUrl.trim(),
          sort_order: 0,
        },
      ],
    });

    addToast(`Product "${form.name}" added to catalogue!`, 'success');
    setShowAddModal(false);
    setForm({
      name: '',
      category_id: categories[0]?.id || '',
      material: 'Gold Plated',
      price: 1999,
      discount_price: 1499,
      stock_qty: 15,
      sku: `CIR-${Date.now().toString().slice(-4)}`,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      tags: 'new-arrival, daily-wear',
      is_featured: true,
    });
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Catalogue Management
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Jewellery Pieces ({products.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Manage product listings, pricing, inventory stock, and featured collections.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} size="sm">
          + Add New Piece
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="search"
          placeholder="Search by name, SKU or material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ciraaya-input max-w-sm text-xs"
        />
        <div className="text-xs text-[#71717A] flex items-center gap-2">
          <span>Showing <strong>{filtered.length}</strong> of {products.length} products</span>
        </div>
      </div>

      {/* Table */}
      <div className="ciraaya-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#71717A] border-b border-[#EBE6DF]">
              <tr>
                <th className="p-4 font-semibold">Jewellery Piece</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Material</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock Qty</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]/70">
              {filtered.map((product) => {
                const image = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200';

                return (
                  <tr key={product.id} className="hover:bg-[#FAFAF8]/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-[#EBE6DF] bg-[#FAFAF8] shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-[#18181B] text-xs">{product.name}</p>
                          <span className="text-[10px] text-[#71717A] font-mono">/{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium text-[#18181B]">{product.sku}</td>
                    <td className="p-4 font-medium text-[#71717A]">{product.material}</td>
                    <td className="p-4 font-semibold text-[#18181B]">
                      ₹{(product.discount_price || product.price).toLocaleString('en-IN')}
                      {product.discount_price && (
                        <span className="text-[10px] text-[#71717A] line-through ml-1.5 font-normal">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        min="0"
                        value={product.stock_qty}
                        onChange={(e) => updateProduct(product.id, { stock_qty: Number(e.target.value) })}
                        className="w-16 bg-[#FAFAF8] border border-[#EBE6DF] rounded-lg px-2 py-1 text-center font-bold text-xs"
                      />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => updateProduct(product.id, { is_featured: !product.is_featured })}
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md cursor-pointer border transition-all ${
                          product.is_featured
                            ? 'bg-[#FBF7EE] text-[#9E7B32] border-[#E8D5AA]'
                            : 'bg-[#FAFAF8] text-[#71717A] border-[#EBE6DF]'
                        }`}
                      >
                        {product.is_featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            deleteProduct(product.id);
                            addToast('Product deleted.', 'info');
                          }
                        }}
                        className="text-xs text-[#C53030] font-medium hover:underline cursor-pointer"
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#18181B]">Add New Jewellery Piece</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#71717A] hover:text-[#18181B]"
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
                  placeholder="e.g. Royal Kundan Pearl Choker"
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
                    <option value="Gold Plated">Gold Plated</option>
                    <option value="1-Gram Gold">1-Gram Gold</option>
                    <option value="Kundan">Kundan</option>
                    <option value="Pearl">Pearl</option>
                    <option value="Rose Gold">Rose Gold</option>
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

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Image URL (High-res photo) *</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="ciraaya-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="bridal, festive, bestseller, daily-wear"
                  className="ciraaya-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the craftsmanship, style, and occasions..."
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
