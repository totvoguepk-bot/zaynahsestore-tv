export const GROQ_TEXT_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
] as const;

export const GROQ_VISION_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'llama-3.2-11b-vision-preview',
  'llama-3.2-90b-vision-preview',
] as const;

export const GROQ_FREE_LIMITS = {
  reqPerDay: 14400,
  tpm: 30000,
};

export async function callGroq(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt: string,
  isVision: boolean,
  base64Data?: string,
  mimeType?: string,
): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

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
    const err = new Error(`Groq API error ${res.status}`);
    (err as any).status = res.status;
    throw err;
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq API');
  return text;
}
