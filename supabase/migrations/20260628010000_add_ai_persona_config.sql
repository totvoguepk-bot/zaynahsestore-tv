-- Migration: Add ai_persona_config JSONB column to store_settings and ai_settings
-- Date: 2026-06-28
-- Description: Consolidate persona/behavior AI settings into a single JSONB column

-- 1. Add JSONB column to store_settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS ai_persona_config JSONB DEFAULT '{}'::jsonb;

-- 2. Add JSONB column to ai_settings
ALTER TABLE ai_settings
ADD COLUMN IF NOT EXISTS ai_persona_config JSONB DEFAULT '{}'::jsonb;

-- 3. Migrate existing data into the JSONB structure
-- Structure: { "tone": "...", "language": "...", "customInstructions": "...", "targetAudiences": ["..."], "productTypes": ["..."] }
UPDATE store_settings
SET ai_persona_config = jsonb_build_object(
  'tone', COALESCE(ai_tone, 'Professional'),
  'language', COALESCE(ai_language, 'English'),
  'customInstructions', COALESCE(ai_custom_instructions, ''),
  'targetAudiences', COALESCE(string_to_array(target_audiences, ', '), ARRAY[]::text[]),
  'productTypes', COALESCE(string_to_array(product_types, ', '), ARRAY[]::text[])
)
WHERE ai_persona_config = '{}'::jsonb;

UPDATE ai_settings
SET ai_persona_config = jsonb_build_object(
  'tone', COALESCE(tone, 'Professional'),
  'language', COALESCE(language, 'English'),
  'customInstructions', COALESCE(custom_instructions, ''),
  'targetAudiences', COALESCE(string_to_array(target_audiences, ', '), ARRAY[]::text[]),
  'productTypes', COALESCE(string_to_array(product_types, ', '), ARRAY[]::text[])
)
WHERE ai_persona_config = '{}'::jsonb;

-- 4. Update sync_settings_to_ai trigger function to include ai_persona_config
CREATE OR REPLACE FUNCTION sync_settings_to_ai()
RETURNS TRIGGER AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  UPDATE ai_settings
  SET 
    ai_enabled = NEW.ai_enabled,
    ai_model_credentials = NEW.ai_model_credentials,
    ai_persona_config = NEW.ai_persona_config,
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
    category_description_prompt = NEW.category_description_prompt,
    category_description_limit = NEW.category_description_limit,
    product_description_prompt = NEW.product_description_prompt,
    product_description_limit = NEW.product_description_limit,
    product_short_prompt = NEW.product_short_prompt,
    product_short_limit = NEW.product_short_limit,
    updated_at = NOW()
  WHERE id = '00000000-0000-4000-8000-000000000002';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Update sync_ai_to_settings trigger function to include ai_persona_config
CREATE OR REPLACE FUNCTION sync_ai_to_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  UPDATE store_settings
  SET 
    ai_enabled = NEW.ai_enabled,
    ai_model_credentials = NEW.ai_model_credentials,
    ai_persona_config = NEW.ai_persona_config,
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
    category_description_prompt = NEW.category_description_prompt,
    category_description_limit = NEW.category_description_limit,
    product_description_prompt = NEW.product_description_prompt,
    product_description_limit = NEW.product_description_limit,
    product_short_prompt = NEW.product_short_prompt,
    product_short_limit = NEW.product_short_limit,
    updated_at = NOW()
  WHERE id = '00000000-0000-4000-8000-000000000001';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
