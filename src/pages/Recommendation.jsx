import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useRecommendation } from '../hooks/useRecommendation';
import ProductCard from '../components/ProductCard';
import { AlertCircle, Loader, Search, User } from 'lucide-react';

export default function Recommendation() {
  const [userIdInput, setUserIdInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  const { user: authUser, isAuthenticated } = useAuthContext();
  const {
    recommendations,
    isLoading,
    error,
    successMessage,
    fetchRecommendations,
    clearRecommendations,
    hasResults,
  } = useRecommendation();

  const handleGetRecommendations = (e) => {
    e.preventDefault();
    const userId = userIdInput || (isAuthenticated ? authUser?.id : '');
    if (!userId) {
      alert('Masukkan User ID atau login terlebih dahulu');
      return;
    }
    setCurrentUserId(userId);
    fetchRecommendations(userId);
  };

  const handleGetMyRecommendations = () => {
    if (!isAuthenticated) {
      alert('Login terlebih dahulu untuk melihat rekomendasi pribadi');
      return;
    }
    setCurrentUserId(authUser?.id);
    setUserIdInput(authUser?.id);
    fetchRecommendations(authUser?.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rekomendasi Produk untukmu
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dapatkan rekomendasi produk terbaik berdasarkan analisis sentimen dan collaborative filtering
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Masukkan User ID</h2>

        {isAuthenticated && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Logged in as:</strong> {authUser?.name} (ID: {authUser?.id})
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Klik "Dapatkan Rekomendasi Saya" untuk melihat rekomendasi pribadi
            </p>
          </div>
        )}

        <form onSubmit={handleGetRecommendations} className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            min="1"
            placeholder="Masukkan User ID (contoh: 1 atau 2)"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            <Search className="w-5 h-5 mr-2" />
            Cari Rekomendasi
          </button>
        </form>

        {isAuthenticated && (
          <button
            onClick={handleGetMyRecommendations}
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            <User className="w-5 h-5 mr-2" />
            Dapatkan Rekomendasi Saya
          </button>
        )}

        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">💡 User ID Demo Tersedia:</p>
          <p className="text-xs text-gray-600">
            • User ID: 1 (user123) - Muhammad Aditya
            <br />
            • User ID: 2 (aditya_h) - Aditya Handrian
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="space-y-4 mb-8">
        {isLoading && (
          <div className="text-center py-8">
            <Loader className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Mengambil rekomendasi terbaik untuk Anda...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Gagal memuat rekomendasi</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && !isLoading && !error && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {hasResults && !isLoading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Rekomendasi untuk User #{currentUserId}
            </h2>
            <button
              onClick={clearRecommendations}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Clear Results
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Produk</p>
              <p className="text-xl font-bold text-gray-900">{recommendations.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Rata-rata Rating</p>
              <p className="text-xl font-bold text-yellow-600">
                {(recommendations.reduce((acc, p) => acc + p.rating, 0) / recommendations.length).toFixed(1)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Rata-rata Sentimen</p>
              <p className="text-xl font-bold text-green-600">
                {Math.round(
                  (recommendations.reduce((acc, p) => acc + p.sentimentScore, 0) / recommendations.length) * 100
                )}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Kisaran Harga</p>
              <p className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(Math.min(...recommendations.map((p) => p.price)))} -
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(Math.max(...recommendations.map((p) => p.price)))}
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasResults && !isLoading && !error && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada rekomendasi</h3>
          <p className="text-gray-600 mb-4">Masukkan User ID di atas untuk mendapatkan rekomendasi produk</p>

          {isAuthenticated ? (
            <button
              onClick={handleGetMyRecommendations}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <User className="w-5 h-5 mr-2" />
              Dapatkan Rekomendasi Saya
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Login untuk Mulai
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
