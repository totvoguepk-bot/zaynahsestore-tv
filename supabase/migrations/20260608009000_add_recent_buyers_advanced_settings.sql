-- YYYYMMDDHHMMSS_add_recent_buyers_advanced_settings.sql
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS recent_buyers_names TEXT DEFAULT 'Ahmad, Fatima, Zainab, Hamza, Ayesha, Bilal, Sana, Ali, Usman, Maryam',
ADD COLUMN IF NOT EXISTS recent_buyers_cities TEXT DEFAULT 'Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala',
ADD COLUMN IF NOT EXISTS recent_buyers_source TEXT DEFAULT 'simulated', -- 'simulated' or 'real'
ADD COLUMN IF NOT EXISTS recent_buyers_product_pool TEXT DEFAULT 'any', -- 'any', 'featured', 'sale', 'recent', 'custom'
ADD COLUMN IF NOT EXISTS recent_buyers_custom_products JSONB DEFAULT '[]', -- array of product IDs
ADD COLUMN IF NOT EXISTS recent_buyers_initial_delay INTEGER DEFAULT 15, -- in seconds
ADD COLUMN IF NOT EXISTS recent_buyers_interval INTEGER DEFAULT 35, -- in seconds
ADD COLUMN IF NOT EXISTS recent_buyers_display_duration INTEGER DEFAULT 6, -- in seconds
ADD COLUMN IF NOT EXISTS exit_intent_image_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS exit_intent_delay_mobile INTEGER DEFAULT 25, -- in seconds
ADD COLUMN IF NOT EXISTS cookie_consent_text TEXT DEFAULT 'We use cookies to optimize your experience, analyze traffic, and support checkout flows. By continuing, you agree to our privacy policy.',
ADD COLUMN IF NOT EXISTS cookie_consent_button_text TEXT DEFAULT 'Accept All';
