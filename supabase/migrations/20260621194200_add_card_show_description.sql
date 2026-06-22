-- Migration: Add card_show_description to store_settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS card_show_description BOOLEAN DEFAULT true;
