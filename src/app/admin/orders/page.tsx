// pages/admin/orders.tsx
"use client"; 
import { useState, useEffect } from 'react';

import { Order, User, OrderItem, Product } from '@prisma/client';

import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/Authcontext';

// Augment Order type for included relations
interface OrderWithDetails extends Order {
  user: Pick<User, 'id' | 'name' | 'email'>;
  orderItems: (OrderItem & { product: Pick<Product, 'name' | 'price'> })[];
}

const OrderStatusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token,fetchWithAuth } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error fetching orders: ${res.status}`);
      }
      const data: OrderWithDetails[] = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change status of Order ${orderId.substring(0, 8)}... to ${newStatus}?`)) return;
console.log(newStatus,'new')
    try {
      const res = await fetchWithAuth(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error updating order status: ${res.status}`);
      }

      await res.json(); // Consume response
      fetchOrders(); // Re-fetch orders to show updated status
      alert('Order status updated successfully!');
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <AdminLayout title="Order Management">Loading orders...</AdminLayout>;
  if (error) return <AdminLayout title="Order Management">Error: {error}</AdminLayout>;

  return (
    <AdminLayout title="Order Management">
      <Head>
        <title>Orders | Order App Admin</title>
      </Head>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order?.party?.name || order?.party?.email || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul>
                    {order.orderItems.map((item, index) => (
                      <li key={index}>
                        {item.product.name} (x{item.quantity}) - ${item.price.toFixed(2)} ea.
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {OrderStatusOptions.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <select
    value={order.status}
    onChange={(e) => handleStatusChange(order.id, e.target.value)}
    className="block max-w-xs pl-2 pr-6 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
  >
    {OrderStatusOptions.map((statusOption) => (
      <option key={statusOption} value={statusOption}>
        {statusOption}
      </option>
    ))}
  </select>
</td> */}
<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <div className="relative inline-block w-full max-w-xs">
    <select
      value={order.status}
      onChange={(e) => handleStatusChange(order.id, e.target.value)}
      className="
        block w-full appearance-none bg-white border border-gray-300 
        text-gray-700 py-2 px-3 pr-8 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        transition duration-200 ease-in-out
      "
    >
      {OrderStatusOptions.map((statusOption) => (
        <option key={statusOption} value={statusOption}>
          {statusOption}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;