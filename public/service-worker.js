const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/Admin-Logo.png",
  "/vite.svg",
  "/manifest.json", // Web app manifest
  "/Admin-Logo.png", // Example static logo
  "/favicon.ico", // Favicon
  "/src/assets/styles.css", // Example CSS
  "/src/assets/main.js", // Main JS file (Vite will likely generate a hashed file name)
  "/src/assets/app.css",
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
