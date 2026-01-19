// // components/AdminLayout.tsx
// import React, { ReactNode, useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../context/Authcontext'; // We will create this context
// import Head from 'next/head';

// interface AdminLayoutProps {
//   children: ReactNode;
//   title?: string;
// }

// const AdminLayout = ({ children, title = "Admin Panel" }: AdminLayoutProps) => {
//   const router = useRouter();
//   const { user, logout, loading, isAuthenticated } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push('/admin/login');
//     } else if (!loading && isAuthenticated && user?.role !== 'ADMIN') {
//       router.push('/'); // Redirect non-admins if they somehow hit an admin route
//     }
//   }, [loading, isAuthenticated, user, router]);

//   if (loading || (!isAuthenticated && router.pathname !== '/admin/login')) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-xl font-semibold text-gray-700">Loading Admin Panel...</div>
//       </div>
//     );
//   }

//   if (!isAuthenticated && router.pathname === '/admin/login') {
//     return <>{children}</>; // Render login page directly without layout
//   }

//   if (user?.role !== 'ADMIN') {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
//             <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
//             <p className="text-lg">You do not have administrative privileges to access this page.</p>
//             <button
//                 onClick={() => router.push('/')}
//                 className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//                 Go to Home
//             </button>
//         </div>
//     );
//   }

//   const navItems = [
//     { name: 'Dashboard', href: '/admin', icon: '📊' },
//     { name: 'Products', href: '/admin/products', icon: '📦' },
//     { name: 'Orders', href: '/admin/orders', icon: '📝' },
//     { name: 'Users', href: '/admin/users', icon: '👥' },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Head>
//         <title>{title} | Order App Admin</title>
//       </Head>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
//       >
//         <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
//           <Link href="/admin" className="text-xl font-bold">
//             Order Admin
//           </Link>
//           <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {navItems.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center px-4 py-2 rounded-md transition-colors ${
//                 router.pathname === item.href
//                   ? 'bg-gray-700 text-white'
//                   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//               }`}
//             >
//               <span className="mr-3">{item.icon}</span>
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//         <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-900">
//             <p className="text-sm text-gray-400 mb-2">Logged in as: <span className="font-medium">{user?.email}</span></p>
//             <button
//                 onClick={logout}
//                 className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-700 hover:text-white rounded-md transition-colors"
//             >
//                 Sign Out
//             </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="flex items-center justify-between h-16 bg-white border-b px-4 md:px-6 shadow-sm">
//           <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//             </svg>
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
//           <div className="flex items-center">
//             {/* User Dropdown/Info can go here */}
//             <span className="text-gray-700 text-sm hidden sm:block">Hello, {user?.name || user?.email}!</span>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
//           {children}
//         </main>
//         </div>
//       </div>
//     );
//   };

//   export default AdminLayout;
// components/AdminLayout.tsx
// import React, { ReactNode, useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../context/Authcontext';
// import Head from 'next/head';
// import { getWebFcmToken, initFirebase, listenForForegroundNotifications } from '../../../lib/firebaseClient';

// interface AdminLayoutProps {
//   children: ReactNode;
//   title?: string;
// }

// const AdminLayout = ({ children, title = "Admin Panel" }: AdminLayoutProps) => {
//   const router = useRouter();
//   const { user, logout, loading, isAuthenticated } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push('/admin/login');
//     } else if (!loading && isAuthenticated && user?.role !== 'ADMIN') {
//       router.push('/');
//     }
//   }, [loading, isAuthenticated, user, router]);

//   if (loading || (!isAuthenticated && router.pathname !== '/admin/login')) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-xl font-semibold text-gray-700">Loading Admin Panel...</div>
//       </div>
//     );
//   }

//   if (!isAuthenticated && router.pathname === '/admin/login') {
//     return <>{children}</>;
//   }

//   if (user?.role !== 'ADMIN') {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
//         <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
//         <p className="text-lg">You do not have administrative privileges to access this page.</p>
//         <button
//           onClick={() => router.push('/')}
//           className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Go to Home
//         </button>
//       </div>
//     );
//   }

//   const navItems = [
//     { name: 'Dashboard', href: '/admin', icon: '📊' },
//     { name: 'Products', href: '/admin/products', icon: '📦' },
//     { name: 'Orders', href: '/admin/orders', icon: '📝' },
//     { name: 'Users', href: '/admin/users', icon: '👥' },
//     { name: 'Parties', href: '/admin/parties', icon: '🏢' }, // 👈 Added Parties
//     { name: 'Attendance', href: '/admin/attendance', icon: '⏰' }, 
//     { name: 'Notifications', href: '/admin/notifications', icon: '🔔' }
//   ];

//   useEffect(() => {
//     async function setupWebPush() {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission !== "granted") {
//           console.warn("🔕 Notification permission denied");
//           return;
//         }

//         initFirebase();
//         const token = await getWebFcmToken();

//         if (token) {
//           // 🔹 Send this token to backend (same API as mobile)
//           await fetch("/api/notifications/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ fcmToken: token }),
//           });
//           console.log("✅ Web FCM token registered to backend");
//         }

//         listenForForegroundNotifications();
//       } catch (err) {
//         console.error("Web Push setup error:", err);
//       }
//     }

//     setupWebPush();
//   }, []);


//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Head>
//         <title>{title} | Order App Admin</title>
//       </Head>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
//       >
//         <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
//           <Link href="/admin" className="text-xl font-bold">
//             Order Admin
//           </Link>
//           <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {navItems.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center px-4 py-2 rounded-md transition-colors ${
//                 router.pathname === item.href
//                   ? 'bg-gray-700 text-white'
//                   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//               }`}
//             >
//               <span className="mr-3">{item.icon}</span>
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//         <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-900">
//           <p className="text-sm text-gray-400 mb-2">
//             Logged in as: <span className="font-medium">{user?.email}</span>
//           </p>
//           <button
//             onClick={logout}
//             className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-700 hover:text-white rounded-md transition-colors"
//           >
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="flex items-center justify-between h-16 bg-white border-b px-4 md:px-6 shadow-sm">
//           <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//             </svg>
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
//           <div className="flex items-center">
//             <span className="text-gray-700 text-sm hidden sm:block">Hello, {user?.name || user?.email}!</span>
//           </div>
//         </header>
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useAuth } from "../context/Authcontext";
import { initFirebase, getWebFcmToken, listenForForegroundNotifications } from "../../../lib/firebaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

const AdminLayout = ({ children, title = "Admin Panel" }: AdminLayoutProps) => {
  const router = useRouter();
  const { user, logout, loading, isAuthenticated,fetchWithAuth } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [enablePush, setEnablePush] = useState(true);
  const [enableSound, setEnableSound] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    } else if (!loading && isAuthenticated && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [loading, isAuthenticated, user, router]);

  // Fetch notifications for this user
  const loadNotifications = async () => {
    try {
      const res = await fetchWithAuth("/api/admin/notifications/user");
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Setup Firebase web push
//   useEffect(() => {
//     async function setupWebPush() {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission !== "granted") {
//           console.warn("🔕 Notification permission denied");
//           return;
//         }

//         initFirebase();
//         const token = await getWebFcmToken();
// console.log(token)
//         if (token) {
//           await fetchWithAuth("/api/notifications/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ fcmToken: token }),
//           });
//           console.log("✅ Web FCM token registered");
//         }

//         listenForForegroundNotifications();

//         // Listen for messages from service worker
//         navigator.serviceWorker.addEventListener("message", (event) => {
//           const payload = event.data?.firebaseMessaging?.payload;
//           if (!payload) return;

//           const { title, body } = payload.notification ?? {};

//           if (enablePush) {
//             toast.info(`${title}: ${body}`, { position: "bottom-right" });
//             if (enableSound) {
//               const audio = new Audio("/notification.mp3");
//               audio.play().catch(() => {});
//             }
//           }

//           setNotifications((prev) => [
//             { id: Date.now().toString(), title, body, createdAt: new Date().toISOString(), read: false },
//             ...prev,
//           ]);
//         });
//       } catch (err) {
//         console.error("Web Push setup error:", err);
//       }
//     }

//     setupWebPush();
//   }, [enablePush, enableSound]);


// useEffect(() => {
//   let listener: any;

//   async function setupWebPush() {
//     try {
//       // ✅ 1. Register service worker first
//       if ("serviceWorker" in navigator) {
//         const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
//         console.log("✅ Service Worker registered:", reg.scope);
//       } else {
//         console.warn("❌ Service Worker not supported in this browser");
//         return;
//       }

//       // ✅ 2. Ask notification permission
//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") {
//         console.warn("🔕 Notification permission denied");
//         return;
//       }

//       // ✅ 3. Initialize Firebase and get token
//       initFirebase();
//       const token = await getWebFcmToken();

//       if (token) {
//         await fetchWithAuth("/api/notifications/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fcmToken: token }),
//         });
//         console.log("✅ Web FCM token registered");
//       }

//       // ✅ 4. Listen for foreground notifications
//       listenForForegroundNotifications();

//       // ✅ 5. Handle messages from Service Worker (background notifications)
//       listener = (event: MessageEvent) => {
//         const payload = event.data?.firebaseMessaging?.payload;
//         console.log(payload,'payload')
//         if (!payload) return;

//         const { title, body } = payload.notification ?? {};

//         if (enablePush) {
//           toast.info(`${title}: ${body}`, { position: "bottom-right" });
//           if (enableSound) {
//             const audio = new Audio("/notification.mp3");
//             audio.play().catch(() => {});
//           }
//         }

//         setNotifications((prev) => [
//           { id: Date.now().toString(), title, body, createdAt: new Date().toISOString(), read: false },
//           ...prev,
//         ]);
//       };

//       navigator.serviceWorker.addEventListener("message", listener);
//     } catch (err) {
//       console.error("⚠️ Web Push setup error:", err);
//     }
//   }

//   setupWebPush();

//   // ✅ 6. Cleanup event listener on unmount
//   return () => {
//     if (listener) {
//       navigator.serviceWorker.removeEventListener("message", listener);
//     }
//   };
// }, [enablePush, enableSound]);


useEffect(() => {
    let listener: any;

    async function setupWebPush() {
      try {
        // ✅ 1. Register Service Worker
        if ("serviceWorker" in navigator) {
          const existing = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
          console.log(existing,'existing')
          if (!existing) {
            const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
            console.log("✅ Service Worker registered:", reg.scope);
          }
        } else {
          console.warn("❌ Service Worker not supported in this browser");
          return;
        }

        // ✅ 2. Ask for permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("🔕 Notification permission denied");
          return;
        }

        // ✅ 3. Init Firebase and get token
        initFirebase();
        const token = await getWebFcmToken();

        if (token) {
          await fetchWithAuth("/api/notifications/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fcmToken: token }),
          });
          console.log("✅ Web FCM token registered");
        }

        // ✅ 4. Foreground messages
        listenForForegroundNotifications();

        // ✅ 5. Background messages (from SW)
        listener = (event: MessageEvent) => {
          const payload = event.data?.firebaseMessaging?.payload;
          if (!payload) return;

          const { title, body } = payload.notification ?? {};

          if (enablePush) {
            toast.info(`${title}: ${body}`, { position: "bottom-right" });
            if (enableSound) {
              const audio = new Audio("/notification.mp3");
              audio.play().catch(() => {});
            }
          }

          setNotifications((prev) => [
            { id: Date.now().toString(), title, body, createdAt: new Date().toISOString(), read: false },
            ...prev,
          ]);
        };

        navigator.serviceWorker.addEventListener("message", listener);
      } catch (err) {
        console.error("⚠️ Web Push setup error:", err);
      }
    }

    setupWebPush();

    return () => {
      if (listener) navigator.serviceWorker.removeEventListener("message", listener);
    };
  }, [enablePush, enableSound]);

  // Derived state
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark one notification as read
  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await fetchWithAuth("/api/admin/notifications/mark-read", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetchWithAuth("/api/admin/notifications/mark-read", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "📦" },
    { name: "Orders", href: "/admin/orders", icon: "📝" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Parties", href: "/admin/parties", icon: "🏢" },
    { name: "Attendance", href: "/admin/attendance", icon: "⏰" },
    { name: "Notifications", href: "/admin/notifications", icon: "🔔" },
  ];

  if (loading || (!isAuthenticated && router.pathname !== "/admin/login")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAuthenticated && router.pathname === "/admin/login") return <>{children}</>;

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">You do not have administrative privileges.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>{title} | Order App Admin</title>
      </Head>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <Link href="/admin" className="text-xl font-bold">
            Order Admin
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            ✖
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                router.pathname === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-900">
          <p className="text-sm text-gray-400 mb-2">
            Logged in as: <span className="font-medium">{user?.email}</span>
          </p>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-700 hover:text-white rounded-md transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 bg-white border-b px-4 md:px-6 shadow-sm relative">
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

          {/* 🔔 Notification Bell */}
          <div className="relative">
            <button
              className="relative focus:outline-none"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                if (!dropdownOpen) loadNotifications();
              }}
            >
              <span className="text-2xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                  <div className="space-x-2">
                    <button onClick={() => setSettingsOpen(true)} className="text-sm text-gray-500 hover:text-gray-700">
                      ⚙️
                    </button>
                    <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">
                      Mark all read
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`px-4 py-3 border-b cursor-pointer transition ${
                          n.read ? "bg-white" : "bg-blue-50"
                        } hover:bg-gray-50`}
                      >
                        <p
                          className={`font-medium ${
                            n.read ? "text-gray-700" : "text-blue-700"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-sm text-gray-600">{n.body}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="text-center py-2 border-t">
                  <Link href="/admin/notifications" className="text-blue-600 text-sm hover:underline">
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* ⚙️ Notification Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Enable Push Notifications</span>
                <input
                  type="checkbox"
                  checked={enablePush}
                  onChange={() => setEnablePush(!enablePush)}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Play Sound on Notification</span>
                <input
                  type="checkbox"
                  checked={enableSound}
                  onChange={() => setEnableSound(!enableSound)}
                  className="w-5 h-5"
                />
              </label>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;

