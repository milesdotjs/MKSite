/* KC TERMINAL service worker — offline shell for the home-screen app.
   Bump CACHE when any shell file changes so clients pick up the new build. */
var CACHE = "kc-terminal-v1";

var SHELL = [
  "./",
  "index.html",
  "app.css",
  "app.js",
  "manifest.webmanifest",
  "vendor/gsap.min.js",
  "vendor/CustomEase.min.js",
  "vendor/ScrambleTextPlugin.min.js",
  "vendor/Physics2DPlugin.min.js",
  "vendor/Observer.min.js",
  "vendor/SplitText.min.js",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        return c.addAll(SHELL);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (k) {
            return k === CACHE ? null : caches.delete(k);
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

/* Cache-first for the shell; network falls back to cache when offline.
   Fresh copies are written back so a reload picks up new deploys. */
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(function (hit) {
      var live = fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(req, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return hit;
        });
      return hit || live;
    })
  );
});
