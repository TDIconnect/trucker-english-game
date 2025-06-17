
const CACHE_NAME = 'trucker-english-cache-v2';
const urlsToCache = [
  '/trucker-english-game/index.html',
  '/trucker-english-game/game.js',
  '/trucker-english-game/questions.json',
  '/trucker-english-game/manifest.json',
  '/trucker-english-game/icon-192.png',
  '/trucker-english-game/icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
