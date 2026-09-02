-- ==============================================================================
-- CIRAAYA ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.product_views enable row level security;
alter table public.whatsapp_message_queue enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------------------------
-- PROFILES: Users read/write their own, Admins read all
-- ------------------------------------------------------------------------------
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- ------------------------------------------------------------------------------
-- ADDRESSES: Users CRUD own addresses, Admins view all
-- ------------------------------------------------------------------------------
create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- CATALOG (Categories, Products, Images, Variants): Public Read, Admin Write
-- ------------------------------------------------------------------------------
create policy "Public can view active categories"
  on public.categories for select
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin());

create policy "Public can view active products"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin());

create policy "Public can view product images"
  on public.product_images for select
  using (true);

create policy "Admins can manage product images"
  on public.product_images for all
  using (public.is_admin());

create policy "Public can view product variants"
  on public.product_variants for select
  using (true);

create policy "Admins can manage product variants"
  on public.product_variants for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- CART ITEMS: User own items
-- ------------------------------------------------------------------------------
create policy "Users can view own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert into own cart"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- WISHLIST: User own items
-- ------------------------------------------------------------------------------
create policy "Users can view own wishlist"
  on public.wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can add to wishlist"
  on public.wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from wishlist"
  on public.wishlist_items for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- COUPONS: Public view active, Admins manage
-- ------------------------------------------------------------------------------
create policy "Public can check active coupons"
  on public.coupons for select
  using (is_active = true or public.is_admin());

create policy "Admins can manage coupons"
  on public.coupons for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- ORDERS & ORDER ITEMS: Users view own, Admins manage all
-- ------------------------------------------------------------------------------
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Authenticated or guests can create orders"
  on public.orders for insert
  with check (true);

create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Users or system can insert order items"
  on public.order_items for insert
  with check (true);

-- ------------------------------------------------------------------------------
-- REVIEWS: Public view approved, Authenticated insert, Admin moderate
-- ------------------------------------------------------------------------------
create policy "Public can view approved reviews"
  on public.reviews for select
  using (is_approved = true or public.is_admin());

create policy "Authenticated users can submit reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Admins can moderate reviews"
  on public.reviews for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- PRODUCT VIEWS & WHATSAPP QUEUE
-- ------------------------------------------------------------------------------
create policy "Users can insert product views"
  on public.product_views for insert
  with check (true);

create policy "Admins can view product analytics"
  on public.product_views for select
  using (public.is_admin());

create policy "Admins can manage whatsapp queue"
  on public.whatsapp_message_queue for all
  using (public.is_admin());
