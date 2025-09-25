// components/AdminLayout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Authcontext'; // We will create this context
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Admin Panel" }: AdminLayoutProps) => {
  const router = useRouter();
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    } else if (!loading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/'); // Redirect non-admins if they somehow hit an admin route
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || (!isAuthenticated && router.pathname !== '/admin/login')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAuthenticated && router.pathname === '/admin/login') {
    return <>{children}</>; // Render login page directly without layout
  }

  if (user?.role !== 'ADMIN') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg">You do not have administrative privileges to access this page.</p>
            <button
                onClick={() => router.push('/')}
                className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Go to Home
            </button>
        </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Products', href: '/admin/products', icon: '📦' },
    { name: 'Orders', href: '/admin/orders', icon: '📝' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>{title} | Order App Admin</title>
      </Head>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <Link href="/admin" className="text-xl font-bold">
            Order Admin
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                router.pathname === item.href
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-900">
            <p className="text-sm text-gray-400 mb-2">Logged in as: <span className="font-medium">{user?.email}</span></p>
            <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-700 hover:text-white rounded-md transition-colors"
            >
                Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-white border-b px-4 md:px-6 shadow-sm">
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <div className="flex items-center">
            {/* User Dropdown/Info can go here */}
            <span className="text-gray-700 text-sm hidden sm:block">Hello, {user?.name || user?.email}!</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
        </div>
      </div>
    );
  };

  export default AdminLayout;