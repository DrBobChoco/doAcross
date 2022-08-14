const cacheName = 'doAcross-v0.1';
const filesToCache = [
    './',
    './index.html',
    './global.css',
    './favicon.png',
    './build/bundle.js',
    './build/bundle.css',
    './images/icon-512.png',
    './images/icon-32.png',
];

self.addEventListener('install', (ev) => {
    //console.log('Service worker install');

    self.skipWaiting();

    ev.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(filesToCache);
    })());
});

self.addEventListener('activate', (ev) => {
    //console.log('Service worker activate');

    ev.waitUntil((async () => {
        const cacheKeys = await caches.keys();
        cacheKeys.forEach(async (key) => {
            if(key !== cacheName) {
                await caches.delete(key);
            }
        });

        clients.claim();
    })());
});

self.addEventListener('fetch', (ev) => {
    //console.log('Service worker fetch');

    ev.respondWith((async () => {
        const cacheResp = await caches.match(ev.request);
        if(cacheResp) {
            return cacheResp;
        }

        const netResp = await fetch(ev.request);
        const cache = await caches.open(cacheName);
        cache.put(ev.request, netResp.clone());
        return netResp;
    })());
});
