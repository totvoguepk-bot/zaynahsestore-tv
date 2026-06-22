-- Abandoned Carts Table
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,                      -- localStorage/cookie-based session ID
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'PKR',
  checkout_url TEXT,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  order_placed BOOLEAN DEFAULT false,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  recovered_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session ON abandoned_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(customer_email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_pending ON abandoned_carts(email_sent, order_placed, last_activity);

-- RLS
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert abandoned carts" ON abandoned_carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update abandoned carts" ON abandoned_carts FOR UPDATE USING (true);
CREATE POLICY "Admin read abandoned carts" ON abandoned_carts FOR SELECT USING (true);
CREATE POLICY "Admin delete abandoned carts" ON abandoned_carts FOR DELETE USING (auth.role() = 'authenticated');

-- Enable realtime for orders (if not already)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
