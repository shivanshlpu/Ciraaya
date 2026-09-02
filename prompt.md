# CIRAAYA — E-Commerce Website Development Specification

> Project: Jewellery e-commerce website for the brand **CIRAAYA**
> Prepared as a build spec / prompt for development (Frontend + Backend + Database)
> Database: **Supabase** (Postgres + Auth + Storage + Row Level Security)

---

## 1. Project Overview

Build a premium, minimal, mobile-first e-commerce website for **CIRAAYA**, a modern jewellery brand. Customers should be able to browse products, view details, filter/search, add to cart, apply coupons, checkout with online payment or COD, track orders, leave reviews, and get personalized product recommendations. The brand owner (Pooja) needs to manage products, orders, and coupons herself through an easy admin panel — no coding required after handover.

**Brand tone:** Premium, elegant, feminine, modern, subtle luxury — never flashy.

---

## 2. Brand & Design System

### 2.1 Color Palette (Minimal Ivory/Cream + Gold)
| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FAF7F2` (ivory) | Page background |
| `--color-surface` | `#FFFFFF` | Cards, modals |
| `--color-cream` | `#F3ECE1` | Section backgrounds, borders |
| `--color-gold` | `#C9A24B` | Primary accent, buttons, icons |
| `--color-gold-dark` | `#A9822F` | Hover states |
| `--color-gold-light` | `#E8D9B5` | Subtle highlights, badges |
| `--color-text` | `#2B2620` | Primary text (warm near-black, not pure black) |
| `--color-text-muted` | `#7A7166` | Secondary text |
| `--color-error` | `#B3413B` | Errors, out-of-stock |
| `--color-success` | `#5C7A5A` | Confirmations |

- No bright/saturated colors. No gradients except a very subtle gold shimmer on hover.
- Generous white space; jewellery photography is the hero — UI should recede.

### 2.2 Typography
- Headings: an elegant serif (e.g., "Playfair Display" or "Cormorant Garamond") for a luxury feel.
- Body/UI: a clean modern sans-serif (e.g., "Inter" or "Poppins", weight 300–500).
- Letter-spacing slightly increased on uppercase labels (e.g., nav links, category tags) for a premium look.

### 2.3 UI/Interaction Details
- Buttons: soft rounded corners (6–10px), gold fill with ivory text or ivory fill with gold border (outline variant).
  - Hover: gentle scale (1.02–1.03), subtle shadow lift, color transition ~200ms ease.
  - Active/pressed: slight scale down (0.98).
  - Disabled: reduced opacity, no hover effect.
- Product cards: soft shadow on hover, image zoom (scale 1.05, 300ms), quick "Add to Wishlist" heart icon fade-in on hover.
- Page transitions: fade/slide, no jarring jumps.
- Loading states: skeleton loaders (shimmer in gold-light tone), not spinners, for product grids.
- Micro-animations: subtle fade-in on scroll for sections (use IntersectionObserver), cart icon bounce on "Add to Cart".
- Toast notifications for cart/wishlist/coupon actions — minimal, top-right, auto-dismiss.

### 2.4 Responsiveness
- Mobile-first. Breakpoints: 375px, 768px, 1024px, 1440px.
- Sticky bottom nav bar on mobile (Home, Shop, Wishlist, Cart, Account).
- Hamburger menu on mobile with smooth slide-in drawer.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) + TypeScript |
| Styling | Tailwind CSS (custom design tokens per section 2.1/2.2) |
| Database & Auth | **Supabase** (Postgres, Supabase Auth, Row Level Security) |
| File/Image Storage | Supabase Storage (product images, category banners) |
| Payments | Razorpay (supports UPI, Cards, Netbanking, Wallets) + Cash on Delivery option |
| WhatsApp | `wa.me` deep links (customer-initiated chat) + Baileys (Node.js) for automated outbound order messages, with a Supabase-backed queue (see §6.4) |
| WhatsApp worker hosting | Small persistent Node.js process on Railway/Render/VPS (Baileys needs a long-lived WebSocket connection — cannot run on Vercel serverless functions) |
| Instagram | Instagram Basic Display API / embedded feed widget |
| Hosting (frontend) | Vercel |
| Hosting (backend) | Supabase (managed) |
| Email | Resend or Supabase Edge Functions + SMTP for order confirmations |
| Search | Postgres full-text search (Supabase) or Algolia if catalog grows large |

---

## 4. Supabase Database Schema

```sql
-- USERS (extends Supabase auth.users)
profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  phone text,
  default_address_id uuid,
  created_at timestamptz default now()
)

addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  label text,             -- Home, Work, etc.
  full_name text,
  phone text,
  line1 text, line2 text,
  city text, state text, pincode text,
  is_default boolean default false
)

-- CATALOG
categories (
  id uuid primary key default gen_random_uuid(),
  name text,               -- Necklaces, Earrings, Rings, Bangles...
  slug text unique,
  image_url text,
  parent_id uuid references categories(id) -- for subcategories
)

products (
  id uuid primary key default gen_random_uuid(),
  name text,
  slug text unique,
  description text,
  category_id uuid references categories(id),
  material text,           -- Gold Plated, Silver, Kundan, etc.
  price numeric,
  discount_price numeric,
  stock_qty int,
  sku text unique,
  is_featured boolean default false,
  is_active boolean default true,
  tags text[],             -- for filtering: "bridal", "daily-wear", "new-arrival"
  created_at timestamptz default now()
)

product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  image_url text,
  sort_order int
)

product_variants (          -- optional: size/color variants
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  variant_name text,        -- e.g. "Size", "Color"
  variant_value text,
  price_delta numeric default 0,
  stock_qty int
)

-- CART & WISHLIST
cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity int default 1,
  created_at timestamptz default now()
)

wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  created_at timestamptz default now()
)

-- ORDERS
orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  order_number text unique,
  status text,              -- placed, confirmed, shipped, delivered, cancelled
  payment_method text,      -- upi, card, cod
  payment_status text,      -- pending, paid, failed, refunded
  subtotal numeric,
  discount numeric default 0,
  shipping_fee numeric default 0,
  total numeric,
  coupon_code text,
  shipping_address_id uuid references addresses(id),
  created_at timestamptz default now()
)

order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  product_name_snapshot text,
  price_snapshot numeric,
  quantity int
)

-- REVIEWS
reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  user_id uuid references profiles(id),
  rating int check (rating between 1 and 5),
  comment text,
  image_url text,
  is_verified_purchase boolean default false,
  created_at timestamptz default now()
)

-- COUPONS
coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  discount_type text,       -- flat, percentage
  discount_value numeric,
  min_order_value numeric default 0,
  max_uses int,
  used_count int default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean default true
)

-- RECOMMENDATION SUPPORT
product_views (             -- tracks browsing behaviour for recommendations
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  product_id uuid references products(id),
  viewed_at timestamptz default now()
)
```

**Row Level Security (RLS):**
- `profiles`, `addresses`, `cart_items`, `wishlist_items`, `orders`, `order_items`: user can only read/write their own rows (`auth.uid() = user_id`).
- `products`, `categories`, `reviews` (read): public read access.
- `reviews` (write): only logged-in users who purchased the product (`is_verified_purchase` check).
- Admin role (via Supabase custom claim or a separate `is_admin` flag on `profiles`) has full access via a protected `/admin` dashboard route, enforced both client-side and via RLS policy.

---

## 5. Pages & Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero banner, featured collections, "Recommended for You" (see §7), bestsellers, Instagram feed, newsletter signup |
| `/shop` | Shop / All Products | Grid with filters + sort + search |
| `/category/[slug]` | Category page | Necklaces, Earrings, Rings, Bangles, etc. |
| `/product/[slug]` | Product Details | Gallery, price, variants, description, reviews, related products, WhatsApp "Ask about this product" button |
| `/cart` | Cart | Editable quantities, coupon field, order summary |
| `/checkout` | Checkout | Address, shipping, payment method selection |
| `/order-confirmation/[orderId]` | Order confirmation | Order summary + WhatsApp/email confirmation trigger |
| `/account` | My Account | Order history, saved addresses, wishlist, profile |
| `/account/orders/[id]` | Order tracking/detail | Status timeline |
| `/wishlist` | Wishlist | Saved items, move to cart |
| `/about` | About CIRAAYA | Brand story |
| `/contact` | Contact Us | Form + WhatsApp + Instagram + map (if physical store) |
| `/faq` | FAQ | Accordion UI |
| `/shipping-delivery` | Shipping & Delivery Policy | |
| `/returns-exchange` | Returns & Exchange Policy | |
| `/privacy-policy` | Privacy Policy | |
| `/terms-conditions` | Terms & Conditions | |
| `/admin/*` | Admin Dashboard (protected) | Products, orders, coupons, reviews moderation |

---

## 6. Feature Requirements

### 6.1 Product Search & Filters (must work correctly, combinable)
- **Search:** debounced live search by product name/tags (Postgres full-text search).
- **Filters (combinable via URL query params, e.g. `/shop?category=rings&material=gold&price=1000-5000`):**
  - Category / subcategory
  - Price range (slider)
  - Material (Gold Plated, Silver, Kundan, Pearl, etc.)
  - Occasion/tag (Bridal, Daily Wear, Festive, New Arrival)
  - Availability (In stock only)
  - Rating (4★ & above)
- **Sort:** Price (low–high / high–low), Newest, Popularity, Rating.
- Filters must update the product grid without a full page reload (client-side state + server query), update the URL for shareable/bookmarkable filtered views, and show an active filter count with a "Clear all" option.
- Empty state: friendly "No products match your filters" message with a reset action.

### 6.2 Cart & Checkout
- Add to cart from product card (quick-add) and product detail page (with variant selection).
- Persistent cart (tied to `user_id` if logged in; local storage merge-on-login for guests).
- Editable quantity, remove item, live subtotal calculation.
- Coupon code field with validation against `coupons` table (min order value, expiry, usage limit).
- Checkout: address selection/creation → shipping method → payment method → place order.
- Order summary recalculated server-side before payment capture (never trust client-side totals).

### 6.3 Payments
- **Razorpay integration** for UPI, Cards, Netbanking, Wallets.
- **Cash on Delivery (COD)** as an explicit option, with optional COD availability rules (e.g., disabled above a certain order value or in unserviceable pincodes).
- Payment success/failure webhook handled via a Supabase Edge Function to update `orders.payment_status` reliably (do not rely on client redirect alone).
- Order confirmation email + optional WhatsApp message triggered after successful payment/COD confirmation.

### 6.4 WhatsApp Integration

**Customer-initiated contact:**
- Floating WhatsApp chat button (site-wide) linking to `wa.me/<number>` with a pre-filled message.
- "Ask about this product" button on product detail page, pre-filled with product name/link.

**Automated outbound messaging (order updates, invoices, tracking, thank-you) — Baileys-based:**

Outbound transactional messages (order confirmation, tracking ID, invoice/bill, thank-you note, shipping/delivery updates) will be sent from the brand's own WhatsApp number using **Baileys** (unofficial WhatsApp Web multi-device library), routed through a queue rather than sent directly, so message bursts never hit WhatsApp's rate limits or trigger a block.

**Architecture:**

1. **Trigger layer** — Any event that should notify a customer (order placed, payment confirmed, order shipped, order delivered, coupon applied, etc.) writes a row into a `whatsapp_message_queue` table instead of sending a message directly. This decouples the app from the sending process completely.

2. **Queue table (Supabase):**
```sql
whatsapp_message_queue (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  phone_number text not null,
  message_type text,        -- order_confirmation, tracking_id, invoice, thank_you, shipping_update, delivered, custom
  message_body text,
  media_url text,            -- e.g. invoice PDF link, if applicable
  status text default 'pending',   -- pending, sending, sent, failed, retrying
  priority int default 5,    -- lower = higher priority (e.g. OTP/urgent = 1, thank-you = 5)
  attempts int default 0,
  max_attempts int default 3,
  last_error text,
  scheduled_at timestamptz default now(),  -- allows delayed/staggered sending
  sent_at timestamptz,
  created_at timestamptz default now()
)
```

3. **Worker/sender process** — A small always-on Node.js service (separate from the Next.js app — e.g. deployed on Railway/Render/a VPS, since Baileys needs a persistent WebSocket connection and can't run inside a serverless function):
   - Holds the authenticated Baileys session (multi-device pairing, session creds persisted to disk or Supabase Storage so it survives restarts without re-scanning the QR code every time).
   - Polls or subscribes (via Supabase Realtime) to `whatsapp_message_queue` for `status = 'pending'` rows, ordered by `priority`, then `scheduled_at`.
   - Sends **strictly throttled at ~1 message every 500ms–1s (i.e. under 2 msg/sec)**, with a small randomized jitter (e.g. 500–900ms) rather than a fixed interval — a perfectly uniform send rate is itself a bot signal, so slight randomness looks more human.
   - On success: update row to `sent`, `sent_at = now()`.
   - On failure (network error, number invalid, WhatsApp temporary block): increment `attempts`, exponential backoff, retry up to `max_attempts`, then mark `failed` and surface it in the admin dashboard for manual follow-up (fallback: SMS/email).
   - Daily/hourly volume cap as a safety valve (configurable) so even a traffic spike can't push the account into a risky sending pattern.

4. **Priority handling** — even under heavy queue load, nothing is dropped, only delayed:
   - Priority 1: OTP/critical account actions (if used).
   - Priority 2: Order confirmation + payment confirmation.
   - Priority 3: Tracking ID / shipping update.
   - Priority 4: Invoice/bill.
   - Priority 5: Thank-you / marketing-adjacent messages.
   - A burst of 100 orders in one minute simply means thank-you messages go out a few minutes later than order confirmations — every customer still gets every message, just sequenced sensibly.

5. **Admin visibility** — the admin dashboard should show queue health: pending count, failed count (with retry/resend button), and average send delay, so Pooja (or whoever manages the account) can see at a glance if messages are backing up.

**Important considerations to flag before committing to this approach:**
- Baileys is an **unofficial**, reverse-engineered client (not Meta's official WhatsApp Business API). It works well for many small businesses but carries a real, non-zero risk of the number being flagged or temporarily banned if sending patterns look automated/bulk — the queue + throttling + jitter above significantly reduces this risk but doesn't eliminate it.
- Recommend using a **dedicated WhatsApp number** for this (not the brand's primary support number), and ideally warming it up gradually with real conversations before going live with automated sends.
- Keep message content transactional and personalized (order number, customer name) rather than templated bulk-marketing style — this both looks more human and is generally what customers actually want.
- Because this is unofficial, treat WhatsApp delivery as a **best-effort channel**: order confirmation should always also happen via email (§6.9) as the reliable fallback, with WhatsApp as the preferred/faster channel on top.
- If the brand later wants guaranteed delivery, official support, and no ban risk at scale, migrating this same queue architecture to the **official WhatsApp Business API** (via a BSP like Gupshup, Interakt, or AiSensy) is a straightforward upgrade — the queue table and worker logic stay largely the same, only the sending client changes.

### 6.5 Instagram Integration
- Embedded Instagram feed section on Home/About page showing latest posts (via Instagram Basic Display API or a widget like Elfsight/SnapWidget as a low-maintenance alternative).
- Follow/share buttons on product pages.

### 6.6 Reviews
- Star rating (1–5) + written review + optional photo upload (Supabase Storage).
- "Verified Purchase" badge for reviewers who ordered that product.
- Average rating + rating distribution shown on product page and in shop grid.
- Basic moderation: admin can hide/delete inappropriate reviews.

### 6.7 Coupons/Discounts
- Admin-managed coupon codes (flat or percentage discount, min order value, expiry, usage cap).
- Applied at cart/checkout, validated server-side before payment.

### 6.8 Wishlist
- Heart icon on product card and detail page.
- Persistent per logged-in user; guest wishlist stored in local storage and merged on login.
- Dedicated `/wishlist` page with "Move to Cart" action.

### 6.9 Order Confirmation & Updates
- On order placement: confirmation page + email (and WhatsApp if enabled).
- Order status timeline: Placed → Confirmed → Shipped → Delivered (admin updates status; customer sees live status in `/account/orders/[id]`).

---

## 7. Personalization & Recommendations

**Goal:** When a returning customer opens the website, show products based on their previous orders and browsing behaviour.

**Home page "Recommended for You" section (logged-in users):**
1. Pull categories/tags/materials from the customer's `order_items` (past purchases).
2. Pull recently viewed products from `product_views`.
3. Recommend:
   - Products in the same category as past purchases (excluding already-purchased items).
   - Frequently-bought-together items (based on co-occurrence in `order_items` across all orders — simple collaborative filtering).
   - Trending/bestselling products within categories the customer has shown interest in.
4. For new/guest users, fall back to: Bestsellers + New Arrivals + Editor's Picks (curated by admin via `is_featured`).

**Product Detail Page "You May Also Like":**
- Same category products, sorted by rating/popularity, excluding out-of-stock items.

**Implementation approach:**
- v1 (simple, ships fast): SQL queries against `order_items`/`product_views` joined with `products`, ranked by recency + category match + popularity. No ML needed.
- v2 (future upgrade): move to a proper recommendation engine or Supabase Edge Function with a lightweight scoring model if catalog/traffic grows significantly.

---

## 8. Admin Dashboard (Self-Management for Pooja)

Must be simple enough for a non-technical business owner to use daily.

- **Products:** Add/edit/delete products, upload multiple images (drag-drop), set price/discount/stock, mark featured, manage variants.
- **Categories:** Add/edit categories and subcategories with banner images.
- **Orders:** View orders, update status, view/download invoice, filter by status/date.
- **Coupons:** Create/edit/deactivate coupon codes.
- **Reviews:** Approve/hide reviews.
- **Homepage content:** Manage hero banner image/text, featured collection selection — without touching code.
- **Basic analytics:** Total orders, revenue, top-selling products, low-stock alerts.

---

## 9. Non-Functional Requirements

- **Performance:** Optimized images (Next.js Image + Supabase image transforms), lazy loading, target Lighthouse score 90+ on mobile.
- **SEO:** Server-side rendering/static generation for product & category pages, meta tags, Open Graph tags, sitemap.xml, structured data (Product schema with price/availability/rating).
- **Security:** RLS on all Supabase tables, server-side price/coupon validation, HTTPS everywhere, payment handled via Razorpay (PCI compliance offloaded to gateway).
- **Accessibility:** Proper alt text on product images, sufficient color contrast despite the light palette, keyboard-navigable menus.
- **Analytics:** Google Analytics / Meta Pixel integration for marketing tracking.
- **Legal pages:** Privacy Policy, Terms & Conditions, Shipping & Delivery, Returns & Exchange — drafted with placeholders for Pooja/legal review before launch.

---

## 10. Deliverables & Handover

- Fully functional, responsive website deployed to production (Vercel + Supabase).
- Admin login credentials + a short training/walkthrough (video or live session) for managing products/orders.
- Source code repository access.
- Basic documentation: how to add products, apply coupons, process orders, update homepage banners.
- Domain connection and DNS setup guidance.
- 15–30 days of post-launch bug-fix support (define exact window separately in the commercial proposal).

---

## 11. Out of Scope (for this phase, unless specified)

- Native mobile apps (iOS/Android) — website will be mobile-web responsive only.
- Multi-currency/international shipping (assume INR/domestic shipping unless stated otherwise).
- Advanced AI-based recommendation engine (v2 upgrade, see §7).
- Live chat support beyond WhatsApp deep-linking.

---

## 12. AI Agent Context Continuity (Cross-Agent Memory Graph)

**Problem this solves:** This project is being built with AI coding assistance. If a session runs out of tokens, or if development switches from one AI agent/tool to another (e.g. Claude → GPT → a different Claude session), the new agent should NOT need to re-read the entire codebase and conversation history from scratch to become useful again. That wastes tokens and re-introduces the risk of the new agent re-deciding things that were already decided.

**Solution: a persistent, in-repo project knowledge graph** — a compact, structured, machine-readable summary of the project's state that any AI agent can load first, before touching code, to get oriented in a fraction of the tokens a full codebase read would cost.

### 12.1 What the graph contains
Nodes and edges representing:
- **Entities:** pages/routes, DB tables, API endpoints, components, features (from §6), external integrations (Razorpay, Baileys, Instagram).
- **Relationships:** `depends_on`, `implements`, `writes_to`, `reads_from`, `blocks`, `blocked_by` (e.g. `checkout page --writes_to--> orders table`, `whatsapp_worker --reads_from--> whatsapp_message_queue`).
- **Status per node:** `not_started | in_progress | done | needs_review`.
- **Key decisions & rationale**, kept to 1–2 lines each (e.g. "Chose Baileys over official API for v1 — see §6.4 tradeoffs").
- **Open issues / TODOs** with the file path they live in.

### 12.2 Storage format
Kept in the repo itself (not in chat history, which is agent-specific and disappears):
```
/docs/context-graph/
  graph.json          -- machine-readable nodes + edges (source of truth)
  SESSION_LOG.md       -- append-only, one short entry per work session:
                          date, agent used, what changed, what's next
  ARCHITECTURE.md      -- human-readable narrative summary, regenerated
                          periodically from graph.json (not hand-maintained twice)
```

`graph.json` shape:
```json
{
  "nodes": [
    { "id": "checkout_page", "type": "page", "status": "done", "path": "/app/checkout" },
    { "id": "orders_table", "type": "db_table", "status": "done", "path": "supabase/schema.sql" },
    { "id": "whatsapp_worker", "type": "service", "status": "in_progress", "path": "/services/wa-worker" }
  ],
  "edges": [
    { "from": "checkout_page", "to": "orders_table", "relation": "writes_to" },
    { "from": "whatsapp_worker", "to": "whatsapp_message_queue", "relation": "reads_from" }
  ],
  "decisions": [
    { "topic": "whatsapp_provider", "choice": "Baileys (v1)", "rationale": "Avoid official API cost/approval delay at launch; see §6.4 for migration path." }
  ],
  "open_issues": [
    { "id": "ISSUE-014", "summary": "COD not disabled for unserviceable pincodes yet", "path": "/app/checkout" }
  ]
}
```

### 12.3 Handoff protocol (every AI agent follows this)
1. **On starting work:** read `graph.json` + the last 3–5 entries of `SESSION_LOG.md` first — not the full codebase. Only open specific files the graph points to when actually working on that node.
2. **On finishing a session (or before running out of context):** update `graph.json` (status changes, new nodes/edges, new decisions/issues) and append one entry to `SESSION_LOG.md`. This is a mandatory last step, not optional cleanup.
3. This keeps every handoff to roughly "read one JSON file + a short log," regardless of how large the codebase has grown — token cost of onboarding a new agent stays roughly constant over the life of the project instead of growing with the codebase.

### 12.4 Ownership
Whoever runs the AI coding sessions (developer or Shivansh's team) is responsible for keeping `/docs/context-graph/` up to date as part of each work session — treat it as part of the deliverable, not an internal scratch file, since it's also useful documentation for Pooja's team if they ever bring in a different developer later.

---

## 13. QA, Testing & Verification Report

Before any release is considered "done," it must be verified — not just built. This is a hard requirement, not a nice-to-have.

### 13.1 What gets tested
- **Every button and interactive element** on every page (§5) — confirm it triggers the correct action (navigation, API call, state change) and that the action actually completes successfully, not just that it's clickable.
- **Every API endpoint / Supabase call** used by the frontend — confirm request reaches the backend, returns the expected shape, and errors are handled gracefully (not a blank screen or console-only error).
- **Every form** (checkout, contact, review submission, coupon field, admin product form) — valid input succeeds, invalid input shows a proper inline error, nothing silently fails.
- **Critical user flows end-to-end:** browse → filter → add to cart → apply coupon → checkout → pay (test mode) → order confirmation → order appears in account → admin sees the order → status update reflects back to customer.
- **WhatsApp queue:** simulate a burst of orders and confirm messages are throttled correctly, all eventually delivered, priority ordering respected, and failures show up in admin (per §6.4).
- **Links:** no dead links/404s across nav, footer, legal pages, product links from Home/recommendations.
- **Cross-device/browser:** mobile (iOS Safari, Android Chrome), desktop (Chrome, Safari), at minimum.
- **Auth & RLS:** confirm a logged-in user cannot access another user's cart/orders/addresses (test with two accounts), and confirm admin routes are inaccessible to non-admin users.

### 13.2 Testing approach
- **Automated E2E tests** (Playwright recommended) scripted for every critical flow above and every page's primary buttons/links — these should be runnable on demand (e.g. `npm run test:e2e`) and re-run before every deploy.
- **API/integration tests** hitting Supabase (test project, not production data) to confirm endpoints and RLS policies behave as specified.
- **Manual pass** for visual/UX quality (button hover effects, animations, spacing) since automated tests can't judge "does this feel premium."
- An automated **link checker** and **endpoint health check** run as part of this pass.

### 13.3 Deliverable: the Test Report
A single report (Markdown or a simple HTML page, e.g. `/docs/qa/test-report-<date>.md`) produced after each testing pass, structured as:

| Area | Item Tested | Result | Notes |
|---|---|---|---|
| Navigation | All header/footer links | ✅ Pass | |
| Shop filters | Category + price + material combined | ✅ Pass | |
| Cart | Add/remove/update quantity | ✅ Pass | |
| Checkout | Razorpay test payment | ✅ Pass | |
| Checkout | COD flow | ✅ Pass | |
| Coupons | Valid / expired / min-order-not-met | ✅ Pass | |
| WhatsApp | Burst of 50 simulated orders | ✅ Pass | Avg delay 4s under load |
| Admin | Product CRUD | ✅ Pass | |
| Admin | Order status update reflects to customer | ✅ Pass | |
| Auth/RLS | Cross-user data isolation | ✅ Pass | |
| Mobile | iOS Safari full flow | ⚠️ Minor | Sticky nav overlaps CTA on small screens |

- Every ❌/⚠️ row must link to an entry in `open_issues` in the context graph (§12) so it's tracked, not lost.
- This report is delivered alongside the handover materials in §10, and re-generated for any major update post-launch.

---

## 14. Notes for the Development Team

- Keep the visual language restrained at all times — this is a luxury jewellery brand, not a mass-market storefront. When in doubt, remove an element rather than add one.
- All monetary values must be validated/recalculated server-side (via Supabase Edge Functions) before any payment is captured — never trust cart totals sent from the client.
- Use optimistic UI updates for cart/wishlist actions, but reconcile with the database in the background.
- Structure the codebase so filters, recommendations, and product queries are reusable server functions — the same logic should back the Shop page, Category pages, and Home page recommendation sections.
- Treat `/docs/context-graph/` (§12) and the QA test report (§13) as living project artifacts, updated continuously — not one-time documents written at the end.