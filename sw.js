const CACHE_NAME = 'kabayan-dxb-v3';
const ASSETS = [
  './',
  'index.html',
  'offline.html',
  'manifest.webmanifest',
  'css/styles.css',
  'js/app.js',
  'js/currency.js',
  'js/routes.js',
  'favicon.svg',
  'favicon.ico',
  'apple-touch-icon.png',
  'og-image.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const netFetch = fetch(e.request).then(res => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => null);

      return cached || netFetch.then(res => {
        return res || (e.request.mode === 'navigate' ? caches.match('offline.html') : Response.error());
      });
    })
  );
});
