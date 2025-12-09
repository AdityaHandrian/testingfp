import { useState, useEffect } from 'react';
import { Search, AlertCircle, Loader } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useCatalog, useContextRecommendation } from '../hooks/useCatalog';
import CatalogItemCard from '../components/CatalogItemCard';
import AlgorithmComparisonModal from '../components/AlgorithmComparisonModal';

/**
 * Catalog Page
 * Displays all products and their context-aware recommendations
 * Features:
 * - Browse product catalog
 * - Search and filter products
 * - Click product to see recommendations from 4 algorithms
 * - Compare recommendations side-by-side
 */
export default function Catalog() {
  const { user } = useAuthContext();
  const {
    filteredItems,
    isLoading,
    error,
    searchQuery,
    selectedItem,
    itemCount,
    totalItemCount,
    handleSearch,
    clearSearch,
    selectItem,
    clearSelectedItem,
  } = useCatalog();

  const {
    recommendations,
    contextItem,
    isLoading: isLoadingRecommendations,
    error: recommendationError,
    algorithmErrors,
    fetchRecommendationsForContext,
    clearRecommendations,
  } = useContextRecommendation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Handle product selection and fetch recommendations
  const handleItemSelect = async (item) => {
    selectItem(item);

    // Only fetch recommendations if user is authenticated
    if (!user?.id) {
      alert('Silakan login terlebih dahulu untuk melihat rekomendasi');
      clearSelectedItem();
      return;
    }

    try {
      setIsModalOpen(true);
      await fetchRecommendationsForContext(user.id, item.id, item);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearSelectedItem();
    clearRecommendations();
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    handleSearch(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput('');
    clearSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Katalog Produk
          </h1>
          <p className="text-gray-600">
            Jelajahi produk dan lihat rekomendasi dari berbagai algoritma
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama, kategori, atau deskripsi..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {isLoading ? (
              <span>Memuat katalog...</span>
            ) : (
              <span>
                Menampilkan <span className="font-semibold">{itemCount}</span> dari
                <span className="font-semibold ml-1">{totalItemCount}</span> produk
              </span>
            )}
          </p>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Hapus pencarian
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600">Memuat produk...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery ? 'Produk Tidak Ditemukan' : 'Katalog Kosong'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `Tidak ada produk yang cocok dengan pencarian "${searchQuery}"`
                : 'Belum ada produk tersedia'}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <CatalogItemCard
                key={item.id}
                item={item}
                onSelect={handleItemSelect}
                isSelected={selectedItem?.id === item.id}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Comparison Modal */}
      <AlgorithmComparisonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contextItem={contextItem}
        recommendations={recommendations}
        algorithmErrors={algorithmErrors}
        isLoading={isLoadingRecommendations}
      />
    </div>
  );
}
