// pages/admin/index.tsx
"use client"; 
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/Authcontext';
import { useEffect, useState } from 'react';
interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}
const AdminDashboardPage = () => {
  const { user,fetchWithAuth } = useAuth(); // Get user from context
  const [stats, setStats] = useState<Stats | null>(null);
  const fetchStats = async () => {
    try {
      const res = await fetchWithAuth("/api/admin/stats");
      if (!res.ok) {
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    // <AdminLayout title="Dashboard">
    //   <Head>
    //     <title>Dashboard | Order App Admin</title>
    //   </Head>
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    //     {/* Example Dashboard Cards */}
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
    //       <p className="text-3xl font-bold text-blue-600">1,234</p> {/* Placeholder */}
    //       <p className="text-gray-500 text-sm">Last 30 days</p>
    //     </div>
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h2 className="text-xl font-semibold text-gray-800 mb-2">Revenue</h2>
    //       <p className="text-3xl font-bold text-green-600">$56,789</p> {/* Placeholder */}
    //       <p className="text-gray-500 text-sm">Last 30 days</p>
    //     </div>
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h2 className="text-xl font-semibold text-gray-800 mb-2">New Users</h2>
    //       <p className="text-3xl font-bold text-purple-600">120</p> {/* Placeholder */}
    //       <p className="text-gray-500 text-sm">Last 30 days</p>
    //     </div>
    //   </div>

    //   <div className="bg-white p-6 rounded-lg shadow-md">
    //     <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user?.name || user?.email}!</h2>
    //     <p className="text-gray-600">This is your admin dashboard. Use the sidebar to navigate through product, order, and user management.</p>
    //   </div>

    //   {/* Add more dashboard widgets here */}
    // </AdminLayout>
    <AdminLayout title="Dashboard">
      <Head>
        <title>Dashboard | Order App Admin</title>
      </Head>

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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.name || user?.email}!
        </h2>
        <p className="text-gray-600">
          This is your admin dashboard. Use the sidebar to navigate through product,
          order, and user management.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
