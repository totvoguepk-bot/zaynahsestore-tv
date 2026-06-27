-- Migration: Add PostEx courier integration settings to store_settings
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS postex_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS postex_api_token TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_mode TEXT DEFAULT 'sandbox',
  ADD COLUMN IF NOT EXISTS postex_pickup_address TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_return_address TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_order_type TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_handling_type TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_default_remarks TEXT DEFAULT '';
