// ======================= ROUTES =======================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RECOMMENDATION: '/recommendation',
  SENTIMENT: '/sentiment-analysis',
  DASHBOARD: '/dashboard',
};

// ======================= APP INFO =======================
export const APP_NAME = 'RecSystem - Tokopedia Product Recommender';
export const APP_DESCRIPTION =
  'Sistem Rekomendasi Produk Tokopedia berbasis Sentiment Analysis';

// ======================= SENTIMENT LABELS =======================
export const SENTIMENT_LABELS = {
  positive: { label: 'Positif', color: 'green', icon: '😊' },
  neutral: { label: 'Netral', color: 'yellow', icon: '😐' },
  negative: { label: 'Negatif', color: 'red', icon: '😞' },
};

// ======================= FEATURES (UPDATE BARU) =======================
export const FEATURES = {
  SENTIMENT: 'sentiment',
  COLLABORATIVE: 'collaborative',
  SVD: 'svd',
  MOCK_DATA: 'mock_data',
};
