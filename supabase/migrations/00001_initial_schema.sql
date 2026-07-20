-- ===================================================
-- Golden Mycology — Initial Schema Migration (v0.1)
-- ===================================================

-- 0. Extensions
-- ===================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Products
-- ===================================================
CREATE TABLE products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  subtitle        text,
  brand           text DEFAULT 'golden-mycology',
  category        text NOT NULL,
  subcategory     text,
  price           decimal(10,2) NOT NULL,
  variants        jsonb DEFAULT '[]'::jsonb,
  rating          decimal(2,1) DEFAULT 0,
  review_count    int DEFAULT 0,
  description     text,
  features        jsonb DEFAULT '[]'::jsonb,
  images          jsonb DEFAULT '[]'::jsonb,
  inventory       int,                          -- null = made-to-order
  for_microscopy_only  boolean DEFAULT true,
  featured        boolean DEFAULT false,
  tags            jsonb DEFAULT '[]'::jsonb,
  specs           jsonb DEFAULT '{}'::jsonb,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 2. User Profiles
-- ===================================================
CREATE TABLE user_profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text,
  full_name           text,
  shipping_addresses  jsonb DEFAULT '[]'::jsonb,
  is_admin            boolean DEFAULT false,
  created_at          timestamptz DEFAULT now()
);

-- 3. Orders
-- ===================================================
CREATE TABLE orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES user_profiles(id),
  email             text NOT NULL,
  shipping_name     text NOT NULL,
  street            text NOT NULL,
  city              text NOT NULL,
  state             text NOT NULL,
  zip               text NOT NULL,
  items             jsonb NOT NULL,
  subtotal          decimal(10,2) NOT NULL,
  shipping          decimal(10,2) DEFAULT 15.00,
  tax               decimal(10,2) DEFAULT 0,
  total             decimal(10,2) NOT NULL,
  payment_method    text,
  payment_status    text DEFAULT 'pending',
  fulfillment_status text DEFAULT 'pending',
  tracking_number   text,
  notes             text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- 4. Reviews
-- ===================================================
CREATE TABLE reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES user_profiles(id),
  rating      int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body        text,
  created_at  timestamptz DEFAULT now()
);

-- 5. Blog Posts
-- ===================================================
CREATE TABLE blog_posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  body        text,
  published   boolean DEFAULT false,
  author_id   uuid REFERENCES user_profiles(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ===================================================
-- Indexes
-- ===================================================
CREATE INDEX idx_products_category    ON products(category);
CREATE INDEX idx_products_featured    ON products(featured);
CREATE INDEX idx_orders_user_id       ON orders(user_id);
CREATE INDEX idx_orders_status        ON orders(fulfillment_status);
CREATE INDEX idx_reviews_product_id   ON reviews(product_id);
CREATE INDEX idx_blog_posts_slug      ON blog_posts(slug);

-- ===================================================
-- Row-Level Security
-- ===================================================

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products — public select"       ON products FOR SELECT USING (true);
CREATE POLICY "Products — admin all"           ON products FOR ALL USING (
  (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders — user select own"       ON orders FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Orders — admin select all"      ON orders FOR SELECT USING (
  (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Orders — authenticated insert"  ON orders FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles — user select own"     ON user_profiles FOR SELECT USING (
  id = auth.uid()
);
CREATE POLICY "Profiles — admin select all"    ON user_profiles FOR SELECT USING (
  (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews — public select"        ON reviews FOR SELECT USING (true);
CREATE POLICY "Reviews — authenticated insert" ON reviews FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND user_id = auth.uid()
);
CREATE POLICY "Reviews — user update own"      ON reviews FOR UPDATE USING (
  user_id = auth.uid()
);
CREATE POLICY "Reviews — admin all"            ON reviews FOR ALL USING (
  (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
);

-- Blog Posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog — public select published" ON blog_posts FOR SELECT USING (
  published = true
);
CREATE POLICY "Blog — admin all"               ON blog_posts FOR ALL USING (
  (SELECT is_admin FROM user_profiles WHERE id = auth.uid()) = true
);

-- ===================================================
-- Auto-update updated_at trigger
-- ===================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
