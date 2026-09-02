'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Coupon, Order, Review } from '@/types/database';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '@/lib/data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  reviews: Review[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'used_count'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'order_number'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingId?: string) => void;
  addReview: (review: Omit<Review, 'id' | 'created_at'>) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load and persist in localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('ciraaya_products');
    if (savedProducts) {
      try { setProducts(JSON.parse(savedProducts)); } catch {}
    }

    const savedCategories = localStorage.getItem('ciraaya_categories');
    if (savedCategories) {
      try { setCategories(JSON.parse(savedCategories)); } catch {}
    }

    const savedCoupons = localStorage.getItem('ciraaya_coupons');
    if (savedCoupons) {
      try { setCoupons(JSON.parse(savedCoupons)); } catch {}
    }

    const savedOrders = localStorage.getItem('ciraaya_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch {}
    } else {
      // Seed a sample order for tracking showcase
      const sampleOrder: Order = {
        id: 'ord-sample-001',
        order_number: 'CIR-2026-8891',
        status: 'confirmed',
        payment_method: 'upi',
        payment_status: 'paid',
        subtotal: 3499,
        discount: 350,
        shipping_fee: 0,
        total: 3149,
        coupon_code: 'WELCOME10',
        customer_name: 'Pooja Sharma',
        customer_email: 'pooja@example.com',
        customer_phone: '+91 98765 43210',
        shipping_address: {
          full_name: 'Pooja Sharma',
          phone: '+91 98765 43210',
          line1: 'B-402, Royal Palms Residency',
          line2: 'Near Rose Garden, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
        },
        items: [
          {
            id: 'item-1',
            order_id: 'ord-sample-001',
            product_id: INITIAL_PRODUCTS[0].id,
            product_name_snapshot: INITIAL_PRODUCTS[0].name,
            product_image_snapshot: INITIAL_PRODUCTS[0].images?.[0]?.image_url,
            variant_snapshot: 'Yellow Gold 18K',
            price_snapshot: 3499,
            quantity: 1,
          },
        ],
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      };
      setOrders([sampleOrder]);
      localStorage.setItem('ciraaya_orders', JSON.stringify([sampleOrder]));
    }
  }, []);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('ciraaya_products', JSON.stringify(updated));
  };

  const addProduct = (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const addCategory = (category: Omit<Category, 'id' | 'created_at'>) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('ciraaya_categories', JSON.stringify(updated));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCategories(updated);
    localStorage.setItem('ciraaya_categories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('ciraaya_categories', JSON.stringify(updated));
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'used_count'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      used_count: 0,
    };
    const updated = [...coupons, newCoupon];
    setCoupons(updated);
    localStorage.setItem('ciraaya_coupons', JSON.stringify(updated));
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCoupons(updated);
    localStorage.setItem('ciraaya_coupons', JSON.stringify(updated));
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    setCoupons(updated);
    localStorage.setItem('ciraaya_coupons', JSON.stringify(updated));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'created_at' | 'order_number'>): Order => {
    const orderNumber = `CIR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('ciraaya_orders', JSON.stringify(updated));

    // Also decrement stock quantity for purchased products
    if (orderData.items) {
      const updatedProducts = products.map((prod) => {
        const item = orderData.items?.find((i) => i.product_id === prod.id);
        if (item) {
          return { ...prod, stock_qty: Math.max(0, prod.stock_qty - item.quantity) };
        }
        return prod;
      });
      saveProducts(updatedProducts);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingId?: string) => {
    const updated = orders.map((o) =>
      o.id === orderId || o.order_number === orderId
        ? {
            ...o,
            status,
            tracking_id: trackingId || o.tracking_id,
            tracking_url: trackingId ? `https://shiprocket.co/tracking/${trackingId}` : o.tracking_url,
            updated_at: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    localStorage.setItem('ciraaya_orders', JSON.stringify(updated));
  };

  const addReview = (review: Omit<Review, 'id' | 'created_at'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find((c) => c.slug === slug);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        coupons,
        orders,
        reviews,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        createOrder,
        updateOrderStatus,
        addReview,
        getProductBySlug,
        getCategoryBySlug,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
