import { NextRequest, NextResponse } from 'next/server';
import { getAISettings } from '@/lib/aiEngine';
import { routeVision, extractKeys } from '@/lib/ai/router';

export const runtime = 'nodejs';

/**
 * POST /api/ai/vision
 * Accept: { image: string (URL), prompt?: string, provider?: string }
 * Returns: { result, provider, model }
 */
export async function POST(req: NextRequest) {
  try {
    const { image, prompt, provider: forcedProvider } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const settings = await getAISettings();
    const keys = extractKeys(settings);

    const systemPrompt = `You are an expert Image SEO optimizer. Analyze the provided image and generate relevant SEO tags. Return ONLY a valid JSON object matching the requested schema. Do not include markdown code block wrappers or extra text.`;

    const userPrompt = prompt || `Analyze this image and return ONLY this JSON schema:
{
  "alt_text": "Highly descriptive, SEO-friendly ALT text focusing on clothing attributes, material, and color.",
  "seo_filename": "hyphen-separated-lowercase-filename.webp",
  "title": "Clean, descriptive title for the image.",
  "description": "A 100-150 words detailed description of what is visible in the image.",
  "caption": "A short, engaging caption for the image."
}`;

    // If a specific provider is forced, use only that one
    if (forcedProvider && keys.vision[forcedProvider]) {
      const result = await routeVision(userPrompt, systemPrompt, image, {
        [forcedProvider]: keys.vision[forcedProvider],
      });
      return NextResponse.json(result);
    }

    // Otherwise use full fallback chain
    const result = await routeVision(userPrompt, systemPrompt, image, keys.vision);
    if (!result) {
      return NextResponse.json({ error: 'All vision providers failed' }, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Vision API]', err);
    return NextResponse.json(
      { error: err.message || 'Vision analysis failed' },
      { status: err.status || 500 },
    );
  }
}
