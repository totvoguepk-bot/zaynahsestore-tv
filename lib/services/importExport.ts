import { ExportBundle } from '@/lib/types';

/**
 * Initiates product export for the selected product IDs.
 * Returns the self-contained export bundle.
 */
export const exportProducts = async (productIds: string[]): Promise<ExportBundle> => {
  const res = await fetch('/api/products/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Export API request failed: ${res.statusText}`);
  }

  return res.json();
};

/**
 * Uploads export bundle file and processes streaming progress updates line-by-line.
 */
export const importProductsStream = async (
  file: File,
  strategy: 'skip' | 'overwrite' | 'rename',
  onProgress: (progress: any) => void
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('strategy', strategy);

  const res = await fetch('/api/products/import', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Import API request failed: ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Readable stream response not supported by browser.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Keep the last potentially incomplete chunk
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          onProgress(parsed);
        } catch (err) {
          console.warn('[Import Service] Failed to parse stream line:', line, err);
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        onProgress(parsed);
      } catch (err) {
        console.warn('[Import Service] Failed to parse final stream line:', buffer, err);
      }
    }
  } finally {
    reader.releaseLock();
  }
};
