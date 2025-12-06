export default function SentimentChart({ scores }) {
  const sentiments = [
    { key: 'positive', label: 'Positif', color: 'green' },
    { key: 'neutral', label: 'Netral', color: 'yellow' },
    { key: 'negative', label: 'Negatif', color: 'red' },
  ];

  const total = Object.values(scores).reduce((acc, val) => acc + val.percentage, 0);

  return (
    <div className="space-y-4">
      {sentiments.map((sentiment) => {
        const data = scores[sentiment.key];
        const percentage = data.percentage;

        return (
          <div key={sentiment.key} className="space-y-2">
            {/* Label */}
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">
                {sentiment.label}
              </label>
              <span className={`text-lg font-bold text-${sentiment.color}-600`}>
                {percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-${sentiment.color}-500 h-3 rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
