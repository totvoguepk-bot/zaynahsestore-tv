-- Add global flash_sale_end_date to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS flash_sale_end_date TIMESTAMPTZ;
