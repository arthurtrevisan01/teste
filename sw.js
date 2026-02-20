const CACHE_NAME = "hypergym-v3";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles/main.css",
        "/src/app.js",
        "/src/state.js",
        "/src/storage.js",
        "/src/workoutController.js",
        "/src/analysis.js",
        "/src/ui.js"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
