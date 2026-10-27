const CACHE_NAME = "vivitek-cache-v3";

const FILES_TO_CACHE = [
  "/Vivitek/",
  "/Vivitek/index.html",
  "/Vivitek/manifest.json",
  "/Vivitek/icon-192.png",
  "/Vivitek/icon-512.png",
    "/Vivitek/health-article.html",
  "/Vivitek/malaria.html",
  "/Vivitek/mosquito-malaria.png",
  "/Vivitek/news-article.html",
  "/Vivitek/contact.html",
  "/Vivitek/advertise.html",
  "/Vivitek/SSudan-14-Dec-2018.jpg",
"/Vivitek/typhoid.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});




self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(async (response) => {
        if (response && response.ok) {
          const contentType = response.headers.get("content-type") || "";

          if (
            contentType.includes("text/html") ||
            url.pathname.endsWith(".html") ||
            url.pathname.endsWith("/")
          ) {
            const copy = response.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, copy);
          }
        }

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          const homepage = await caches.match("/Vivitek/");
          if (homepage) return homepage;
        }

        return new Response(
          "You are offline and this page has not been cached yet.",
          {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          }
        );
      })
  );
});

