-- ===================================================
-- Golden Mycology — Seed Data (v0.1)
-- ===================================================
-- Run this after applying the initial migration.
-- Products use stable UUIDs derived from their slug.
-- ===================================================

-- Admin user profile (user must be created via Supabase Auth UI first)
INSERT INTO user_profiles (id, email, full_name, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@goldenmycology.com',
  'Golden Mycology Admin',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ===================================================
-- Products
-- ===================================================
-- Genetics — Liquid Cultures
-- ===================================================

INSERT INTO products (id, name, subtitle, brand, category, subcategory, price, variants, rating, review_count, description, features, images, for_microscopy_only, featured, tags, specs)
VALUES
(
  'a1000001-0000-4000-8000-000000000001',
  'Enigma Liquid Culture',
  'The Brain of the Mycelial Network',
  'golden-mycology',
  'genetics',
  'liquid-cultures',
  19.99,
  '[]'::jsonb,
  4.9,
  128,
  'Enigma is one of the most sought-after cubensis variants in the underground mycology community. Known for its distinct coral-like morphology and potent expression, this liquid culture is a must-have for advanced cultivators looking to add something truly unique to their library. Each syringe is prepared fresh using sterile technique in our lab-grade facility.',
  '["Made Fresh to Order", "Sterile Technique in ISO 5 Flow Hood", "Lab Tested for Viability", "UV-Resistant Syringe Packaging", "Secure Discreet Shipping"]'::jsonb,
  '["/images/products/enigma-lc.png"]'::jsonb,
  true,
  true,
  '["liquid-culture", "cubensis", "enigma", "advanced", "exotic", "featured"]'::jsonb,
  '{"volume": "10ml", "storage": "Refrigerate at 2-8°C", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000002',
  'Emerald Gates Spore Swabs',
  'Sterile Isolate Swabs',
  'golden-mycology',
  'genetics',
  'spore-swabs',
  14.99,
  '[]'::jsonb,
  4.8,
  94,
  'Premium Emerald Gates spore swabs, meticulously collected in sterile conditions. Each swab is individually sealed and labeled for microscopy and preservation purposes. Perfect for starting your genetic library or studying spore morphology under the microscope.',
  '["Individually Sealed", "Sterile Collection Process", "High Spore Density", "Labelled and Dated", "5 Swabs per Pack"]'::jsonb,
  '["/images/products/emerald-gates-swabs.png"]'::jsonb,
  true,
  true,
  '["spore-swab", "cubensis", "emerald-gates", "microscopy", "featured"]'::jsonb,
  '{"quantity": "5 sterile swabs", "storage": "Store in cool, dark place", "shelfLife": "12 months", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000003',
  'Albino Jedi Mind Fuck Liquid Culture',
  'AJMF — Legendary Potency Isolate',
  'golden-mycology',
  'genetics',
  'liquid-cultures',
  22.99,
  '[]'::jsonb,
  4.9,
  156,
  'Albino Jedi Mind Fuck (AJMF) is a legendary isolate known for its vigorous growth and striking albino phenotype. A favorite among serious collectors, this culture displays strong rhizomorphic mycelium and consistent expression. Sourced from our most reliable mother culture.',
  '["Made Fresh to Order", "Sterile Technique in ISO 5 Flow Hood", "Lab Tested for Viability", "Strong Rhizomorphic Growth", "UV-Resistant Syringe Packaging"]'::jsonb,
  '["/images/products/albino-jedi-mind-fuck.png"]'::jsonb,
  true,
  true,
  '["liquid-culture", "cubensis", "ajmf", "albino", "exotic", "featured"]'::jsonb,
  '{"volume": "10ml", "storage": "Refrigerate at 2-8°C", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000004',
  'Gandalf Liquid Culture',
  'You Shall Not Pass (Go) Without This One',
  'golden-mycology',
  'genetics',
  'liquid-cultures',
  19.99,
  '[]'::jsonb,
  4.7,
  112,
  'Gandalf is a revered cubensis culture named for its wise, commanding presence in the grow. Known for consistent flushes and classic cubensis morphology with a twist, this culture is a staple for any serious genetic library. Vigorous myc growth with great colonization speeds.',
  '["Made Fresh to Order", "Sterile Technique", "Fast Colonization", "Consistent Expression", "UV-Resistant Syringe Packaging"]'::jsonb,
  '["/images/products/gandalf.png"]'::jsonb,
  true,
  true,
  '["liquid-culture", "cubensis", "gandalf", "classic", "featured"]'::jsonb,
  '{"volume": "10ml", "storage": "Refrigerate at 2-8°C", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000005',
  'Toque x Berg Liquid Culture',
  'The Cross You Didn''t Know You Needed',
  'golden-mycology',
  'genetics',
  'liquid-cultures',
  24.99,
  '[]'::jsonb,
  4.8,
  87,
  'Toque x Berg is a hybrid cross that combines the best traits of two powerhouse isolations. This culture exhibits aggressive rhizomorphic growth and impressive genetic stability. A rare find in the mycology community — we''re proud to offer this exclusive cross.',
  '["Exclusive Hybrid Cross", "Made Fresh to Order", "Sterile Technique in ISO 5 Flow Hood", "Lab Tested for Viability", "UV-Resistant Syringe Packaging"]'::jsonb,
  '["/images/products/toque-x-berg.png"]'::jsonb,
  true,
  true,
  '["liquid-culture", "cubensis", "hybrid", "cross", "exclusive", "featured"]'::jsonb,
  '{"volume": "10ml", "storage": "Refrigerate at 2-8°C", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000006',
  'Leucistic Machine Elf Liquid Culture',
  'Pale Phenotype with Otherworldly Vigor',
  'golden-mycology',
  'genetics',
  'liquid-cultures',
  21.99,
  '[]'::jsonb,
  4.8,
  73,
  'Leucistic Machine Elf is a stunning pale phenotype that stands out in any collection. This isolate displays the characteristic leucistic coloration with exceptional growth characteristics. A visual and genetic standout that serious collectors prize for both its appearance and performance.',
  '["Rare Leucistic Phenotype", "Made Fresh to Order", "Sterile Technique in ISO 5 Flow Hood", "Lab Tested for Viability", "UV-Resistant Syringe Packaging"]'::jsonb,
  '["/images/products/leucistic-machine-elf.png"]'::jsonb,
  true,
  true,
  '["liquid-culture", "cubensis", "leucistic", "rare", "exotic", "featured"]'::jsonb,
  '{"volume": "10ml", "storage": "Refrigerate at 2-8°C", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000007',
  'Stormtrooper Liquid Culture',
  'Can''t Miss — White Phenotype Powerhouse',
  'golden-mycology',
  'genetics',
  'liquid-cultures',
  19.99,
  '[]'::jsonb,
  4.7,
  91,
  'Stormtrooper is a striking white phenotype isolate that delivers every time. Known for its stark white appearance and heavy yields, this culture has become a fan favorite in the mycology community. Consistent, reliable, and visually impressive from inoculation to harvest.',
  '["White Phenotype Isolate", "Made Fresh to Order", "Sterile Technique in ISO 5 Flow Hood", "High Yield Potential", "UV-Resistant Syringe Packaging"]'::jsonb,
  '["/images/products/stormtrooper.png"]'::jsonb,
  true,
  true,
  '["liquid-culture", "cubensis", "stormtrooper", "white-phenotype", "featured"]'::jsonb,
  '{"volume": "10ml", "storage": "Refrigerate at 2-8°C", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
);

-- ===================================================
-- Supplies — Agar Media
-- ===================================================

INSERT INTO products (id, name, subtitle, brand, category, subcategory, price, variants, rating, review_count, description, features, images, for_microscopy_only, featured, tags, specs)
VALUES
(
  'a1000001-0000-4000-8000-000000000008',
  'Premium Agar Plates',
  'Lab-Grade PDA Plates — Sterile and Ready to Use',
  'golden-mycology',
  'supplies',
  'agar-media',
  18.00,
  '[{"label": "10 Pack", "price": 18.00}, {"label": "20 Pack", "price": 32.00, "bestValue": true}]'::jsonb,
  4.9,
  213,
  'Our premium Potato Dextrose Agar (PDA) plates are poured in a sterile laminar flow environment using pharmaceutical-grade ingredients. Each plate comes pre-sterilized, wrapped, and ready for immediate use. Consistent depth, no condensation issues — the standard for clean mycology work.',
  '["Poured in ISO 5 Flow Hood", "Pharmaceutical-Grade Ingredients", "Pre-Sterilized and Sealed", "Consistent 20ml Pour Depth", "No Condensation Lid Design", "Lab Tested for Contamination"]'::jsonb,
  '["/images/products/premium-agar-plates.png"]'::jsonb,
  true,
  true,
  '["supplies", "agar", "plates", "pda", "sterile", "lab-supply", "featured"]'::jsonb,
  '{"size": "90mm x 15mm standard", "medium": "Potato Dextrose Agar (PDA)", "volume": "20ml per plate", "storage": "Refrigerate at 2-8°C, upside down", "shelfLife": "6 months refrigerated", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
);

-- ===================================================
-- Supplies — Substrates
-- ===================================================

INSERT INTO products (id, name, subtitle, brand, category, subcategory, price, variants, rating, review_count, description, features, images, for_microscopy_only, featured, tags, specs)
VALUES
(
  'a1000001-0000-4000-8000-000000000009',
  'Premium Grain Bags',
  'Rye Berries — Sterilized and Ready to Inoculate',
  'golden-mycology',
  'supplies',
  'substrates',
  22.00,
  '[{"label": "3lb Bag", "price": 22.00}, {"label": "5lb Bag", "price": 30.00, "bestValue": true}]'::jsonb,
  4.8,
  187,
  'Our grain bags are filled with premium organic rye berries, properly hydrated and sterilized in commercial-grade autoclaves. Each bag features a self-healing injection port and a 0.5-micron filter patch for gas exchange. Ready to inoculate straight out of the box — no prep needed.',
  '["Organic Rye Berries", "Commercial Autoclave Sterilized", "Self-Healing Injection Port", "0.5-Micron Filter Patch", "Optimal Hydration Ratio", "Ready to Inoculate"]'::jsonb,
  '["/images/products/premium-grain-bags.png"]'::jsonb,
  true,
  true,
  '["supplies", "grain", "substrate", "rye", "sterilized", "featured"]'::jsonb,
  '{"grain": "Organic Rye Berries", "filter": "0.5 micron breathable patch", "port": "Self-healing silicone injection port", "storage": "Room temperature, out of direct sunlight", "shelfLife": "3 months", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
),
(
  'a1000001-0000-4000-8000-00000000000a',
  'AIO Bags & Substrate',
  'All-in-One Grow Bags — Grain + Substrate in One Bag',
  'golden-mycology',
  'supplies',
  'substrates',
  28.00,
  '[{"label": "3lb AIO Bag", "price": 28.00}, {"label": "5lb AIO Bag", "price": 42.00, "bestValue": true}, {"label": "10lb AIO Bag", "price": 72.00}]'::jsonb,
  4.7,
  145,
  'Our All-in-One bags combine premium rye grain with nutrient-rich CVG substrate (coco coir, vermiculite, gypsum) in a single bag design. Colonize the grain, then mix directly into the substrate below — no separate bulk substrate prep needed. The easiest path from syringe to harvest.',
  '["Grain + Substrate in One Bag", "Premium Organic Rye Grain Layer", "CVG Substrate Layer (Coco + Verm + Gypsum)", "Self-Healing Injection Port", "0.5-Micron Filter Patch", "No Bulk Substrate Prep Needed"]'::jsonb,
  '["/images/products/aio-bags.png"]'::jsonb,
  true,
  true,
  '["supplies", "aio", "all-in-one", "grow-bag", "substrate", "featured"]'::jsonb,
  '{"grain": "Organic Rye Berries (bottom layer)", "substrate": "CVG — Coco Coir, Vermiculite, Gypsum (top layer)", "ratio": "60:40 grain to substrate", "filter": "0.5 micron breathable patch", "port": "Self-healing silicone injection port", "storage": "Room temperature, out of direct sunlight", "shelfLife": "3 months", "origin": "Golden Mycology Lab — Portland, OR"}'::jsonb
);

-- ===================================================
-- Merch — Stickers
-- ===================================================

INSERT INTO products (id, name, subtitle, brand, category, subcategory, price, variants, rating, review_count, description, features, images, for_microscopy_only, featured, tags, specs)
VALUES
(
  'a1000001-0000-4000-8000-00000000000b',
  'Sticker Pack',
  '6 Premium Vinyl Stickers',
  'golden-mycology',
  'merch',
  'stickers',
  9.99,
  '[]'::jsonb,
  4.6,
  54,
  'Express your mycology pride with our premium vinyl sticker pack. Six unique designs featuring Golden Mycology artwork — mushrooms, logos, and culture graphics. Weatherproof, UV-resistant, and ready to stick on your laptop, water bottle, grow tent, or toolbox.',
  '["6 Unique Designs", "Premium Vinyl Material", "Weatherproof & UV-Resistant", "Scratch-Resistant Laminate", "Easy Peel Application"]'::jsonb,
  '["/images/products/sticker-pack.png"]'::jsonb,
  false,
  false,
  '["merch", "stickers", "vinyl", "swag"]'::jsonb,
  '{"quantity": "6 stickers", "material": "Premium vinyl with UV laminate", "sizes": "2-4 inches each", "application": "Indoor or outdoor, smooth surfaces"}'::jsonb
),
(
  'a1000001-0000-4000-8000-00000000000c',
  'Collaboration Tee',
  'Premium Quality Mycology Tee',
  'golden-mycology',
  'merch',
  'apparel',
  34.99,
  '[]'::jsonb,
  4.8,
  39,
  'Premium quality mycology tee featuring Golden Mycology original artwork. Printed on heavyweight 100% ring-spun cotton for maximum comfort and durability. Features a dual-sided print with the Golden Mycology emblem on front and custom mushroom design on back.',
  '["Golden Mycology Original Art", "100% Ring-Spun Cotton", "Front + Back Print", "Heavyweight 6oz Fabric", "Relaxed Fit"]'::jsonb,
  '["/images/products/collab-tee.png"]'::jsonb,
  false,
  false,
  '["merch", "apparel", "tee", "collab", "limited", "streetwear"]'::jsonb,
  '{"material": "100% ring-spun cotton", "weight": "6oz heavyweight", "fit": "Relaxed / True to Size", "sizes": "S, M, L, XL, 2XL", "care": "Machine wash cold, tumble dry low"}'::jsonb
),
(
  'a1000001-0000-4000-8000-00000000000d',
  'Mycology Hoodie',
  'Golden Mycology Embroidered Hoodie',
  'golden-mycology',
  'merch',
  'apparel',
  54.99,
  '[]'::jsonb,
  4.9,
  67,
  'Stay warm and represent the culture with our premium embroidered mycology hoodie. Features the Golden Mycology emblem embroidered on the chest and a subtle mycelium network pattern on the sleeves. Made from a heavyweight cotton-polyester blend for warmth, durability, and comfort.',
  '["Embroidered Chest Logo", "Mycelium Pattern Sleeve Detailing", "Heavyweight Cotton-Poly Blend", "Kangaroo Pocket", "Ribbed Cuffs and Hem", "Adjustable Drawstring Hood"]'::jsonb,
  '["/images/products/mycology-hoodie.png"]'::jsonb,
  false,
  false,
  '["merch", "apparel", "hoodie", "embroidered", "warm"]'::jsonb,
  '{"material": "80% cotton, 20% polyester", "weight": "10oz heavyweight", "fit": "Regular / True to Size", "sizes": "S, M, L, XL, 2XL, 3XL", "care": "Machine wash cold, tumble dry low"}'::jsonb
),
(
  'a1000001-0000-4000-8000-00000000000e',
  'Golden Mycology T-Shirt',
  'Premium cotton tee with embroidered logo',
  'golden-mycology',
  'merch',
  'apparel',
  34.99,
  '[{"label": "S", "price": 34.99}, {"label": "M", "price": 34.99}, {"label": "L", "price": 34.99}, {"label": "XL", "price": 34.99}, {"label": "2XL", "price": 36.99}]'::jsonb,
  4.8,
  42,
  'Represent Golden Mycology with this premium cotton t-shirt. Features an embroidered mushroom logo on the chest. Heavyweight 6oz ring-spun cotton for durability and comfort.',
  '["Embroidered Mushroom Logo", "100% Ring-Spun Cotton", "Heavyweight 6oz Fabric", "Relaxed Fit"]'::jsonb,
  '["/images/products/gm-t-shirt.png"]'::jsonb,
  false,
  true,
  '["merch", "apparel", "t-shirt", "embroidered"]'::jsonb,
  '{}'::jsonb
),
(
  'a1000001-0000-4000-8000-00000000000f',
  'Golden Mycology Hoodie',
  'Premium embroidered hoodie with gold accents',
  'golden-mycology',
  'merch',
  'apparel',
  54.99,
  '[{"label": "S", "price": 54.99}, {"label": "M", "price": 54.99}, {"label": "L", "price": 54.99}, {"label": "XL", "price": 54.99}, {"label": "2XL", "price": 56.99}, {"label": "3XL", "price": 58.99}]'::jsonb,
  4.9,
  38,
  'Stay warm and represent the culture with our premium embroidered hoodie. Features the Golden Mycology emblem in gold thread on the chest with subtle katana motif detailing on the sleeves. Heavyweight cotton-polyester blend for warmth and durability.',
  '["Gold Embroidered Chest Logo", "Katana Motif Sleeve Embroidery", "Heavyweight Cotton-Poly Blend", "Kangaroo Pocket", "Ribbed Cuffs and Hem", "Adjustable Drawstring Hood"]'::jsonb,
  '["/images/products/gm-hoodie.png"]'::jsonb,
  false,
  true,
  '["merch", "apparel", "hoodie", "embroidered", "gold", "samurai"]'::jsonb,
  '{}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000010',
  'Golden Mycology Sticker Pack',
  '5 premium vinyl stickers — samurai & mushroom designs',
  'golden-mycology',
  'merch',
  'stickers',
  9.99,
  '[]'::jsonb,
  4.7,
  29,
  'Five premium vinyl stickers featuring Golden Mycology original artwork — samurai warrior, mushroom motifs, and gold foil designs. Weatherproof, UV-resistant, and perfect for laptops, water bottles, or your grow space.',
  '["5 Unique Designs", "Gold Foil Accents", "Premium Vinyl Material", "Weatherproof & UV-Resistant", "Scratch-Resistant Laminate"]'::jsonb,
  '["/images/products/gm-sticker-pack.png"]'::jsonb,
  false,
  true,
  '["merch", "stickers", "vinyl", "gold-foil", "samurai"]'::jsonb,
  '{"quantity": "5 stickers", "material": "Premium vinyl with gold foil accents", "sizes": "2-4 inches each", "application": "Indoor or outdoor, smooth surfaces"}'::jsonb
),
(
  'a1000001-0000-4000-8000-000000000011',
  'Golden Mycology Dad Hat',
  'Embroidered logo — one size fits all',
  'golden-mycology',
  'merch',
  'apparel',
  24.99,
  '[]'::jsonb,
  4.8,
  31,
  'Complete your look with our premium dad hat. Features the Golden Mycology logo embroidered in gold thread on a structured cotton front. Adjustable brass buckle closure, curved brim, and a comfortable fit for all-day wear.',
  '["Gold Embroidered Logo", "Structured Cotton Front", "Adjustable Brass Buckle Closure", "Curved Brim", "One Size Fits Most"]'::jsonb,
  '["/images/products/gm-hat.png"]'::jsonb,
  false,
  true,
  '["merch", "apparel", "hat", "dad-hat", "embroidered", "gold"]'::jsonb,
  '{"material": "100% cotton front, polyester mesh back", "closure": "Brass buckle adjuster", "fit": "One size — fits most", "care": "Spot clean recommended"}'::jsonb
);
