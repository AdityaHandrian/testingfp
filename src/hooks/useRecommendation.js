import { useState, useEffect } from 'react';
import { mockRecommendations, mockApiResponses } from '../api/mockData';

export function useRecommendation(userId = null) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch recommendations function
  const fetchRecommendations = async (inputUserId = userId) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validasi input
      if (!inputUserId) {
        throw new Error('User ID diperlukan untuk mendapatkan rekomendasi');
      }

      // Panggil mock API response
      const response = mockApiResponses.getRecommendations(inputUserId);

      if (response.status === 'success') {
        setRecommendations(response.data);
        setSuccessMessage(response.message);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear recommendations
  const clearRecommendations = () => {
    setRecommendations([]);
    setError(null);
    setSuccessMessage(null);
  };

  // Auto-fetch jika userId disediakan
  useEffect(() => {
    if (userId) {
      fetchRecommendations(userId);
    }
  }, [userId]);

  return {
    recommendations,
    isLoading,
    error,
    successMessage,
    fetchRecommendations,
    clearRecommendations,
    hasResults: recommendations.length > 0,
  };
}
