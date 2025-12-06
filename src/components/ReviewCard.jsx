import { Trash2 } from 'lucide-react';

export default function ReviewCard({ review, onRemove, index }) {
  // Get sentiment color dan icon
  const getSentimentInfo = (sentiment) => {
    const sentimentMap = {
      positive: { label: 'Positif', color: 'green', icon: '😊', bg: 'bg-green-50', border: 'border-green-200' },
      neutral: { label: 'Netral', color: 'yellow', icon: '😐', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      negative: { label: 'Negatif', color: 'red', icon: '😞', bg: 'bg-red-50', border: 'border-red-200' },
    };
    return sentimentMap[sentiment] || sentimentMap.neutral;
  };

  const info = getSentimentInfo(review.sentiment);

  return (
    <div className={`${info.bg} border ${info.border} rounded-lg p-4 relative`}>
      {/* Header dengan sentiment badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{info.icon}</span>
          <span className={`font-semibold text-${info.color}-700`}>
            {info.label}
          </span>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          title="Hapus review"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Review text */}
      <p className="text-gray-700 mb-3 italic">"{review.text}"</p>

      {/* Confidence score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Confidence Score:</span>
          <span className={`font-semibold text-${info.color}-600`}>
            {Math.round(review.confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${info.color}-500 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${review.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
