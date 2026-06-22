-- 1. Add deleted_at column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create index for performance on deleted_at checks
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON public.products (deleted_at);

-- 3. Enable pg_cron extension if not enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 4. Unschedule if already scheduled to prevent duplicates, then reschedule daily 1-month purge
SELECT cron.unschedule('purge-deleted-products-30-days')
FROM cron.job
WHERE jobname = 'purge-deleted-products-30-days';

SELECT cron.schedule(
  'purge-deleted-products-30-days',
  '0 0 * * *', -- every day at midnight
  $$ DELETE FROM public.products WHERE deleted_at < NOW() - INTERVAL '1 month' $$
);
