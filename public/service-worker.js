const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/assets/Admin-Logo.svg",
  "/vite.svg",
  "/manifest.json", // Web app manifest
  "/src/assets/main.js", // Main JS file (Vite will likely generate a hashed file name)
  "/src/index.css",
  // Add other static assets like CSS, JS files if needed
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
