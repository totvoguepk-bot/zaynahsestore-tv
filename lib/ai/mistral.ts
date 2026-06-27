export const MISTRAL_VISION_MODELS = [
  'mistral-small-2506',
  'ministral-3b-2512',
  'ministral-8b-2512',
  'ministral-14b-2512',
  'mistral-large-2512',
  'mistral-medium-2508',
] as const;

export const MISTRAL_TEXT_MODELS = [
  'open-mistral-nemo',
  'devstral-2512',
  'magistral-medium-2509',
  'magistral-small-2509',
] as const;

export const MISTRAL_FREE_LIMITS = {
  tokensPerMonth: 1_000_000_000,
  tpm: 2_250_000,
};

export async function callMistral(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt: string,
  isVision: boolean,
  base64Data?: string,
  mimeType?: string,
): Promise<string> {
  const url = 'https://api.mistral.ai/v1/chat/completions';

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
    max_tokens: 8000,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`Mistral API error ${res.status}`);
    (err as any).status = res.status;
    throw err;
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Mistral API');
  return text;
}
