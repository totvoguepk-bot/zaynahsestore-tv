-- Migration to add card_show_swatches column to store_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS card_show_swatches BOOLEAN DEFAULT true;
