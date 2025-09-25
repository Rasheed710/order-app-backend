// pages/admin/index.tsx
"use client"; 
import Head from 'next/head';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/Authcontext';

const AdminDashboardPage = () => {
  const { user } = useAuth(); // Get user from context

  return (
    <AdminLayout title="Dashboard">
      <Head>
        <title>Dashboard | Order App Admin</title>
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Example Dashboard Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">1,234</p> {/* Placeholder */}
          <p className="text-gray-500 text-sm">Last 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Revenue</h2>
          <p className="text-3xl font-bold text-green-600">$56,789</p> {/* Placeholder */}
          <p className="text-gray-500 text-sm">Last 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">New Users</h2>
          <p className="text-3xl font-bold text-purple-600">120</p> {/* Placeholder */}
          <p className="text-gray-500 text-sm">Last 30 days</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user?.name || user?.email}!</h2>
        <p className="text-gray-600">This is your admin dashboard. Use the sidebar to navigate through product, order, and user management.</p>
      </div>

      {/* Add more dashboard widgets here */}
    </AdminLayout>
  );
};

export default AdminDashboardPage;