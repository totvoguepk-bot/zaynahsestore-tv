-- Migration to add customizable homepage trust badges to store_settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS trust_badge_1_title TEXT DEFAULT 'Free Delivery',
ADD COLUMN IF NOT EXISTS trust_badge_1_desc TEXT DEFAULT 'On all orders above Rs. 2,000',
ADD COLUMN IF NOT EXISTS trust_badge_1_icon TEXT DEFAULT 'Truck',
ADD COLUMN IF NOT EXISTS trust_badge_2_title TEXT DEFAULT 'Secure Payments',
ADD COLUMN IF NOT EXISTS trust_badge_2_desc TEXT DEFAULT '100% protected checkout payments',
ADD COLUMN IF NOT EXISTS trust_badge_2_icon TEXT DEFAULT 'Shield',
ADD COLUMN IF NOT EXISTS trust_badge_3_title TEXT DEFAULT 'Easy Exchange',
ADD COLUMN IF NOT EXISTS trust_badge_3_desc TEXT DEFAULT 'No questions asked return policy',
ADD COLUMN IF NOT EXISTS trust_badge_3_icon TEXT DEFAULT 'RefreshCw',
ADD COLUMN IF NOT EXISTS trust_badge_4_title TEXT DEFAULT '24/7 Support',
ADD COLUMN IF NOT EXISTS trust_badge_4_desc TEXT DEFAULT 'Call/WhatsApp anytime for assistance',
ADD COLUMN IF NOT EXISTS trust_badge_4_icon TEXT DEFAULT 'Phone';
