import apiClient from './apiClient';

/**
 * Catalog API integration layer
 * All functions communicate with the backend recommendation system
 * NO MOCK DATA - All data from real API endpoints
 */

// ==================== CATALOG ENDPOINTS ====================

/**
 * Get all products from catalog with pagination
 * @param {number} pageNum - Page number (starting from 1)
 * @param {number} pageSize - Number of items per page (default: 20)
 * @returns {Promise<Array>} Array of product objects
 */
export async function getAllProducts(pageNum = 1, pageSize = 20) {
  try {
    const response = await apiClient.get(
      `/products/${pageNum}/page/${pageSize}`
    );
    // Handle different response formats from backend
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.products || response.data.items || [];
  } catch (error) {
    console.error(
      `Failed to fetch products (page ${pageNum}, size ${pageSize}):`,
      error
    );
    throw new Error(
      error.response?.data?.message || 'Gagal memuat katalog produk'
    );
  }
}

/**
 * Get product details
 * @param {number} itemId - Product ID
 * @returns {Promise<Object>} Product object
 */
export async function getProductDetail(itemId) {
  try {
    const response = await apiClient.get(`/products/${itemId}`);
    return response.data || {};
  } catch (error) {
    console.error(`Failed to fetch product ${itemId}:`, error);
    throw new Error(
      error.response?.data?.message || 'Gagal memuat detail produk'
    );
  }
}

/**
 * Get all users from database
 * @returns {Promise<Array>} Array of user objects
 */
export async function getAllUsers() {
  try {
    const response = await apiClient.get('/users/');
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.users || response.data || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat data pengguna');
  }
}

/**
 * Get user details
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User object
 */
export async function getUserDetail(userId) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data || {};
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw new Error(error.response?.data?.message || 'Gagal memuat detail pengguna');
  }
}

// ==================== RECOMMENDATION ENDPOINTS ====================

/**
 * Get NCF recommendations (simple)
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of recommended items with scores
 */
export async function getNCFRecommendation(userId) {
  try {
    const response = await apiClient.get(`/recommend_ncf/${userId}`);
    return response.data.items || response.data || [];
  } catch (error) {
    console.error(`Failed to fetch NCF recommendations for user ${userId}:`, error);
    throw new Error(
      error.response?.data?.message || 'Gagal memuat rekomendasi NCF'
    );
  }
}

/**
 * Get NCF recommendations with product context
 * @param {number} userId - User ID
 * @param {number} itemId - Product ID for context
 * @returns {Promise<Array>} Array of recommended items with scores
 */
export async function getNCFRecommendationContext(userId, itemId) {
  try {
    const response = await apiClient.get(
      `/recommend_ncf/${userId}/context/${itemId}`
    );
    return response.data.items || response.data || [];
  } catch (error) {
    console.error(
      `Failed to fetch NCF recommendations for user ${userId}, item ${itemId}:`,
      error
    );
    throw new Error(
      error.response?.data?.message || 'Gagal memuat rekomendasi NCF'
    );
  }
}

/**
 * Get CBF recommendations (simple)
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of recommended items with scores
 */
export async function getCBFRecommendation(userId) {
  try {
    const response = await apiClient.get(`/recommend_cbf/${userId}`);
    return response.data.items || response.data || [];
  } catch (error) {
    console.error(`Failed to fetch CBF recommendations for user ${userId}:`, error);
    throw new Error(
      error.response?.data?.message || 'Gagal memuat rekomendasi CBF'
    );
  }
}

/**
 * Get CBF recommendations with product context
 * @param {number} userId - User ID
 * @param {number} itemId - Product ID for context
 * @returns {Promise<Array>} Array of recommended items with scores
 */
export async function getCBFRecommendationContext(userId, itemId) {
  try {
    const response = await apiClient.get(
      `/recommend_cbf/${userId}/context/${itemId}`
    );
    return response.data.items || response.data || [];
  } catch (error) {
    console.error(
      `Failed to fetch CBF recommendations for user ${userId}, item ${itemId}:`,
      error
    );
    throw new Error(
      error.response?.data?.message || 'Gagal memuat rekomendasi CBF'
    );
  }
}

/**
 * Get SVD recommendations with product context
 * NOTE: Currently not available in backend - stub for future use
 * @param {number} userId - User ID
 * @param {number} itemId - Product ID for context
 * @returns {Promise<Array>} Array of recommended items with scores
 */
export async function getSVDRecommendationContext(userId, itemId) {
  try {
    // Placeholder - endpoint not yet implemented in backend
    const response = await apiClient.get(
      `/recommend_svd/${userId}/context/${itemId}`
    );
    return response.data.items || response.data || [];
  } catch (error) {
    console.error(
      `Failed to fetch SVD recommendations for user ${userId}, item ${itemId}:`,
      error
    );
    // Return empty array instead of throwing for graceful degradation
    return [];
  }
}

/**
 * Get KNN recommendations with product context
 * NOTE: Currently not available in backend - stub for future use
 * @param {number} userId - User ID
 * @param {number} itemId - Product ID for context
 * @returns {Promise<Array>} Array of recommended items with scores
 */
export async function getKNNRecommendationContext(userId, itemId) {
  try {
    // Placeholder - endpoint not yet implemented in backend
    const response = await apiClient.get(
      `/recommend_knn/${userId}/context/${itemId}`
    );
    return response.data.items || response.data || [];
  } catch (error) {
    console.error(
      `Failed to fetch KNN recommendations for user ${userId}, item ${itemId}:`,
      error
    );
    // Return empty array instead of throwing for graceful degradation
    return [];
  }
}

/**
 * Get recommendations from all algorithms in parallel
 * @param {number} userId - User ID
 * @param {number} itemId - Product ID for context
 * @returns {Promise<Object>} Object with recommendations from each algorithm
 */
export async function getAllRecommendationsContext(userId, itemId) {
  try {
    const results = await Promise.allSettled([
      getNCFRecommendationContext(userId, itemId),
      getCBFRecommendationContext(userId, itemId),
      getSVDRecommendationContext(userId, itemId),
      getKNNRecommendationContext(userId, itemId),
    ]);

    return {
      ncf: results[0].status === 'fulfilled' ? results[0].value : null,
      ncfError: results[0].status === 'rejected' ? results[0].reason.message : null,
      cbf: results[1].status === 'fulfilled' ? results[1].value : null,
      cbfError: results[1].status === 'rejected' ? results[1].reason.message : null,
      svd: results[2].status === 'fulfilled' ? results[2].value : null,
      svdError: results[2].status === 'rejected' ? results[2].reason.message : null,
      knn: results[3].status === 'fulfilled' ? results[3].value : null,
      knnError: results[3].status === 'rejected' ? results[3].reason.message : null,
    };
  } catch (error) {
    console.error('Failed to fetch all recommendations:', error);
    throw new Error('Gagal memuat rekomendasi');
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format price in IDR currency
 * @param {number} price - Price amount
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate average rating from reviews
 * @param {Array} reviews - Array of review objects
 * @returns {number} Average rating
 */
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

/**
 * Get recommendation color by algorithm type
 * @param {string} algorithmType - Algorithm ID (ncf, cbf, svd, knn)
 * @returns {string} Hex color code
 */
export function getAlgorithmColor(algorithmType) {
  const colors = {
    ncf: '#3B82F6',
    cbf: '#10B981',
    svd: '#F59E0B',
    knn: '#8B5CF6',
  };
  return colors[algorithmType?.toLowerCase()] || '#6B7280';
}
