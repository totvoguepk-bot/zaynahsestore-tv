-- Add fake views and trust badges configuration to store_settings table
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS enable_fake_views BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS min_views INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS max_views INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS enable_trust_badges BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS delivery_estimate_text TEXT DEFAULT 'Estimate delivery times: 3-5 days International.',
ADD COLUMN IF NOT EXISTS free_shipping_text TEXT DEFAULT 'Free shipping & returns: On all orders over $150.',
ADD COLUMN IF NOT EXISTS promo_code_text TEXT DEFAULT 'Use code "WELCOME15" for discount 15% on your first order.',
ADD COLUMN IF NOT EXISTS enable_safe_checkout BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS safe_checkout_text TEXT DEFAULT 'Guarantee Safe Checkout:',
ADD COLUMN IF NOT EXISTS safe_checkout_methods TEXT[] DEFAULT '{"visa", "mastercard", "paypal", "amex", "klarna", "cirrus", "westernunion"}';
