/* ==========================================================================
   Webstudios Mobile Service Worker (sw.js)
   Handles background push events, offline caching, and lock-screen pop-up notifications
   ========================================================================== */

const CACHE_NAME = 'webstudios-v4';
const ASSETS_TO_CACHE = [
  '/simon/',
  '/simon/index.html',
  '/simon/manifest.webmanifest',
  '/simon/icon.svg',
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache pre-fill non-fatal error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Push Event - Triggered by push service even when the app is completely closed
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'New Client Inquiry!',
        body: event.data.text() || 'A new client booking has arrived in Supabase.',
      };
    }
  } else {
    data = {
      title: 'New Client Inquiry!',
      body: 'A new client booking has arrived in Supabase.',
    };
  }

  const title = data.title || '🎉 New Client Booking!';
  const options = {
    body: data.body || 'A new client inquiry has arrived in Supabase.',
    icon: '/simon/icon.svg',
    badge: '/simon/icon.svg',
    vibrate: [300, 100, 300, 100, 300],
    tag: data.tag || 'webstudios-booking-' + Date.now(),
    requireInteraction: true,
    renotify: true,
    data: {
      url: data.url || '/simon/',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Open Booking' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  // Set app badge counter if supported (shows unread badge icon like WhatsApp)
  if ('setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(1).catch(() => {});
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event - Opens or focuses the app when notification is tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Clear app badge when notification is opened
  if ('clearAppBadge' in self.navigator) {
    self.navigator.clearAppBadge().catch(() => {});
  }

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/simon/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Fetch Event - Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/simon/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Message listener from foreground window
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification(event.data.title || '🔔 Webstudios Notification', {
      body: event.data.body || 'Background notification system active!',
      icon: '/simon/icon.svg',
      badge: '/simon/icon.svg',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { url: '/simon/' }
    });
  }
});
