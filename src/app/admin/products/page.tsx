// pages/admin/products.tsx
"use client"; 
import { useState, useEffect } from 'react';

import { Product } from '@prisma/client';

import Head from 'next/head';
import ProductFormModal from '@/app/components/ProductFormModal';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/Authcontext';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null); // For edit
  const { token,fetchWithAuth } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error fetching products: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Are you sure you want to delete this product?')) return;

  //   try {
  //     const res = await fetch(`/api/products/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (!res.ok) {
  //       const errData = await res.json();
  //       throw new Error(errData.message || `Error deleting product: ${res.status}`);
  //     }

  //     setProducts(products.filter((p) => p.id !== id));
  //     alert('Product deleted successfully!');
  //   } catch (err: any) {
  //     setError(err.message);
  //     alert(err.message);
  //   }
  // };
  // const handleDelete = async (id: string) => {
  //   if (!confirm('Are you sure you want to delete this product?')) return;
  
  //   try {
  //     const res = await fetch(`/api/products/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });
  
  //     if (!res.ok) {
  //       // Try parsing JSON only if content-length > 0
  //       let errMessage = `Error deleting product: ${res.status}`;
  //       const contentLength = res.headers.get('content-length');
  //       if (contentLength && parseInt(contentLength) > 0) {
  //         const errData = await res.json();
  //         errMessage = errData.message || errMessage;
  //       }
  //       throw new Error(errMessage);
  //     }
  
  //     setProducts(products.filter((p) => p.id !== id));
  //     alert('Product deleted successfully!');
  //   } catch (err: any) {
  //     setError(err.message);
  //     alert(err.message);
  //   }
  // };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
  
    try {
      const res = await fetchWithAuth(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      if (!res.ok) {
        let errMessage = `Error deleting product: ${res.status}`;
        if (res.headers.get('content-type')?.includes('application/json')) {
          const errData = await res.json();
          errMessage = errData.message || errMessage;
        }
        throw new Error(errMessage);
      }
  
      setProducts(products.filter((p) => p.id !== id));
      alert('Product deleted successfully!');
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };
  

  const openCreateModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  if (loading) return <AdminLayout title="Product Management">Loading products...</AdminLayout>;
  if (error) return <AdminLayout title="Product Management">Error: {error}</AdminLayout>;

  return (
    <AdminLayout title="Product Management">
      <Head>
        <title>Products | Order App Admin</title>
      </Head>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-2-6a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={currentProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchProducts} // Refresh products after save
        />
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;