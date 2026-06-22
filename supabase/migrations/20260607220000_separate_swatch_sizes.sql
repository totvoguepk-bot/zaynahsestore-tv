-- Alter store_settings to support separate swatch sizes and alignment
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS archive_swatch_size TEXT DEFAULT 'md';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_swatch_size TEXT DEFAULT 'md';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS archive_swatch_align TEXT DEFAULT 'left';
