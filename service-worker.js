const CACHE_NAME = 'hyperscience-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(fetchResp => {
      if(!fetchResp || fetchResp.status !== 200 || fetchResp.type !== 'basic') return fetchResp;
      const responseToCache = fetchResp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
      return fetchResp;
    }))
  );
});
