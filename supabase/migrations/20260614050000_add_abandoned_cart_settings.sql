-- Migration: Add abandoned cart settings to store_settings table
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS abandoned_cart_email_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS abandoned_cart_admin_notify BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS abandoned_cart_email_subject TEXT DEFAULT 'You left items in your cart!',
  ADD COLUMN IF NOT EXISTS abandoned_cart_email_template TEXT DEFAULT 'Hi {{name}},\n\nYou left some items in your cart. Complete your purchase here:\n{{checkout_url}}';
