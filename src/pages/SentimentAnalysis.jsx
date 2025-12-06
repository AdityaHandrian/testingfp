import { useState } from 'react';
import { mockApiResponses } from '../api/mockData';
import ReviewCard from '../components/ReviewCard';
import SentimentChart from '../components/SentimentChart';
import { AlertCircle, Loader, Send, Trash, Brain } from 'lucide-react';

export default function SentimentAnalysis() {
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      setError('Masukkan teks review terlebih dahulu');
      return;
    }

    if (reviewText.trim().length < 10) {
      setError('Review minimal 10 karakter');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Panggil mock API
      const response = mockApiResponses.analyzeSentiment(reviewText);

      if (response.status === 'success') {
        // Tambahkan review ke list
        setReviews((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: reviewText,
            sentiment: response.data.sentiment,
            confidence: response.data.confidence,
            timestamp: new Date().toLocaleTimeString('id-ID'),
          },
        ]);

        setSuccessMessage('Review berhasil dianalisis!');
        setReviewText('');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove review
  const handleRemoveReview = (index) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all reviews
  const handleClearAll = () => {
    if (reviews.length === 0) return;
    if (window.confirm('Hapus semua review? Tindakan ini tidak dapat dibatalkan.')) {
      setReviews([]);
      setSuccessMessage(null);
      setError(null);
    }
  };

  // Calculate sentiment percentages
  const calculateSentimentStats = () => {
    if (reviews.length === 0) {
      return {
        positive: { percentage: 0, label: 'Positif' },
        neutral: { percentage: 0, label: 'Netral' },
        negative: { percentage: 0, label: 'Negatif' },
      };
    }

    const counts = {
      positive: reviews.filter((r) => r.sentiment === 'positive').length,
      neutral: reviews.filter((r) => r.sentiment === 'neutral').length,
      negative: reviews.filter((r) => r.sentiment === 'negative').length,
    };

    const total = reviews.length;

    return {
      positive: {
        percentage: Math.round((counts.positive / total) * 100),
        label: 'Positif',
        count: counts.positive,
      },
      neutral: {
        percentage: Math.round((counts.neutral / total) * 100),
        label: 'Netral',
        count: counts.neutral,
      },
      negative: {
        percentage: Math.round((counts.negative / total) * 100),
        label: 'Negatif',
        count: counts.negative,
      },
    };
  };

  const sentimentStats = calculateSentimentStats();

  // Sample reviews untuk demo
  const sampleReviews = [
    'Produk ini sangat bagus! Kualitasnya premium dan pengiriman cepat.',
    'Cukup memuaskan, tapi bisa lebih baik lagi.',
    'Sangat mengecewakan, produk rusak saat tiba.',
  ];

  const getRandomSampleReview = () => {
    return sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analisis Sentimen Review
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Masukkan teks review produk untuk menganalisis sentimen (Positif/Netral/Negatif)
          menggunakan algoritma machine learning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Input Review
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start space-x-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teks Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onFocus={() => setError(null)}
                  placeholder="Masukkan review produk di sini... (minimal 10 karakter)"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {reviewText.length} karakter | Minimal 10 karakter
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !reviewText.trim()}
                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                  isLoading || !reviewText.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2" size={20} />
                    Analisis Sentimen
                  </>
                )}
              </button>

              {/* Demo Button */}
              <button
                type="button"
                onClick={() => setReviewText(getRandomSampleReview())}
                disabled={isLoading}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100"
              >
                📝 Gunakan Sample Review
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">
                💡 Tips menggunakan analisis sentimen:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Gunakan bahasa Indonesia untuk akurasi terbaik</li>
                <li>• Review yang lebih panjang memberikan hasil lebih akurat</li>
                <li>• Klik tombol "Gunakan Sample Review" untuk contoh</li>
              </ul>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Review yang Dianalisis ({reviews.length})
              </h2>
              {reviews.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash size={16} className="mr-1" />
                  Hapus Semua
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada review yang dianalisis</p>
                <p className="text-sm mt-2">
                  Masukkan review di atas untuk memulai analisis
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onRemove={handleRemoveReview}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="lg:col-span-1">
          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Statistik Sentimen
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-gray-400" size={32} />
                </div>
                <p className="text-sm">Analisis minimal 1 review</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Chart */}
                <SentimentChart scores={sentimentStats} />

                {/* Summary Stats */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Review</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {reviews.length}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Positif</p>
                      <p className="text-lg font-bold text-green-600">
                        {sentimentStats.positive.count}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Netral</p>
                      <p className="text-lg font-bold text-yellow-600">
                        {sentimentStats.neutral.count}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Negatif</p>
                      <p className="text-lg font-bold text-red-600">
                        {sentimentStats.negative.count}
                      </p>
                    </div>
                  </div>

                  {/* Overall Sentiment */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Sentimen Keseluruhan</p>
                    <p className="text-sm font-bold text-gray-900">
                      {sentimentStats.positive.percentage >
                      sentimentStats.negative.percentage
                        ? '😊 Positif'
                        : sentimentStats.negative.percentage >
                            sentimentStats.positive.percentage
                          ? '😞 Negatif'
                          : '😐 Netral'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-900 mb-2">✅ Sentimen Positif</p>
          <p className="text-xs text-green-800">
            Review yang menunjukkan kepuasan pelanggan terhadap produk atau layanan
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-900 mb-2">➖ Sentimen Netral</p>
          <p className="text-xs text-yellow-800">
            Review yang bersifat faktual tanpa menunjukkan kepuasan atau ketidakpuasan
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-900 mb-2">❌ Sentimen Negatif</p>
          <p className="text-xs text-red-800">
            Review yang menunjukkan ketidakpuasan pelanggan terhadap produk atau layanan
          </p>
        </div>
      </div>
    </div>
  );
}
