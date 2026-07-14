const CACHE_NAME = "ai-companion-v1";
const CACHED_PATHS = ["/", "/emotion", "/rest", "/daily", "/progress", "/analyze"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHED_PATHS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // navigation 请求：network-first（先尝试网络，失败后回退缓存）
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // 静态资源：cache-first（先读缓存，未命中再请求网络并回填缓存）
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((res) => {
            const copy = res.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy));
            return res;
          })
          .catch(() => cached)
      );
    })
  );
});
