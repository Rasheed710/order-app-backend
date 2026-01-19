// // public/firebase-messaging-sw.js
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: 'AIzaSyBnRBLIvHTO3UdwyJK5en4Nwe-v5Sfy1M8',
//       projectId: 'jrfoods-9a874',
//       messagingSenderId: '364630671053',
//       appId: '1:364630671053:web:b83141a1cab5d7edee7384',
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("📬 Background message:", payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     // icon: "/icon.png",
//     vibrate: [200, 100, 200],
//     data: payload.data,
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
// self.addEventListener("notificationclick", function (event) {
//   console.log("🔔 Notification click:", event.notification);
//   event.notification.close();

//   // You can control what happens when user clicks the notification
//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then((clientList) => {
//       for (const client of clientList) {
//         if (client.url.includes("/admin/orders") && "focus" in client) {
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow("/admin/orders");
//       }
//     })
//   );
// });

// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBnRBLIvHTO3UdwyJK5en4Nwe-v5Sfy1M8",
  projectId: "jrfoods-9a874",
  messagingSenderId: "364630671053",
  appId: "1:364630671053:web:b83141a1cab5d7edee7384",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📬 Background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: "/icon.png",
    vibrate: [200, 100, 200],
    data: payload.data, // 👈 pass data for click handling
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification click:", event.notification);
  event.notification.close();

  const targetUrl = event.notification.data?.targetUrl || "/admin/orders";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
