'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory } = useStore();
  const { addToast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addCategory({
      name: name.trim(),
      slug,
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      sort_order: categories.length + 1,
    });

    addToast(`Category "${name}" created!`, 'success');
    setShowAdd(false);
    setName('');
    setDescription('');
    setImageUrl('');
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
            Organize fine jewellery collections, galleries, and navigation taxonomies.
          </p>
        </div>

        <Button onClick={() => setShowAdd(true)} size="sm">
          + Add Category
        </Button>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="ciraaya-card overflow-hidden bg-white flex flex-col justify-between"
          >
            <div className="h-44 bg-[#FAFAF8] overflow-hidden relative">
              {cat.image_url && (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
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
              <div className="pt-3 border-t border-[#EBE6DF] flex justify-end">
                <button
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"?`)) {
                      deleteCategory(cat.id);
                      addToast('Category deleted.', 'info');
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

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="text-base font-bold text-[#18181B] mb-4">Add Category</h3>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mangalsutras"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ciraaya-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description for SEO and category banner..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="ciraaya-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#18181B] block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="ciraaya-input text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" fullWidth size="sm">
                  Create Category
                </Button>
                <Button type="button" variant="ghost" fullWidth size="sm" onClick={() => setShowAdd(false)}>
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
