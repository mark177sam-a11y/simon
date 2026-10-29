self.addEventListener('notificationclick', (event) => {
  event.notification.close();
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

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Webstudios Mobile', body: event.data ? event.data.text() : 'New client booking received' };
  }

  const title = data.title || 'New Client Booking!';
  const options = {
    body: data.body || 'A new client inquiry has arrived in Supabase.',
    icon: '/simon/icon.svg',
    badge: '/simon/icon.svg',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'webstudios-booking',
    requireInteraction: true,
    data: {
      url: '/simon/',
      timestamp: Date.now(),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
