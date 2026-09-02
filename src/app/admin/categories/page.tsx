'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { compressImageFile, handleImageError } from '@/lib/image-compressor';
import { Category } from '@/types/database';
import { Upload } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCategoryId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800');
    setCompressionStatus(null);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800');
    setCompressionStatus(null);
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setCompressionStatus('Compressing image...');

    try {
      const result = await compressImageFile(file, 800, 800, 0.82);
      setImageUrl(result.dataUrl);
      setCompressionStatus(`✓ Compressed to ${Math.round(result.compressedSizeBytes / 1024)}KB`);
      addToast('Category image uploaded and compressed!', 'success');
    } catch {
      addToast('Failed to compress image.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const computedSlug = (slug.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: name.trim(),
        slug: computedSlug,
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      });
      addToast(`Category "${name}" updated and reflected across website!`, 'success');
    } else {
      addCategory({
        name: name.trim(),
        slug: computedSlug,
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        sort_order: categories.length + 1,
      });
      addToast(`Category "${name}" created and reflected across website!`, 'success');
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Taxonomy &amp; Galleries
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            Categories ({categories.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Changes made here immediately update in the store navigation, homepage, and shop filters.
          </p>
        </div>

        <Button onClick={handleOpenAdd} size="sm">
          + Add Category
        </Button>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="ciraaya-card overflow-hidden bg-white flex flex-col justify-between border border-[#EBE6DF] hover:border-[#C5A059] transition-all"
          >
            <div className="h-44 bg-[#FAFAF8] overflow-hidden relative">
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              )}
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-[#EBE6DF]">
                /{cat.slug}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-[#18181B] text-sm">{cat.name}</h3>
                <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                  {cat.description || 'No description added.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[#EBE6DF] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="text-xs text-[#C5A059] font-semibold hover:underline cursor-pointer"
                >
                  Edit Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"? It will be removed from navigation and shop.`)) {
                      deleteCategory(cat.id);
                      addToast(`Category "${cat.name}" deleted.`, 'info');
                    }
                  }}
                  className="text-xs text-[#C53030] font-medium hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <div className="flex justify-between items-center border-b border-[#EBE6DF] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#18181B]">
                {editingCategoryId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mangalsutras"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategoryId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  className="ciraaya-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. mangalsutras"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="ciraaya-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe pieces in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="ciraaya-input text-xs resize-none"
                />
              </div>

              {/* Photo Upload or URL */}
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#EBE6DF] space-y-2">
                <label className="font-semibold text-[#18181B] block">Category Image</label>
                <label className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-[#C5A059] bg-white rounded-xl text-xs font-semibold text-[#9E7B32] hover:bg-[#FBF7EE] transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isCompressing ? 'Compressing...' : 'Upload Image from Phone / PC'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isCompressing}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (Unsplash / CDN)..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="ciraaya-input text-xs"
                  />
                </div>

                {compressionStatus && (
                  <p className="text-[11px] text-[#2A7A4C] font-semibold">{compressionStatus}</p>
                )}

                {imageUrl && (
                  <div className="relative h-24 rounded-lg overflow-hidden border border-[#EBE6DF]">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="submit" fullWidth size="sm">
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </Button>
                <Button type="button" variant="ghost" fullWidth size="sm" onClick={() => setShowModal(false)}>
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
