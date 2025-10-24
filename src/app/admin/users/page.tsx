// "use client"; 
// import { useState, useEffect } from 'react';

// import { User } from '@prisma/client';

// import Head from 'next/head';
// import UserFormModal from '@/app/components/UserFormModal';
// import AdminLayout from '../../components/AdminLayout';
// import { useAuth } from '../../context/Authcontext';

// const UserRoleOptions = ['CUSTOMER', 'ADMIN'];

// const AdminUsersPage = () => {
//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState<User | null>(null); // For edit
//     const { token, user: loggedInUser,fetchWithAuth } = useAuth(); // Get logged-in admin user
  
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetchWithAuth('/api/admin/users', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         if (!res.ok) {
//           const errData = await res.json();
//           throw new Error(errData.message || `Error fetching users: ${res.status}`);
//         }
//         const data = await res.json();
//         setUsers(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     useEffect(() => {
//       if (token) {
//         fetchUsers();
//       }
//     }, [token]);
  
//     const handleDelete = async (id: string) => {
//       if (id === loggedInUser?.id) {
//         alert("You cannot delete your own admin account!");
//         return;
//       }
//       if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
  
//       try {
//         const res = await fetchWithAuth(`/api/admin/users/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
  
//         if (!res.ok) {
//           const errData = await res.json();
//           throw new Error(errData.message || `Error deleting user: ${res.status}`);
//         }
  
//         setUsers(users.filter((u) => u.id !== id));
//         alert('User deleted successfully!');
//       } catch (err: any) {
//         setError(err.message);
//         alert(err.message);
//       }
//     };
  
//     const openCreateModal = () => {
//       setCurrentUser(null);
//       setIsModalOpen(true);
//     };
  
//     const openEditModal = (user: User) => {
//       setCurrentUser(user);
//       setIsModalOpen(true);
//     };
  
//     if (loading) return <AdminLayout title="User Management">Loading users...</AdminLayout>;
//     if (error) return <AdminLayout title="User Management">Error: {error}</AdminLayout>;
  
//     return (
//       <AdminLayout title="User Management">
//         <Head>
//           <title>Users | Order App Admin</title>
//         </Head>
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Users</h1>
//           <button
//             onClick={openCreateModal}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
//           >
//             Add New User
//           </button>
//         </div>
  
//         <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User ID
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created At
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {user.id.substring(0, 8)}...
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name || 'N/A'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className={`text-red-600 hover:text-red-900 ${user.id === loggedInUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       disabled={user.id === loggedInUser?.id}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
  
//         {isModalOpen && (
//           <UserFormModal
//             user={currentUser}
//             onClose={() => setIsModalOpen(false)}
//             onSave={fetchUsers} // Refresh users after save
//           />
//         )}
//       </AdminLayout>
//     );
//   };
  
//   export default AdminUsersPage;
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/Authcontext";
import UserFormModal from "@/app/components/UserFormModal";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

const roleOptions = ["ALL", "ADMIN", "SALESMAN", "CUSTOMER"];

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { token, user: loggedInUser, fetchWithAuth } = useAuth();

  const itemsPerPage = 5;

  // ✅ Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (searchQuery) queryParams.append("search", searchQuery);
      if (selectedRole !== "ALL") queryParams.append("role", selectedRole);

      const res = await fetchWithAuth(`/api/admin/users?${queryParams.toString()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error fetching users: ${res.status}`);
      }

      const { data, meta } = await res.json();
      setUsers(data);
      setTotalUsers(meta?.totalCount || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, currentPage, searchQuery, selectedRole]);

  // ✅ Delete user
  const handleDelete = async (id: string) => {
    if (id === loggedInUser?.id) {
      alert("You cannot delete your own admin account!");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetchWithAuth(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error deleting user: ${res.status}`);
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("User deleted successfully!");
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };

  // ✅ Modal actions
  const openCreateModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  if (loading)
    return (
      <AdminLayout title="User Management">
        <p>Loading users...</p>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout title="User Management">
        <p className="text-red-500">Error: {error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout title="User Management">
      <Head>
        <title>Users | Order App Admin</title>
      </Head>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded"
        />

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/4 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded"
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role === "ALL" ? "All Roles" : role}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4">{user.name || "N/A"}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-indigo-100 text-indigo-800"
                          : user.role === "SALESMAN"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === loggedInUser?.id}
                      className={`text-red-600 hover:text-red-800 ${
                        user.id === loggedInUser?.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Delete
                    </button>
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

      {/* Modal */}
      {isModalOpen && (
        <UserFormModal
          user={currentUser}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchUsers}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsersPage;
