// // pages/admin/products.tsx
// "use client"; 
// import { useState, useEffect } from 'react';

// import { Product } from '@prisma/client';

// import Head from 'next/head';
// import ProductFormModal from '@/app/components/ProductFormModal';
// import AdminLayout from '../../components/AdminLayout';
// import { useAuth } from '../../context/Authcontext';

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState<Product | null>(null); // For edit
//   const { token,fetchWithAuth } = useAuth();

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchWithAuth('/api/products', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || `Error fetching products: ${res.status}`);
//       }
//       const data = await res.json();
//       setProducts(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//     }
//   }, [token]);

//   // const handleDelete = async (id: string) => {
//   //   if (!confirm('Are you sure you want to delete this product?')) return;

//   //   try {
//   //     const res = await fetch(`/api/products/${id}`, {
//   //       method: 'DELETE',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //       },
//   //     });

//   //     if (!res.ok) {
//   //       const errData = await res.json();
//   //       throw new Error(errData.message || `Error deleting product: ${res.status}`);
//   //     }

//   //     setProducts(products.filter((p) => p.id !== id));
//   //     alert('Product deleted successfully!');
//   //   } catch (err: any) {
//   //     setError(err.message);
//   //     alert(err.message);
//   //   }
//   // };
//   // const handleDelete = async (id: string) => {
//   //   if (!confirm('Are you sure you want to delete this product?')) return;
  
//   //   try {
//   //     const res = await fetch(`/api/products/${id}`, {
//   //       method: 'DELETE',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //       },
//   //     });
  
//   //     if (!res.ok) {
//   //       // Try parsing JSON only if content-length > 0
//   //       let errMessage = `Error deleting product: ${res.status}`;
//   //       const contentLength = res.headers.get('content-length');
//   //       if (contentLength && parseInt(contentLength) > 0) {
//   //         const errData = await res.json();
//   //         errMessage = errData.message || errMessage;
//   //       }
//   //       throw new Error(errMessage);
//   //     }
  
//   //     setProducts(products.filter((p) => p.id !== id));
//   //     alert('Product deleted successfully!');
//   //   } catch (err: any) {
//   //     setError(err.message);
//   //     alert(err.message);
//   //   }
//   // };
  
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;
  
//     try {
//       const res = await fetchWithAuth(`/api/products/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
  
//       if (!res.ok) {
//         let errMessage = `Error deleting product: ${res.status}`;
//         if (res.headers.get('content-type')?.includes('application/json')) {
//           const errData = await res.json();
//           errMessage = errData.message || errMessage;
//         }
//         throw new Error(errMessage);
//       }
  
//       setProducts(products.filter((p) => p.id !== id));
//       alert('Product deleted successfully!');
//     } catch (err: any) {
//       setError(err.message);
//       alert(err.message);
//     }
//   };
  

//   const openCreateModal = () => {
//     setCurrentProduct(null);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (product: Product) => {
//     setCurrentProduct(product);
//     setIsModalOpen(true);
//   };

//   if (loading) return <AdminLayout title="Product Management">Loading products...</AdminLayout>;
//   if (error) return <AdminLayout title="Product Management">Error: {error}</AdminLayout>;

//   return (
//     <AdminLayout title="Product Management">
//       <Head>
//         <title>Products | Order App Admin</title>
//       </Head>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Products</h1>
//         <button
//           onClick={openCreateModal}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
//         >
//           Add New Product
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Image
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Category
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {product.imageUrl ? (
//                     <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded object-cover" />
//                   ) : (
//                     <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded text-gray-500">
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-2-6a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category || 'N/A'}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
//                     Edit
//                   </button>
//                   <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {isModalOpen && (
//         <ProductFormModal
//           product={currentProduct}
//           onClose={() => setIsModalOpen(false)}
//           onSave={fetchProducts} // Refresh products after save
//         />
//       )}
//     </AdminLayout>
//   );
// };

// export default AdminProductsPage;
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Product } from "@prisma/client";
import AdminLayout from "../../components/AdminLayout";
import ProductFormModal from "@/app/components/ProductFormModal";
import { useAuth } from "../../context/Authcontext";

const categoryOptions = ["ALL", "Food", "Drinks", "Electronics"];

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 5;

  const { token, fetchWithAuth } = useAuth();

  // ✅ Fetch products with filters and pagination
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchQuery) queryParams.append("search", searchQuery);
      if (selectedCategory !== "ALL")
        queryParams.append("category", selectedCategory);

      const res = await fetchWithAuth(`/api/products?${queryParams.toString()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch products");
      }

      const { data, meta } = await res.json();
      setProducts(data);
      setTotalProducts(meta?.totalCount || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token, currentPage, searchQuery, selectedCategory]);

  // ✅ Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetchWithAuth(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ✅ Modal actions
  const openCreateModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (loading)
    return <AdminLayout title="Product Management">Loading...</AdminLayout>;

  if (error)
    return (
      <AdminLayout title="Product Management">
        <p className="text-red-500">{error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Product Management">
      <Head>
        <title>Products | Order App Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/4 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "ALL" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-2-6a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
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
        <ProductFormModal
          product={currentProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchProducts}
        />
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;
