-- Migration: Add global discount settings to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS global_flash_sale_discount_type TEXT DEFAULT 'percentage';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS global_flash_sale_discount_value NUMERIC(10,2) DEFAULT 0;
