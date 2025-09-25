// components/UserFormModal.tsx
import { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { useAuth } from '../context/Authcontext';


interface UserFormModalProps {
  user: User | null; // Null for create, User object for edit
  onClose: () => void;
  onSave: () => void; // Callback to refresh user list
}

const UserRoleOptions = ['CUSTOMER', 'ADMIN']; // Define available roles

const UserFormModal = ({ user, onClose, onSave }: UserFormModalProps) => {
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'CUSTOMER'); // Default to CUSTOMER for new
  const [password, setPassword] = useState(''); // For new user or changing existing
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user: loggedInUser } = useAuth(); // Get logged-in admin user from context

  const isEditing = !!user;

  // Disable changing own role/deleting own account
  const isSelf = user?.id === loggedInUser?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation for new user or if password field is touched for existing user
    if (!isEditing && (!password || !confirmPassword)) {
      setError('Password and confirm password are required for new users.');
      setLoading(false);
      return;
    }

    if (password && password !== confirmPassword) { // Only check if password is provided
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/admin/users/${user.id}` : '/api/admin/users';

    const userData: any = { email, name, role };
    if (password) { // Only send password if it's provided/changed
      userData.password = password;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} user`);
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
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isEditing} {/* Email usually not editable for existing users */}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSelf} // Prevent changing own role
            >
              {UserRoleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {isSelf && <p className="text-xs text-gray-500 mt-1">You cannot change your own role.</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              {isEditing ? 'New Password (optional)' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing} // Required for new users, optional for existing
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              {isEditing ? 'Confirm New Password' : 'Confirm Password'}
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isEditing || !!password} // Required if new password is being set, or for new user
            />
            {password && !confirmPassword && <p className="text-xs text-red-500 mt-1">Please confirm the new password.</p>}
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
              {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Add User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;