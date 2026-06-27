export const OPENROUTER_FREE_TEXT = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-4-maverick:free',
  'meta-llama/llama-4-scout:free',
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat:free',
  'qwen/qwen3-235b-a22b:free',
] as const;

export const OPENROUTER_FREE_VISION = [
  'google/gemini-2.5-flash-preview:free',
  'meta-llama/llama-4-maverick:free',
  'meta-llama/llama-4-scout:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'qwen/qwen2.5-vl-7b-instruct:free',
  'microsoft/phi-4-multimodal-instruct:free',
] as const;

export async function callOpenRouter(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt: string,
  isVision: boolean,
  base64Data?: string,
  mimeType?: string,
): Promise<string> {
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  let userContent: any = prompt;
  if (isVision && base64Data) {
    userContent = [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: `data:${mimeType || 'image/webp'};base64,${base64Data}` } },
    ];
  }

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
      'X-Title': process.env.NEXT_PUBLIC_BRAND_NAME || 'Store',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`OpenRouter API error ${res.status}`);
    (err as any).status = res.status;
    throw err;
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from OpenRouter API');
  return text;
}
