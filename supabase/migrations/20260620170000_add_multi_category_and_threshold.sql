-- 1. Create product_categories junction table
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, category_id)
);

-- 2. Enable RLS on product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 3. Create SELECT and write policies for product_categories
CREATE POLICY "Allow public read access to product_categories"
  ON public.product_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated admin full write access to product_categories"
  ON public.product_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Add inventory_threshold column to products and product_variants tables
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS inventory_threshold INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_threshold INTEGER NOT NULL DEFAULT 0;

-- 5. Enable realtime publication for product_categories
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_categories;
