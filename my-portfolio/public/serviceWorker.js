self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch((err) => {
            console.warn("Falha de rede no Service Worker:", event.request.url);
            return new Response("", { status: 408, statusText: "Fetch failed" });
        })
    );
});