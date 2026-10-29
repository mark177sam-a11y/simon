/**
 * Utility for triggering system notifications on mobile & desktop browsers.
 * Integrates with Android Notification Channels and Service Worker showNotification API.
 */

export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      // Immediately post an initial notification so Android OS registers the app
      // and activates the notification channel in Android Settings.
      await postSystemNotification({
        title: '🔔 Pop-up Notifications Active!',
        body: 'Webstudios Mobile will now post pop-up alerts for new client inquiries.',
        tag: 'webstudios-welcome',
      });
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Notification permission error:', err);
    return false;
  }
}

export async function postSystemNotification(payload: NotificationPayload): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }

  const options: NotificationOptions = {
    body: payload.body,
    icon: '/simon/icon.svg',
    badge: '/simon/icon.svg',
    tag: payload.tag || 'webstudios-booking',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: payload.requireInteraction !== false,
    data: payload.data || { url: '/simon/' },
  };

  // 1. Try Service Worker showNotification (preferred for mobile PWA)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(payload.title, options);
        return true;
      }
    } catch (err) {
      console.warn('ServiceWorker showNotification failed, trying fallback:', err);
    }
  }

  // 2. Direct Notification fallback
  try {
    new Notification(payload.title, options);
    return true;
  } catch (err) {
    console.warn('Direct Notification fallback error:', err);
    return false;
  }
}
