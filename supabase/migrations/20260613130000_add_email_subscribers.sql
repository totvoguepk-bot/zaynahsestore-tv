-- ============================================================
-- EMAIL SUBSCRIBERS (Newsletter footer form)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'newsletter',   -- 'newsletter' | 'footer'
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers (email);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Public insert (any visitor can subscribe)
DROP POLICY IF EXISTS "Public insert email subscribers" ON email_subscribers;
CREATE POLICY "Public insert email subscribers" ON email_subscribers
  FOR INSERT WITH CHECK (true);

-- Admin full access
DROP POLICY IF EXISTS "Admin all email subscribers" ON email_subscribers;
CREATE POLICY "Admin all email subscribers" ON email_subscribers
  FOR ALL USING (auth.role() = 'authenticated');
