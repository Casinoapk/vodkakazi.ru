const CACHE_NAME = 'cache-v1';

const baseUrlsToCache = [
  '/icon/index.html',
  '/icon/logo192.png',
  '/icon/logo512.png'
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
    'https://vodka-kaz.ru/index.html'
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

