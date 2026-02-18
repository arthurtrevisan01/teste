/* ==========================================
   HYPERSCIENCE — SERVICE WORKER v3.0
   Cache-first para assets estáticos,
   network-first para fontes externas.
   ========================================== */

const CACHE_NAME    = 'hyperscience-v3';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// ---- INSTALL: Pre-cache assets estáticos ----
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// ---- ACTIVATE: Remove caches antigos ----
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// ---- FETCH: Estratégia por tipo de recurso ----
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignora requisições não-GET
    if (request.method !== 'GET') return;

    // Ignora extensões do browser e chrome-extension
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Fontes Google: Cache-first com fallback de rede
    if (url.hostname.includes('fonts.')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(request).then(cached => {
                    if (cached) return cached;
                    return fetch(request).then(response => {
                        if (response && response.status === 200) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    }).catch(() => cached); // Fallback se offline
                })
            )
        );
        return;
    }

    // Assets estáticos próprios: Cache-first
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(response => {
                    if (response && response.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, response.clone());
                        });
                    }
                    return response;
                }).catch(() => {
                    // Fallback para index.html em rotas não encontradas
                    if (request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
            })
        );
        return;
    }

    // CDN externas (tailwind, etc): Network-first
    event.respondWith(
        fetch(request).then(response => {
            if (response && response.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, response.clone());
                });
            }
            return response;
        }).catch(() => caches.match(request))
    );
});
