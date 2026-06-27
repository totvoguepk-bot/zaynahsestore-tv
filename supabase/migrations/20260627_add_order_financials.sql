-- Add financial adjustment columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_code TEXT;
