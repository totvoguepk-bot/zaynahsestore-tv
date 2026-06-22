ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS flash_sale_start_date TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS flash_sale_start_date TIMESTAMPTZ;
