-- Add enable_swatches column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS enable_swatches BOOLEAN DEFAULT true;
