// Service Worker for PWA
self.addEventListener('install', (e) => {
  console.log('[SW] installed');
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Required for PWA install criteria
});