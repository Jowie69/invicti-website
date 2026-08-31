const IMAGE_CACHE = "invicti-images-v1";

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("invicti-images-") && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    request.destination !== "image" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith("/images/")
  ) {
    return;
  }

  event.respondWith(
    caches.open(IMAGE_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const updated = fetch(request).then((response) => {
        if (response.ok) void cache.put(request, response.clone());
        return response;
      });

      if (cached) {
        event.waitUntil(updated.catch(() => undefined));
        return cached;
      }

      return updated;
    }),
  );
});
