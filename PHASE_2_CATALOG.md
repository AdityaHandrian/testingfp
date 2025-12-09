# Phase 2: Catalog Implementation

## Objective
Implement the Catalog page with real API data, item display, and context-based recommendation inference.

## Overview

The Catalog page will:
1. Fetch all available items from the backend API
2. Display items in a responsive grid
3. Allow filtering and search (optional for phase 2)
4. On item click (when user is logged in):
   - Trigger inference using all recommendation algorithms (NCF, CBF, SVD, KNN)
   - Display recommendations for that specific item in context
   - Show comparison of recommendations across algorithms

## Tasks

### Task 2.1: Create src/api/catalogApi.js

**Purpose:** Centralize all catalog-related API calls

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

const catalogApi = {
  /**
   * Fetch all items from catalog
   * @returns {Promise<Array>} List of items
   */
  async getAllItems() {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error(error.response?.data?.message || 'Gagal memuat katalog produk');
    }
  },

  /**
   * Get recommendations for specific item using NCF with context
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID for context
   * @returns {Promise<Object>} Recommendations from NCF algorithm
   */
  async getNCFRecommendationContext(userId, itemId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/recommend_ncf/${userId}/context/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching NCF recommendations:', error);
      throw new Error(error.response?.data?.message || 'Gagal memuat rekomendasi NCF');
    }
  },

  /**
   * Get recommendations for specific item using CBF with context
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID for context
   * @returns {Promise<Object>} Recommendations from CBF algorithm
   */
  async getCBFRecommendationContext(userId, itemId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/recommend_cbf/${userId}/context/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching CBF recommendations:', error);
      throw new Error(error.response?.data?.message || 'Gagal memuat rekomendasi CBF');
    }
  },

  /**
   * Get recommendations for specific item using SVD with context
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID for context
   * @returns {Promise<Object>} Recommendations from SVD algorithm
   */
  async getSVDRecommendationContext(userId, itemId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/recommend_svd/${userId}/context/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SVD recommendations:', error);
      throw new Error(error.response?.data?.message || 'Gagal memuat rekomendasi SVD');
    }
  },

  /**
   * Get recommendations for specific item using KNN with context
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID for context
   * @returns {Promise<Object>} Recommendations from KNN algorithm
   */
  async getKNNRecommendationContext(userId, itemId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/recommend_knn/${userId}/context/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KNN recommendations:', error);
      throw new Error(error.response?.data?.message || 'Gagal memuat rekomendasi KNN');
    }
  },

  /**
   * Get all recommendations for a context item (all algorithms in parallel)
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID for context
   * @returns {Promise<Object>} All recommendations combined
   */
  async getAllRecommendationsContext(userId, itemId) {
    try {
      const [ncf, cbf, svd, knn] = await Promise.all([
        this.getNCFRecommendationContext(userId, itemId).catch(err => ({ error: err.message, algorithm: 'NCF' })),
        this.getCBFRecommendationContext(userId, itemId).catch(err => ({ error: err.message, algorithm: 'CBF' })),
        this.getSVDRecommendationContext(userId, itemId).catch(err => ({ error: err.message, algorithm: 'SVD' })),
        this.getKNNRecommendationContext(userId, itemId).catch(err => ({ error: err.message, algorithm: 'KNN' })),
      ]);

      return { ncf, cbf, svd, knn };
    } catch (error) {
      console.error('Error fetching all recommendations:', error);
      throw new Error('Gagal memuat semua rekomendasi');
    }
  },
};

export default catalogApi;
```

**Success Criteria:**
- ✅ All API functions defined
- ✅ Proper error handling
- ✅ Uses environment variable for API URL
- ✅ Parallel requests for all algorithms

---

### Task 2.2: Create src/hooks/useCatalog.js

**Purpose:** Manage catalog state and API calls

```javascript
import { useState, useEffect } from 'react';
import catalogApi from '../api/catalogApi';

export function useCatalog() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * Fetch all items from catalog
   */
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await catalogApi.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    error,
    selectedItem,
    setSelectedItem,
    refetch: fetchItems,
  };
}

export function useContextRecommendation() {
  const [recommendations, setRecommendations] = useState({
    ncf: null,
    cbf: null,
    svd: null,
    knn: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextItem, setContextItem] = useState(null);

  /**
   * Fetch recommendations for a specific item context
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID for context
   */
  const fetchRecommendationsForContext = async (userId, itemId) => {
    setIsLoading(true);
    setError(null);
    setContextItem(itemId);
    try {
      const data = await catalogApi.getAllRecommendationsContext(userId, itemId);
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch context recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRecommendations = () => {
    setRecommendations({ ncf: null, cbf: null, svd: null, knn: null });
    setContextItem(null);
    setError(null);
  };

  return {
    recommendations,
    contextItem,
    isLoading,
    error,
    fetchRecommendationsForContext,
    clearRecommendations,
  };
}
```

**Success Criteria:**
- ✅ useCatalog hook manages items state
- ✅ useContextRecommendation hook manages recommendation state
- ✅ Proper error handling
- ✅ Loading states tracked

---

### Task 2.3: Create src/components/CatalogItemCard.jsx

**Purpose:** Display individual item in catalog

```javascript
import { ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

export default function CatalogItemCard({ item, onSelect, isSelected }) {
  const { isAuthenticated, user } = useAuthContext();

  const handleClick = () => {
    if (isAuthenticated && onSelect) {
      onSelect(item);
    }
  };

  const imageUrl = item.image || 'https://via.placeholder.com/200?text=' + encodeURIComponent(item.name);

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${
        !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* Item Image */}
      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200?text=' + encodeURIComponent(item.name);
          }}
        />
        {item.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{item.discount}%
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {item.name}
        </h3>

        {/* Category */}
        {item.category && (
          <p className="text-xs text-gray-500 mb-2">{item.category}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900">
            {item.rating ? item.rating.toFixed(1) : 'N/A'}
          </span>
          {item.review_count && (
            <span className="text-xs text-gray-500">({item.review_count})</span>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(item.price)}
          </p>
          {item.original_price && (
            <p className="text-xs text-gray-500 line-through">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(item.original_price)}
            </p>
          )}
        </div>

        {/* Sentiment Score */}
        {item.sentiment_score !== undefined && (
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-600 mb-1">Sentimen Positif</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${item.sentiment_score * 100}%` }}
              ></div>
            </div>
            <p className="text-xs font-medium text-gray-900 mt-1">
              {(item.sentiment_score * 100).toFixed(0)}%
            </p>
          </div>
        )}

        {/* Action Button */}
        {isAuthenticated ? (
          <button
            onClick={handleClick}
            className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isSelected ? 'Terpilih' : 'Lihat Rekomendasi'}
          </button>
        ) : (
          <div className="w-full py-2 rounded-lg bg-gray-100 text-gray-500 text-center text-sm font-medium flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Login untuk melihat rekomendasi
          </div>
        )}
      </div>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Item card displays all information
- ✅ Click handler triggers parent component
- ✅ Selected state styling
- ✅ Authentication-aware UI

---

### Task 2.4: Update src/pages/Catalog.jsx

**Replace placeholder with full implementation:**

```javascript
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useCatalog, useContextRecommendation } from '../hooks/useCatalog';
import CatalogItemCard from '../components/CatalogItemCard';
import AlgorithmComparisonModal from '../components/AlgorithmComparisonModal';
import { Loader, AlertCircle, Search, X } from 'lucide-react';

export default function Catalog() {
  const { isAuthenticated, user } = useAuthContext();
  const { items, isLoading: itemsLoading, error: itemsError, selectedItem, setSelectedItem } = useCatalog();
  const {
    recommendations,
    contextItem,
    isLoading: recLoading,
    error: recError,
    fetchRecommendationsForContext,
    clearRecommendations,
  } = useContextRecommendation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    if (isAuthenticated && user?.id) {
      try {
        await fetchRecommendationsForContext(user.id, item.id);
        setShowRecommendations(true);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  };

  const handleCloseRecommendations = () => {
    setShowRecommendations(false);
    clearRecommendations();
    setSelectedItem(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Katalog Produk</h1>
        <p className="text-gray-600">Silakan login terlebih dahulu untuk melihat katalog produk dan mendapatkan rekomendasi.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Produk</h1>
        <p className="text-gray-600">Pilih produk untuk melihat rekomendasi berdasarkan algoritma yang berbeda</p>
      </div>

      {/* Error Messages */}
      {itemsError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-800">Gagal memuat katalog</p>
              <p className="text-sm text-red-700">{itemsError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Menampilkan {filteredItems.length} dari {items.length} produk
        </p>
      </div>

      {/* Items Loading */}
      {itemsLoading && (
        <div className="text-center py-12">
          <Loader className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Memuat katalog produk...</p>
        </div>
      )}

      {/* Items Grid */}
      {!itemsLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredItems.map((item) => (
            <CatalogItemCard
              key={item.id}
              item={item}
              onSelect={handleItemClick}
              isSelected={selectedItem?.id === item.id}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!itemsLoading && filteredItems.length === 0 && items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Tidak ada produk tersedia.</p>
        </div>
      )}

      {!itemsLoading && filteredItems.length === 0 && items.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Tidak ada produk yang sesuai dengan pencarian.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Hapus Filter
          </button>
        </div>
      )}

      {/* Recommendation Modal/Sidebar */}
      {showRecommendations && selectedItem && (
        <AlgorithmComparisonModal
          item={selectedItem}
          recommendations={recommendations}
          isLoading={recLoading}
          error={recError}
          onClose={handleCloseRecommendations}
        />
      )}
    </div>
  );
}
```

**Success Criteria:**
- ✅ Items fetched and displayed
- ✅ Search functionality works
- ✅ Click item to view recommendations
- ✅ Recommendations modal/comparison shown
- ✅ Authentication required

---

### Task 2.5: Create src/components/AlgorithmComparisonModal.jsx

**Purpose:** Display recommendation comparison from all algorithms

```javascript
import { X, TrendingUp, AlertCircle, Loader } from 'lucide-react';
import { ALGORITHMS } from '../utils/constants';

export default function AlgorithmComparisonModal({ item, recommendations, isLoading, error, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Rekomendasi untuk: {item.name}</h2>
            <p className="text-blue-100">Perbandingan hasil dari 4 algoritma rekomendasi</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error State */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-red-800">Error dalam pengambilan data</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">Mengambil rekomendasi dari semua algoritma...</p>
            </div>
          )}

          {/* Algorithms Comparison */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(ALGORITHMS).map(([key, algo]) => {
                const recData = recommendations[algo.id.toLowerCase()];
                const hasError = recData?.error;
                const items = recData?.items || recData?.recommendations || [];

                return (
                  <div
                    key={algo.id}
                    className={`border rounded-lg p-4 ${
                      hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {/* Algorithm Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{algo.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{algo.description}</p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 mt-1`}
                        style={{
                          backgroundColor: algo.color === 'blue' ? '#3b82f6' :
                                         algo.color === 'purple' ? '#a855f7' :
                                         algo.color === 'green' ? '#22c55e' :
                                         algo.color === 'orange' ? '#f97316' : '#6b7280',
                        }}
                      ></div>
                    </div>

                    {/* Error in Algorithm */}
                    {hasError ? (
                      <div className="text-sm text-red-700 bg-white rounded p-3">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        {recData.error}
                      </div>
                    ) : (
                      <>
                        {/* Stats */}
                        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Jumlah Rekomendasi</span>
                            <span className="text-lg font-bold text-gray-900">{items.length}</span>
                          </div>
                        </div>

                        {/* Top Recommendations */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {items.slice(0, 5).map((rec, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {rec.name || rec.product_name || 'Unknown'}
                                  </p>
                                  {rec.score !== undefined && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-blue-500 h-2 rounded-full"
                                          style={{ width: `${Math.min(rec.score * 100, 100)}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium text-gray-900 whitespace-nowrap">
                                        {(rec.score * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {items.length > 5 && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            +{items.length - 5} lebih banyak rekomendasi
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Modal displays all 4 algorithms
- ✅ Shows recommendations from each algorithm
- ✅ Error states handled
- ✅ Loading state shown
- ✅ Responsive on mobile

---

## Testing Checklist for Phase 2

- [ ] Navigate to /catalog (requires login)
- [ ] All items load and display
- [ ] Search functionality works
- [ ] Click on item (only when logged in)
- [ ] Recommendations modal opens
- [ ] All 4 algorithms show recommendations
- [ ] Error handling works for API failures
- [ ] Loading indicators display
- [ ] Mobile responsive design
- [ ] Close modal and try another item
- [ ] No mock data used (real API only)

## Commit Message

```
feat: Phase 2 - Implement catalog page with context-based recommendations

- Create catalogApi.js for API calls
- Create useCatalog and useContextRecommendation hooks
- Implement CatalogItemCard component
- Implement AlgorithmComparisonModal component
- Update Catalog.jsx with full functionality
- Support for NCF, CBF, SVD, KNN algorithms
- Real API data integration (no mock data)
```

## Files Created/Modified

- `src/api/catalogApi.js` - Created
- `src/hooks/useCatalog.js` - Created
- `src/components/CatalogItemCard.jsx` - Created
- `src/components/AlgorithmComparisonModal.jsx` - Created
- `src/pages/Catalog.jsx` - Updated

---

**Status:** Ready for implementation  
**Next Phase:** Phase 3 - Users Implementation
