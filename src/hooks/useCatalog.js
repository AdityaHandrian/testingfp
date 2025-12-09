import { useState, useEffect, useCallback } from 'react';
import * as catalogApi from '../api/catalogApi';

/**
 * Custom hook for managing catalog items
 * Handles fetching, filtering, and state management
 */
export function useCatalog() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  /**
   * Fetch all catalog items from API
   */
  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await catalogApi.getAllItems();
      setItems(Array.isArray(data) ? data : []);
      setFilteredItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching catalog items:', err);
      setError(err.message || 'Gagal memuat katalog produk');
      setItems([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update search query
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Select an item
   */
  const selectItem = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  /**
   * Clear selected item
   */
  const clearSelectedItem = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    // State
    items,
    filteredItems,
    isLoading,
    error,
    searchQuery,
    selectedItem,
    itemCount: filteredItems.length,
    totalItemCount: items.length,

    // Actions
    fetchItems,
    handleSearch,
    clearSearch,
    selectItem,
    clearSelectedItem,
  };
}

/**
 * Custom hook for managing context-aware recommendations
 * Handles fetching recommendations from multiple algorithms
 */
export function useContextRecommendation() {
  const [recommendations, setRecommendations] = useState({
    ncf: [],
    cbf: [],
    svd: [],
    knn: [],
  });
  const [contextItem, setContextItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [algorithmErrors, setAlgorithmErrors] = useState({});

  /**
   * Fetch recommendations for context item from all algorithms
   */
  const fetchRecommendationsForContext = useCallback(
    async (userId, itemId, item = null) => {
      try {
        setIsLoading(true);
        setError(null);
        setAlgorithmErrors({});
        setContextItem(item);

        const results = await catalogApi.getAllRecommendationsContext(
          userId,
          itemId
        );

        // Process results and collect errors
        const errors = {};
        if (results.ncfError) errors.ncf = results.ncfError;
        if (results.cbfError) errors.cbf = results.cbfError;
        if (results.svdError) errors.svd = results.svdError;
        if (results.knnError) errors.knn = results.knnError;

        setAlgorithmErrors(errors);

        setRecommendations({
          ncf: results.ncf || [],
          cbf: results.cbf || [],
          svd: results.svd || [],
          knn: results.knn || [],
        });
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Gagal memuat rekomendasi');
        setRecommendations({ ncf: [], cbf: [], svd: [], knn: [] });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Clear recommendations
   */
  const clearRecommendations = useCallback(() => {
    setRecommendations({ ncf: [], cbf: [], svd: [], knn: [] });
    setContextItem(null);
    setError(null);
    setAlgorithmErrors({});
  }, []);

  return {
    // State
    recommendations,
    contextItem,
    isLoading,
    error,
    algorithmErrors,
    hasRecommendations:
      Object.values(recommendations).some((recs) => recs.length > 0),

    // Actions
    fetchRecommendationsForContext,
    clearRecommendations,
  };
}
