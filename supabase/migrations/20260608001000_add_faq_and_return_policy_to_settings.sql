-- Migration to add FAQ and Return/Exchange policy columns to store_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS faq_content TEXT DEFAULT '<h3>Frequently Asked Questions</h3><p>Add your store FAQs here. You can edit this content in the Admin Settings panel.</p>',
ADD COLUMN IF NOT EXISTS return_policy_content TEXT DEFAULT '<h3>Return & Exchange Policy</h3><p>Add your store Return & Exchange policy here. You can edit this content in the Admin Settings panel.</p>';
