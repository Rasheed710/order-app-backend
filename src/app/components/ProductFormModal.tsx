// components/ProductFormModal.tsx
import { useState, useEffect } from 'react';
import { Product } from '@prisma/client';
import { useAuth } from '../context/Authcontext';

interface ProductFormModalProps {
  product: Product | null; // Null for create, Product object for edit
  onClose: () => void;
  onSave: () => void; // Callback to refresh product list
}

const ProductFormModal = ({ product, onClose, onSave }: ProductFormModalProps) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  useEffect(() => {
    if (product?.imageUrl) {
      setPreviewUrl(product.imageUrl); // This could be something like "/uploads/xxx.webp"
    }
  }, [product]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // preview image
    }
  };
  const [category, setCategory] = useState(product?.category || '');
  const [stock, setStock] = useState(product?.stock.toString() || '0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, fetchWithAuth } = useAuth();

  const isEditing = !!product;
console.log(imageFile,'hi')
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   const method = isEditing ? 'PUT' : 'POST';
  //   const url = isEditing ? `/api/products/${product.id}` : '/api/products';

  //   try {
  //     const res = await fetch(url, {
  //       method,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         name,
  //         description,
  //         price: parseFloat(price),
  //         imageFile,
  //         category,
  //         stock: parseInt(stock),
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
  //     }

  //     onSave(); // Refresh list
  //     onClose(); // Close modal
  //   } catch (err: any) {
  //     setError(err.message || 'An unexpected error occurred.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/products/${product.id}` : '/api/products';
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock.toString());
      if (imageFile) {
        formData.append('image', imageFile); // key must match API file field
      }
  
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`, // do NOT set Content-Type manually
        },
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }
  
      onSave(); // Refresh list
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>
          {/* <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div> */}
           <div className="mb-4">
      <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
        Select Image
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 max-h-40 rounded border"
        />
      )}
    </div>
          <div className="mb-6">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;