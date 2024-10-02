const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/Admin-Logo.png",
  "/vite.svg",
  // Add other static assets like CSS, JS files if needed
];
let deferredPrompt;
let installButtonVisible = false; // Flag to track visibility

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the default mini-info bar from appearing
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Set a timeout to show the prompt after 30 seconds
  setTimeout(() => {
    if (deferredPrompt) {
      // Only show the prompt if the button is not already shown
      if (!installButtonVisible) {
        // Show your custom install button here
        const installButton = document.getElementById("installButton");
        installButton.style.display = "block";
        installButtonVisible = true; // Update flag

        installButton.addEventListener("click", () => {
          // Show the install prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the A2HS prompt");
            } else {
              console.log("User dismissed the A2HS prompt");
            }
            deferredPrompt = null; // Clear the deferredPrompt variable
            installButton.style.display = "none"; // Hide the button after prompt
          });
        });
      }
    }
  }, 30000); // 30 seconds
});

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
