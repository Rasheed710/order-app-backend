// // pages/admin/index.tsx
// "use client"; 
// import Head from 'next/head';
// import AdminLayout from '../components/AdminLayout';
// import { useAuth } from '../context/Authcontext';
// import { useEffect, useState } from 'react';
// interface Stats {
//   totalUsers: number;
//   totalOrders: number;
//   totalRevenue: number;
// }
// interface Activity {
//   id: string;
//   action: string;
//   message: string;
//   createdAt: string;
//   user?: {
//     name?: string;
//     email?: string;
//   };
//   order?: {
//     id: string;
//     status: string;
//   };
// }
// const AdminDashboardPage = () => {
//   const { user,fetchWithAuth } = useAuth(); // Get user from context
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [activities, setActivities] = useState<Activity[]>([]);
// const [meta, setMeta] = useState<any>({});
// const [page, setPage] = useState(1);
// const [filterAction, setFilterAction] = useState("");
// const [loadingActivities, setLoadingActivities] = useState(true);

// const fetchActivities = async (page = 1, action = "") => {
//   try {
//     setLoadingActivities(true);
//     const res = await fetchWithAuth(
//       `/api/admin/recent-activities?page=${page}&limit=5&action=${action}`
//     );
//     const data = await res.json();
//     setActivities(data.data);
//     setMeta(data.meta);
//     setPage(data.meta.page);
//   } catch (error) {
//     console.error("Failed to fetch activities:", error);
//   } finally {
//     setLoadingActivities(false);
//   }
// };
//   const fetchStats = async () => {
//     try {
//       const res = await fetchWithAuth("/api/admin/stats");
//       if (!res.ok) {
//         throw new Error(`Failed to fetch stats: ${res.status}`);
//       }
//       const data = await res.json();
//       setStats(data);
//     } catch (error) {
//       console.error("Failed to fetch stats:", error);
//     }
//   };
//   useEffect(() => {
//     fetchActivities()
//     fetchStats();
//   }, []);

//   return (
//     // <AdminLayout title="Dashboard">
//     //   <Head>
//     //     <title>Dashboard | Order App Admin</title>
//     //   </Head>
//     //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//     //     {/* Example Dashboard Cards */}
//     //     <div className="bg-white p-6 rounded-lg shadow-md">
//     //       <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
//     //       <p className="text-3xl font-bold text-blue-600">1,234</p> {/* Placeholder */}
//     //       <p className="text-gray-500 text-sm">Last 30 days</p>
//     //     </div>
//     //     <div className="bg-white p-6 rounded-lg shadow-md">
//     //       <h2 className="text-xl font-semibold text-gray-800 mb-2">Revenue</h2>
//     //       <p className="text-3xl font-bold text-green-600">$56,789</p> {/* Placeholder */}
//     //       <p className="text-gray-500 text-sm">Last 30 days</p>
//     //     </div>
//     //     <div className="bg-white p-6 rounded-lg shadow-md">
//     //       <h2 className="text-xl font-semibold text-gray-800 mb-2">New Users</h2>
//     //       <p className="text-3xl font-bold text-purple-600">120</p> {/* Placeholder */}
//     //       <p className="text-gray-500 text-sm">Last 30 days</p>
//     //     </div>
//     //   </div>

//     //   <div className="bg-white p-6 rounded-lg shadow-md">
//     //     <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user?.name || user?.email}!</h2>
//     //     <p className="text-gray-600">This is your admin dashboard. Use the sidebar to navigate through product, order, and user management.</p>
//     //   </div>

//     //   {/* Add more dashboard widgets here */}
//     // </AdminLayout>
//     <AdminLayout title="Dashboard">
//       <Head>
//         <title>Dashboard | Order App Admin</title>
//       </Head>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
//           <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders ?? 0}</p>
//           <p className="text-gray-500 text-sm">All time</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Revenue</h2>
//           <p className="text-3xl font-bold text-green-600">
//             ₹{stats?.totalRevenue?.toLocaleString("en-IN") ?? 0}
//           </p>
//           <p className="text-gray-500 text-sm">All time</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h2>
//           <p className="text-3xl font-bold text-purple-600">{stats?.totalUsers ?? 0}</p>
//           <p className="text-gray-500 text-sm">Registered customers</p>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Welcome, {user?.name || user?.email}!
//         </h2>
//         <p className="text-gray-600">
//           This is your admin dashboard. Use the sidebar to navigate through product,
//           order, and user management.
//         </p>
//       </div>
//       {/* --- Recent Activity Section --- */}
// <div className="bg-white p-6 rounded-lg shadow-md">
//   <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>

//   {/* Filters */}
//   <div className="flex flex-wrap gap-3 mb-4">
//     {["", "ORDER_CREATED", "STATUS_UPDATED", "ORDER_DELETED"].map((type) => (
//       <button
//         key={type}
//         onClick={() => {
//           setFilterAction(type);
//           setPage(1);
//           fetchActivities(1, type);
//         }}
//         className={`px-3 py-1 rounded-md text-sm font-medium ${
//           filterAction === type
//             ? "bg-blue-600 text-white"
//             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//         }`}
//       >
//         {type ? type.replace("_", " ") : "All"}
//       </button>
//     ))}
//   </div>

//   {loadingActivities ? (
//     <p className="text-gray-500">Loading recent activities...</p>
//   ) : activities.length === 0 ? (
//     <p className="text-gray-500">No recent activity found.</p>
//   ) : (
//     <>
//       <ul className="divide-y divide-gray-200">
//         {activities.map((activity) => (
//           <li key={activity.id} className="py-3">
//             <p className="text-gray-800 font-medium">{activity.message}</p>
//             <p className="text-sm text-gray-500 mt-1">
//               {new Date(activity.createdAt).toLocaleString("en-IN")} •{" "}
//               {activity.user?.name || activity.user?.email || "System"}
//             </p>
//           </li>
//         ))}
//       </ul>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           disabled={!meta.hasPrevPage}
//           onClick={() => fetchActivities(page - 1, filterAction)}
//           className={`px-3 py-1 rounded-md text-sm ${
//             meta.hasPrevPage
//               ? "bg-gray-200 hover:bg-gray-300"
//               : "bg-gray-100 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Previous
//         </button>
//         <span className="text-sm text-gray-500">
//           Page {page} of {meta.totalPages}
//         </span>
//         <button
//           disabled={!meta.hasNextPage}
//           onClick={() => fetchActivities(page + 1, filterAction)}
//           className={`px-3 py-1 rounded-md text-sm ${
//             meta.hasNextPage
//               ? "bg-gray-200 hover:bg-gray-300"
//               : "bg-gray-100 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Next
//         </button>
//       </div>
//     </>
//   )}
// </div>
//     </AdminLayout>
//   );
// };

// export default AdminDashboardPage;
"use client";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/Authcontext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Activity {
  id: string;
  action: string;
  message: string;
  createdAt: string;
  user?: { name?: string; email?: string };
  order?: { id: string; status: string };
}

export default function AdminDashboardPage() {
  const { user, fetchWithAuth } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [salesTrend, setSalesTrend] = useState<{ date: string; total: number }[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetchWithAuth("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Fetch AI Summary
  const fetchSalesSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await fetchWithAuth("/api/ai/sales-summary");
      const data = await res.json();
      setSummary(data.summary || "No summary available.");
    } catch (err) {
      console.error("AI summary error:", err);
      setSummary("⚠️ Could not generate AI summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch Sales Trend
  const fetchSalesTrend = async () => {
    try {
      setLoadingTrend(true);
      const res = await fetchWithAuth("/api/admin/sales-trend");
      const data = await res.json();
      setSalesTrend(data.trend || []);
    } catch (err) {
      console.error("Trend error:", err);
    } finally {
      setLoadingTrend(false);
    }
  };

  // Fetch Activities
  const fetchActivities = async (page = 1, action = "") => {
    try {
      setLoadingActivities(true);
      const res = await fetchWithAuth(
        `/api/admin/recent-activities?page=${page}&limit=5&action=${action}`
      );
      const data = await res.json();
      setActivities(data.data || []);
      setMeta(data.meta || {});
      setPage(data.meta?.page || 1);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // fetchSalesSummary();
    fetchSalesTrend();
    fetchActivities();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <Head>
        <title>Dashboard | Order App Admin</title>
      </Head>

      {/* === STAT CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders ?? 0}</p>
          <p className="text-gray-500 text-sm">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Revenue</h2>
          <p className="text-3xl font-bold text-green-600">
            ₹{stats?.totalRevenue?.toLocaleString("en-IN") ?? 0}
          </p>
          <p className="text-gray-500 text-sm">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalUsers ?? 0}</p>
          <p className="text-gray-500 text-sm">Registered customers</p>
        </div>
      </div>

      {/* === AI SALES SUMMARY === */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
          AI Sales Summary
          <button
            onClick={fetchSalesSummary}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Refresh
          </button>
        </h2>
        {loadingSummary ? (
          <p className="text-gray-500 italic">Generating summary...</p>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        )}
      </div> */}

      {/* === WELCOME BOX === */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.name || user?.email}!
        </h2>
        <p className="text-gray-600">
          This is your admin dashboard. Use the sidebar to navigate through
          product, order, and user management.
        </p>
      </div>

      {/* === SALES TREND CHART === */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
          Sales Trend (Last 30 Days)
          <button
            onClick={fetchSalesTrend}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Refresh
          </button>
        </h2>

        {loadingTrend ? (
          <p className="text-gray-500 italic">Loading chart...</p>
        ) : salesTrend.length === 0 ? (
          <p className="text-gray-500">No sales data found for the last 30 days.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis />
              <Tooltip
                formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, "Sales"]}
                labelFormatter={(d) => `Date: ${d}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      

      {/* === RECENT ACTIVITY === */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>

        <div className="flex flex-wrap gap-3 mb-4">
          {["", "ORDER_CREATED", "STATUS_UPDATED", "ORDER_DELETED"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterAction(type);
                setPage(1);
                fetchActivities(1, type);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterAction === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type ? type.replace("_", " ") : "All"}
            </button>
          ))}
        </div>

        {loadingActivities ? (
          <p className="text-gray-500">Loading recent activities...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500">No recent activity found.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="py-3">
                  <p className="text-gray-800 font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.createdAt).toLocaleString("en-IN")} •{" "}
                    {activity.user?.name || activity.user?.email || "System"}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4">
              <button
                disabled={!meta.hasPrevPage}
                onClick={() => fetchActivities(page - 1, filterAction)}
                className={`px-3 py-1 rounded-md text-sm ${
                  meta.hasPrevPage
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNextPage}
                onClick={() => fetchActivities(page + 1, filterAction)}
                className={`px-3 py-1 rounded-md text-sm ${
                  meta.hasNextPage
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
