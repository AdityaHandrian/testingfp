// Mock data untuk product recommendations
export const mockRecommendations = [
  {
    id: 1,
    name: 'Laptop ASUS VivoBook 15',
    price: 5999000,
    image: 'https://via.placeholder.com/300x200?text=Laptop+ASUS',
    rating: 4.5,
    reviews: 2341,
    seller: 'ASUS Official',
    sentimentScore: 0.92,
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    price: 699000,
    image: 'https://via.placeholder.com/300x200?text=Mouse+Logitech',
    rating: 4.7,
    reviews: 1523,
    seller: 'Logitech Direct',
    sentimentScore: 0.88,
  },
  {
    id: 3,
    name: 'Keyboard Mechanical RGB',
    price: 899000,
    image: 'https://via.placeholder.com/300x200?text=Keyboard+RGB',
    rating: 4.3,
    reviews: 987,
    seller: 'Tech Store',
    sentimentScore: 0.85,
  },
  {
    id: 4,
    name: 'Monitor 4K 32 Inch',
    price: 2999000,
    image: 'https://via.placeholder.com/300x200?text=Monitor+4K',
    rating: 4.6,
    reviews: 1834,
    seller: 'Tokopedia Official',
    sentimentScore: 0.90,
  },
];

// Mock data untuk sentiment analysis
export const mockSentimentResults = {
  positive: {
    label: 'Positif',
    percentage: 75,
    color: 'bg-green-500',
    textColor: 'text-green-600',
  },
  neutral: {
    label: 'Netral',
    percentage: 15,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
  },
  negative: {
    label: 'Negatif',
    percentage: 10,
    color: 'bg-red-500',
    textColor: 'text-red-600',
  },
};

// Mock users
export const mockUsers = [
  {
    id: 1,
    username: 'user123',
    email: 'user@example.com',
    password: 'password123', // Hanya untuk demo!
    name: 'Muhammad Aditya',
  },
  {
    id: 2,
    username: 'aditya_h',
    email: 'aditya@example.com',
    password: 'password123',
    name: 'Aditya Handrian',
  },
];

// Mock API responses
export const mockApiResponses = {
  // Untuk endpoint: GET /api/recommendations?user_id=123
  getRecommendations: (userId) => ({
    status: 'success',
    data: mockRecommendations,
    message: `Rekomendasi untuk user ${userId}`,
  }),

  // Untuk endpoint: POST /api/sentiment/analyze
  analyzeSentiment: (text) => ({
    status: 'success',
    data: {
      text,
      sentiment: 'positive', // positive, neutral, negative
      confidence: 0.92,
      scores: mockSentimentResults,
    },
    message: 'Analisis sentimen berhasil',
  }),

  // Untuk endpoint: POST /api/auth/login
  login: (username) => ({
    status: 'success',
    data: {
      user: mockUsers.find((u) => u.username === username),
      token: 'fake-jwt-token-' + Date.now(),
    },
    message: 'Login berhasil',
  }),
};
