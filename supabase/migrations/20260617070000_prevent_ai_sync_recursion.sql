-- Prevent infinite recursion loop in sync triggers between store_settings and ai_settings

CREATE OR REPLACE FUNCTION sync_settings_to_ai()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent cascading recursion loops
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  UPDATE ai_settings
  SET 
    ai_enabled = NEW.ai_enabled,
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

CREATE OR REPLACE FUNCTION sync_ai_to_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent cascading recursion loops
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  UPDATE store_settings
  SET 
    ai_enabled = NEW.ai_enabled,
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
