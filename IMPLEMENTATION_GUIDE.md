# Implementation Guide - Product Recommendation System Frontend

**Target:** Phase 2 - Complete Catalog Implementation  
**Framework:** React + Vite + Tailwind CSS  
**API Base:** http://localhost:8000/api

---

## STEP 1: Review Repository (DO THIS FIRST!)

### What to Check
```bash
# 1. Check current structure
ls -la src/

# 2. Review existing code
cat src/App.jsx
cat src/utils/constants.js
cat src/components/Navbar.jsx

# 3. Check what pages exist
ls -la src/pages/

# 4. Check what hooks exist
ls -la src/hooks/

# 5. Check what API integrations exist
ls -la src/api/

# 6. Look at AuthContext to understand auth flow
cat src/contexts/AuthContext.jsx
```

### Understanding Current Setup
- **Routing:** React Router with routes in `constants.js`
- **Auth:** AuthContext provides `isAuthenticated`, `user`, `login()`, `logout()`
- **Styling:** Tailwind CSS (already configured)
- **HTTP:** Axios (for API calls)
- **Icons:** lucide-react

---

## STEP 2: Environment Setup

### Check Environment Variables
```bash
# Create or check .env file
cat .env
cat .env.local

# Should have:
VITE_API_URL=http://localhost:8000/api
```

If not present, create `.env.local`:
```env
VITE_API_URL=http://localhost:8000/api
```

### Start Backend
```bash
# In another terminal, start backend
cd backend/
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
# Should see: Running on http://localhost:8000/api
```

### Start Frontend
```bash
# In project root
npm install
npm run dev
# Should see: http://localhost:5173
```

---

## STEP 3: Create API Layer (src/api/catalogApi.js)

### Create the file
```bash
touch src/api/catalogApi.js
```

### Complete Code
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const catalogApi = {
  /**
   * Fetch all items from catalog
   * @returns {Promise<Array>} List of items with all data
   */
  async getAllItems() {
    try {
      console.log(`Fetching items from: ${API_BASE_URL}/items`);
      const response = await axios.get(`${API_BASE_URL}/items`);
      console.log('Items fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Gagal memuat katalog produk'
      );
    }
  },

  /**
   * Get NCF recommendations with context
   */
  async getNCFRecommendationContext(userId, itemId) {
    try {
      const url = `${API_BASE_URL}/recommend_ncf/${userId}/context/${itemId}`;
      console.log(`Fetching NCF from: ${url}`);
      const response = await axios.get(url);
      console.log('NCF recommendations:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching NCF recommendations:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Gagal memuat rekomendasi NCF'
      );
    }
  },

  /**
   * Get CBF recommendations with context
   */
  async getCBFRecommendationContext(userId, itemId) {
    try {
      const url = `${API_BASE_URL}/recommend_cbf/${userId}/context/${itemId}`;
      console.log(`Fetching CBF from: ${url}`);
      const response = await axios.get(url);
      console.log('CBF recommendations:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching CBF recommendations:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Gagal memuat rekomendasi CBF'
      );
    }
  },

  /**
   * Get SVD recommendations with context
   */
  async getSVDRecommendationContext(userId, itemId) {
    try {
      const url = `${API_BASE_URL}/recommend_svd/${userId}/context/${itemId}`;
      console.log(`Fetching SVD from: ${url}`);
      const response = await axios.get(url);
      console.log('SVD recommendations:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching SVD recommendations:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Gagal memuat rekomendasi SVD'
      );
    }
  },

  /**
   * Get KNN recommendations with context
   */
  async getKNNRecommendationContext(userId, itemId) {
    try {
      const url = `${API_BASE_URL}/recommend_knn/${userId}/context/${itemId}`;
      console.log(`Fetching KNN from: ${url}`);
      const response = await axios.get(url);
      console.log('KNN recommendations:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching KNN recommendations:', error);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Gagal memuat rekomendasi KNN'
      );
    }
  },

  /**
   * Get all recommendations in parallel
   */
  async getAllRecommendationsContext(userId, itemId) {
    try {
      console.log(`Fetching ALL recommendations for user ${userId}, item ${itemId}`);
      
      const [ncf, cbf, svd, knn] = await Promise.all([
        this.getNCFRecommendationContext(userId, itemId)
          .catch(err => ({ error: err.message, algorithm: 'NCF' })),
        this.getCBFRecommendationContext(userId, itemId)
          .catch(err => ({ error: err.message, algorithm: 'CBF' })),
        this.getSVDRecommendationContext(userId, itemId)
          .catch(err => ({ error: err.message, algorithm: 'SVD' })),
        this.getKNNRecommendationContext(userId, itemId)
          .catch(err => ({ error: err.message, algorithm: 'KNN' })),
      ]);

      console.log('All recommendations fetched:', { ncf, cbf, svd, knn });
      return { ncf, cbf, svd, knn };
    } catch (error) {
      console.error('Error in getAllRecommendationsContext:', error);
      throw new Error('Gagal memuat semua rekomendasi');
    }
  },
};

export default catalogApi;
```

### Test It
```javascript
// In browser console:
import catalogApi from './src/api/catalogApi';

// Test items
await catalogApi.getAllItems()

// Test NCF for user 1, item 1
await catalogApi.getNCFRecommendationContext(1, 1)
```

---

## STEP 4: Create Custom Hooks (src/hooks/useCatalog.js)

### Create the file
```bash
touch src/hooks/useCatalog.js
```

### Complete Code
```javascript
import { useState, useEffect } from 'react';
import catalogApi from '../api/catalogApi';

/**
 * Hook to manage catalog items state
 */
export function useCatalog() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * Fetch all items from API
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

  // Fetch items on component mount
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

/**
 * Hook to manage recommendation state for context item
 */
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
   * Fetch recommendations for all algorithms with context item
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

  /**
   * Clear recommendations state
   */
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

---

## STEP 5: Create CatalogItemCard Component

### Create the file
```bash
touch src/components/CatalogItemCard.jsx
```

### Complete Code
```javascript
import { ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

export default function CatalogItemCard({ item, onSelect, isSelected }) {
  const { isAuthenticated } = useAuthContext();

  const handleClick = () => {
    if (isAuthenticated && onSelect) {
      onSelect(item);
    }
  };

  // Fallback image
  const imageUrl = item.image || `https://via.placeholder.com/200?text=${encodeURIComponent(item.name || 'Product')}`;

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${
        !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/200?text=${encodeURIComponent(item.name || 'Product')}`;
          }}
        />
        {/* Discount Badge */}
        {item.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{item.discount}%
          </div>
        )}
      </div>

      {/* Info Container */}
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
            }).format(item.price || 0)}
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

        {/* Sentiment Score Bar */}
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
            Login untuk rekomendasi
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## STEP 6: Create AlgorithmComparisonModal Component

### Create the file
```bash
touch src/components/AlgorithmComparisonModal.jsx
```

### Complete Code
```javascript
import { X, AlertCircle, Loader } from 'lucide-react';
import { ALGORITHMS } from '../utils/constants';

export default function AlgorithmComparisonModal({
  item,
  recommendations,
  isLoading,
  error,
  onClose,
}) {
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

          {/* Algorithms Grid */}
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
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{
                          backgroundColor:
                            algo.color === 'blue'
                              ? '#3b82f6'
                              : algo.color === 'purple'
                              ? '#a855f7'
                              : algo.color === 'green'
                              ? '#22c55e'
                              : algo.color === 'orange'
                              ? '#f97316'
                              : '#6b7280',
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
                                    {rec.name || rec.product_name || `Product ${rec.id}`}
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

---

## STEP 7: Update Catalog Page

### Replace src/pages/Catalog.jsx
```javascript
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useCatalog, useContextRecommendation } from '../hooks/useCatalog';
import CatalogItemCard from '../components/CatalogItemCard';
import AlgorithmComparisonModal from '../components/AlgorithmComparisonModal';
import { Loader, AlertCircle, Search, X } from 'lucide-react';

export default function Catalog() {
  const { isAuthenticated, user } = useAuthContext();
  const {
    items,
    isLoading: itemsLoading,
    error: itemsError,
    selectedItem,
    setSelectedItem,
  } = useCatalog();

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
        <p className="text-gray-600">
          Silakan login terlebih dahulu untuk melihat katalog produk dan mendapatkan rekomendasi.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Produk</h1>
        <p className="text-gray-600">
          Pilih produk untuk melihat rekomendasi berdasarkan algoritma yang berbeda
        </p>
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

      {/* Recommendation Modal */}
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

---

## STEP 8: Update Constants (src/utils/constants.js)

### Add these constants
```javascript
// Update APP_NAME
export const APP_NAME = 'Product Recommendation System Demo';
export const APP_DESCRIPTION = 'Sistem Rekomendasi Produk berbasis Kecerdasan Buatan';

// Add/Update ROUTES
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CATALOG: '/catalog',          // NEW
  USERS: '/users',              // NEW
  RECOMMENDATION: '/recommendation',
  SENTIMENT: '/sentiment-analysis',
  DASHBOARD: '/dashboard',
};

// Add ALGORITHMS
export const ALGORITHMS = {
  NCF: {
    id: 'ncf',
    name: 'Nearest Collaborative Filtering',
    description: 'Rekomendasi berdasarkan kesamaan pengguna',
    color: 'blue',
  },
  CBF: {
    id: 'cbf',
    name: 'Content-Based Filtering',
    description: 'Rekomendasi berdasarkan fitur produk',
    color: 'purple',
  },
  SVD: {
    id: 'svd',
    name: 'Singular Value Decomposition',
    description: 'Rekomendasi berbasis matrix factorization',
    color: 'green',
  },
  KNN: {
    id: 'knn',
    name: 'K-Nearest Neighbors',
    description: 'Rekomendasi berbasis k-tetangga terdekat',
    color: 'orange',
  },
};
```

---

## STEP 9: Update App Router (src/App.jsx)

### Add imports and routes
```javascript
import Catalog from './pages/Catalog';
import Users from './pages/Users';

// In the Routes component:
<Route path={ROUTES.CATALOG} element={<Catalog />} />
<Route path={ROUTES.USERS} element={<Users />} />
```

---

## STEP 10: Update Navbar (src/components/Navbar.jsx)

### Add catalog/users links (when authenticated)
```javascript
{isAuthenticated && (
  <div className="hidden md:flex items-center space-x-4">
    <Link 
      to={ROUTES.CATALOG} 
      className="text-gray-700 hover:text-gray-900 font-medium"
    >
      Catalog
    </Link>
    <Link 
      to={ROUTES.USERS} 
      className="text-gray-700 hover:text-gray-900 font-medium"
    >
      Users
    </Link>
  </div>
)}
```

---

## TESTING CHECKLIST

### Before committing:
- [ ] No console errors
- [ ] Items load from API
- [ ] Search works
- [ ] Click item opens modal
- [ ] All 4 algorithms shown
- [ ] Recommendations display correctly
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] No mock data

### Test on different screen sizes:
```bash
# DevTools
Ctrl+Shift+K (or Cmd+Option+K on Mac)
Ctrl+Shift+M to toggle device toolbar

# Test sizes
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (wide)
```

---

## COMMITTING CHANGES

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "feat: Phase 2 - Implement catalog page with context-based recommendations

- Create catalogApi.js with all API functions
- Create useCatalog and useContextRecommendation hooks
- Implement CatalogItemCard component
- Implement AlgorithmComparisonModal component
- Update Catalog.jsx with full functionality
- Support for NCF, CBF, SVD, KNN algorithms
- Real API data integration (no mock data)
- Mobile responsive design with Tailwind CSS"

# Push to main
git push origin main
```

---

**You're ready to start implementing!** 🚀
