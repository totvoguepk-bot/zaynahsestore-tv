-- Add email and source_type columns to whatsapp_subscribers table
ALTER TABLE whatsapp_subscribers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE whatsapp_subscribers ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'wheel';
