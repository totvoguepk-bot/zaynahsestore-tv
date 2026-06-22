-- Create size_guides table
CREATE TABLE IF NOT EXISTS size_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  chart_data JSONB NOT NULL DEFAULT '[]',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE size_guides ENABLE ROW LEVEL SECURITY;

-- Policies for size_guides
CREATE POLICY "Public read size guides" ON size_guides FOR SELECT USING (true);
CREATE POLICY "Admin all size guides" ON size_guides FOR ALL USING (auth.role() = 'authenticated');

-- Add size_guide_id to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_guide_id UUID REFERENCES size_guides(id) ON DELETE SET NULL;
