-- Migration: Add ai_usage table for rate limit tracking
-- Date: 2026-06-28

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  date DATE NOT NULL,
  req_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider, date)
);

-- Index for quick lookups per provider+date
CREATE INDEX IF NOT EXISTS idx_ai_usage_provider_date ON public.ai_usage(provider, date);

-- RPC to increment usage atomically (upsert pattern)
CREATE OR REPLACE FUNCTION public.increment_ai_usage(
  p_provider TEXT,
  p_date DATE,
  p_tokens INTEGER DEFAULT 0
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.ai_usage (provider, date, req_count, token_count)
  VALUES (p_provider, p_date, 1, p_tokens)
  ON CONFLICT (provider, date)
  DO UPDATE SET
    req_count = ai_usage.req_count + 1,
    token_count = ai_usage.token_count + p_tokens,
    updated_at = now();
END;
$$;

-- Enable RLS but allow all access via service_role (admin bypass)
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access
CREATE POLICY "service_role_all_ai_usage"
  ON public.ai_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "authenticated_read_ai_usage"
  ON public.ai_usage
  FOR SELECT
  TO authenticated
  USING (true);
