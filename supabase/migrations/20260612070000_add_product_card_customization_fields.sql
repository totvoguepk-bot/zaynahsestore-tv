ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS card_style VARCHAR DEFAULT 'style1',
ADD COLUMN IF NOT EXISTS card_show_stars BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_quickview BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_wishlist BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_show_quickcart BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_alignment VARCHAR DEFAULT 'left',
ADD COLUMN IF NOT EXISTS card_elements_order TEXT[] DEFAULT ARRAY['title', 'rating', 'price', 'swatches'];

-- Sync default values for the existing settings row
UPDATE store_settings
SET 
  card_style = 'style1',
  card_show_stars = true,
  card_show_quickview = true,
  card_show_wishlist = true,
  card_show_quickcart = true,
  card_alignment = 'left',
  card_elements_order = ARRAY['title', 'rating', 'price', 'swatches']
WHERE id = '00000000-0000-4000-8000-000000000001';
