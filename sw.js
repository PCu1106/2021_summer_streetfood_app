const staticCacheName = 'site-static-v1';
const dynamicCache = 'site-dynamic-v1';
const assets = ['/', '/templates/dist/homepage.html', '/static/js/app.js',
    '/static/js/homepage.js', '/static/js/dist/homepage.dev.js', '/static/sass/dist/homepage.css', '/static/sass/homepage.sass',
    '/static/file/camera.png', '/static/file/cross-icon.png', '/static/file/favorite.png', '/static/file/history.png',
    '/static/file/previous-icon-b.png', '/static/file/previous-icon-w.png'];

self.addEventListener('install', evt => {
    //console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});
self.addEventListener('activate', evt => {
    //console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCache)
                .map(key => caches.delete(key))
            )
        })
    );
});
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    /*
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
    );*/
});