-- ==============================================================================
-- CIRAAYA DATABASE SCHEMA
-- Supabase Postgres Schema for Luxury Jewellery E-Commerce
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & PROFILES
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  is_admin boolean default false,
  default_address_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  label text default 'Home', -- 'Home', 'Work', 'Other'
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 2. CATALOG: CATEGORIES, PRODUCTS, IMAGES, VARIANTS
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  details jsonb default '[]'::jsonb, -- e.g. [{"label": "Base Metal", "value": "Brass"}, ...]
  care_instructions text,
  category_id uuid references public.categories(id) on delete set null,
  material text not null, -- 'Gold Plated', 'Silver 925', 'Kundan', 'Pearl', 'Rose Gold'
  price numeric(10,2) not null check (price >= 0),
  discount_price numeric(10,2) check (discount_price is null or discount_price < price),
  stock_qty int not null default 10 check (stock_qty >= 0),
  sku text unique not null,
  is_featured boolean default false,
  is_active boolean default true,
  tags text[] default '{}', -- ['bridal', 'daily-wear', 'new-arrival', 'bestseller']
  rating numeric(3,2) default 5.0,
  review_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  variant_name text not null, -- e.g. 'Size', 'Plating Color'
  variant_value text not null, -- e.g. 'Free Size', '16-inch', 'Gold', 'Silver'
  price_delta numeric(10,2) default 0,
  stock_qty int default 10,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 3. CART & WISHLIST
-- ------------------------------------------------------------------------------
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity int default 1 check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id, variant_id)
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ------------------------------------------------------------------------------
-- 4. COUPONS
-- ------------------------------------------------------------------------------
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('flat', 'percentage')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  min_order_value numeric(10,2) default 0,
  max_discount numeric(10,2),
  max_uses int,
  used_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  order_number text unique not null,
  status text not null default 'placed' check (status in ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('upi', 'card', 'netbanking', 'wallet', 'cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_gateway_order_id text,
  payment_gateway_payment_id text,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  shipping_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  coupon_code text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null, -- snapshot of delivery address
  notes text,
  tracking_id text,
  tracking_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name_snapshot text not null,
  product_image_snapshot text,
  variant_snapshot text,
  price_snapshot numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 6. REVIEWS
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  user_name text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  comment text not null,
  image_url text,
  is_verified_purchase boolean default false,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 7. PRODUCT VIEWS (FOR RECOMMENDATION ENGINE)
-- ------------------------------------------------------------------------------
create table if not exists public.product_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text,
  product_id uuid references public.products(id) on delete cascade,
  viewed_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 8. WHATSAPP MESSAGE QUEUE (§6.4)
-- ------------------------------------------------------------------------------
create table if not exists public.whatsapp_message_queue (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  phone_number text not null,
  message_type text not null, -- order_confirmation, tracking_id, invoice, thank_you, shipping_update, delivered, custom
  message_body text not null,
  media_url text,
  status text default 'pending' check (status in ('pending', 'sending', 'sent', 'failed', 'retrying')),
  priority int default 5, -- lower number = higher priority
  attempts int default 0,
  max_attempts int default 3,
  last_error text,
  scheduled_at timestamptz default now(),
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 9. TRIGGERS FOR PROFILE AUTO-CREATION ON SUPABASE AUTH SIGNUP
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
