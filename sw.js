const CACHE_NAME = 'cache-v1';

const baseUrlsToCache = [
  '/icon/index.html',
  '/icon',
  '/cache/vodkabet-logo.webp',
  '/cache/1.html',
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
  '/cache/vodka.html',
  '/cache/vodka.js',
  'https://6317f0cd.cache-3iw.pages.dev/vodkabet-logo.webp',
  'https://6317f0cd.cache-3iw.pages.dev/1.html',
  'https://6317f0cd.cache-3iw.pages.dev/kaz-vodka.css',
  'https://6317f0cd.cache-3iw.pages.dev/license.html',
  'https://6317f0cd.cache-3iw.pages.dev/license.js',
  'https://6317f0cd.cache-3iw.pages.dev/nicepage-site.css',
  'https://6317f0cd.cache-3iw.pages.dev/nicepage.css',
  'https://6317f0cd.cache-3iw.pages.dev/otvet.html',
  'https://6317f0cd.cache-3iw.pages.dev/otvet.js',
  'https://6317f0cd.cache-3iw.pages.dev/partner-program.html',
  'https://6317f0cd.cache-3iw.pages.dev/partner-program.js',
  'https://6317f0cd.cache-3iw.pages.dev/police.html',
  'https://6317f0cd.cache-3iw.pages.dev/police.js',
  'https://6317f0cd.cache-3iw.pages.dev/project_structure.txt',
  'https://6317f0cd.cache-3iw.pages.dev/ru.html',
  'https://6317f0cd.cache-3iw.pages.dev/vodka.html',
  'https://6317f0cd.cache-3iw.pages.dev/vodka.js'
];

async function getAllFilesInDirectory(directory) {
  const response = await fetch(directory);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = Array.from(doc.querySelectorAll('a[href]'))
    .map(a => a.getAttribute('href'))
    .filter(href => !href.endsWith('/') && !href.includes('?') && !href.startsWith('http'));
  return links.map(file => `${directory}${file}`);
}

async function getUrlsToCache() {
  let urls = [...baseUrlsToCache];

  const subdirectories = [
    '/cache/assets/',
    '/cache/en/',
    '/cache/images/',
    '/cache/vodka-casino.ru/link/',
    'https://6317f0cd.cache-3iw.pages.dev/assets/',
    'https://6317f0cd.cache-3iw.pages.dev/en/',
    'https://6317f0cd.cache-3iw.pages.dev/images/',
    'https://6317f0cd.cache-3iw.pages.dev/vodka-casino.ru/link/'
  ];

  for (const dir of subdirectories) {
    try {
      const files = await getAllFilesInDirectory(dir);
      urls = [...urls, ...files];
    } catch (e) {
      console.warn(`Не удалось получить файлы из ${dir}:`, e);
    }
  }

  return urls;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    getUrlsToCache().then((urlsToCache) => {
      return caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
