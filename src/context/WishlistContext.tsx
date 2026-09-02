'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, WishlistItem } from '@/types/database';
import { useToast } from '@/components/ui/Toast';
import { useCart } from './CartContext';

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  moveToCart: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { addToast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem('ciraaya_wishlist');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveWishlist = (newItems: WishlistItem[]) => {
    setItems(newItems);
    localStorage.setItem('ciraaya_wishlist', JSON.stringify(newItems));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product_id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      const updated = items.filter((item) => item.product_id !== product.id);
      saveWishlist(updated);
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      const newItem: WishlistItem = {
        id: `wish-${Date.now()}`,
        product_id: product.id,
        product,
        created_at: new Date().toISOString(),
      };
      const updated = [newItem, ...items];
      saveWishlist(updated);
      addToast(`Saved "${product.name}" to wishlist ♡`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updated = items.filter((item) => item.product_id !== productId);
    saveWishlist(updated);
  };

  const moveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        moveToCart,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
