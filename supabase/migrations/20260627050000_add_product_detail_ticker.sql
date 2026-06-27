-- Migration: Add product detail page ticker columns (separate from homepage ticker)
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS product_detail_enable_ticker BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS product_detail_ticker_text TEXT DEFAULT 'Free returns within 30 days' || CHR(10) || 'Unlimited delivery for only $175';
