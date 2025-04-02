const CACHE_NAME = 'farmsync-offline-v1';
const urlsToCache = [
    'farmer_dashboard.html',
    'css/app.css',
    'js/dashboard.js',
    'js/profile.js',
    'js/orders.js',
    'js/inventory.js',
    'js/offline-storage.js',
    'js/charts.js',
    'js/app.js',
    'img/icons/icon-48x48.png',
    'img/icons/icon-72x72.png',
    'img/icons/icon-96x96.png',
    'img/icons/icon-144x144.png',
    'img/icons/icon-192x192.png',
    'img/icons/icon-384x384.png',
    'img/icons/icon-512x512.png',
    'profile.html',
    'orders.html',
    'inventory.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 