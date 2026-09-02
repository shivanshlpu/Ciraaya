export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface ProductDetailItem {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string; // e.g. "Ring Size", "Plating"
  variant_value: string; // e.g. "Size 14", "Rose Gold"
  price_delta: number;
  stock_qty: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details?: ProductDetailItem[];
  care_instructions?: string | null;
  category_id?: string | null;
  category?: Category | null;
  material: string; // 'Gold Plated' | 'Silver 925' | 'Kundan' | 'Pearl' | 'Rose Gold'
  price: number;
  discount_price?: number | null;
  stock_qty: number;
  sku: string;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  rating: number;
  review_count: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email?: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  default_address_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  product: Product;
  variant?: ProductVariant | null;
  created_at?: string;
}

export interface WishlistItem {
  id: string;
  user_id?: string;
  product_id: string;
  product: Product;
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'flat' | 'percentage';
  discount_value: number;
  min_order_value: number;
  max_discount?: number | null;
  max_uses?: number | null;
  used_count: number;
  valid_from?: string;
  valid_until?: string | null;
  is_active: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  product_name_snapshot: string;
  product_image_snapshot?: string | null;
  variant_snapshot?: string | null;
  price_snapshot: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  status: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_gateway_order_id?: string | null;
  payment_gateway_payment_id?: string | null;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  coupon_code?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  notes?: string | null;
  tracking_id?: string | null;
  tracking_url?: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string | null;
  user_name: string;
  rating: number;
  title?: string | null;
  comment: string;
  image_url?: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface WhatsAppQueueItem {
  id: string;
  order_id?: string | null;
  phone_number: string;
  message_type: 'order_confirmation' | 'tracking_id' | 'invoice' | 'thank_you' | 'shipping_update' | 'delivered' | 'custom';
  message_body: string;
  media_url?: string | null;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'retrying';
  priority: number;
  attempts: number;
  max_attempts: number;
  last_error?: string | null;
  scheduled_at: string;
  sent_at?: string | null;
  created_at: string;
}
