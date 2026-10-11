// Alterjot Service Worker — Offline Studio & Progressive Web App
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `alterjot-static-${CACHE_VERSION}`;
const FONTS_CACHE = `alterjot-fonts-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `alterjot-dynamic-${CACHE_VERSION}`;

// Precache essential application shell assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/apple-touch-icon.png',
  '/favicon.svg',
];

// Installation: Precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[Alterjot SW] Precache partial error (ignored):', err);
      }
      return self.skipWaiting();
    })
  );
});

// Activation: Clean up older cache versions
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, FONTS_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log('[Alterjot SW] Removing stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message listener for skipWaiting trigger
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch interception strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. Google Fonts & Fonts CDN caching (Cache-First)
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONTS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 3. API Requests: Network-First with graceful offline fallback
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).catch(async () => {
        // Return offline status object
        return new Response(
          JSON.stringify({
            offline: true,
            status: 'offline',
            message: 'You are currently working in offline mode. Changes will sync when reconnected.',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      })
    );
    return;
  }

  // 4. HTML Navigation Requests (mode: 'navigate'): Network-First -> Cache Fallback ('/')
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 5. Static Assets (JS, CSS, images, icons): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      // Return cached immediately if available, else await network
      return cachedResponse || fetchPromise;
    })
  );
});
