// // // // pages/admin/orders.tsx
// // // "use client"; 
// // // import { useState, useEffect } from 'react';

// // // import { Order, User, OrderItem, Product } from '@prisma/client';

// // // import Head from 'next/head';
// // // import AdminLayout from '../../components/AdminLayout';
// // // import { useAuth } from '../../context/Authcontext';

// // // // Augment Order type for included relations
// // // interface OrderWithDetails extends Order {
// // //   user: Pick<User, 'id' | 'name' | 'email'>;
// // //   orderItems: (OrderItem & { product: Pick<Product, 'name' | 'price'> })[];
// // // }

// // // const OrderStatusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// // // const AdminOrdersPage = () => {
// // //   const [orders, setOrders] = useState<OrderWithDetails[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const { token,fetchWithAuth } = useAuth();

// // //   const fetchOrders = async () => {
// // //     setLoading(true);
// // //     setError(null);
// // //     try {
// // //       const res = await fetchWithAuth('/api/orders', {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //         },
// // //       });
// // //       if (!res.ok) {
// // //         const errData = await res.json();
// // //         throw new Error(errData.message || `Error fetching orders: ${res.status}`);
// // //       }
// // //       const data: OrderWithDetails[] = await res.json();
// // //       setOrders(data);
// // //     } catch (err: any) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (token) {
// // //       fetchOrders();
// // //     }
// // //   }, [token]);

// // //   const handleStatusChange = async (orderId: string, newStatus: string) => {
// // //     if (!confirm(`Are you sure you want to change status of Order ${orderId.substring(0, 8)}... to ${newStatus}?`)) return;
// // // console.log(newStatus,'new')
// // //     try {
// // //       const res = await fetchWithAuth(`/api/orders/${orderId}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({ status: newStatus }),
// // //       });

// // //       if (!res.ok) {
// // //         const errData = await res.json();
// // //         throw new Error(errData.message || `Error updating order status: ${res.status}`);
// // //       }

// // //       await res.json(); // Consume response
// // //       fetchOrders(); // Re-fetch orders to show updated status
// // //       alert('Order status updated successfully!');
// // //     } catch (err: any) {
// // //       setError(err.message);
// // //       alert(err.message);
// // //     }
// // //   };

// // //   const getStatusColor = (status: string) => {
// // //     switch (status) {
// // //       case 'PENDING': return 'bg-yellow-100 text-yellow-800';
// // //       case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
// // //       case 'SHIPPED': return 'bg-purple-100 text-purple-800';
// // //       case 'DELIVERED': return 'bg-green-100 text-green-800';
// // //       case 'CANCELLED': return 'bg-red-100 text-red-800';
// // //       default: return 'bg-gray-100 text-gray-800';
// // //     }
// // //   };

// // //   if (loading) return <AdminLayout title="Order Management">Loading orders...</AdminLayout>;
// // //   if (error) return <AdminLayout title="Order Management">Error: {error}</AdminLayout>;

// // //   return (
// // //     <AdminLayout title="Order Management">
// // //       <Head>
// // //         <title>Orders | Order App Admin</title>
// // //       </Head>
// // //       <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

// // //       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
// // //         <table className="min-w-full divide-y divide-gray-200">
// // //           <thead className="bg-gray-50">
// // //             <tr>
// // //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Order ID
// // //               </th>
// // //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Customer
// // //               </th>
// // //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Total
// // //               </th>
// // //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Status
// // //               </th>
// // //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Items
// // //               </th>
// // //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Order Date
// // //               </th>
// // //               <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Actions
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody className="bg-white divide-y divide-gray-200">
// // //             {orders.map((order) => (
// // //               <tr key={order.id}>
// // //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// // //                   {order.id.substring(0, 8)}...
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                   {order?.party?.name || order?.party?.email || 'N/A'}
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
// // //                     {order.status}
// // //                   </span>
// // //                 </td>
// // //                 <td className="px-6 py-4 text-sm text-gray-500">
// // //                   <ul>
// // //                     {order.orderItems.map((item, index) => (
// // //                       <li key={index}>
// // //                         {item.product.name} (x{item.quantity}) - ${item.price.toFixed(2)} ea.
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                   {new Date(order.createdAt).toLocaleDateString()}
// // //                 </td>
// // //                 {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// // //                   <select
// // //                     value={order.status}
// // //                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
// // //                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
// // //                   >
// // //                     {OrderStatusOptions.map((statusOption) => (
// // //                       <option key={statusOption} value={statusOption}>
// // //                         {statusOption}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </td> */}
// // //                 {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// // //   <select
// // //     value={order.status}
// // //     onChange={(e) => handleStatusChange(order.id, e.target.value)}
// // //     className="block max-w-xs pl-2 pr-6 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
// // //   >
// // //     {OrderStatusOptions.map((statusOption) => (
// // //       <option key={statusOption} value={statusOption}>
// // //         {statusOption}
// // //       </option>
// // //     ))}
// // //   </select>
// // // </td> */}
// // // <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// // //   <div className="relative inline-block w-full max-w-xs">
// // //     <select
// // //       value={order.status}
// // //       onChange={(e) => handleStatusChange(order.id, e.target.value)}
// // //       className="
// // //         block w-full appearance-none bg-white border border-gray-300 
// // //         text-gray-700 py-2 px-3 pr-8 rounded-lg shadow-sm 
// // //         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
// // //         transition duration-200 ease-in-out
// // //       "
// // //     >
// // //       {OrderStatusOptions.map((statusOption) => (
// // //         <option key={statusOption} value={statusOption}>
// // //           {statusOption}
// // //         </option>
// // //       ))}
// // //     </select>
// // //     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
// // //       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
// // //       </svg>
// // //     </div>
// // //   </div>
// // // </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </AdminLayout>
// // //   );
// // // };

// // // export default AdminOrdersPage;
// // "use client";
// // import { useState, useEffect } from "react";
// // import { Order, User, OrderItem, Product } from "@prisma/client";
// // import Head from "next/head";
// // import AdminLayout from "../../components/AdminLayout";
// // import { useAuth } from "../../context/Authcontext";

// // interface OrderWithDetails extends Order {
// //   user?: Pick<User, "id" | "name" | "email">;
// //   orderItems: (OrderItem & { product: Pick<Product, "name" | "price"> })[];
// //   party?: { id: string; name?: string; email?: string; phone?: string; address?: string };
// // }

// // const OrderStatusOptions = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

// // const AdminOrdersPage = () => {
// //   const [orders, setOrders] = useState<OrderWithDetails[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [search, setSearch] = useState("");

// //   const { token, fetchWithAuth } = useAuth();

// //   const fetchOrders = async (pageNum = 1, searchText = "") => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const res = await fetchWithAuth(
// //         `/api/orders?page=${pageNum}&limit=10&search=${encodeURIComponent(searchText)}`,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       if (!res.ok) {
// //         const errData = await res.json();
// //         throw new Error(errData.message || `Error fetching orders: ${res.status}`);
// //       }

// //       const result = await res.json();
// //       const { data, meta } = result;
// //       setOrders(data);
// //       setTotalPages(meta.totalPages || 1);
// //     } catch (err: any) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (token) fetchOrders(page, search);
// //   }, [token, page]);

// //   const handleStatusChange = async (orderId: string, newStatus: string) => {
// //     if (!confirm(`Change status of Order ${orderId.substring(0, 8)}... to ${newStatus}?`)) return;
// //     try {
// //       const res = await fetchWithAuth(`/api/orders/${orderId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ status: newStatus }),
// //       });

// //       if (!res.ok) {
// //         const errData = await res.json();
// //         throw new Error(errData.message || `Error updating order status: ${res.status}`);
// //       }

// //       await res.json();
// //       fetchOrders(page, search);
// //       alert("Order status updated successfully!");
// //     } catch (err: any) {
// //       setError(err.message);
// //       alert(err.message);
// //     }
// //   };

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case "PENDING":
// //         return "bg-yellow-100 text-yellow-800";
// //       case "CONFIRMED":
// //         return "bg-blue-100 text-blue-800";
// //       case "SHIPPED":
// //         return "bg-purple-100 text-purple-800";
// //       case "DELIVERED":
// //         return "bg-green-100 text-green-800";
// //       case "CANCELLED":
// //         return "bg-red-100 text-red-800";
// //       default:
// //         return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setPage(1);
// //     fetchOrders(1, search);
// //   };

// //   if (loading)
// //     return <AdminLayout title="Order Management">Loading orders...</AdminLayout>;
// //   if (error)
// //     return <AdminLayout title="Order Management">Error: {error}</AdminLayout>;

// //   return (
// //     <AdminLayout title="Order Management">
// //       <Head>
// //         <title>Orders | Admin</title>
// //       </Head>

// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
// //         <form onSubmit={handleSearch} className="flex space-x-2">
// //           <input
// //             type="text"
// //             placeholder="Search orders..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //           />
// //           <button
// //             type="submit"
// //             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
// //           >
// //             Search
// //           </button>
// //         </form>
// //       </div>

// //       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               {[
// //                 "Order ID",
// //                 "Customer",
// //                 "Total",
// //                 "Status",
// //                 "Items",
// //                 "Order Date",
// //                 "Actions",
// //               ].map((header) => (
// //                 <th
// //                   key={header}
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
// //                 >
// //                   {header}
// //                 </th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {orders.map((order) => (
// //               <tr key={order.id}>
// //                 <td className="px-6 py-4 text-sm font-medium text-gray-900">
// //                   {order.id.substring(0, 8)}...
// //                 </td>
// //                 <td className="px-6 py-4 text-sm text-gray-500">
// //                   {order?.party?.name || order?.party?.email || "N/A"}
// //                 </td>
// //                 <td className="px-6 py-4 text-sm text-gray-500">
// //                   ₹{order.total.toFixed(2)}
// //                 </td>
// //                 <td className="px-6 py-4">
// //                   <span
// //                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
// //                       order.status
// //                     )}`}
// //                   >
// //                     {order.status}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 text-sm text-gray-500">
// //                   <ul>
// //                     {order.orderItems.map((item, i) => (
// //                       <li key={i}>
// //                         {item.product.name} (x{item.quantity})
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </td>
// //                 <td className="px-6 py-4 text-sm text-gray-500">
// //                   {new Date(order.createdAt).toLocaleDateString()}
// //                 </td>
// //                 <td className="px-6 py-4 text-right text-sm font-medium">
// //                   <div className="relative inline-block w-full max-w-xs">
// //                     <select
// //                       value={order.status}
// //                       onChange={(e) =>
// //                         handleStatusChange(order.id, e.target.value)
// //                       }
// //                       className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
// //                     >
// //                       {OrderStatusOptions.map((statusOption) => (
// //                         <option key={statusOption} value={statusOption}>
// //                           {statusOption}
// //                         </option>
// //                       ))}
// //                     </select>
// //                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
// //                       <svg
// //                         className="h-4 w-4"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth="2"
// //                           d="M19 9l-7 7-7-7"
// //                         />
// //                       </svg>
// //                     </div>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         {/* ✅ Pagination Controls */}
// //         <div className="flex items-center justify-between mt-6">
// //           <button
// //             onClick={() => setPage((p) => Math.max(1, p - 1))}
// //             disabled={page === 1}
// //             className={`px-4 py-2 rounded-md ${
// //               page === 1
// //                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //                 : "bg-indigo-600 text-white hover:bg-indigo-700"
// //             }`}
// //           >
// //             Previous
// //           </button>

// //           <span className="text-sm text-gray-600">
// //             Page <strong>{page}</strong> of <strong>{totalPages}</strong>
// //           </span>

// //           <button
// //             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //             disabled={page === totalPages}
// //             className={`px-4 py-2 rounded-md ${
// //               page === totalPages
// //                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //                 : "bg-indigo-600 text-white hover:bg-indigo-700"
// //             }`}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </AdminLayout>
// //   );
// // };

// // export default AdminOrdersPage;
// // "use client";
// // import { useEffect, useState } from "react";
// // import Head from "next/head";
// // import AdminLayout from "@/app/components/AdminLayout";
// // import { useAuth } from "@/app/context/Authcontext";

// // interface OrderItem {
// //   product: { name: string; price: number };
// //   quantity: number;
// //   price: number;
// // }

// // interface Party {
// //   name?: string;
// //   email?: string;
// //   phone?: string;
// // }

// // interface Order {
// //   id: string;
// //   total: number;
// //   status: string;
// //   createdAt: string;
// //   orderItems: OrderItem[];
// //   party?: Party;
// // }

// // // ✅ Allowed transitions (admin only)
// // const getAvailableStatusOptions = (currentStatus: string) => {
// //   switch (currentStatus) {
// //     case "PENDING":
// //       return ["PENDING", "CONFIRMED", "CANCELLED"];
// //     case "CONFIRMED":
// //       return ["CONFIRMED", "SHIPPED", "CANCELLED"];
// //     case "SHIPPED":
// //     case "DELIVERED":
// //     case "CANCELLED":
// //     default:
// //       return [currentStatus]; // Locked
// //   }
// // };

// // // ✅ Color helper
// // const getStatusColorClass = (status: string) => {
// //   switch (status) {
// //     case "PENDING":
// //       return "bg-yellow-100 text-yellow-800";
// //     case "CONFIRMED":
// //       return "bg-blue-100 text-blue-800";
// //     case "SHIPPED":
// //       return "bg-purple-100 text-purple-800";
// //     case "DELIVERED":
// //       return "bg-green-100 text-green-800";
// //     case "CANCELLED":
// //       return "bg-red-100 text-red-800";
// //     default:
// //       return "bg-gray-100 text-gray-800";
// //   }
// // };

// // export default function OrdersAdminPage() {
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [totalOrders, setTotalOrders] = useState(0);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;

// //   const { token, fetchWithAuth } = useAuth();

// //   // ✅ Fetch Orders
// //   const fetchOrders = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetchWithAuth(
// //         `/api/orders?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
// //       );
// //       const result = await res.json();
// //       const { data, meta } = result;
// //       setOrders(data || []);
// //       setTotalOrders(meta?.totalCount || 0);
// //     } catch (err) {
// //       console.error("Error fetching orders:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrders();
// //   }, [currentPage, searchQuery]);

// //   // ✅ Handle Status Change
// //   const handleStatusChange = async (orderId: string, newStatus: string) => {
// //     if (!confirm(`Change order status to ${newStatus}?`)) return;
// //     try {
// //       const res = await fetchWithAuth(`/api/orders/${orderId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ status: newStatus }),
// //       });

// //       if (!res.ok) throw new Error("Failed to update status");
// //       await res.json();
// //       fetchOrders();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error updating status");
// //     }
// //   };

// //   const totalPages = Math.ceil(totalOrders / itemsPerPage);

// //   return (
// //     <AdminLayout title="Orders Management">
// //       <Head>
// //         <title>Orders | Order App Admin</title>
// //       </Head>

// //       <div className="p-1">
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-6">
// //           <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
// //         </div>

// //         {/* Search */}
// //         <input
// //           type="text"
// //           placeholder="Search by Order ID, Party Name or Phone..."
// //           value={searchQuery}
// //           onChange={(e) => {
// //             setSearchQuery(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded mb-4"
// //         />

// //         {/* Table */}
// //         {loading ? (
// //           <p>Loading...</p>
// //         ) : (
// //           <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
// //             <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Order ID
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Party
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Total
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Items
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Created
// //                   </th>
// //                   <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">
// //                     Action
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {orders.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={7} className="text-center py-6 text-gray-500">
// //                       No orders found
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   orders.map((order) => (
// //                     <tr key={order.id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4">{order.id.substring(0, 8)}...</td>
// //                       <td className="px-6 py-4">
// //                         {order.party?.name || order.party?.email || "N/A"}
// //                       </td>
// //                       <td className="px-6 py-4 font-semibold">
// //                         ₹{order.total.toFixed(2)}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <span
// //                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
// //                             order.status
// //                           )}`}
// //                         >
// //                           {order.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 text-gray-600">
// //                         <ul>
// //                           {order.orderItems.map((item, i) => (
// //                             <li key={i}>
// //                               {item.product.name} (x{item.quantity})
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         {new Date(order.createdAt).toLocaleDateString()}
// //                       </td>

// //                       {/* ✅ Action column */}
// //                       <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
// //                         {["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status) ? (
// //                           <div className="flex items-center space-x-1">
// //                             <span
// //                               className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(
// //                                 order.status
// //                               )}`}
// //                             >
// //                               {order.status}
// //                             </span>

// //                             {/* 🔒 Lock icon */}
// //                             <svg
// //                               xmlns="http://www.w3.org/2000/svg"
// //                               className="h-4 w-4 text-gray-400"
// //                               fill="none"
// //                               viewBox="0 0 24 24"
// //                               stroke="currentColor"
// //                             >
// //                               <path
// //                                 strokeLinecap="round"
// //                                 strokeLinejoin="round"
// //                                 strokeWidth={2}
// //                                 d="M12 11V7a4 4 0 10-8 0v4m8 0a4 4 0 008 0V7a4 4 0 00-8 0zM5 11h14v10H5V11z"
// //                               />
// //                             </svg>

// //                             {order.status === "SHIPPED" && (
// //                               <span className="text-xs text-gray-500">
// //                                 (Locked for Salesman)
// //                               </span>
// //                             )}
// //                           </div>
// //                         ) : (
// //                           <select
// //                             value={order.status}
// //                             onChange={(e) =>
// //                               handleStatusChange(order.id, e.target.value)
// //                             }
// //                             className="border border-gray-300 bg-white text-gray-800 py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                           >
// //                             {getAvailableStatusOptions(order.status).map(
// //                               (status) => (
// //                                 <option key={status} value={status}>
// //                                   {status}
// //                                 </option>
// //                               )
// //                             )}
// //                           </select>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>

// //             {/* Pagination */}
// //             {totalPages > 1 && (
// //               <div className="flex justify-center mt-4 space-x-2">
// //                 {Array.from({ length: totalPages }, (_, i) => (
// //                   <button
// //                     key={i + 1}
// //                     onClick={() => setCurrentPage(i + 1)}
// //                     className={`px-3 py-1 rounded ${
// //                       currentPage === i + 1
// //                         ? "bg-blue-600 text-white"
// //                         : "bg-gray-200 text-gray-700"
// //                     }`}
// //                   >
// //                     {i + 1}
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </AdminLayout>
// //   );
// // }
// // "use client";
// // import { useEffect, useState } from "react";
// // import Head from "next/head";
// // import AdminLayout from "@/app/components/AdminLayout";
// // import { useAuth } from "@/app/context/Authcontext";
// // import Papa from "papaparse"; // ✅ For CSV export

// // interface OrderItem {
// //   product: { name: string; price: number };
// //   quantity: number;
// //   price: number;
// // }

// // interface Party {
// //   name?: string;
// //   email?: string;
// //   phone?: string;
// // }

// // interface Salesman {
// //   id: string;
// //   name: string;
// //   email?: string;
// // }

// // interface Order {
// //   id: string;
// //   total: number;
// //   status: string;
// //   createdAt: string;
// //   orderItems: OrderItem[];
// //   party?: Party;
// //   user?: Salesman;
// // }

// // // ✅ Status color helper
// // const getStatusColorClass = (status: string) => {
// //   switch (status) {
// //     case "PENDING":
// //       return "bg-yellow-100 text-yellow-800";
// //     case "CONFIRMED":
// //       return "bg-blue-100 text-blue-800";
// //     case "SHIPPED":
// //       return "bg-purple-100 text-purple-800";
// //     case "DELIVERED":
// //       return "bg-green-100 text-green-800";
// //     case "CANCELLED":
// //       return "bg-red-100 text-red-800";
// //     default:
// //       return "bg-gray-100 text-gray-800";
// //   }
// // };

// // // ✅ Status flow for Admin
// // const getAvailableStatusOptions = (currentStatus: string) => {
// //   switch (currentStatus) {
// //     case "PENDING":
// //       return ["PENDING", "CONFIRMED", "CANCELLED"];
// //     case "CONFIRMED":
// //       return ["CONFIRMED", "SHIPPED", "CANCELLED"];
// //     default:
// //       return [currentStatus];
// //   }
// // };

// // export default function AdminOrdersPage() {
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [totalOrders, setTotalOrders] = useState(0);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;

// //   const { token, fetchWithAuth } = useAuth();

// //   // ✅ Fetch orders
// //   const fetchOrders = async () => {
// //     try {
// //       setLoading(true);
// //       const queryParams = new URLSearchParams({
// //         page: currentPage.toString(),
// //         limit: itemsPerPage.toString(),
// //       });
// //       if (searchQuery) queryParams.append("search", searchQuery);

// //       const res = await fetchWithAuth(`/api/orders?${queryParams.toString()}`);
// //       const result = await res.json();

// //       if (!res.ok) throw new Error(result.message || "Failed to fetch orders");

// //       const { data, meta } = result;
// //       console.log(data,'datatatta')
// //       setOrders(data || []);
// //       setTotalOrders(meta?.totalCount || 0);
// //     } catch (err) {
// //       console.error("Error fetching orders:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrders();
// //   }, [currentPage, searchQuery]);

// //   // ✅ Update order status
// //   const handleStatusChange = async (orderId: string, newStatus: string) => {
// //     if (!confirm(`Change status to ${newStatus}?`)) return;
// //     try {
// //       const res = await fetchWithAuth(`/api/orders/${orderId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ status: newStatus }),
// //       });

// //       if (!res.ok) throw new Error("Failed to update order");
// //       await res.json();
// //       fetchOrders();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error updating order");
// //     }
// //   };

// //   // ✅ Export to CSV
// //   const handleExport = () => {
// //     if (orders.length === 0) {
// //       alert("No data available to export!");
// //       return;
// //     }

// //     const csvData = orders.map((o) => ({
// //       OrderID: o.id,
// //       Salesman: o.user?.name || o.user?.email || "N/A",
// //       Party: o.party?.name || "N/A",
// //       Total: o.total.toFixed(2),
// //       Status: o.status,
// //       CreatedAt: new Date(o.createdAt).toLocaleDateString(),
// //     }));

// //     const csv = Papa.unparse(csvData);
// //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// //     const url = window.URL.createObjectURL(blob);

// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.setAttribute(
// //       "download",
// //       `Orders_${new Date().toISOString().split("T")[0]}.csv`
// //     );
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   const totalPages = Math.ceil(totalOrders / itemsPerPage);

// //   return (
// //     <AdminLayout title="Orders Management">
// //       <Head>
// //         <title>Orders | Admin Dashboard</title>
// //       </Head>

// //       <div className="p-1">
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-6">
// //           <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
// //         </div>

// //         {/* 🔍 Search & Export */}
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
// //           <input
// //             type="text"
// //             placeholder="Search by Order ID or Party Name..."
// //             value={searchQuery}
// //             onChange={(e) => {
// //               setSearchQuery(e.target.value);
// //               setCurrentPage(1);
// //             }}
// //             className="w-full sm:w-72 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded"
// //           />

// //           {/* ✅ Export Button */}
// //           <button
// //             onClick={handleExport}
// //             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
// //           >
// //             <span className="flex items-center gap-2">
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M12 16v-8m0 8l4-4m-4 4l-4-4M4 20h16"
// //                 />
// //               </svg>
// //               Export CSV
// //             </span>
// //           </button>
// //         </div>

// //         {/* Table */}
// //         {loading ? (
// //           <p>Loading...</p>
// //         ) : (
// //           <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
// //             <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Order ID
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Salesman
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Party
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Total
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
// //                     Created
// //                   </th>
// //                   <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">
// //                     Action
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {orders.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={7} className="text-center py-6 text-gray-500">
// //                       No orders found
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   orders.map((order) => (
// //                     <tr key={order.id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4">
// //                         {order.id.substring(0, 8)}...
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         {order.user?.name || order.user?.email || "N/A"}
// //                       </td>
// //                       <td className="px-6 py-4">{order.party?.name || "N/A"}</td>
// //                       <td className="px-6 py-4 font-semibold">
// //                         ₹{order.total.toFixed(2)}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <span
// //                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
// //                             order.status
// //                           )}`}
// //                         >
// //                           {order.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         {new Date(order.createdAt).toLocaleDateString()}
// //                       </td>
// //                       <td className="px-6 py-4 text-right">
// //                         {["SHIPPED", "DELIVERED", "CANCELLED"].includes(
// //                           order.status
// //                         ) ? (
// //                           <span className="text-xs text-gray-500">(Locked)</span>
// //                         ) : (
// //                           <select
// //                             value={order.status}
// //                             onChange={(e) =>
// //                               handleStatusChange(order.id, e.target.value)
// //                             }
// //                             className="border border-gray-300 bg-white text-gray-800 py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                           >
// //                             {getAvailableStatusOptions(order.status).map(
// //                               (status) => (
// //                                 <option key={status} value={status}>
// //                                   {status}
// //                                 </option>
// //                               )
// //                             )}
// //                           </select>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>

// //             {/* Pagination */}
// //             {totalPages > 1 && (
// //               <div className="flex justify-center mt-4 space-x-2">
// //                 {Array.from({ length: totalPages }, (_, i) => (
// //                   <button
// //                     key={i + 1}
// //                     onClick={() => setCurrentPage(i + 1)}
// //                     className={`px-3 py-1 rounded ${
// //                       currentPage === i + 1
// //                         ? "bg-blue-600 text-white"
// //                         : "bg-gray-200 text-gray-700"
// //                     }`}
// //                   >
// //                     {i + 1}
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </AdminLayout>
// //   );
// // }

// "use client";
// import { useEffect, useState } from "react";
// import Head from "next/head";
// import AdminLayout from "@/app/components/AdminLayout";
// import { useAuth } from "@/app/context/Authcontext";
// import Papa from "papaparse"; // npm install papaparse

// interface OrderItem {
//   product: { name: string; price: number };
//   quantity: number;
//   price: number;
// }

// interface Party {
//   name?: string;
//   email?: string;
//   phone?: string;
// }

// interface Salesman {
//   id: string;
//   name: string;
//   email?: string;
// }

// interface Order {
//   id: string;
//   total: number;
//   status: string;
//   createdAt: string;
//   orderItems: OrderItem[];
//   party?: Party;
//   user?: Salesman;
// }

// // ✅ Status color helper
// const getStatusColorClass = (status: string) => {
//   switch (status) {
//     case "PENDING":
//       return "bg-yellow-100 text-yellow-800";
//     case "CONFIRMED":
//       return "bg-blue-100 text-blue-800";
//     case "SHIPPED":
//       return "bg-purple-100 text-purple-800";
//     case "DELIVERED":
//       return "bg-green-100 text-green-800";
//     case "CANCELLED":
//       return "bg-red-100 text-red-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// // ✅ Status flow options
// const getAvailableStatusOptions = (currentStatus: string) => {
//   switch (currentStatus) {
//     case "PENDING":
//       return ["PENDING", "CONFIRMED", "CANCELLED"];
//     case "CONFIRMED":
//       return ["CONFIRMED", "SHIPPED", "CANCELLED"];
//     default:
//       return [currentStatus];
//   }
// };

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const { token, fetchWithAuth } = useAuth();

//   // ✅ Fetch orders
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//       });
//       if (searchQuery) queryParams.append("search", searchQuery);

//       const res = await fetchWithAuth(`/api/orders?${queryParams.toString()}`);
//       const { data, meta } = await res.json();
// console.log(data,'datatat')
//       setOrders(data || []);
//       setTotalOrders(meta?.totalCount || 0);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [currentPage, searchQuery]);

//   // ✅ Update order status
//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     if (!confirm(`Change status to ${newStatus}?`)) return;
//     try {
//       const res = await fetchWithAuth(`/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error("Failed to update order");
//       await res.json();
//       fetchOrders();
//     } catch (err) {
//       console.error(err);
//       alert("Error updating order");
//     }
//   };

//   // ✅ Export to CSV
//   const handleExport = () => {
//     if (orders.length === 0) {
//       alert("No data available to export!");
//       return;
//     }

//     const csvData = orders.map((o) => ({
//       OrderID: o.id,
//       Salesman: o.user?.name || "N/A",
//       Party: o.party?.name || "N/A",
//       Total: o.total.toFixed(2),
//       Status: o.status,
//       CreatedAt: new Date(o.createdAt).toLocaleDateString(),
//     }));

//     const csv = Papa.unparse(csvData);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `Orders_${new Date().toISOString().split("T")[0]}.csv`
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const totalPages = Math.ceil(totalOrders / itemsPerPage);

//   return (
//     <AdminLayout title="Orders Management">
//       <Head>
//         <title>Orders | Admin Dashboard</title>
//       </Head>

//       <div className="p-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
//         </div>

//         {/* 🔍 Filters + Export */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 w-full">
//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <input
//               type="text"
//               placeholder="Search by Order ID or Party Name..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full sm:w-72 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Export CSV Button */}
//           <button
//             onClick={handleExport}
//             className="self-end sm:self-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition flex items-center gap-2"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 16v-8m0 8l4-4m-4 4l-4-4M4 20h16"
//               />
//             </svg>
//             Export CSV
//           </button>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
//             <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Order ID</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Salesman</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Party</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Total</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Created</th>
//                   <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-200">
//                 {orders.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-6 text-gray-500">
//                       No orders found
//                     </td>
//                   </tr>
//                 ) : (
//                   orders.map((order) => (
//                     <tr key={order.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{order.id.substring(0, 8)}...</td>
//                       <td className="px-6 py-4">{order.user?.name || "N/A"}</td>
//                       <td className="px-6 py-4">{order.party?.name || "N/A"}</td>
//                       <td className="px-6 py-4 font-semibold">₹{order.total.toFixed(2)}</td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
//                             order.status
//                           )}`}
//                         >
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </td>

//                       {/* Action column with lock icon */}
//                       <td className="px-6 py-4 text-right">
//                         {["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status) ? (
//                           <div className="flex justify-end items-center text-gray-500 text-sm gap-1">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-4 w-4 text-gray-500"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth={2}
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M12 11c.6 0 1 .4 1 1v2h-2v-2c0-.6.4-1 1-1zm6-1V9a6 6 0 10-12 0v1H4v10h16V10h-2zm-8 0V9a4 4 0 018 0v1H10z"
//                               />
//                             </svg>
//                             <span>(Locked)</span>
//                           </div>
//                         ) : (
//                           <select
//                             value={order.status}
//                             onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                             className="border border-gray-300 bg-white text-gray-800 py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                           >
//                             {getAvailableStatusOptions(order.status).map((status) => (
//                               <option key={status} value={status}>
//                                 {status}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-4 space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-3 py-1 rounded ${
//                       currentPage === i + 1
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-200 text-gray-700"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "@/app/components/AdminLayout";
import { useAuth } from "@/app/context/Authcontext";
import Papa from "papaparse"; // npm install papaparse

interface OrderItem {
  product: { name: string; price: number };
  quantity: number;
  price: number;
}

interface Party {
  name?: string;
  email?: string;
  phone?: string;
}

interface Salesman {
  id: string;
  name: string;
  email?: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
  party?: Party;
  user?: Salesman;
}

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { token, fetchWithAuth } = useAuth();

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (searchQuery) queryParams.append("search", searchQuery);

      const res = await fetchWithAuth(`/api/orders?${queryParams.toString()}`);
      const { data, meta } = await res.json();
      setOrders(data || []);
      setTotalOrders(meta?.totalCount || 0);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery]);

  // ✅ Update order status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!confirm(`Change status to ${newStatus}?`)) return;
    try {
      const res = await fetchWithAuth(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      await res.json();
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Error updating order");
    }
  };

  // ✅ Export to CSV
  const handleExport = () => {
    if (orders.length === 0) {
      alert("No data available to export!");
      return;
    }

    const csvData = orders.map((o) => ({
      OrderID: o.id,
      Salesman: o.user?.name || "N/A",
      Party: o.party?.name || "N/A",
      Total: o.total.toFixed(2),
      Status: o.status,
      CreatedAt: new Date(o.createdAt).toLocaleDateString(),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <AdminLayout title="Orders Management">
      <Head>
        <title>Orders | Admin Dashboard</title>
      </Head>

      <div className="p-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 w-full">
          <input
            type="text"
            placeholder="Search by Order ID or Party Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-72 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition flex items-center gap-2"
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Salesman</th>
                  <th className="px-6 py-3 text-left">Party</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      {/* ✅ Clickable Order ID → navigates to details */}
                      <td className="px-6 py-4 font-semibold text-blue-600 hover:underline">
                        <Link href={`/admin/orders/${order.id}`}>
                          {order.id.substring(0, 8)}...
                        </Link>
                      </td>
                      <td className="px-6 py-4">{order.user?.name || "N/A"}</td>
                      <td className="px-6 py-4">{order.party?.name || "N/A"}</td>
                      <td className="px-6 py-4 font-semibold">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {["SHIPPED", "DELIVERED", "CANCELLED"].includes(
                          order.status
                        ) ? (
                          <span className="text-gray-400 text-sm">Locked</span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="border border-gray-300 bg-white text-gray-800 py-1 px-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            {getAvailableStatusOptions(order.status).map(
                              (status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
