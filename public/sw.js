const CACHE_NAME = 'zaynahs-estore-v4';

const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE_ASSETS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

function isRscRequest(url) {
  return (
    url.searchParams.has('_rsc') ||
    url.searchParams.has('__nextjs') ||
    url.pathname.startsWith('/_next/data/')
  );
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isAdminRequest(url) {
  return url.pathname.startsWith('/admin');
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/mp3/') ||
    url.pathname.startsWith('/audio/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname === '/manifest.json'
  );
}

function hasCacheableContentType(response) {
  const ct = response.headers.get('content-type') || '';
  return (
    ct.includes('text/html') ||
    ct.includes('text/css') ||
    ct.includes('application/javascript') ||
    ct.includes('application/x-javascript') ||
    ct.includes('image/') ||
    ct.includes('font/') ||
    ct.includes('audio/') ||
    ct.includes('text/plain')
  );
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (
    e.request.method !== 'GET' ||
    !url.protocol.startsWith('http') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  if (isRscRequest(url) || isApiRequest(url) || isAdminRequest(url)) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  if (isStaticAsset(url)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return response;
        }).catch(() => {
          return caches.match(e.request).then((fallback) => fallback || new Response('', { status: 503 }));
        });
      })
    );
    return;
  }

  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).then((response) => {
      if (
        response &&
        response.status === 200 &&
        response.type === 'basic' &&
        e.request.mode === 'navigate' &&
        hasCacheableContentType(response)
      ) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(e.request).then((cached) => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('', { status: 503 });
      });
    })
  );
});
