// Đổi số này mỗi khi bạn deploy bản mới (thêm nhạc, sửa giao diện...)
// để máy bạn bè tự cập nhật thay vì dùng bản cache cũ.
const CACHE_VERSION = "v2";
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
                // Safari (và nhiều trình duyệt mobile) tải file audio theo từng đoạn nhỏ
                // (HTTP Range request) thay vì tải nguyên file. Nếu cache theo đúng request
                // gốc, mỗi lần sẽ chỉ lưu được 1 mảnh nhỏ -> lúc offline bị thiếu, không phát được.
                // Giải pháp: luôn bỏ qua header Range, tải + cache NGUYÊN file hoàn chỉnh.
                const cleanRequest = new Request(url.href, { method: "GET" });
                const cached = await cache.match(cleanRequest);
                if (cached) return cached;
                try {
                    const response = await fetch(cleanRequest, { cache: "reload" });
                    if (response.ok) cache.put(cleanRequest, response.clone());
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