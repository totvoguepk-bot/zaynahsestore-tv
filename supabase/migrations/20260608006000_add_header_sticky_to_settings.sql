-- Add header_sticky option to store_settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS header_sticky BOOLEAN DEFAULT true;
