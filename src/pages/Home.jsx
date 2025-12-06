import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import {
  ArrowRight,
  Brain,
  Heart,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuthContext();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Menggunakan algoritma SVD++ untuk rekomendasi yang lebih akurat',
      color: 'blue',
    },
    {
      icon: Heart,
      title: 'Sentiment Analysis',
      description: 'Analisis sentimen review untuk kualitas produk yang lebih baik',
      color: 'pink',
    },
    {
      icon: BarChart3,
      title: 'Collaborative Filtering',
      description: 'Rekomendasi berdasarkan perilaku pengguna serupa',
      color: 'green',
    },
  ];

  const stats = [
    { label: 'Produk Teranalisis', value: '10K+' },
    { label: 'Pengguna Aktif', value: '5K+' },
    { label: 'Akurasi', value: '92%' },
    { label: 'Rekomendasi Harian', value: '50K+' },
  ];

  const reviews = [
    {
      text:
        "Sistem rekomendasi ini sangat akurat! Saya menemukan produk yang sempurna sesuai kebutuhan saya.",
      author: 'Sarah Wijaya',
      role: 'Pengguna Premium',
      rating: 5,
    },
    {
      text:
        'Fitur analisis sentimen sangat membantu dalam mengevaluasi kualitas produk sebelum membeli.',
      author: 'Budi Raharjo',
      role: 'Pengguna Aktif',
      rating: 5,
    },
    {
      text:
        'Rekomendasi produk yang diberikan selalu relevan dan sesuai dengan preferensi saya.',
      author: 'Diana Putri',
      role: 'Pengguna Baru',
      rating: 4.5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4 mr-2" />
          Rekomendasi Produk Tokopedia Terbaik
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Temukan Produk Terbaik dengan
          <span className="block text-blue-600">Kecerdasan Buatan</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Sistem rekomendasi produk Tokopedia yang menggunakan analisis sentimen,
          collaborative filtering, dan algoritma SVD++ untuk memberikan rekomendasi yang paling relevan untukmu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={isAuthenticated ? ROUTES.RECOMMENDATION : ROUTES.LOGIN}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Mulai Sekarang
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          <Link
            to={ROUTES.SENTIMENT}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            Coba Analisis Sentimen
          </Link>
        </div>

        {isAuthenticated && (
          <div className="mt-8 inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            Selamat datang kembali,
            <strong className="ml-1">{user.name}</strong>!
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Teknologi canggih untuk pengalaman belanja yang lebih cerdas
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Apa Kata Pengguna?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Pengalaman nyata dari ribuan pengguna yang puas
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                  {review.rating % 1 !== 0 && <span className="text-yellow-400 text-xl">⭐</span>}
                </div>

                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                    {review.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{review.author}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Siap Menemukan Produk Terbaik?</h2>
            <p className="text-lg mb-8">
              Jelajahi ribuan produk dengan rekomendasi paling relevan — lebih cepat dan lebih akurat.
            </p>

            <Link
              to={isAuthenticated ? ROUTES.RECOMMENDATION : ROUTES.LOGIN}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              Mulai Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
