-- Add reset_token and reset_token_expires_at to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS reset_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;
