-- Add shipping_method_name to orders

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_method_name TEXT;
