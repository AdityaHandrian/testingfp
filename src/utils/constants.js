// ======================= ROUTES =======================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CATALOG: '/catalog',
  USERS: '/users',
  RECOMMENDATION: '/recommendation',
  SENTIMENT: '/sentiment-analysis',
  DASHBOARD: '/dashboard',
};

// ======================= APP INFO =======================
export const APP_NAME = 'Product Recommendation System Demo';
export const APP_DESCRIPTION =
  'Sistem Rekomendasi Produk berbasis Algoritma Kolaboratif dan Content-Based';

// ======================= SENTIMENT LABELS =======================
export const SENTIMENT_LABELS = {
  positive: { label: 'Positif', color: 'green', icon: '😊' },
  neutral: { label: 'Netral', color: 'yellow', icon: '😐' },
  negative: { label: 'Negatif', color: 'red', icon: '😞' },
};

// ======================= RECOMMENDATION ALGORITHMS =======================
export const ALGORITHMS = {
  NCF: {
    id: 'ncf',
    name: 'Neural Collaborative Filtering',
    displayName: 'NCF',
    description: 'Algoritma kolaboratif berbasis neural network untuk mempelajari pola preferensi pengguna',
    color: '#3B82F6', // blue
    shortDescription: 'Kolaboratif Neural',
  },
  CBF: {
    id: 'cbf',
    name: 'Content-Based Filtering',
    displayName: 'CBF',
    description: 'Algoritma berbasis fitur produk yang merekomendasikan item serupa dengan preferensi pengguna',
    color: '#10B981', // green
    shortDescription: 'Berbasis Konten',
  },
  SVD: {
    id: 'svd',
    name: 'Singular Value Decomposition',
    displayName: 'SVD',
    description: 'Teknik dekomposisi matriks untuk mengekstrak fitur laten dari rating pengguna',
    color: '#F59E0B', // amber
    shortDescription: 'Dekomposisi Matriks',
  },
  KNN: {
    id: 'knn',
    name: 'K-Nearest Neighbors',
    displayName: 'KNN',
    description: 'Algoritma berbasis jarak yang menemukan pengguna/item serupa untuk rekomendasi',
    color: '#8B5CF6', // purple
    shortDescription: 'Tetangga Terdekat',
  },
};

// ======================= FEATURES =======================
export const FEATURES = {
  SENTIMENT: 'sentiment',
  COLLABORATIVE: 'collaborative',
  SVD: 'svd',
  KNN: 'knn',
};
