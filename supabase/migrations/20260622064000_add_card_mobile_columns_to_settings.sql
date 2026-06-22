-- Migration to add card_mobile_columns to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_mobile_columns INTEGER DEFAULT 2;
