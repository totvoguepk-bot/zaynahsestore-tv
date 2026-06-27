export const GOOGLE_MODELS = {
  text: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'],
  vision: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'],
} as const;

export const GOOGLE_FREE_LIMITS = {
  'gemini-2.5-flash': { reqPerDay: 1500, rpm: 15 },
  'gemini-2.5-pro': { reqPerDay: 100, rpm: 5 },
  'gemini-2.5-flash-lite': { reqPerDay: 4000, rpm: 30 },
};

export async function callGoogle(
  apiKey: string,
  model: string,
  prompt: string,
  systemPrompt: string,
  isVision: boolean,
  base64Data?: string,
  mimeType?: string,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const parts: any[] = [];
  if (isVision && base64Data) {
    parts.push({ inlineData: { mimeType: mimeType || 'image/webp', data: base64Data } });
  }
  parts.push({ text: prompt });

  const body = {
    contents: [{ role: 'user', parts }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: 'application/json' },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`Google API error ${res.status}`);
    (err as any).status = res.status;
    throw err;
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Google Gemini API');
  return text;
}
