'use client';

import { useEffect } from 'react';

export default function ChunkErrorListener() {
  useEffect(() => {
    const handleChunkError = (message?: string) => {
      if (!message) return;
      const lower = message.toLowerCase();
      if (
        lower.includes('chunkloaderror') ||
        lower.includes('loading chunk') ||
        lower.includes('failed to fetch dynamically imported module') ||
        lower.includes('load chunk')
      ) {
        console.warn('[ChunkErrorListener] Chunk load error detected! Reloading page to fetch latest build...');
        
        // Use session storage to prevent infinite reloading loop
        const reloadKey = 'last_chunk_error_reload';
        const now = Date.now();
        const lastReload = sessionStorage.getItem(reloadKey);
        
        // Only allow reload if the last one was more than 10 seconds ago
        if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
          sessionStorage.setItem(reloadKey, now.toString());
          window.location.reload();
        }
      }
    };

    const onError = (event: ErrorEvent) => {
      handleChunkError(event.message || event.error?.message || event.error?.toString?.());
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason?.message || reason?.toString?.();
      handleChunkError(message);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}
