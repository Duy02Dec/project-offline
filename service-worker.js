const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
        .catch(error => {
            console.error('Failed to cache resources:', error);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(() => {
                // Tùy chọn: trả về một tài nguyên dự phòng nếu cả cache và mạng đều không thành công
                return new Response('Offline page', {
                    headers: { 'Content-Type': 'text/html' }
                });
            });
        })
        .catch(error => {
            console.error('Failed to fetch resource:', error);
        })
    );
});
