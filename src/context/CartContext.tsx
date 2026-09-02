'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Coupon } from '@/types/database';
import { useToast } from '@/components/ui/Toast';
import { useStore } from './StoreContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { addToast } = useToast();
  const { coupons } = useStore();

  useEffect(() => {
    const savedCart = localStorage.getItem('ciraaya_cart');
    if (savedCart) {
      try { setItems(JSON.parse(savedCart)); } catch {}
    }
    const savedCoupon = localStorage.getItem('ciraaya_coupon');
    if (savedCoupon) {
      try { setAppliedCoupon(JSON.parse(savedCoupon)); } catch {}
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('ciraaya_cart', JSON.stringify(newItems));
  };

  const addToCart = (product: Product, variant?: ProductVariant | null, quantity = 1) => {
    const existingIndex = items.findIndex(
      (item) => item.product_id === product.id && item.variant_id === (variant?.id || null)
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        product_id: product.id,
        variant_id: variant?.id || null,
        quantity,
        product,
        variant: variant || null,
        created_at: new Date().toISOString(),
      };
      updated = [newItem, ...items];
    }

    saveCart(updated);
    addToast(`Added "${product.name}" to your bag`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    const item = items.find((i) => i.id === cartItemId);
    const updated = items.filter((i) => i.id !== cartItemId);
    saveCart(updated);
    if (item) {
      addToast(`Removed "${item.product.name}" from bag`, 'info');
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('ciraaya_coupon');
  };

  // Subtotal calculation based on effective price (discount_price if available, plus variant delta)
  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.product.discount_price || item.product.price;
    const variantDelta = item.variant?.price_delta || 0;
    return sum + (basePrice + variantDelta) * item.quantity;
  }, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.min_order_value) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
        discount = appliedCoupon.max_discount;
      }
    } else {
      discount = appliedCoupon.discount_value;
    }
  }

  // Free shipping above ₹999, else ₹49
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.is_active);

    if (!found) {
      addToast(`Coupon "${cleanCode}" is invalid or expired.`, 'error');
      return { success: false, message: 'Invalid coupon code' };
    }

    if (subtotal < found.min_order_value) {
      const msg = `Minimum order of ₹${found.min_order_value} required for ${found.code}.`;
      addToast(msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    localStorage.setItem('ciraaya_coupon', JSON.stringify(found));
    addToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('ciraaya_coupon');
    addToast('Coupon removed.', 'info');
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
