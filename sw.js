// Service Worker for LearnEase
const CACHE_NAME = 'learnease-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/courses.html',
  '/contact.html',
  '/assets/css/style.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/css/themes.css',
  '/assets/js/main.js',
  '/assets/js/components.js',
  '/assets/js/animations.js',
  '/utils/helpers.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
