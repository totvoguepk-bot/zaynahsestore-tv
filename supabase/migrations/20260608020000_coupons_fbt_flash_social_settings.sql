-- Migration: Add Coupons, FBT, Flash Sales, and Social Settings
-- Created at: 2026-06-08

-- 1. Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_cart_amount NUMERIC(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Policies for coupons
DROP POLICY IF EXISTS "Public read coupons" ON coupons;
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admin all coupons" ON coupons;
CREATE POLICY "Admin all coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for coupons updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Add columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS frequently_bought_together_ids UUID[] DEFAULT '{}'::uuid[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS flash_sale_enabled BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS flash_sale_end_date TIMESTAMPTZ;

-- 3. Add columns to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_feeds_homepage_enabled BOOLEAN DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_feeds_product_enabled BOOLEAN DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_feeds_title TEXT DEFAULT 'Follow Us On Instagram';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_feeds_subtitle TEXT DEFAULT '@Zaynahs.pk';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_feeds_desc TEXT DEFAULT 'Tag us in your post to get featured on our page';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_feeds_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS cart_timer_message TEXT DEFAULT 'Items in your cart are reserved for {timer} minutes.';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS coupon_codes_enabled BOOLEAN DEFAULT true;
