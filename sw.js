// Amin AI World — Service Worker
// ক্যাশ ভার্সন বদলালে (v1 -> v2) পুরনো ক্যাশ স্বয়ংক্রিয়ভাবে মুছে নতুন ফাইল লোড হবে
const CACHE_NAME = 'amin-ai-world-v1';
const CORE_ASSETS = [
  './index.html',
  './about.html',
  './privacy.html',
  './terms.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// data.json সবসময় নেটওয়ার্ক থেকে সর্বশেষ কপি আনার চেষ্টা করবে (অফলাইনে ক্যাশ থেকে দেখাবে)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('data.json')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // বাকি সব ফাইলের জন্য: আগে ক্যাশ, না পেলে নেটওয়ার্ক
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});
