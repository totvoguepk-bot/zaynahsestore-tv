-- Migration to add floating contacts adjustment settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS floating_contacts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS floating_contacts_position VARCHAR(20) DEFAULT 'left',
ADD COLUMN IF NOT EXISTS floating_contacts_bottom_mobile INTEGER DEFAULT 80,
ADD COLUMN IF NOT EXISTS floating_contacts_bottom_desktop INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS floating_contacts_side_mobile INTEGER DEFAULT 16,
ADD COLUMN IF NOT EXISTS floating_contacts_side_desktop INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS floating_contacts_scale NUMERIC DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS floating_whatsapp_preset TEXT DEFAULT 'Hello! I am visiting your store and have a question.',
ADD COLUMN IF NOT EXISTS floating_whatsapp_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS floating_instagram_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS floating_tiktok_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS floating_snapchat_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS floating_twitter_enabled BOOLEAN DEFAULT false;
