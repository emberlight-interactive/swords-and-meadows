/* eslint-disable prefer-arrow-callback */
/* global self */
/* global clients */

self.addEventListener('push', function (event) {
  const data = event.data.json();
  const { title, ...options } = data.notification;
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (e) {
  // Close the notification popout
  e.notification.close();
  // Get all the Window clients
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientsArr => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some(windowClient =>
        windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        clients
          .openWindow(e.notification.data.url)
          .then(windowClient => (windowClient ? windowClient.focus() : null));
    })
  );
});
