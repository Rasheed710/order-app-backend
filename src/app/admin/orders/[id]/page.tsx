"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { useAuth } from "@/app/context/Authcontext";
import AdminLayout from "@/app/components/AdminLayout";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Party {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Salesman {
  id: string;
  name: string;
  email?: string;
}

interface Activity {
  id: string;
  action: string;
  message: string;
  createdAt: string;
  user?: { name: string | null };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  party: Party;
  user: Salesman;
  orderItems: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch recent activities for this order
  const fetchOrderActivities = async () => {
    try {
      const res = await fetchWithAuth(`/api/orders/${id}/activity`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchOrderActivities();
    }
  }, [id]);

  // ✅ Update order status
  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    if (!confirm(`Change status to ${newStatus}?`)) return;

    try {
      setUpdating(true);
      const res = await fetchWithAuth(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      await fetchOrderDetails();
      await fetchOrderActivities(); // refresh activity log
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="flex items-center justify-center h-96 text-gray-500">
          Loading order details...
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="flex items-center justify-center h-96 text-gray-500">
          Order not found
        </div>
      </AdminLayout>
    );
  }

  const lockedStatuses = ["SHIPPED", "DELIVERED", "CANCELLED"];
  const isLocked = lockedStatuses.includes(order.status);

  return (
    <AdminLayout title={`Order #${order.id.slice(0, 8)}`}>
      <Head>
        <title>Order Details | Admin Dashboard</title>
      </Head>

      <div className="p-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center gap-1 mb-4"
        >
          ← Back to Orders
        </button>

        {/* Main Info */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Order #{order.id.slice(0, 8)}
              </h2>
              <p className="text-gray-600 text-sm">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">
                Updated: {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColorClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              {!isLocked && (
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {getAvailableStatusOptions(order.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-6">
            {/* Party Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Party Info</h3>
              <p className="text-gray-800">{order.party?.name}</p>
              {order.party?.phone && (
                <p className="text-gray-600 text-sm">{order.party.phone}</p>
              )}
              {order.party?.email && (
                <p className="text-gray-600 text-sm">{order.party.email}</p>
              )}
              {order.party?.address && (
                <p className="text-gray-600 text-sm">{order.party.address}</p>
              )}
            </div>

            {/* Salesman Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Salesman Info
              </h3>
              <p className="text-gray-800">{order.user?.name || "N/A"}</p>
              {order.user?.email && (
                <p className="text-gray-600 text-sm">{order.user.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Items
          </h3>
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Product</th>
                <th className="px-6 py-3 text-left font-medium">Price</th>
                <th className="px-6 py-3 text-left font-medium">Qty</th>
                <th className="px-6 py-3 text-left font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-3">{item.product?.name}</td>
                  <td className="px-6 py-3">₹{item.product?.price}</td>
                  <td className="px-6 py-3">{item.quantity}</td>
                  <td className="px-6 py-3 font-semibold">
                    ₹{(item.quantity * item.product.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4">
            <span className="text-lg font-bold text-gray-800">
              Total: ₹{order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 🔹 Recent Activity Timeline */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>

          {activities.length === 0 ? (
            <p className="text-gray-500">No activity found for this order.</p>
          ) : (
            <ul className="relative border-l border-gray-200 ml-3">
              {activities.map((act, i) => (
                <li key={act.id} className="mb-6 ml-4">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></div>
                  <time className="text-gray-400 text-xs">
                    {new Date(act.createdAt).toLocaleString()}
                  </time>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {act.action.replace("_", " ")}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{act.message}</p>
                  {act.user?.name && (
                    <p className="text-xs text-gray-500 mt-1">
                      by {act.user.name}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// ✅ Helpers
const getStatusColorClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getAvailableStatusOptions = (currentStatus: string) => {
  switch (currentStatus) {
    case "PENDING":
      return ["PENDING", "CONFIRMED", "CANCELLED"];
    case "CONFIRMED":
      return ["CONFIRMED", "SHIPPED", "CANCELLED"];
    default:
      return [currentStatus];
  }
};
