-- Update default templates, custom prompts and limits in store_settings and ai_settings to match inspired templates

-- 1. Alter default values in store_settings
ALTER TABLE store_settings
  ALTER COLUMN category_default_template SET DEFAULT '<p>Explore our exclusively curated <strong>{{category_name}}</strong> collection — from casual everyday wear to festive outfits. Soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1–14 years.</p>',
  ALTER COLUMN product_default_template SET DEFAULT '<p>Give your child a style upgrade with this premium {{product_name}}. Featuring soft premium cotton fabric, comfortable fits, and a modern look — perfect for active boys and girls.</p>\n\n<h3>Key Features</h3>\n<ul>\n  <li><strong>Premium Fabric:</strong> Soft, breathable, and gentle on sensitive skin.</li>\n  <li><strong>Durable Details:</strong> Fade-resistant through regular washing.</li>\n  <li><strong>Relaxed Fit:</strong> Easy movement, designed for everyday play.</li>\n  <li><strong>Easy to Style:</strong> Pairs easily with any outfits.</li>\n</ul>\n\n<h3>Available Colors</h3>\n<p>Classic shades and vibrant patterns</p>\n\n<h3>Care Instructions</h3>\n<ul>\n  <li>Machine wash cold, inside out.</li>\n  <li>Do not iron on print.</li>\n  <li>Air dry or tumble dry low.</li>\n</ul>',
  ALTER COLUMN category_description_prompt SET DEFAULT 'Write an engaging category overview inspired by: Explore our exclusively curated collection, featuring soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1-14 years.',
  ALTER COLUMN category_description_limit SET DEFAULT 80,
  ALTER COLUMN product_description_prompt SET DEFAULT 'Write a premium, detailed product description inspired by: paragraph explaining the product style, soft fabric, and fit; a "Key Features" bullet list; "Available Colors" list; and "Care Instructions" bullet list.',
  ALTER COLUMN product_description_limit SET DEFAULT 150,
  ALTER COLUMN product_short_prompt SET DEFAULT 'Write a catchy, high-conversion single-line product highlight (maximum 1 line) about the article. Include the focus keyword and make it highly optimized for SEO.',
  ALTER COLUMN product_short_limit SET DEFAULT 20;

-- 2. Alter default values in ai_settings
ALTER TABLE ai_settings
  ALTER COLUMN category_default_template SET DEFAULT '<p>Explore our exclusively curated <strong>{{category_name}}</strong> collection — from casual everyday wear to festive outfits. Soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1–14 years.</p>',
  ALTER COLUMN product_default_template SET DEFAULT '<p>Give your child a style upgrade with this premium {{product_name}}. Featuring soft premium cotton fabric, comfortable fits, and a modern look — perfect for active boys and girls.</p>\n\n<h3>Key Features</h3>\n<ul>\n  <li><strong>Premium Fabric:</strong> Soft, breathable, and gentle on sensitive skin.</li>\n  <li><strong>Durable Details:</strong> Fade-resistant through regular washing.</li>\n  <li><strong>Relaxed Fit:</strong> Easy movement, designed for everyday play.</li>\n  <li><strong>Easy to Style:</strong> Pairs easily with any outfits.</li>\n</ul>\n\n<h3>Available Colors</h3>\n<p>Classic shades and vibrant patterns</p>\n\n<h3>Care Instructions</h3>\n<ul>\n  <li>Machine wash cold, inside out.</li>\n  <li>Do not iron on print.</li>\n  <li>Air dry or tumble dry low.</li>\n</ul>',
  ALTER COLUMN category_description_prompt SET DEFAULT 'Write an engaging category overview inspired by: Explore our exclusively curated collection, featuring soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1-14 years.',
  ALTER COLUMN category_description_limit SET DEFAULT 80,
  ALTER COLUMN product_description_prompt SET DEFAULT 'Write a premium, detailed product description inspired by: paragraph explaining the product style, soft fabric, and fit; a "Key Features" bullet list; "Available Colors" list; and "Care Instructions" bullet list.',
  ALTER COLUMN product_description_limit SET DEFAULT 150,
  ALTER COLUMN product_short_prompt SET DEFAULT 'Write a catchy, high-conversion single-line product highlight (maximum 1 line) about the article. Include the focus keyword and make it highly optimized for SEO.',
  ALTER COLUMN product_short_limit SET DEFAULT 20;

-- 3. Update active singleton rows with the updated defaults
UPDATE store_settings
SET
  category_default_template = '<p>Explore our exclusively curated <strong>{{category_name}}</strong> collection — from casual everyday wear to festive outfits. Soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1–14 years.</p>',
  product_default_template = '<p>Give your child a style upgrade with this premium {{product_name}}. Featuring soft premium cotton fabric, comfortable fits, and a modern look — perfect for active boys and girls.</p>\n\n<h3>Key Features</h3>\n<ul>\n  <li><strong>Premium Fabric:</strong> Soft, breathable, and gentle on sensitive skin.</li>\n  <li><strong>Durable Details:</strong> Fade-resistant through regular washing.</li>\n  <li><strong>Relaxed Fit:</strong> Easy movement, designed for everyday play.</li>\n  <li><strong>Easy to Style:</strong> Pairs easily with any outfits.</li>\n</ul>\n\n<h3>Available Colors</h3>\n<p>Classic shades and vibrant patterns</p>\n\n<h3>Care Instructions</h3>\n<ul>\n  <li>Machine wash cold, inside out.</li>\n  <li>Do not iron on print.</li>\n  <li>Air dry or tumble dry low.</li>\n</ul>',
  category_description_prompt = 'Write an engaging category overview inspired by: Explore our exclusively curated collection, featuring soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1-14 years.',
  category_description_limit = 80,
  product_description_prompt = 'Write a premium, detailed product description inspired by: paragraph explaining the product style, soft fabric, and fit; a "Key Features" bullet list; "Available Colors" list; and "Care Instructions" bullet list.',
  product_description_limit = 150,
  product_short_prompt = 'Write a catchy, high-conversion single-line product highlight (maximum 1 line) about the article. Include the focus keyword and make it highly optimized for SEO.',
  product_short_limit = 20
WHERE id = '00000000-0000-4000-8000-000000000001';

UPDATE ai_settings
SET
  category_default_template = '<p>Explore our exclusively curated <strong>{{category_name}}</strong> collection — from casual everyday wear to festive outfits. Soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1–14 years.</p>',
  product_default_template = '<p>Give your child a style upgrade with this premium {{product_name}}. Featuring soft premium cotton fabric, comfortable fits, and a modern look — perfect for active boys and girls.</p>\n\n<h3>Key Features</h3>\n<ul>\n  <li><strong>Premium Fabric:</strong> Soft, breathable, and gentle on sensitive skin.</li>\n  <li><strong>Durable Details:</strong> Fade-resistant through regular washing.</li>\n  <li><strong>Relaxed Fit:</strong> Easy movement, designed for everyday play.</li>\n  <li><strong>Easy to Style:</strong> Pairs easily with any outfits.</li>\n</ul>\n\n<h3>Available Colors</h3>\n<p>Classic shades and vibrant patterns</p>\n\n<h3>Care Instructions</h3>\n<ul>\n  <li>Machine wash cold, inside out.</li>\n  <li>Do not iron on print.</li>\n  <li>Air dry or tumble dry low.</li>\n</ul>',
  category_description_prompt = 'Write an engaging category overview inspired by: Explore our exclusively curated collection, featuring soft fabrics, vibrant prints, and comfortable fits designed for active kids aged 1-14 years.',
  category_description_limit = 80,
  product_description_prompt = 'Write a premium, detailed product description inspired by: paragraph explaining the product style, soft fabric, and fit; a "Key Features" bullet list; "Available Colors" list; and "Care Instructions" bullet list.',
  product_description_limit = 150,
  product_short_prompt = 'Write a catchy, high-conversion single-line product highlight (maximum 1 line) about the article. Include the focus keyword and make it highly optimized for SEO.',
  product_short_limit = 20
WHERE id = '00000000-0000-4000-8000-000000000002';
