-- Add columns to both store_settings and ai_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS target_audiences TEXT DEFAULT 'Kids',
ADD COLUMN IF NOT EXISTS product_types TEXT DEFAULT 'Clothes, Shoes',
ADD COLUMN IF NOT EXISTS category_default_template TEXT DEFAULT '<p>Explore our exclusively curated <strong>{{category_name}}</strong> collection — from casual everyday wear to festive outfits. Soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1–14 years.</p>',
ADD COLUMN IF NOT EXISTS product_default_template TEXT DEFAULT '<p>Give your child a style upgrade with this premium {{product_name}}. Featuring soft premium cotton fabric, comfortable fits, and a modern look — perfect for active boys and girls.</p>\n\n<h3>Key Features</h3>\n<ul>\n  <li><strong>Premium Fabric:</strong> Soft, breathable, and gentle on sensitive skin.</li>\n  <li><strong>Durable Details:</strong> Fade-resistant through regular washing.</li>\n  <li><strong>Relaxed Fit:</strong> Easy movement, designed for everyday play.</li>\n  <li><strong>Easy to Style:</strong> Pairs easily with any outfits.</li>\n</ul>\n\n<h3>Available Colors</h3>\n<p>Classic shades and vibrant patterns</p>\n\n<h3>Care Instructions</h3>\n<ul>\n  <li>Machine wash cold, inside out.</li>\n  <li>Do not iron on print.</li>\n  <li>Air dry or tumble dry low.</li>\n</ul>';

ALTER TABLE ai_settings 
ADD COLUMN IF NOT EXISTS target_audiences TEXT DEFAULT 'Kids',
ADD COLUMN IF NOT EXISTS product_types TEXT DEFAULT 'Clothes, Shoes',
ADD COLUMN IF NOT EXISTS category_default_template TEXT DEFAULT '<p>Explore our exclusively curated <strong>{{category_name}}</strong> collection — from casual everyday wear to festive outfits. Soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1–14 years.</p>',
ADD COLUMN IF NOT EXISTS product_default_template TEXT DEFAULT '<p>Give your child a style upgrade with this premium {{product_name}}. Featuring soft premium cotton fabric, comfortable fits, and a modern look — perfect for active boys and girls.</p>\n\n<h3>Key Features</h3>\n<ul>\n  <li><strong>Premium Fabric:</strong> Soft, breathable, and gentle on sensitive skin.</li>\n  <li><strong>Durable Details:</strong> Fade-resistant through regular washing.</li>\n  <li><strong>Relaxed Fit:</strong> Easy movement, designed for everyday play.</li>\n  <li><strong>Easy to Style:</strong> Pairs easily with any outfits.</li>\n</ul>\n\n<h3>Available Colors</h3>\n<p>Classic shades and vibrant patterns</p>\n\n<h3>Care Instructions</h3>\n<ul>\n  <li>Machine wash cold, inside out.</li>\n  <li>Do not iron on print.</li>\n  <li>Air dry or tumble dry low.</li>\n</ul>';

-- Sync trigger: store_settings -> ai_settings
CREATE OR REPLACE FUNCTION sync_settings_to_ai()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_settings
  SET 
    content_provider = NEW.content_provider,
    content_model = NEW.content_model,
    content_keys = NEW.content_keys,
    vision_provider = NEW.vision_provider,
    vision_model = NEW.vision_model,
    vision_keys = NEW.vision_keys,
    tone = NEW.ai_tone,
    language = NEW.ai_language,
    custom_instructions = NEW.ai_custom_instructions,
    auto_content_seo = NEW.auto_content_seo,
    auto_media_ai = NEW.auto_media_ai,
    target_audiences = NEW.target_audiences,
    product_types = NEW.product_types,
    category_default_template = NEW.category_default_template,
    product_default_template = NEW.product_default_template,
    brand_name = NEW.store_name,
    updated_at = NOW()
  WHERE id = '00000000-0000-4000-8000-000000000002';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_settings_to_ai ON store_settings;
CREATE TRIGGER trigger_sync_settings_to_ai
  AFTER UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION sync_settings_to_ai();

-- Sync trigger: ai_settings -> store_settings
CREATE OR REPLACE FUNCTION sync_ai_to_settings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE store_settings
  SET 
    content_provider = NEW.content_provider,
    content_model = NEW.content_model,
    content_keys = NEW.content_keys,
    vision_provider = NEW.vision_provider,
    vision_model = NEW.vision_model,
    vision_keys = NEW.vision_keys,
    ai_tone = NEW.tone,
    ai_language = NEW.language,
    ai_custom_instructions = NEW.custom_instructions,
    auto_content_seo = NEW.auto_content_seo,
    auto_media_ai = NEW.auto_media_ai,
    target_audiences = NEW.target_audiences,
    product_types = NEW.product_types,
    category_default_template = NEW.category_default_template,
    product_default_template = NEW.product_default_template,
    store_name = CASE WHEN NEW.brand_name IS NOT NULL AND NEW.brand_name <> '' THEN NEW.brand_name ELSE store_name END,
    updated_at = NOW()
  WHERE id = '00000000-0000-4000-8000-000000000001';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_ai_to_settings ON ai_settings;
CREATE TRIGGER trigger_sync_ai_to_settings
  AFTER UPDATE ON ai_settings
  FOR EACH ROW
  EXECUTE FUNCTION sync_ai_to_settings();
