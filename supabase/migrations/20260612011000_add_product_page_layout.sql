ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS product_page_layout TEXT[] DEFAULT ARRAY['details', 'ticker', 'reviews', 'related'];

-- Sync default value for existing row
UPDATE store_settings
SET product_page_layout = ARRAY['details', 'ticker', 'reviews', 'related']
WHERE id = '00000000-0000-4000-8000-000000000001' AND product_page_layout IS NULL;
