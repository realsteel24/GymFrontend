const CACHE_NAME = "app-cache-v4";
const urlsToCache = [
  "/",
  "/index.html",
  "/vite.svg",
  "/manifest.json",
  "/src/assets/Admin-Logo.svg",
  "/src/index.css",
];

// Install - pre-cache static assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate - remove old caches and take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch - network-first for HTML (avoid white screens), cache-first for assets
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Bypass caching for API calls (always fetch fresh data)
  // Adjust this pattern if your API prefix is different (e.g. /api/v1/)
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Optionally, you could update a runtime cache for offline fallback
          // but do not serve stale API responses from cache by default.
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Network-first for navigation requests (index.html)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a fresh copy of index.html
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", clone));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        // Only cache successful GET requests for static assets
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          request.method === "GET"
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});

// Optional: reload page automatically when new SW takes over
self.addEventListener("controllerchange", () => {
  window.location?.reload?.();
});
