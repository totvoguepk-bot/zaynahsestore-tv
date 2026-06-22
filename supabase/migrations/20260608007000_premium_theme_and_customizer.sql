-- Migration to add Landing Page Customizer and Premium Theme Settings

-- 1. Create homepage_sections table
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_type TEXT NOT NULL,          -- 'hero_banner', 'product_grid', 'category_list', 'promo_banner', 'trust_badges', 'recent_reviews', 'brands_logos'
  title TEXT,
  settings JSONB NOT NULL DEFAULT '{}', -- visual adjustments: columns, height, aspect ratio
  content_data JSONB NOT NULL DEFAULT '{}', -- category_ids, selected_product_ids, image_urls
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create whatsapp_subscribers table
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Extend store_settings table
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS exit_intent_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS exit_intent_title TEXT DEFAULT 'Wait! Get a Special Discount',
ADD COLUMN IF NOT EXISTS exit_intent_text TEXT DEFAULT 'Submit your WhatsApp number to unlock a secret coupon code.',
ADD COLUMN IF NOT EXISTS exit_intent_coupon TEXT DEFAULT 'WELCOME10',
ADD COLUMN IF NOT EXISTS spin_wheel_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS spin_wheel_segments TEXT[] DEFAULT '{"Try Again", "5% Off", "Free Shipping", "10% Off", "Free Delivery", "WELCOME15"}',
ADD COLUMN IF NOT EXISTS cart_timer_minutes INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS free_shipping_threshold NUMERIC(10,2) DEFAULT 2000.00,
ADD COLUMN IF NOT EXISTS volume_discount_threshold INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS volume_discount_percentage NUMERIC(5,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS recent_buyers JSONB DEFAULT '[{"name": "Ahmad", "city": "Lahore"}, {"name": "Fatima", "city": "Karachi"}, {"name": "Zainab", "city": "Islamabad"}, {"name": "Hamza", "city": "Rawalpindi"}, {"name": "Ayesha", "city": "Faisalabad"}, {"name": "Bilal", "city": "Multan"}]',
ADD COLUMN IF NOT EXISTS recently_viewed_limit INTEGER DEFAULT 4;

-- Seed default homepage sections if empty
INSERT INTO homepage_sections (section_type, title, settings, content_data, sort_order)
VALUES 
  ('hero_banner', 'Hero Slider', '{"height_desktop": "450px", "height_mobile": "220px", "overlay_opacity": 0.3}', '{}', 1),
  ('category_list', 'Shop By Category', '{"columns_desktop": 6, "columns_mobile": 3}', '{}', 2),
  ('product_grid', 'Featured Collection', '{"limit": 8, "columns_desktop": 4, "columns_mobile": 2, "source": "featured"}', '{}', 3),
  ('trust_badges', 'Our Guarantees', '{}', '{}', 4),
  ('recent_reviews', 'Customer Feedback', '{"limit": 3}', '{}', 5)
ON CONFLICT DO NOTHING;
