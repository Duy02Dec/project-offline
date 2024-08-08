const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',  // Trang chính
    '/styles.css',   // Tệp CSS
    '/app.js',       // Tệp JavaScript
    '/fallback.html' // Trang dự phòng khi offline
];

// Cài đặt Service Worker và lưu trữ các tài nguyên vào cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
        .catch(error => {
            console.error('Failed to cache resources:', error);
        })
    );
});

// Xử lý các yêu cầu và trả về từ cache nếu có, nếu không thì từ mạng
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Nếu tài nguyên có trong cache, trả về từ cache
            if (response) {
                return response;
            }
            // Nếu tài nguyên không có trong cache, lấy từ mạng
            return fetch(event.request)
                .catch(() => {
                    // Nếu mạng không khả dụng và yêu cầu là điều hướng, trả về trang dự phòng
                    if (event.request.mode === 'navigate') {
                        return caches.match('/fallback.html');
                    }
                });
        })
        .catch(error => {
            console.error('Failed to fetch resource:', error);
        })
    );
});
