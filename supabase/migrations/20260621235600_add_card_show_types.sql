-- Migration to add type-specific catalog card visibility options
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS card_show_type_color BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_type_size BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_type_material BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_type_custom BOOLEAN DEFAULT true;
