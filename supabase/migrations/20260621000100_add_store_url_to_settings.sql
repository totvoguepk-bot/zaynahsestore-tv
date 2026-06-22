-- Add store_url to store_settings table
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS store_url TEXT;
