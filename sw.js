const staticCacheName = 'site-static';
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
});
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});