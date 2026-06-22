-- Migration to add card_show_sizes, card_show_materials, and card_show_custom columns to store_settings
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS card_show_sizes BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_materials BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_custom BOOLEAN DEFAULT true;
