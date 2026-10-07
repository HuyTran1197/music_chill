// Đổi số này mỗi khi bạn deploy bản mới (thêm nhạc, sửa giao diện...)
// để máy bạn bè tự cập nhật thay vì dùng bản cache cũ.
const CACHE_VERSION = "v1";
const RUNTIME_CACHE = `chill-runtime-${CACHE_VERSION}`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== RUNTIME_CACHE).map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    if (url.pathname.includes("/audio/")) {
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(async (cache) => {
                const cached = await cache.match(event.request);
                if (cached) return cached;
                try {
                    // cache: "reload" -> luôn hỏi thẳng server, bỏ qua cache HTTP của trình duyệt,
                    // tránh việc lỡ dính 1 lần lỗi (404) rồi bị nhớ nhầm mãi.
                    const response = await fetch(event.request, { cache: "reload" });
                    if (response.ok) cache.put(event.request, response.clone());
                    return response;
                } catch (err) {
                    return cached || Promise.reject(err);
                }
            })
        );
        return;
    }

    event.respondWith(
        caches.open(RUNTIME_CACHE).then(async (cache) => {
            const cached = await cache.match(event.request);
            const networkFetch = fetch(event.request)
                .then((response) => {
                    if (response.ok) cache.put(event.request, response.clone());
                    return response;
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});