-- Add deleted_at column to categories and reviews tables for soft-delete/trash features

-- 1. Add deleted_at to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON public.categories (deleted_at);

-- 2. Add deleted_at to reviews
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_deleted_at ON public.reviews (deleted_at);
