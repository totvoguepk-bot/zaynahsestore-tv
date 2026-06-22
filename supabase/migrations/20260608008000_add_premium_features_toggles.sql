-- Migration to add individual toggles for all premium e-commerce theme features

ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS recent_buyers_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS cookie_consent_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS free_shipping_bar_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS volume_discounts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS frequently_bought_together_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS stock_urgency_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS flash_sale_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS social_feeds_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS cart_timer_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS size_guide_enabled BOOLEAN DEFAULT true;
