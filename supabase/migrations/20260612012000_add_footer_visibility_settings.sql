ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS footer_show_payments BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS footer_show_menu BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS footer_show_newsletter BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS footer_show_social BOOLEAN DEFAULT TRUE;

-- Sync values for the singleton settings row
UPDATE store_settings
SET 
  footer_show_payments = TRUE,
  footer_show_menu = TRUE,
  footer_show_newsletter = TRUE,
  footer_show_social = TRUE
WHERE id = '00000000-0000-4000-8000-000000000001';
