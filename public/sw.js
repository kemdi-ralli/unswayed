// public/sw.js
const CACHE_NAME = 'my-app-cache-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/_next/static/*', // Next's static assets will be handled by runtime caching below
  // add other core assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // HTML navigation requests: network-first with offline fallback
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For other requests: cache-first for static assets, network-first for API (example)
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/static/')) {
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, res.clone());
          return res;
        })
      }))
    );
    return;
  }

  // default to network-first
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
