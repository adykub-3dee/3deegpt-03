const CACHE_VERSION = "3dee-pro-pwa-v1";
const CACHE_PREFIX = "3dee-pro-pwa-";
const APP_SHELL = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./vendor/xlsx.full.min.js"
];

const absoluteUrl = (path) => new URL(path, self.location.href).href;
const INDEX_URL = absoluteUrl("./index.html");
const OFFLINE_URL = absoluteUrl("./offline.html");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL.map(absoluteUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);

  // Google Apps Script a všetky ostatné externé požiadavky idú vždy priamo
  // cez sieť. Cloudové odpovede ani používateľské dáta sa necachujú.
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_VERSION).then((cache) => cache.put(INDEX_URL, copy))
            );
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          return (await cache.match(INDEX_URL)) || cache.match(OFFLINE_URL);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response.ok || response.type !== "basic") return response;
        const copy = response.clone();
        event.waitUntil(
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
        );
        return response;
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
