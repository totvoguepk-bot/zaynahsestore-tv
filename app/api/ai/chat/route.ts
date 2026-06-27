import { NextRequest, NextResponse } from 'next/server';
import { getAISettings } from '@/lib/aiEngine';
import { routeText, extractKeys } from '@/lib/ai/router';

export const runtime = 'nodejs';

/**
 * POST /api/ai/chat
 * Accept: { messages: array, provider?: string }
 * messages: [{ role: 'user'|'assistant'|'system', content: string }]
 * Returns: { result, provider, model }
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, provider: forcedProvider } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const settings = await getAISettings();
    const keys = extractKeys(settings);

    // Build prompt from message history
    const systemMsg = messages.find((m: any) => m.role === 'system');
    const historyMsgs = messages.filter((m: any) => m.role !== 'system');
    const conversation = historyMsgs.map((m: any) => `${m.role}: ${m.content}`).join('\n');
    const prompt = conversation;
    const systemPrompt = systemMsg?.content || 'You are a helpful e-commerce assistant.';

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
    console.error('[Chat API]', err);
    return NextResponse.json(
      { error: err.message || 'Chat failed' },
      { status: err.status || 500 },
    );
  }
}
