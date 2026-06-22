-- ============================================================
-- ADD SHIPPING AND PAYMENT METHODS TABLES
-- ============================================================

-- 1. Create shipping_methods Table
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  estimated_days TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create payment_methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
DROP POLICY IF EXISTS "Public read shipping_methods" ON shipping_methods;
CREATE POLICY "Public read shipping_methods" ON shipping_methods
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admin all shipping_methods" ON shipping_methods;
CREATE POLICY "Admin all shipping_methods" ON shipping_methods
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read payment_methods" ON payment_methods;
CREATE POLICY "Public read payment_methods" ON payment_methods
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admin all payment_methods" ON payment_methods;
CREATE POLICY "Admin all payment_methods" ON payment_methods
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. Insert Default Records
INSERT INTO shipping_methods (name, cost, estimated_days, active) VALUES
('Standard Delivery', 200.00, '3-5 business days', true),
('Express Delivery', 500.00, '1-2 business days', true)
ON CONFLICT DO NOTHING;

INSERT INTO payment_methods (name, code, active) VALUES
('Visa', 'visa', true),
('MasterCard', 'mastercard', true),
('Cash on Delivery', 'cod', true),
('EasyPaisa', 'easypaisa', true),
('JazzCash', 'jazzcash', true),
('Bank Transfer', 'banktransfer', true)
ON CONFLICT DO NOTHING;
