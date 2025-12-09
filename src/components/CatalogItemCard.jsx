import { Star, ShoppingCart, TrendingUp } from 'lucide-react';
import { formatPrice } from '../api/catalogApi';

/**
 * Product card component for catalog display
 * Shows product information and recommendation button
 */
export default function CatalogItemCard({
  item,
  onSelect,
  isSelected = false,
  isAuthenticated = false,
}) {
  if (!item) return null;

  const handleClick = () => {
    if (isAuthenticated) {
      onSelect(item);
    }
  };

  // Calculate average rating from reviews
  const avgRating = item.rating || (item.reviews?.length > 0
    ? (item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / item.reviews.length).toFixed(1)
    : 0);

  const reviewCount = item.review_count || item.reviews?.length || 0;
  const sentimentScore = item.sentiment_score || 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } cursor-pointer`}
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
        {item.image_url || item.image ? (
          <img
            src={item.image_url || item.image}
            alt={item.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <ShoppingCart className="w-12 h-12 text-gray-500" />
          </div>
        )}

        {/* Sentiment Score Badge */}
        {sentimentScore > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            📊 {(sentimentScore * 100).toFixed(0)}%
          </div>
        )}

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Terpilih
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col">
        {/* Category */}
        {(item.category || item.product_category) && (
          <span className="text-xs text-gray-500 font-semibold mb-1">
            {item.category || item.product_category}
          </span>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
          {item.name || item.product_name || 'Produk Tanpa Nama'}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(avgRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1">
            {avgRating > 0 ? avgRating : 'N/A'} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-bold text-blue-600">
            {item.price ? formatPrice(item.price) : 'Harga Tidak Tersedia'}
          </p>
          {item.original_price && item.original_price > item.price && (
            <p className="text-xs text-gray-500 line-through">
              {formatPrice(item.original_price)}
            </p>
          )}
        </div>

        {/* Sentiment Score Progress Bar */}
        {sentimentScore > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Sentimen Positif</span>
              <span className="text-xs font-semibold text-green-600">
                {(sentimentScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                style={{ width: `${sentimentScore * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Recommendation Button */}
        {isAuthenticated ? (
          <button
            className={`w-full py-2 px-3 rounded text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }}`}
            onClick={handleClick}
          >
            <TrendingUp className="w-4 h-4" />
            {isSelected ? 'Lihat Rekomendasi' : 'Lihat Rekomendasi'}
          </button>
        ) : (
          <div className="w-full py-2 px-3 rounded text-sm font-medium text-center bg-gray-100 text-gray-600">
            Login untuk rekomendasi
          </div>
        )}
      </div>
    </div>
  );
}
