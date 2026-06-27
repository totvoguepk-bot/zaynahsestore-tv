-- Migration: Add Zaynahs Courier Manager-style PostEx settings columns
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS postex_pickup_display TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_return_display TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_return_city TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS postex_product_check TEXT DEFAULT '1',
  ADD COLUMN IF NOT EXISTS postex_sku_check TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS postex_weight_check TEXT DEFAULT '1',
  ADD COLUMN IF NOT EXISTS postex_pieces_check TEXT DEFAULT '1',
  ADD COLUMN IF NOT EXISTS postex_cod_check TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS postex_notes_check TEXT DEFAULT '1',
  ADD COLUMN IF NOT EXISTS postex_default_weight TEXT DEFAULT '0.5',
  ADD COLUMN IF NOT EXISTS postex_default_items TEXT DEFAULT '3',
  ADD COLUMN IF NOT EXISTS postex_default_product TEXT DEFAULT 'Kids Clothes',
  ADD COLUMN IF NOT EXISTS postex_whatsapp_template TEXT DEFAULT 'Dear {name}, your order has been booked. You can track it here: {url}\n{note}',
  ADD COLUMN IF NOT EXISTS postex_whatsapp_note TEXT DEFAULT 'Thank you for shopping with us!';
