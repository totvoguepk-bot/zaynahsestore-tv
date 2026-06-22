-- Migration: Add Pixels, SEO & AI settings to store_settings
-- Date: 2026-06-12

ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS meta_pixel_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS ga4_measurement_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS gtm_container_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS tiktok_pixel_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS twitter_pixel_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS snapchat_pixel_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS pinterest_tag_id TEXT DEFAULT '',

ADD COLUMN IF NOT EXISTS twitter_handle TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS meta_title_suffix TEXT DEFAULT '',

ADD COLUMN IF NOT EXISTS content_provider TEXT DEFAULT 'groq',
ADD COLUMN IF NOT EXISTS content_model TEXT DEFAULT 'llama-3.3-70b-versatile',
ADD COLUMN IF NOT EXISTS content_keys TEXT DEFAULT '',

ADD COLUMN IF NOT EXISTS vision_provider TEXT DEFAULT 'gemini',
ADD COLUMN IF NOT EXISTS vision_model TEXT DEFAULT 'gemini-2.0-flash',
ADD COLUMN IF NOT EXISTS vision_keys TEXT DEFAULT '',

ADD COLUMN IF NOT EXISTS ai_tone TEXT DEFAULT 'Professional',
ADD COLUMN IF NOT EXISTS ai_language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS ai_custom_instructions TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS auto_content_seo BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS auto_media_ai BOOLEAN DEFAULT true,

-- SMTP/Email Fallback Columns (For schema compatibility with guide)
ADD COLUMN IF NOT EXISTS smtp_email TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS smtp_app_password TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS smtp_from_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS admin_notification_email TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS email_notifications JSONB DEFAULT '{
  "welcome": true,
  "password_reset": true,
  "password_changed": true,
  "order_placed": true,
  "order_confirmed": true,
  "order_shipped": true,
  "order_delivered": true,
  "order_cancelled": true,
  "order_refunded": true,
  "review_request": true,
  "admin_new_order": true,
  "admin_low_stock": true,
  "admin_new_customer": true,
  "admin_new_review": true,
  "admin_contact_form": true
}'::jsonb,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Update current singleton row to populate defaults
UPDATE store_settings
SET 
  meta_pixel_id = COALESCE(meta_pixel_id, ''),
  ga4_measurement_id = COALESCE(ga4_measurement_id, ''),
  gtm_container_id = COALESCE(gtm_container_id, ''),
  tiktok_pixel_id = COALESCE(tiktok_pixel_id, ''),
  twitter_pixel_id = COALESCE(twitter_pixel_id, ''),
  snapchat_pixel_id = COALESCE(snapchat_pixel_id, ''),
  pinterest_tag_id = COALESCE(pinterest_tag_id, ''),
  
  twitter_handle = COALESCE(twitter_handle, ''),
  meta_title_suffix = COALESCE(meta_title_suffix, ''),
  
  content_provider = COALESCE(content_provider, 'groq'),
  content_model = COALESCE(content_model, 'llama-3.3-70b-versatile'),
  content_keys = COALESCE(content_keys, ''),
  
  vision_provider = COALESCE(vision_provider, 'gemini'),
  vision_model = COALESCE(vision_model, 'gemini-2.0-flash'),
  vision_keys = COALESCE(vision_keys, ''),
  
  ai_tone = COALESCE(ai_tone, 'Professional'),
  ai_language = COALESCE(ai_language, 'English'),
  ai_custom_instructions = COALESCE(ai_custom_instructions, ''),
  auto_content_seo = COALESCE(auto_content_seo, true),
  auto_media_ai = COALESCE(auto_media_ai, true),

  smtp_email = COALESCE(smtp_email, ''),
  smtp_app_password = COALESCE(smtp_app_password, ''),
  smtp_from_name = COALESCE(smtp_from_name, ''),
  admin_notification_email = COALESCE(admin_notification_email, ''),
  email_notifications = COALESCE(email_notifications, '{
    "welcome": true,
    "password_reset": true,
    "password_changed": true,
    "order_placed": true,
    "order_confirmed": true,
    "order_shipped": true,
    "order_delivered": true,
    "order_cancelled": true,
    "order_refunded": true,
    "review_request": true,
    "admin_new_order": true,
    "admin_low_stock": true,
    "admin_new_customer": true,
    "admin_new_review": true,
    "admin_contact_form": true
  }'::jsonb),
  low_stock_threshold = COALESCE(low_stock_threshold, 5)
WHERE id = '00000000-0000-4000-8000-000000000001';
