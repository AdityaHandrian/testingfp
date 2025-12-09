import { useState, useEffect } from 'react';
import { AlertCircle, Loader, Users as UsersIcon } from 'lucide-react';
import * as catalogApi from '../api/catalogApi';

/**
 * Users Page
 * Displays all users in the system and allows selection
 * Features:
 * - Browse user list
 * - View user details
 * - Display user statistics
 * - Future: View purchase history
 */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await catalogApi.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Gagal memuat data pengguna');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

  // Handle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Daftar Pengguna
          </h1>
          <p className="text-gray-600">
            Kelola pengguna dan lihat riwayat pembelian mereka
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama, username, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {isLoading ? (
              <span>Memuat data pengguna...</span>
            ) : (
              <span>
                Menampilkan <span className="font-semibold">{filteredUsers.length}</span> dari
                <span className="font-semibold ml-1">{users.length}</span> pengguna
              </span>
            )}
          </p>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} pengguna dipilih
              </span>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Hapus Pilihan
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600">Memuat pengguna...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery ? 'Pengguna Tidak Ditemukan' : 'Belum Ada Pengguna'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `Tidak ada pengguna yang cocok dengan pencarian "${searchQuery}"`
                : 'Belum ada pengguna terdaftar di sistem'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        )}

        {/* Users Table */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map((u) => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Nama
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-200 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                            {(user.name || user.username || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.name || user.username || 'Pengguna Tanpa Nama'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        @{user.username || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Box for Future Features */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">📝 Catatan:</span> Fitur riwayat pembelian pengguna akan ditambahkan di fase selanjutnya.
          </p>
        </div>
      </div>
    </div>
  );
}
