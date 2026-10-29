importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCXnm2YAHXPWmi2Lfl-ZwrqUKTFilQfEiA",
  authDomain: "gen-lang-client-0531069457.firebaseapp.com",
  projectId: "gen-lang-client-0531069457",
  storageBucket: "gen-lang-client-0531069457.firebasestorage.app",
  messagingSenderId: "977004077038",
  appId: "1:977004077038:web:b781f8544c53e952fbf8ff"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || '🎉 New Client Booking!';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'A new client inquiry has arrived in Supabase.',
    icon: '/simon/icon.svg',
    badge: '/simon/icon.svg',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    data: {
      url: '/simon/',
      timestamp: Date.now()
    }
  };

  self.registration.showNotification(title, options);
});

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
