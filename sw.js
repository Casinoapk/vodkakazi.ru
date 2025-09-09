const CACHE_NAME = 'vodka-kaz-cache-v1';
const urlsToCache = [
  // Корневые файлы
  '/cache/vodkabet-logo.webp',
  '/cache/kaz-vodka.css',
  '/cache/license.html',
  '/cache/license.js',
  '/cache/nicepage-site.css',
  '/cache/nicepage.css',
  '/cache/otvet.html',
  '/cache/otvet.js',
  '/cache/partner-program.html',
  '/cache/partner-program.js',
  '/cache/police.html',
  '/cache/police.js',
  '/cache/project_structure.txt',
  '/cache/ru.html',

  // Файлы из assets
  '/cache/assets/jquery-3.5.1.min.js',

  // Файлы из en
  '/cache/en/google9f68414e76f600be.html',
  '/cache/en/index.html',

  // Файлы из images (только перечисленные)
  '/cache/images/cropped-vodkabet-logo-180x180.webp',
  '/cache/images/cropped-vodkabet-logo-192x192.webp',
  '/cache/images/cropped-vodkabet-logo-32x32.webp',
  '/cache/images/instagram.png',
  '/cache/images/telegram-icon.png',
  '/cache/images/twitter.png',
  '/cache/images/vodka-bet.svg',
  '/cache/images/vodka-bet64.webp',
  '/cache/images/vodka-bet82.webp',
  '/cache/images/vodka-bet96.webp',
  '/cache/images/vodka-logg.webp',
  '/cache/images/vodka.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});