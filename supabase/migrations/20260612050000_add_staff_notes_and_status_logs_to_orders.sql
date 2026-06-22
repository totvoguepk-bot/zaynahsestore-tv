-- Add staff_notes and status_logs to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS staff_notes TEXT,
ADD COLUMN IF NOT EXISTS status_logs JSONB DEFAULT '[]'::jsonb;
