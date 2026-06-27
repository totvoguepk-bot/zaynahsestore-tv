import { NextRequest, NextResponse } from 'next/server';
import { getAISettings } from '@/lib/aiEngine';
import { routeText, extractKeys } from '@/lib/ai/router';

export const runtime = 'nodejs';

/**
 * POST /api/ai/text
 * Accept: { prompt: string, systemPrompt?: string, provider?: string }
 * Returns: { result, provider, model }
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, systemPrompt: customSystemPrompt, provider: forcedProvider } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const settings = await getAISettings();
    const keys = extractKeys(settings);

    const systemPrompt = customSystemPrompt || `You are an expert e-commerce SEO content writer for kids clothing. Return ONLY valid JSON.`;

    if (forcedProvider && keys.text[forcedProvider]) {
      const result = await routeText(prompt, systemPrompt, {
        [forcedProvider]: keys.text[forcedProvider],
      });
      return NextResponse.json(result);
    }

    const result = await routeText(prompt, systemPrompt, keys.text);
    if (!result) {
      return NextResponse.json({ error: 'All text providers failed' }, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Text API]', err);
    return NextResponse.json(
      { error: err.message || 'Text generation failed' },
      { status: err.status || 500 },
    );
  }
}
