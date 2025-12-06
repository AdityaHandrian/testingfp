import { Star, ShoppingCart, User, TrendingUp } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    id,
    name,
    price,
    image,
    rating,
    reviews,
    seller,
    sentimentScore,
  } = product;

  // Format harga ke IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format rating ke bintang
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <Star
            className="w-4 h-4 text-yellow-400"
            strokeWidth={2}
          />
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-4 h-4 text-gray-300"
            strokeWidth={1}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Sentiment score indicator
  const getSentimentColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Render sentiment badge
  const renderSentimentBadge = (score) => {
    const percentage = Math.round(score * 100);
    const color = getSentimentColor(score);
    
    return (
      <div className={`flex items-center text-xs font-medium ${color}`}>
        <TrendingUp className="w-3 h-3 mr-1" />
        {percentage}% Positif
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          {renderSentimentBadge(sentimentScore)}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Seller Info */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <User className="w-3 h-3 mr-1" />
          <span>{seller}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-3">
          {renderStars(rating)}
          <span className="text-xs text-gray-500">
            ({reviews.toLocaleString('id-ID')} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-blue-600 mb-4">
          {formatPrice(price)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert(`Produk "${name}" berhasil ditambahkan ke wishlist!`)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Wishlist
          </button>
          <button
            className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => window.open(`https://www.tokopedia.com/search?q=${encodeURIComponent(name)}`, '_blank')}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}
