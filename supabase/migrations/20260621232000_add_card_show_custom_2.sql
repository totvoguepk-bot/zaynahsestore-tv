-- Migration to add card_show_custom_2 column to store_settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS card_show_custom_2 BOOLEAN DEFAULT true;
