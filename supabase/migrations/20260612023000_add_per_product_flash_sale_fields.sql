-- Migration to add per-product flash sale discount type and value columns
ALTER TABLE products
ADD COLUMN IF NOT EXISTS flash_sale_discount_type TEXT DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS flash_sale_discount_value NUMERIC(10,2) DEFAULT 0;
