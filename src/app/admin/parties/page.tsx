// "use client";

// import { useEffect, useState } from "react";
// import Head from "next/head";
// import { useAuth } from "@/app/context/Authcontext";

// interface Party {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string | null;
//   address?: string | null;
//   createdAt: string;
// }

// type SortField = "name" | "phone" | "email" | "createdAt";
// type SortOrder = "asc" | "desc";

// export default function PartiesAdminPage() {
//   const [parties, setParties] = useState<Party[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalParties, setTotalParties] = useState(0);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

//   const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const [sortField, setSortField] = useState<SortField>("createdAt");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//   const { token,fetchWithAuth } = useAuth();

//   // Fetch parties (server-side pagination, sorting, search)
//   const fetchParties = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchWithAuth(
//         `/api/party?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
//       );
//       const data = await res.json();
//       setParties(data.parties);
//       setTotalParties(data.total);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchParties(); }, [currentPage, searchQuery, sortField, sortOrder]);

//   // Modal handlers
//   const openModal = (party?: Party) => {
//     if (party) {
//       setEditingId(party.id);
//       setForm({ name: party.name, phone: party.phone, email: party.email || "", address: party.address || "" });
//     } else {
//       setEditingId(null);
//       setForm({ name: "", phone: "", email: "", address: "" });
//     }
//     setModalOpen(true);
//   };
//   const closeModal = () => setModalOpen(false);

//   // Add/Edit party
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.phone.trim()) return alert("Name and Phone are required");

//     try {
//       setSubmitting(true);
//       const url = editingId ? `/api/party/${editingId}` : "/api/party";
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) return alert((await res.json()).message || "Operation failed");

//       setModalOpen(false);
//       await fetchParties();
//     } catch (err) { console.error(err); }
//     finally { setSubmitting(false); }
//   };

//   // Delete party
//   const handleDelete = async () => {
//     if (!confirmDeleteId) return;
//     try {
//       const res = await fetch(`/api/party/${confirmDeleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to delete");
//       setConfirmDeleteId(null);
//       await fetchParties();
//     } catch (err) { console.error(err); }
//   };

//   // Sorting
//   const handleSort = (field: SortField) => {
//     if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else { setSortField(field); setSortOrder("asc"); }
//   };

//   const totalPages = Math.ceil(totalParties / itemsPerPage);

//   return (
//     <>
//       <Head><title>Admin | Parties</title></Head>
//       <div className="p-6 max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Parties Management</h1>
//           <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
//             + Add Party
//           </button>
//         </div>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name, phone, email or address..."
//           value={searchQuery}
//           onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//           className="w-full border px-4 py-2 rounded mb-4"
//         />

//         {loading ? <p>Loading...</p> : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {["name", "phone", "email", "address", "createdAt"].map((field) => (
//                     <th
//                       key={field}
//                       onClick={() => handleSort(field as SortField)}
//                       className="text-left px-4 py-2 cursor-pointer select-none"
//                     >
//                       {field === "createdAt" ? "Created" : field.charAt(0).toUpperCase() + field.slice(1)}
//                       {sortField === field && (sortOrder === "asc" ? " ▲" : " ▼")}
//                     </th>
//                   ))}
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {parties.map((party) => (
//                   <tr key={party.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-2">{party.name}</td>
//                     <td className="px-4 py-2">{party.phone}</td>
//                     <td className="px-4 py-2">{party.email || "-"}</td>
//                     <td className="px-4 py-2">{party.address || "-"}</td>
//                     <td className="px-4 py-2">{new Date(party.createdAt).toLocaleDateString()}</td>
//                     <td className="px-4 py-2 space-x-2">
//                       <button onClick={() => openModal(party)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
//                       <button onClick={() => setConfirmDeleteId(party.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-4 space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Add/Edit Modal */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
//               <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Party" : "Add Party"}</h2>
//               <form className="space-y-3" onSubmit={handleSubmit}>
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
//                 <div className="flex justify-end space-x-2 mt-4">
//                   <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
//                   <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{submitting ? "Saving..." : "Save"}</button>
//                 </div>
//               </form>
//               <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg">&times;</button>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation */}
//         {confirmDeleteId && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
//               <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//               <p className="mb-6">Are you sure you want to delete this party?</p>
//               <div className="flex justify-center space-x-4">
//                 <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
//                 <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import Head from "next/head";
// import { useAuth } from "@/app/context/Authcontext";

// interface Party {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string | null;
//   address?: string | null;
//   createdAt: string;
// }

// type SortField = "name" | "phone" | "email" | "address" | "createdAt";
// type SortOrder = "asc" | "desc";

// export default function PartiesAdminPage() {
//   const [parties, setParties] = useState<Party[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalParties, setTotalParties] = useState(0);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

//   const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const [sortField, setSortField] = useState<SortField>("createdAt");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

//   const { token,fetchWithAuth } = useAuth();

//   // Fetch parties (server-side pagination, sorting, search)
//   const fetchParties = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchWithAuth(
//         `/api/party?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
//       );
//       const data = await res.json();
//       setParties(data.parties);
//       setTotalParties(data.total);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchParties(); }, [currentPage, searchQuery, sortField, sortOrder]);

//   // Modal handlers
//   const openModal = (party?: Party) => {
//     if (party) {
//       setEditingId(party.id);
//       setForm({ name: party.name, phone: party.phone, email: party.email || "", address: party.address || "" });
//     } else {
//       setEditingId(null);
//       setForm({ name: "", phone: "", email: "", address: "" });
//     }
//     setModalOpen(true);
//   };
//   const closeModal = () => setModalOpen(false);

//   // Add/Edit party
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.phone.trim()) return alert("Name and Phone are required");

//     try {
//       setSubmitting(true);
//       const url = editingId ? `/api/party/${editingId}` : "/api/party";
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetchWithAuth(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) return alert((await res.json()).message || "Operation failed");

//       setModalOpen(false);
//       await fetchParties();
//     } catch (err) { console.error(err); }
//     finally { setSubmitting(false); }
//   };

//   // Delete party
//   const handleDelete = async () => {
//     if (!confirmDeleteId) return;
//     try {
//       const res = await fetchWithAuth(`/api/party/${confirmDeleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to delete");
//       setConfirmDeleteId(null);
//       await fetchParties();
//     } catch (err) { console.error(err); }
//   };

//   // Sorting
//   const handleSort = (field: SortField) => {
//     if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else { setSortField(field); setSortOrder("asc"); }
//   };

//   const totalPages = Math.ceil(totalParties / itemsPerPage);

//   return (
//     <>
//       <Head><title>Admin | Parties</title></Head>
//       <div className="p-6 max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Parties Management</h1>
//           <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
//             + Add Party
//           </button>
//         </div>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name, phone, email or address..."
//           value={searchQuery}
//           onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//           className="w-full border px-4 py-2 rounded mb-4"
//         />

//         {loading ? <p>Loading...</p> : (
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {["name", "phone", "email", "address", "createdAt"].map((field) => (
//                     <th
//                       key={field}
//                       onClick={() => handleSort(field as SortField)}
//                       className="text-left px-4 py-2 cursor-pointer select-none"
//                     >
//                       {field === "createdAt" ? "Created" : field.charAt(0).toUpperCase() + field.slice(1)}
//                       {sortField === field && (sortOrder === "asc" ? " ▲" : " ▼")}
//                     </th>
//                   ))}
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {parties.map((party) => (
//                   <tr key={party.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-2">{party.name}</td>
//                     <td className="px-4 py-2">{party.phone}</td>
//                     <td className="px-4 py-2">{party.email || "-"}</td>
//                     <td className="px-4 py-2">{party.address || "-"}</td>
//                     <td className="px-4 py-2">{new Date(party.createdAt).toLocaleDateString()}</td>
//                     <td className="px-4 py-2 space-x-2">
//                       <button onClick={() => openModal(party)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
//                       <button onClick={() => setConfirmDeleteId(party.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-4 space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Add/Edit Modal */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
//               <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Party" : "Add Party"}</h2>
//               <form className="space-y-3" onSubmit={handleSubmit}>
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
//                 <div className="flex justify-end space-x-2 mt-4">
//                   <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
//                   <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{submitting ? "Saving..." : "Save"}</button>
//                 </div>
//               </form>
//               <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg">&times;</button>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation */}
//         {confirmDeleteId && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
//               <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//               <p className="mb-6">Are you sure you want to delete this party?</p>
//               <div className="flex justify-center space-x-4">
//                 <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
//                 <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import Head from "next/head";
// // <-- wrap content here
// import { useAuth } from "@/app/context/Authcontext";
// import AdminLayout from "@/app/components/AdminLayout";

// interface Party {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string | null;
//   address?: string | null;
//   createdAt: string;
// }

// type SortField = "name" | "phone" | "email" | "address" | "createdAt";
// type SortOrder = "asc" | "desc";

// export default function PartiesAdminPage() {
//   const [parties, setParties] = useState<Party[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalParties, setTotalParties] = useState(0);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

//   const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const [sortField, setSortField] = useState<SortField>("createdAt");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

//   const { token, fetchWithAuth } = useAuth();

//   const fetchParties = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchWithAuth(
//         `/api/party?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
//       );
//       const data = await res.json();
//       setParties(data.parties);
//       setTotalParties(data.total);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchParties(); }, [currentPage, searchQuery, sortField, sortOrder]);

//   const openModal = (party?: Party) => {
//     if (party) {
//       setEditingId(party.id);
//       setForm({ name: party.name, phone: party.phone, email: party.email || "", address: party.address || "" });
//     } else {
//       setEditingId(null);
//       setForm({ name: "", phone: "", email: "", address: "" });
//     }
//     setModalOpen(true);
//   };
//   const closeModal = () => setModalOpen(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.phone.trim()) return alert("Name and Phone are required");

//     try {
//       setSubmitting(true);
//       const url = editingId ? `/api/party/${editingId}` : "/api/party";
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetchWithAuth(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) return alert((await res.json()).message || "Operation failed");

//       setModalOpen(false);
//       await fetchParties();
//     } catch (err) { console.error(err); }
//     finally { setSubmitting(false); }
//   };

//   const handleDelete = async () => {
//     if (!confirmDeleteId) return;
//     try {
//       const res = await fetchWithAuth(`/api/party/${confirmDeleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Failed to delete");
//       setConfirmDeleteId(null);
//       await fetchParties();
//     } catch (err) { console.error(err); }
//   };

//   const handleSort = (field: SortField) => {
//     if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else { setSortField(field); setSortOrder("asc"); }
//   };

//   const totalPages = Math.ceil(totalParties / itemsPerPage);

//   return (
//     <AdminLayout title="Parties Management">
//       <Head><title>Parties | Order App Admin</title></Head>

//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Parties</h1>
//           <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
//             + Add Party
//           </button>
//         </div>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name, phone, email or address..."
//           value={searchQuery}
//           onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//           className="w-full border px-4 py-2 rounded mb-4"
//         />

//         {loading ? <p>Loading...</p> : (
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {["name", "phone", "email", "address", "createdAt"].map((field) => (
//                     <th
//                       key={field}
//                       onClick={() => handleSort(field as SortField)}
//                       className="text-left px-4 py-2 cursor-pointer select-none"
//                     >
//                       {field === "createdAt" ? "Created" : field.charAt(0).toUpperCase() + field.slice(1)}
//                       {sortField === field && (sortOrder === "asc" ? " ▲" : " ▼")}
//                     </th>
//                   ))}
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {parties.map((party) => (
//                   <tr key={party.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-2">{party.name}</td>
//                     <td className="px-4 py-2">{party.phone}</td>
//                     <td className="px-4 py-2">{party.email || "-"}</td>
//                     <td className="px-4 py-2">{party.address || "-"}</td>
//                     <td className="px-4 py-2">{new Date(party.createdAt).toLocaleDateString()}</td>
//                     <td className="px-4 py-2 space-x-2">
//                       <button onClick={() => openModal(party)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
//                       <button onClick={() => setConfirmDeleteId(party.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-4 space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Modals */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
//               <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Party" : "Add Party"}</h2>
//               <form className="space-y-3" onSubmit={handleSubmit}>
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//                 <input className="w-full border px-3 py-2 rounded" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
//                 <div className="flex justify-end space-x-2 mt-4">
//                   <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
//                   <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{submitting ? "Saving..." : "Save"}</button>
//                 </div>
//               </form>
//               <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg">&times;</button>
//             </div>
//           </div>
//         )}

//         {confirmDeleteId && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
//               <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//               <p className="mb-6">Are you sure you want to delete this party?</p>
//               <div className="flex justify-center space-x-4">
//                 <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
//                 <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
"use client"; 
import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/app/components/AdminLayout";
import { useAuth } from "@/app/context/Authcontext";

interface Party {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  createdAt: string;
}

type SortField = "name" | "phone" | "email" | "address" | "createdAt";
type SortOrder = "asc" | "desc";

export default function PartiesAdminPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalParties, setTotalParties] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { token, fetchWithAuth } = useAuth();

  // Fetch parties
  const fetchParties = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(
        `/api/party?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const data = await res.json();
      setParties(data.parties);
      setTotalParties(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParties(); }, [currentPage, searchQuery, sortField, sortOrder]);

  // Open / close modal
  const openModal = (party?: Party) => {
    if (party) {
      setEditingId(party.id);
      setForm({ name: party.name, phone: party.phone, email: party.email || "", address: party.address || "" });
    } else {
      setEditingId(null);
      setForm({ name: "", phone: "", email: "", address: "" });
    }
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return alert("Name and Phone are required");

    try {
      setSubmitting(true);
      const url = editingId ? `/api/party/${editingId}` : "/api/party";
      const method = editingId ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (!res.ok) return alert((await res.json()).message || "Operation failed");

      setModalOpen(false);
      await fetchParties();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  // Delete party
  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetchWithAuth(`/api/party/${confirmDeleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setConfirmDeleteId(null);
      await fetchParties();
    } catch (err) { console.error(err); }
  };

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const totalPages = Math.ceil(totalParties / itemsPerPage);

  return (
    <AdminLayout title="Parties Management">
      <Head><title>Parties | Order App Admin</title></Head>

      <div className="p-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Parties</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            + Add Party
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, phone, email or address..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded mb-4"
        />

        {/* Table */}
        {loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  {["name", "phone", "email", "address", "createdAt"].map((field) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field as SortField)}
                      className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer select-none"
                    >
                      {field === "createdAt" ? "Created" : field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parties.map((party) => (
                  <tr key={party.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{party.name}</td>
                    <td className="px-6 py-4">{party.phone}</td>
                    <td className="px-6 py-4">{party.email || "-"}</td>
                    <td className="px-6 py-4">{party.address || "-"}</td>
                    <td className="px-6 py-4">{new Date(party.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(party)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                      <button onClick={() => setConfirmDeleteId(party.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {/* {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
              <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Party" : "Add Party"}</h2>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <input className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="w-full border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{submitting ? "Saving..." : "Save"}</button>
                </div>
              </form>
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg">&times;</button>
            </div>
          </div>
        )} */}

        {/* Delete Confirmation */}
        {/* {confirmDeleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete this party?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )} */}
        {/* Add/Edit Modal */}
{modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{editingId ? "Edit Party" : "Add Party"}</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded"
          placeholder="Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded"
          placeholder="Phone *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="w-full border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg"
      >
        &times;
      </button>
    </div>
  </div>
)}

{/* Delete Confirmation */}
{confirmDeleteId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
      <p className="mb-6 text-gray-700">Are you sure you want to delete this party?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setConfirmDeleteId(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </AdminLayout>
  );
}
