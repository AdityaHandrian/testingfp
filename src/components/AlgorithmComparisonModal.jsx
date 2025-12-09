import { X, AlertCircle, Loader } from 'lucide-react';
import { formatPrice } from '../api/catalogApi';
import { ALGORITHMS } from '../utils/constants';

/**
 * Modal component for comparing recommendations from multiple algorithms
 * Displays NCF, CBF, SVD, and KNN recommendations side-by-side
 */
export default function AlgorithmComparisonModal({
  isOpen,
  onClose,
  contextItem,
  recommendations,
  algorithmErrors,
  isLoading,
}) {
  if (!isOpen) return null;

  const maxScore = 1.0; // Assuming scores are normalized 0-1

  const algorithms = [
    { key: 'ncf', ...ALGORITHMS.NCF },
    { key: 'cbf', ...ALGORITHMS.CBF },
    { key: 'svd', ...ALGORITHMS.SVD },
    { key: 'knn', ...ALGORITHMS.KNN },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Perbandingan Rekomendasi
            </h2>
            {contextItem && (
              <p className="text-sm text-gray-600 mt-1">
                Produk: <span className="font-semibold">{contextItem.name || contextItem.product_name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
              <span className="text-gray-600">Memuat rekomendasi...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Algorithm Cards */}
              {algorithms.map((algo) => {
                const recs = recommendations[algo.key] || [];
                const error = algorithmErrors[algo.key];

                return (
                  <div
                    key={algo.key}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Algorithm Header */}
                    <div
                      className="p-4 text-white"
                      style={{ backgroundColor: algo.color }}
                    >
                      <h3 className="font-bold text-lg">{algo.displayName}</h3>
                      <p className="text-sm opacity-90">{algo.shortDescription}</p>
                    </div>

                    {/* Algorithm Body */}
                    <div className="p-4 min-h-[400px] flex flex-col">
                      {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                          <p className="text-sm text-gray-600">
                            {error}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Algoritma tidak tersedia saat ini
                          </p>
                        </div>
                      ) : recs.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <p className="text-sm text-gray-600">
                            Tidak ada rekomendasi tersedia
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          {/* Recommendation Count */}
                          <div className="mb-3 pb-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">
                              {recs.length} Rekomendasi
                            </p>
                          </div>

                          {/* Recommendations List */}
                          <div className="flex-1 space-y-2">
                            {recs.slice(0, 5).map((item, idx) => {
                              const score = item.score || item.rating || 0;
                              const scorePercent = (score / maxScore) * 100;

                              return (
                                <div key={`${algo.key}-${idx}`} className="text-sm">
                                  {/* Item Name */}
                                  <div className="flex items-start justify-between mb-1">
                                    <p className="font-medium text-gray-800 line-clamp-2 flex-1">
                                      {item.name || item.product_name || `Item ${item.id}`}
                                    </p>
                                    <span
                                      className="ml-2 px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0"
                                      style={{ backgroundColor: algo.color }}
                                    >
                                      {score > 1 ? score.toFixed(0) : (score * 100).toFixed(0)}%
                                    </span>
                                  </div>

                                  {/* Score Bar */}
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full transition-all duration-300"
                                      style={{
                                        width: `${scorePercent}%`,
                                        backgroundColor: algo.color,
                                      }}
                                    />
                                  </div>

                                  {/* Price */}
                                  {item.price && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatPrice(item.price)}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Algorithm Description Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {algo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
