const CACHE_NAME = 'my-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const urlsToCache = [
  '/styles.min.css',
  '/',
  '/index.html',
  '/script.js',
  '/favicon.ico',
  '/favicon.svg',
  '/icon/logo192.png',
  '/icon/logo512.png',
  '/404.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
