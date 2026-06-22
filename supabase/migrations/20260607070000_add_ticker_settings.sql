-- Migration: Add ticker configuration to store_settings table
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS enable_ticker BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ticker_text TEXT DEFAULT 'Free returns within 30 days' || CHR(10) || 'Unlimited delivery for only $175';
