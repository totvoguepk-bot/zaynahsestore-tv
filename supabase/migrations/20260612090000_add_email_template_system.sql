-- Migration: Add Email Template System & Orders Columns
-- Date: 2026-06-12 18:50:00

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'customer' | 'admin'
  label TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  subject TEXT NOT NULL,
  custom_html TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed all 18 email types
INSERT INTO email_templates (email_type, category, label, description, subject) VALUES
('welcome', 'customer', 'Welcome Email', 'Sent when customer registers', 'Welcome to {{brand_name}}!'),
('password_reset', 'customer', 'Password Reset', 'Sent on forgot password request', 'Reset your {{brand_name}} password'),
('password_changed', 'customer', 'Password Changed', 'Sent after password change confirmation', 'Your password was changed'),
('order_placed', 'customer', 'Order Placed', 'Sent when order is placed', 'Order Confirmation #{{order_id}}'),
('order_confirmed', 'customer', 'Order Confirmed', 'Sent when admin confirms order', 'Your order #{{order_id}} is confirmed'),
('order_processing', 'customer', 'Order Processing', 'Sent when order is being prepared', 'Your order #{{order_id}} is being prepared'),
('order_shipped', 'customer', 'Order Shipped', 'Sent when order ships', 'Your order #{{order_id}} has shipped!'),
('order_out_for_delivery', 'customer', 'Out For Delivery', 'Sent when courier picks up for delivery', 'Your order #{{order_id}} is out for delivery'),
('order_delivered', 'customer', 'Order Delivered', 'Sent when order is successfully delivered', 'Your order #{{order_id}} has been delivered'),
('order_cancelled', 'customer', 'Order Cancelled', 'Sent when order is cancelled', 'Your order #{{order_id}} was cancelled'),
('order_refunded', 'customer', 'Order Refunded', 'Sent when refund is processed', 'Refund processed for order #{{order_id}}'),
('review_request', 'customer', 'Review Request', 'Sent 3 days after delivery', 'How was your order from {{brand_name}}?'),
('admin_new_order', 'admin', 'New Order Alert', 'Sent to admin on new order', 'New Order #{{order_id}} - {{order_total}}'),
('admin_order_cancelled', 'admin', 'Order Cancelled Alert', 'Sent to admin when order is cancelled', 'Order #{{order_id}} was cancelled'),
('admin_low_stock', 'admin', 'Low Stock Alert', 'Sent when stock level drops below threshold', 'Low Stock: {{product_name}}'),
('admin_new_customer', 'admin', 'New Customer Alert', 'Sent on new customer registration', 'New customer: {{customer_name}}'),
('admin_new_review', 'admin', 'New Review Alert', 'Sent on new product review', 'New review on {{product_name}}'),
('admin_contact_form', 'admin', 'Contact Form Alert', 'Sent on contact form submission', 'Contact Form: {{contact_subject}}')
ON CONFLICT (email_type) DO UPDATE SET
  category = EXCLUDED.category,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  subject = EXCLUDED.subject;

-- Add columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS review_email_pending BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,2);
