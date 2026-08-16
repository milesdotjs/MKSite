/* Blackjack with Yugi — offline shell for the home-screen app.
   Vite fingerprints its bundles, so instead of a hard-coded file list this
   caches same-origin GETs as they are requested and serves them cache-first
   afterwards. Bump CACHE to evict everything from a previous deploy. */
var CACHE = "yugi-blackjack-v1";

/* Only the entry point is worth precaching by name — everything else is
   hashed and gets picked up on first visit. */
var CORE = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        /* Never let one bad URL abort the whole install. */
        return Promise.all(
          CORE.map(function (u) {
            return c.add(u).catch(function () {});
          })
        );
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

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  /* Navigations: try the network so a new deploy wins, fall back to the
     cached shell when offline. */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put(req, copy);
          });
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || caches.match("./index.html");
          });
        })
    );
    return;
  }

  /* Everything else: cache-first, refreshed in the background. */
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
