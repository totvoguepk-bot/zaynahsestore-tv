-- SQL Migration to add floating_whatsapp_number to store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS floating_whatsapp_number TEXT;
