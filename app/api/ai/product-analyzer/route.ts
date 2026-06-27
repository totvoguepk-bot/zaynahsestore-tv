import { NextRequest, NextResponse } from 'next/server';
import { getAISettings } from '@/lib/aiEngine';
import { routeVision, extractKeys } from '@/lib/ai/router';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const ANALYSIS_PROMPT = `Analyze this kids clothing product image. Return ONLY this JSON schema (no markdown, no code blocks):
{
  "title": "Product title (max 60 chars, SEO-optimized)",
  "description": "Product description (100-150 words, for SEO meta description and product page)",
  "category": "Best matching category name (e.g., T-Shirts, Dresses, Shoes, Accessories)",
  "colors": ["list", "of", "detected", "colors"],
  "sizes": ["list", "of", "likely", "sizes"],
  "seo_keywords": ["5-10", "relevant", "SEO", "keywords"],
  "style": "e.g., Casual, Formal, Party Wear, Sportswear",
  "material": "Detected or likely fabric/material",
  "gender": "Boys, Girls, Unisex"
}`;

/**
 * POST /api/ai/product-analyzer
 * Accept: { imageUrl: string, productType?: string }
 * Returns: { result: {...analysis}, provider, model }
 */
export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const settings = await getAISettings();

    if (!settings.ai_enabled) {
      return NextResponse.json({ error: 'AI features are disabled' }, { status: 403 });
    }

    const keys = extractKeys(settings);
    const systemPrompt = `You are an expert kids clothing product analyzer. Extract detailed product information from images. Return ONLY valid JSON.`;

    const result = await routeVision(
      ANALYSIS_PROMPT,
      systemPrompt,
      imageUrl,
      keys.vision,
    );

    if (!result) {
      return NextResponse.json({ error: 'All vision providers failed' }, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Product Analyzer]', err);
    return NextResponse.json(
      { error: err.message || 'Product analysis failed' },
      { status: err.status || 500 },
    );
  }
}
