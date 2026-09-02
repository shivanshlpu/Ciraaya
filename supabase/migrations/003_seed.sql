-- ==============================================================================
-- CIRAAYA SEED DATA
-- Curated high-aesthetic jewellery collections & coupons
-- ==============================================================================

-- 1. Insert Categories
insert into public.categories (id, name, slug, description, image_url, sort_order) values
('10000000-0000-0000-0000-000000000001', 'Necklaces', 'necklaces', 'Timeless chokers, layered chains, and royal statement pieces.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', 1),
('10000000-0000-0000-0000-000000000002', 'Earrings', 'earrings', 'From delicate studs to dramatic jhumkas and chandeliers.', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800', 2),
('10000000-0000-0000-0000-000000000003', 'Rings', 'rings', 'Elegantly sculpted solitaire, floral, and cocktail rings.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', 3),
('10000000-0000-0000-0000-000000000004', 'Bangles & Bracelets', 'bangles', 'Intricately handcrafted kadas, cuffs, and everyday bangles.', 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7e?auto=format&fit=crop&q=80&w=800', 4),
('10000000-0000-0000-0000-000000000005', 'Bridal Heritage', 'bridal', 'Magnificent royal bridal sets crafted for unforgettable celebrations.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', 5)
on conflict (slug) do nothing;

-- 2. Insert Products
insert into public.products (
  id, name, slug, description, care_instructions, details, category_id,
  material, price, discount_price, stock_qty, sku, is_featured, is_active, tags, rating, review_count
) values
(
  '20000000-0000-0000-0000-000000000001',
  'Celestial Aurora Kundan Choker Set',
  'celestial-aurora-kundan-choker-set',
  'A grand choker handcrafted with 18k gold micron plating, lustrous uncut Kundan stones, and freshwater pearl drops. Designed to make a regal statement for weddings and festive soirées.',
  'Keep away from perfumes, hairsprays, and moisture. Store individually in the provided velvet pouch.',
  '[{"label": "Base Metal", "value": "Premium Brass"}, {"label": "Plating", "value": "18K Gold Micron"}, {"label": "Stones", "value": "Hydro Polki & Kundan"}, {"label": "Closure", "value": "Adjustable Dori (Thread)"}]'::jsonb,
  '10000000-0000-0000-0000-000000000001',
  'Kundan',
  4499.00,
  3499.00,
  12,
  'CIR-NK-001',
  true,
  true,
  array['bridal', 'bestseller', 'festive'],
  4.9,
  38
),
(
  '20000000-0000-0000-0000-000000000002',
  'Noor Emerald Solitaire Pearl Necklace',
  'noor-emerald-solitaire-pearl-necklace',
  'A graceful masterpiece featuring emerald hydro crystals suspended in a floral gold halo, framed by baroque pearl accents. Subtle luxury designed for both modern gowns and traditional lehengas.',
  'Wipe with a soft cotton cloth after every wear. Avoid chemical cleaners.',
  '[{"label": "Base Metal", "value": "Sterling Silver Base"}, {"label": "Plating", "value": "22K Yellow Gold Vermeil"}, {"label": "Gems", "value": "Emerald Green Hydro Stones"}]'::jsonb,
  '10000000-0000-0000-0000-000000000001',
  'Gold Plated',
  2899.00,
  2199.00,
  15,
  'CIR-NK-002',
  true,
  true,
  array['new-arrival', 'daily-wear'],
  4.8,
  24
),
(
  '20000000-0000-0000-0000-000000000003',
  'Zeenat Chandbali Royal Earrings',
  'zeenat-chandbali-royal-earrings',
  'Inspired by Mughal architecture, these crescent Chandbali earrings feature delicate meenakari detailing, seed pearls, and hand-cut zirconia accents that shimmer gracefully with every movement.',
  'Store in a cool, dry place. Avoid direct sunlight and contact with water.',
  '[{"label": "Weight", "value": "28g (Pair)"}, {"label": "Length", "value": "3.2 inches"}, {"label": "Closure", "value": "Push Back with Security Lock"}]'::jsonb,
  '10000000-0000-0000-0000-000000000002',
  'Kundan',
  2499.00,
  1899.00,
  20,
  'CIR-ER-001',
  true,
  true,
  array['festive', 'bestseller'],
  5.0,
  45
),
(
  '20000000-0000-0000-0000-000000000004',
  'Miraia Solitaire Teardrop Studs',
  'miraia-solitaire-teardrop-studs',
  'Minimalist brilliance for the contemporary woman. Features AAA Grade cubic zirconia in a bezel-set teardrop gold silhouette. Perfect for office elegance and daily sophistication.',
  'Gentle wipe with microfiber cloth. Keep in an airtight container.',
  '[{"label": "Base Metal", "value": "925 Sterling Silver"}, {"label": "Plating", "value": "18K Gold Plated"}, {"label": "Hypoallergenic", "value": "Yes (Nickel & Lead Free)"}]'::jsonb,
  '10000000-0000-0000-0000-000000000002',
  'Silver 925',
  1499.00,
  1199.00,
  35,
  'CIR-ER-002',
  false,
  true,
  array['daily-wear', 'new-arrival'],
  4.7,
  19
),
(
  '20000000-0000-0000-0000-000000000005',
  'Rani Sahiba Statement Polki Ring',
  'rani-sahiba-statement-polki-ring',
  'An imperial cocktail ring featuring open-polki setting surrounded by micro-pearl cluster edging. Features an adjustable band tailored to fit comfortably on any finger.',
  'Handle with care. Avoid harsh friction with hard surfaces.',
  '[{"label": "Size", "value": "Adjustable (Fits sizes 10-18)"}, {"label": "Plating", "value": "Antique Matte Gold"}]'::jsonb,
  '10000000-0000-0000-0000-000000000003',
  'Kundan',
  1899.00,
  1499.00,
  18,
  'CIR-RG-001',
  true,
  true,
  array['bridal', 'festive'],
  4.9,
  31
),
(
  '20000000-0000-0000-0000-000000000006',
  'Aura Eternal Eternity Band Ring',
  'aura-eternal-eternity-band-ring',
  'Sleek and dazzling, studded with channel-set baguette crystals all around. Worn alone or stacked effortlessly with your favourite jewellery pieces.',
  'Clean with warm soapy water and soft brush periodically.',
  '[{"label": "Width", "value": "3.5mm"}, {"label": "Material", "value": "18k Gold Plated Brass"}]'::jsonb,
  '10000000-0000-0000-0000-000000000003',
  'Gold Plated',
  1299.00,
  999.00,
  25,
  'CIR-RG-002',
  false,
  true,
  array['daily-wear'],
  4.6,
  14
),
(
  '20000000-0000-0000-0000-000000000007',
  'Kashvi Open-Cuff Pearl Bangle',
  'kashvi-open-cuff-pearl-bangle',
  'Sculptural elegance at its finest. An open-ended textured gold cuff capped with radiant South Sea replica pearls. Slips comfortably onto the wrist with a gentle flex mechanism.',
  'Gently wipe clean. Do not apply excessive force to bend.',
  '[{"label": "Wrist Size", "value": "Universal Open Cuff (2.4 to 2.8)"}, {"label": "Finish", "value": "Satin Brush Gold"}]'::jsonb,
  '10000000-0000-0000-0000-000000000004',
  'Pearl',
  2199.00,
  1799.00,
  14,
  'CIR-BG-001',
  true,
  true,
  array['new-arrival', 'daily-wear'],
  4.9,
  28
),
(
  '20000000-0000-0000-0000-000000000008',
  'Maharani Royal Bridal Heritage Set',
  'maharani-royal-bridal-heritage-set',
  'The crown jewel of CIRAAYA bridal couture. Includes a multi-tier necklace, matching oversized jhumkas, a maang tikka, and a delicate ring bracelet (haathphool).',
  'Professional jewellery cleaning recommended. Store in moisture-absorbing box.',
  '[{"label": "Set Includes", "value": "Necklace, Earrings, Maang Tikka, Haathphool"}, {"label": "Craftsmanship", "value": "Handcrafted Jaipuri Jadau"}]'::jsonb,
  '10000000-0000-0000-0000-000000000005',
  'Kundan',
  12999.00,
  9999.00,
  5,
  'CIR-BR-001',
  true,
  true,
  array['bridal', 'festive', 'bestseller'],
  5.0,
  52
)
on conflict (slug) do nothing;

-- 3. Insert Product Images
insert into public.product_images (product_id, image_url, sort_order, alt_text) values
('20000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', 0, 'Celestial Aurora Kundan Choker Set'),
('20000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000', 1, 'Choker closeup details'),
('20000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1000', 0, 'Noor Emerald Solitaire Pearl Necklace'),
('20000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000', 0, 'Zeenat Chandbali Royal Earrings'),
('20000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=1000', 0, 'Miraia Solitaire Teardrop Studs'),
('20000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000', 0, 'Rani Sahiba Statement Polki Ring'),
('20000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1000', 0, 'Aura Eternal Eternity Band Ring'),
('20000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7e?auto=format&fit=crop&q=80&w=1000', 0, 'Kashvi Open-Cuff Pearl Bangle'),
('20000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', 0, 'Maharani Royal Bridal Heritage Set')
on conflict do nothing;

-- 4. Insert Product Variants
insert into public.product_variants (product_id, variant_name, variant_value, price_delta, stock_qty) values
('20000000-0000-0000-0000-000000000001', 'Plating', 'Yellow Gold 18K', 0, 10),
('20000000-0000-0000-0000-000000000001', 'Plating', 'Rose Gold Vermeil', 200.00, 5),
('20000000-0000-0000-0000-000000000006', 'Ring Size', 'Size 12', 0, 8),
('20000000-0000-0000-0000-000000000006', 'Ring Size', 'Size 14', 0, 10),
('20000000-0000-0000-0000-000000000006', 'Ring Size', 'Size 16', 0, 7)
on conflict do nothing;

-- 5. Insert Coupons
insert into public.coupons (code, discount_type, discount_value, min_order_value, max_discount, max_uses, is_active) values
('WELCOME10', 'percentage', 10.00, 999.00, 500.00, 1000, true),
('CIRAAYA500', 'flat', 500.00, 2499.00, null, 500, true),
('FESTIVE15', 'percentage', 15.00, 1999.00, 1000.00, 300, true)
on conflict (code) do nothing;
