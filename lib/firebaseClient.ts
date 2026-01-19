// // src/lib/firebaseClient.ts
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// let messaging: ReturnType<typeof getMessaging> | null = null;

// export function initFirebase() {
//   const app = initializeApp(firebaseConfig);
//   messaging = getMessaging(app);
//   return messaging;
// }

// export async function getWebFcmToken() {
//   try {
//     if (!messaging) initFirebase();
//     const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
//     const token = await getToken(messaging!, { vapidKey });
//     console.log("🌐 Web FCM Token:", token);
//     return token;
//   } catch (err) {
//     console.error("❌ Error getting Web FCM token:", err);
//     return null;
//   }
// }

// export function listenForForegroundNotifications() {
//   if (!messaging) initFirebase();

//   onMessage(messaging!, (payload) => {
//     console.log("📩 Foreground notification received:", payload);
//     const { title, body } = payload.notification ?? {};

//     // Show system notification (browser popup)
//     if (Notification.permission === "granted" && title) {
//       new Notification(title, { body, icon: "/icon.png" });
//     }

//     // Optionally: show toast inside dashboard
//     if (typeof window !== "undefined") {
//       alert(`🔔 ${title}\n${body}`);
//     }
//   });
// }

// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// let messaging: ReturnType<typeof getMessaging> | null = null;

// export function initFirebase() {
//   const app = initializeApp(firebaseConfig);
//   messaging = getMessaging(app);
//   return messaging;
// }

// export async function getWebFcmToken() {
//   try {
//     if (!messaging) initFirebase();
//     const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
//     const token = await getToken(messaging!, { vapidKey });
//     console.log("🌐 Web FCM Token:", token);
//     return token;
//   } catch (err) {
//     console.error("❌ Error getting Web FCM token:", err);
//     return null;
//   }
// }

// export function listenForForegroundNotifications() {
//   if (!messaging) initFirebase();

//   onMessage(messaging!, (payload) => {
//     console.log("📩 Foreground notification received:", payload);
//     const { title, body } = payload.notification ?? {};

//     if (Notification.permission === "granted" && title) {
//       new Notification(title, { body });
//     }

//     if (typeof window !== "undefined") {
//       alert(`🔔 ${title}\n${body}`);
//     }
//   });
// }

// lib/firebaseClient.ts
import { getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messaging: ReturnType<typeof getMessaging> | null = null;

export function initFirebase() {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  return messaging;
}

export async function getWebFcmToken() {
  try {
    if (!messaging) initFirebase();
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
    const token = await getToken(messaging!, { vapidKey });
    console.log("🌐 Web FCM Token:", token);
    return token;
  } catch (err) {
    console.error("❌ Error getting Web FCM token:", err);
    return null;
  }
}

export function listenForForegroundNotifications() {
  if (!messaging) initFirebase();

  onMessage(messaging!, (payload) => {
    console.log("📩 Foreground notification received:", payload);
    const { title, body } = payload.notification ?? {};

    if (Notification.permission === "granted" && title) {
      new Notification(title, { body});
    }
  });
}
