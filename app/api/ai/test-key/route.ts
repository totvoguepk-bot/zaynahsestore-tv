import { NextResponse } from 'next/server';

const PROVIDER_ENDPOINTS: Record<string, { url: string; headers: Record<string, string>; method?: string; body?: any }> = {
  groq: { url: 'https://api.groq.com/openai/v1/models', headers: {} },
  gemini: { url: 'https://generativelanguage.googleapis.com/v1beta/models', headers: {} },
  openai: { url: 'https://api.openai.com/v1/models', headers: {} },
  anthropic: { url: 'https://api.anthropic.com/v1/messages', headers: { 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' }, method: 'POST', body: { model: 'claude-3-haiku-20240307', max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] } },
  deepseek: { url: 'https://api.deepseek.com/v1/models', headers: {} },
  mistral: { url: 'https://api.mistral.ai/v1/models', headers: {} },
  together: { url: 'https://api.together.xyz/v1/models', headers: {} },
  fireworks: { url: 'https://api.fireworks.ai/inference/v1/models', headers: {} },
  openrouter: { url: 'https://openrouter.ai/api/v1/models', headers: {} },
  cerebras: { url: 'https://api.cerebras.ai/v1/models', headers: {} },
  nvidia: { url: 'https://integrate.api.nvidia.com/v1/models', headers: {} },
  siliconflow: { url: 'https://api.siliconflow.cn/v1/models', headers: {} },
  kimi: { url: 'https://api.moonshot.cn/v1/models', headers: {} },
  qwen: { url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/models', headers: {} },
  cloudflare: { url: 'https://api.cloudflare.com/client/v4/accounts/', headers: {} },
  minimax: { url: 'https://api.minimax.chat/v1/models', headers: {} },
};

export async function POST(request: Request) {
  try {
    const { provider, apiKey, section } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json({ valid: false, error: 'Missing provider or apiKey' }, { status: 400 });
    }

    const prov = provider.toLowerCase();
    const cfg = PROVIDER_ENDPOINTS[prov];
    if (!cfg) {
      return NextResponse.json({ valid: false, error: `Unknown provider: ${prov}` }, { status: 400 });
    }

    let url = cfg.url;
    const headers: Record<string, string> = { ...cfg.headers };

    if (prov === 'gemini') {
      url = `${url}?key=${apiKey}`;
    } else if (prov === 'cloudflare') {
      const accountId = process.env.CF_ACCOUNT_ID || apiKey.split(':')[0];
      url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search?per_page=1`;
      headers['Authorization'] = `Bearer ${apiKey.includes(':') ? apiKey.split(':')[1] : apiKey}`;
    } else if (prov === 'anthropic') {
      headers['x-api-key'] = apiKey;
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: cfg.method || 'GET',
      headers,
      body: cfg.body ? JSON.stringify(cfg.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      return NextResponse.json({ valid: true });
    }

    let errorText = '';
    try { errorText = (await response.text()).slice(0, 200); } catch {}
    return NextResponse.json({
      valid: false,
      error: `API returned ${response.status}: ${errorText || response.statusText}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      error: error.name === 'AbortError' ? 'Request timed out (10s)' : error.message,
    });
  }
}
