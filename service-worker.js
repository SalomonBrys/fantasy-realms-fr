var APP_PREFIX = 'fantasy-realms-fr-';
var VERSION = '1.0';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  '/fantasy-realms-fr/',
  '/fantasy-realms-fr/index.html',
  '/fantasy-realms-fr/manifest.json',
  '/fantasy-realms-fr/favicon.ico',
  '/fantasy-realms-fr/img/fantasy-realms.jpg',
  '/fantasy-realms-fr/css/style.css',
  '/fantasy-realms-fr/css/bootstrap-grid.min.css',
  '/fantasy-realms-fr/css/bootstrap-reboot.min.css',
  '/fantasy-realms-fr/css/bootstrap.min.css',
  '/fantasy-realms-fr/service-worker.js',
  '/fantasy-realms-fr/js/app.js',
  '/fantasy-realms-fr/js/deck.js',
  '/fantasy-realms-fr/js/hand.js',
  '/fantasy-realms-fr/js/bootstrap.min.js',
  '/fantasy-realms-fr/js/handlebars-v4.0.10.js',
  '/fantasy-realms-fr/js/jquery-3.2.1.min.js',
  '/fantasy-realms-fr/sound/clear.mp3',
  '/fantasy-realms-fr/sound/click.mp3',
  '/fantasy-realms-fr/sound/magic.mp3',
  '/fantasy-realms-fr/sound/swoosh.mp3',
  '/fantasy-realms-fr/browserconfig.xml',
  '/fantasy-realms-fr/icons/android-icon-144x144.png',
  '/fantasy-realms-fr/icons/android-icon-192x192.png',
  '/fantasy-realms-fr/icons/android-icon-36x36.png',
  '/fantasy-realms-fr/icons/android-icon-48x48.png',
  '/fantasy-realms-fr/icons/android-icon-72x72.png',
  '/fantasy-realms-fr/icons/android-icon-96x96.png',
  '/fantasy-realms-fr/icons/apple-icon-114x114.png',
  '/fantasy-realms-fr/icons/apple-icon-120x120.png',
  '/fantasy-realms-fr/icons/apple-icon-144x144.png',
  '/fantasy-realms-fr/icons/apple-icon-152x152.png',
  '/fantasy-realms-fr/icons/apple-icon-180x180.png',
  '/fantasy-realms-fr/icons/apple-icon-57x57.png',
  '/fantasy-realms-fr/icons/apple-icon-60x60.png',
  '/fantasy-realms-fr/icons/apple-icon-72x72.png',
  '/fantasy-realms-fr/icons/apple-icon-76x76.png',
  '/fantasy-realms-fr/icons/apple-icon-precomposed.png',
  '/fantasy-realms-fr/icons/apple-icon.png',
  '/fantasy-realms-fr/icons/favicon-16x16.png',
  '/fantasy-realms-fr/icons/favicon-32x32.png',
  '/fantasy-realms-fr/icons/favicon-96x96.png',
  '/fantasy-realms-fr/icons/ms-icon-144x144.png',
  '/fantasy-realms-fr/icons/ms-icon-150x150.png',
  '/fantasy-realms-fr/icons/ms-icon-310x310.png',
  '/fantasy-realms-fr/icons/ms-icon-70x70.png'
];

self.addEventListener('fetch', function (e) {
  console.log('fetch request: ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache: ' + e.request.url);
        return request;
      } else {
        console.log('file is not cached, fetching: ' + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache: ' + CACHE_NAME)
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache: ' + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
